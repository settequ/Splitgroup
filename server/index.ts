import express from 'express';
import cors from 'cors';
import path from 'path';
import db from './db';

// Seed on startup
import './seed';

const app = express();
app.use(cors());
app.use(express.json());

const TRIP_ID = 'default-trip';

// --- API Routes ---

// Get full trip data
app.get('/api/trip', (_req, res) => {
  const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(TRIP_ID) as any;
  if (!trip) return res.status(404).json({ error: 'Trip not found' });

  const people = db.prepare('SELECT id, name FROM people WHERE trip_id = ?').all(TRIP_ID);

  const rawExpenses = db.prepare(
    'SELECT * FROM expenses WHERE trip_id = ? ORDER BY date DESC, created_at DESC'
  ).all(TRIP_ID) as any[];

  const getParticipants = db.prepare(
    'SELECT person_id FROM expense_participants WHERE expense_id = ?'
  );

  const expenses = rawExpenses.map((e) => ({
    id: e.id,
    description: e.description,
    amount: e.amount,
    currency: e.currency,
    amountInBase: e.amount_in_base,
    exchangeRate: e.exchange_rate,
    paidBy: e.paid_by,
    participants: (getParticipants.all(e.id) as any[]).map((p) => p.person_id),
    date: e.date,
    createdAt: e.created_at,
  }));

  res.json({
    id: trip.id,
    name: trip.name,
    baseCurrency: trip.base_currency,
    people,
    expenses,
  });
});

// Update trip name
app.patch('/api/trip', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  db.prepare('UPDATE trips SET name = ? WHERE id = ?').run(name, TRIP_ID);
  res.json({ ok: true });
});

// Add expense
app.post('/api/expenses', (req, res) => {
  const { description, amount, currency, amountInBase, exchangeRate, paidBy, participants, date } =
    req.body;

  if (!description || !amount || !currency || !paidBy || !participants?.length || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const id = crypto.randomUUID();
  const insertExpense = db.prepare(
    `INSERT INTO expenses (id, trip_id, description, amount, currency, amount_in_base, exchange_rate, paid_by, date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const insertParticipant = db.prepare(
    'INSERT INTO expense_participants (expense_id, person_id) VALUES (?, ?)'
  );

  db.transaction(() => {
    insertExpense.run(id, TRIP_ID, description, amount, currency, amountInBase, exchangeRate, paidBy, date);
    for (const pid of participants) {
      insertParticipant.run(id, pid);
    }
  })();

  res.status(201).json({
    id,
    description,
    amount,
    currency,
    amountInBase,
    exchangeRate,
    paidBy,
    participants,
    date,
    createdAt: new Date().toISOString(),
  });
});

// Update expense
app.put('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  const { description, amount, currency, amountInBase, exchangeRate, paidBy, participants, date } =
    req.body;

  const updateExpense = db.prepare(
    `UPDATE expenses SET description=?, amount=?, currency=?, amount_in_base=?, exchange_rate=?, paid_by=?, date=?
     WHERE id=? AND trip_id=?`
  );
  const deleteParticipants = db.prepare('DELETE FROM expense_participants WHERE expense_id = ?');
  const insertParticipant = db.prepare(
    'INSERT INTO expense_participants (expense_id, person_id) VALUES (?, ?)'
  );

  db.transaction(() => {
    updateExpense.run(description, amount, currency, amountInBase, exchangeRate, paidBy, date, id, TRIP_ID);
    deleteParticipants.run(id);
    for (const pid of participants) {
      insertParticipant.run(id, pid);
    }
  })();

  res.json({ ok: true });
});

// Delete expense
app.delete('/api/expenses/:id', (req, res) => {
  db.prepare('DELETE FROM expenses WHERE id = ? AND trip_id = ?').run(req.params.id, TRIP_ID);
  res.json({ ok: true });
});

// Serve static frontend in production
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));
app.get('/{*splat}', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = parseInt(process.env.PORT || '3001', 10);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Splitgroup API running on http://localhost:${PORT}`);
});
