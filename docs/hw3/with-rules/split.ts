export interface SplitPart {
  memberId: string;
  cents: number;
}

function assertCents(value: number, label: string): void {
  if (!Number.isInteger(value)) {
    throw new Error(`${label} must be an integer number of cents, got ${value}`);
  }
  if (value < 0) {
    throw new Error(`${label} must not be negative, got ${value}`);
  }
}

function sortedById(parts: SplitPart[]): SplitPart[] {
  return [...parts].sort((x, y) => (x.memberId < y.memberId ? -1 : x.memberId > y.memberId ? 1 : 0));
}

/**
 * Split a total equally. The remainder goes one cent at a time to members in
 * sorted id order, so the result is stable and always sums to the total.
 */
export function splitCents(totalCents: number, memberIds: string[]): SplitPart[] {
  assertCents(totalCents, "total");
  if (memberIds.length === 0) {
    throw new Error("a split needs at least one member");
  }
  if (new Set(memberIds).size !== memberIds.length) {
    throw new Error("a split must not contain duplicate member ids");
  }
  const ids = [...memberIds].sort();
  const base = Math.floor(totalCents / ids.length);
  const remainder = totalCents - base * ids.length;
  return ids.map((memberId, i) => ({ memberId, cents: base + (i < remainder ? 1 : 0) }));
}

/**
 * Validate caller-chosen amounts. They must add up to the total exactly,
 * otherwise the group balances would stop summing to zero.
 */
export function exactSplitCents(
  totalCents: number,
  amountsByMember: Record<string, number>,
): SplitPart[] {
  assertCents(totalCents, "total");
  const entries = Object.entries(amountsByMember);
  if (entries.length === 0) {
    throw new Error("a split needs at least one member");
  }
  let sum = 0;
  for (const [memberId, cents] of entries) {
    assertCents(cents, `amount for ${memberId}`);
    sum += cents;
  }
  if (sum !== totalCents) {
    throw new Error(`exact amounts sum to ${sum} cents but the total is ${totalCents} cents`);
  }
  return sortedById(entries.map(([memberId, cents]) => ({ memberId, cents })));
}
