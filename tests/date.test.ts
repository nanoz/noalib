import { describe, expect, it } from "vitest";
import { computeValidityWindow, formatNaolibDate, parseNowParameter } from "../src/date";

describe("computeValidityWindow", () => {
  it("computes the PRD reference validity window", () => {
    const now = new Date("2026-06-23T19:32:00+02:00");
    const window = computeValidityWindow(now);

    expect(formatNaolibDate(window.start)).toBe("23 juin 2026, 18:42");
    expect(formatNaolibDate(window.end)).toBe("23 juin 2026, 19:42");
  });

  it("handles midnight crossing", () => {
    const now = new Date("2026-06-24T00:05:00+02:00");
    const window = computeValidityWindow(now);

    expect(formatNaolibDate(window.start)).toBe("23 juin 2026, 23:15");
    expect(formatNaolibDate(window.end)).toBe("24 juin 2026, 00:15");
  });

  it("handles year crossing", () => {
    const now = new Date("2026-01-01T00:20:00+01:00");
    const window = computeValidityWindow(now);

    expect(formatNaolibDate(window.start)).toBe("31 décembre 2025, 23:30");
    expect(formatNaolibDate(window.end)).toBe("1 janvier 2026, 00:30");
  });

  it("handles daylight saving time changes in Europe/Paris", () => {
    const now = new Date("2026-03-29T03:05:00+02:00");
    const window = computeValidityWindow(now);

    expect(formatNaolibDate(window.start)).toBe("29 mars 2026, 01:15");
    expect(formatNaolibDate(window.end)).toBe("29 mars 2026, 03:15");
  });
});

describe("parseNowParameter", () => {
  it("parses a valid now query parameter", () => {
    expect(parseNowParameter("2026-06-23T19:32:00+02:00")?.toISOString()).toBe(
      "2026-06-23T17:32:00.000Z",
    );
  });

  it("rejects an invalid now query parameter", () => {
    expect(parseNowParameter("invalid")).toBeNull();
  });
});
