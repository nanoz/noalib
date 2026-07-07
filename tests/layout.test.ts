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

  it("bottom-aligns cover overflow so the tab bar is not clipped", () => {
    const layout = computeStageLayout(IPHONE_16_PRO_VIEWPORT.width, 852, "cover");
    const renderedHeight = DESIGN.height * layout.scale;

    expect(layout.scale).toBeCloseTo(IPHONE_16_PRO_VIEWPORT.width / DESIGN.width, 6);
    expect(layout.y).toBeCloseTo(852 - renderedHeight, 6);
  });

  it("keeps large cover overflow centered for non-phone debug viewports", () => {
    const layout = computeStageLayout(500, 852, "cover");
    const renderedHeight = DESIGN.height * layout.scale;

    expect(renderedHeight - 852).toBeGreaterThan(120);
    expect(layout.y).toBeCloseTo((852 - renderedHeight) / 2, 6);
  });
});
