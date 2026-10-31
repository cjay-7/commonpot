import { describe, expect, it } from "vitest";
import { exactSplitCents, splitCents } from "../../../src/lib/money/split";

const cents = (parts: { memberId: string; cents: number }[]): number[] =>
  parts.map((p) => p.cents);
const sum = (xs: number[]): number => xs.reduce((a, b) => a + b, 0);

describe("splitCents", () => {
  it("splits 1000 cents among 3 members as 334, 333, 333", () => {
    const parts = splitCents(1000, ["a", "b", "c"]);
    expect(cents(parts)).toEqual([334, 333, 333]);
  });

  it("splits evenly when the total divides exactly", () => {
    expect(cents(splitCents(900, ["a", "b", "c"]))).toEqual([300, 300, 300]);
  });

  it("gives the remainder to members in sorted id order regardless of input order", () => {
    const parts = splitCents(1001, ["c", "a", "b"]);
    expect(parts).toEqual([
      { memberId: "a", cents: 334 },
      { memberId: "b", cents: 334 },
      { memberId: "c", cents: 333 },
    ]);
  });

  it("always sums to the total for many totals and member counts", () => {
    for (let total = 0; total <= 500; total++) {
      for (let n = 1; n <= 9; n++) {
        const ids = Array.from({ length: n }, (_, i) => `m${i}`);
        expect(sum(cents(splitCents(total, ids)))).toBe(total);
      }
    }
  });

  it("gives one member the whole amount when alone", () => {
    expect(splitCents(777, ["a"])).toEqual([{ memberId: "a", cents: 777 }]);
  });

  it("splits 2 cents among 3 members as 1, 1, 0", () => {
    expect(cents(splitCents(2, ["a", "b", "c"]))).toEqual([1, 1, 0]);
  });

  it("rejects a total that is not an integer number of cents", () => {
    expect(() => splitCents(10.5, ["a", "b"])).toThrow(/integer/);
  });

  it("rejects a negative total", () => {
    expect(() => splitCents(-1, ["a"])).toThrow(/negative/);
  });

  it("rejects an empty member list", () => {
    expect(() => splitCents(100, [])).toThrow(/at least one member/);
  });

  it("rejects duplicate member ids", () => {
    expect(() => splitCents(100, ["a", "a"])).toThrow(/duplicate/);
  });
});

describe("exactSplitCents", () => {
  it("accepts exact amounts that sum to the total", () => {
    const parts = exactSplitCents(1000, { b: 250, a: 750 });
    expect(parts).toEqual([
      { memberId: "a", cents: 750 },
      { memberId: "b", cents: 250 },
    ]);
  });

  it("rejects exact amounts that sum to less than the total", () => {
    expect(() => exactSplitCents(1000, { a: 500, b: 400 })).toThrow(
      /sum to 900 cents but the total is 1000 cents/,
    );
  });

  it("rejects exact amounts that sum to more than the total", () => {
    expect(() => exactSplitCents(1000, { a: 600, b: 500 })).toThrow(
      /sum to 1100 cents but the total is 1000 cents/,
    );
  });

  it("rejects a non-integer amount for a member", () => {
    expect(() => exactSplitCents(1000, { a: 500.5, b: 499.5 })).toThrow(/integer/);
  });

  it("rejects a negative amount for a member", () => {
    expect(() => exactSplitCents(1000, { a: 1100, b: -100 })).toThrow(/negative/);
  });

  it("rejects an empty set of amounts", () => {
    expect(() => exactSplitCents(0, {})).toThrow(/at least one member/);
  });
});
