import { describe, it, expect } from "vitest";
import { splitExpense } from "./splitExpense";

const sum = (s: Record<string, number>) => Object.values(s).reduce((a, b) => a + b, 0);

describe("splitExpense", () => {
  it("splits evenly when divisible", () => {
    expect(splitExpense(3000, ["a", "b", "c"])).toEqual({ a: 1000, b: 1000, c: 1000 });
  });

  it("distributes leftover cents to the first members", () => {
    expect(splitExpense(1000, ["a", "b", "c"])).toEqual({ a: 334, b: 333, c: 333 });
  });

  it("always sums to the original amount", () => {
    const members = ["a", "b", "c", "d", "e", "f", "g"];
    for (const amt of [0, 1, 6, 7, 99, 1001, 123457]) {
      expect(sum(splitExpense(amt, members))).toBe(amt);
    }
  });

  it("gives everything to a single member", () => {
    expect(splitExpense(1234, ["a"])).toEqual({ a: 1234 });
  });

  it("handles zero amount", () => {
    expect(splitExpense(0, ["a", "b"])).toEqual({ a: 0, b: 0 });
  });

  it("handles amount smaller than member count", () => {
    expect(splitExpense(2, ["a", "b", "c"])).toEqual({ a: 1, b: 1, c: 0 });
  });

  it("rejects no members", () => {
    expect(() => splitExpense(100, [])).toThrow();
  });

  it("rejects negative or non-integer amounts", () => {
    expect(() => splitExpense(-1, ["a"])).toThrow();
    expect(() => splitExpense(10.5, ["a"])).toThrow();
  });

  it("rejects duplicate members", () => {
    expect(() => splitExpense(100, ["a", "a"])).toThrow();
  });
});
