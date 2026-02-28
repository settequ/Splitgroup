import db from './db';

const DEFAULT_TRIP_ID = 'default-trip';

const exists = db.prepare('SELECT id FROM trips WHERE id = ?').get(DEFAULT_TRIP_ID);

if (!exists) {
  const insertTrip = db.prepare('INSERT INTO trips (id, name, base_currency) VALUES (?, ?, ?)');
  const insertPerson = db.prepare('INSERT INTO people (id, trip_id, name) VALUES (?, ?, ?)');

  const people = [
    { id: 'filippo', name: 'Filippo' },
    { id: 'cristian', name: 'Cristian' },
    { id: 'davide', name: 'Davide' },
    { id: 'pietro', name: 'Pietro' },
    { id: 'francesca', name: 'Francesca' },
    { id: 'elisa', name: 'Elisa' },
  ];

  db.transaction(() => {
    insertTrip.run(DEFAULT_TRIP_ID, 'Our Trip', 'EUR');
    for (const p of people) {
      insertPerson.run(p.id, DEFAULT_TRIP_ID, p.name);
    }
  })();

  console.log('Seeded default trip with 6 people.');
} else {
  console.log('Default trip already exists.');
}
