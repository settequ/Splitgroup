import { Balance, Person, Expense } from '../types';

export function calculateBalances(people: Person[], expenses: Expense[]): Balance[] {
  const paidMap = new Map<string, number>();
  const shareMap = new Map<string, number>();

  for (const person of people) {
    paidMap.set(person.id, 0);
    shareMap.set(person.id, 0);
  }

  for (const expense of expenses) {
    const currentPaid = paidMap.get(expense.paidBy) ?? 0;
    paidMap.set(expense.paidBy, currentPaid + expense.amountInBase);

    const sharePerPerson = expense.amountInBase / expense.participants.length;
    for (const pid of expense.participants) {
      const currentShare = shareMap.get(pid) ?? 0;
      shareMap.set(pid, currentShare + sharePerPerson);
    }
  }

  return people.map((person) => {
    const totalPaid = Math.round((paidMap.get(person.id) ?? 0) * 100) / 100;
    const totalShare = Math.round((shareMap.get(person.id) ?? 0) * 100) / 100;
    const netBalance = Math.round((totalPaid - totalShare) * 100) / 100;
    return {
      personId: person.id,
      personName: person.name,
      totalPaid,
      totalShare,
      netBalance,
    };
  });
}
