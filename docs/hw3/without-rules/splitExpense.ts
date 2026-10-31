export type Split = Record<string, number>;

/**
 * Split an amount (in integer cents) evenly among members.
 * Any leftover cents go one each to the first members, so the shares
 * always sum exactly to the amount.
 */
export function splitExpense(amountCents: number, members: string[]): Split {
  if (!Number.isInteger(amountCents) || amountCents < 0) {
    throw new Error("amountCents must be a non-negative integer");
  }
  if (members.length === 0) {
    throw new Error("at least one member is required");
  }
  if (new Set(members).size !== members.length) {
    throw new Error("members must be unique");
  }

  const base = Math.floor(amountCents / members.length);
  const remainder = amountCents % members.length;

  const result: Split = {};
  members.forEach((m, i) => {
    result[m] = base + (i < remainder ? 1 : 0);
  });
  return result;
}
