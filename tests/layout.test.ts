import { describe, expect, it } from "vitest";
import { DESIGN, IPHONE_16_PRO_VIEWPORT } from "../src/config";
import { computeStageLayout } from "../src/layout";

describe("computeStageLayout", () => {
  it("matches the native iPhone 16 Pro portrait canvas exactly", () => {
    const layout = computeStageLayout(
      IPHONE_16_PRO_VIEWPORT.width,
      IPHONE_16_PRO_VIEWPORT.height,
      "cover",
    );

    expect(layout.scale).toBeCloseTo(IPHONE_16_PRO_VIEWPORT.width / DESIGN.width, 6);
    expect(layout.x).toBeCloseTo(0, 6);
    expect(layout.y).toBeCloseTo(0, 6);
    expect(DESIGN.width / IPHONE_16_PRO_VIEWPORT.width).toBe(3);
    expect(DESIGN.height / IPHONE_16_PRO_VIEWPORT.height).toBe(3);
  });
});
