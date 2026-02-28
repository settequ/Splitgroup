import { Balance, Settlement, Person } from '../types';

export function calculateSettlements(balances: Balance[], people: Person[]): Settlement[] {
  const nameMap = new Map(people.map((p) => [p.id, p.name]));
  const debtors: { id: string; amount: number }[] = [];
  const creditors: { id: string; amount: number }[] = [];

  for (const b of balances) {
    if (b.netBalance < -0.01) {
      debtors.push({ id: b.personId, amount: -b.netBalance });
    } else if (b.netBalance > 0.01) {
      creditors.push({ id: b.personId, amount: b.netBalance });
    }
  }

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];
  let di = 0;
  let ci = 0;

  while (di < debtors.length && ci < creditors.length) {
    const debtor = debtors[di];
    const creditor = creditors[ci];
    const transfer = Math.min(debtor.amount, creditor.amount);
    const rounded = Math.round(transfer * 100) / 100;

    if (rounded > 0) {
      settlements.push({
        from: debtor.id,
        fromName: nameMap.get(debtor.id) ?? debtor.id,
        to: creditor.id,
        toName: nameMap.get(creditor.id) ?? creditor.id,
        amount: rounded,
      });
    }

    debtor.amount -= transfer;
    creditor.amount -= transfer;

    if (debtor.amount < 0.01) di++;
    if (creditor.amount < 0.01) ci++;
  }

  return settlements;
}
