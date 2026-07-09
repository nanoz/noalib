import { describe, expect, it } from "vitest";
import { DESIGN, IPHONE_16_PRO_VIEWPORT } from "../src/config";
import { computeStageLayout, getStageViewportSize } from "../src/layout";

describe("computeStageLayout", () => {
  it("matches the native iPhone 16 Pro portrait canvas exactly", () => {
    const layout = computeStageLayout(
      IPHONE_16_PRO_VIEWPORT.width,
      IPHONE_16_PRO_VIEWPORT.height,
      "cover",
    );

    expect(layout.scale).toBeCloseTo(IPHONE_16_PRO_VIEWPORT.width / DESIGN.width, 6);
    expect(layout.scaleX).toBeCloseTo(IPHONE_16_PRO_VIEWPORT.width / DESIGN.width, 6);
    expect(layout.scaleY).toBeCloseTo(IPHONE_16_PRO_VIEWPORT.width / DESIGN.width, 6);
    expect(layout.x).toBeCloseTo(0, 6);
    expect(layout.y).toBeCloseTo(0, 6);
    expect(DESIGN.width / IPHONE_16_PRO_VIEWPORT.width).toBe(3);
    expect(DESIGN.height / IPHONE_16_PRO_VIEWPORT.height).toBe(3);
  });

  it("top-aligns small cover overflow so the status area is not clipped", () => {
    const layout = computeStageLayout(IPHONE_16_PRO_VIEWPORT.width, 852, "cover");

    expect(layout.scale).toBeCloseTo(IPHONE_16_PRO_VIEWPORT.width / DESIGN.width, 6);
    expect(layout.scaleX).toBeCloseTo(IPHONE_16_PRO_VIEWPORT.width / DESIGN.width, 6);
    expect(layout.scaleY).toBeCloseTo(IPHONE_16_PRO_VIEWPORT.width / DESIGN.width, 6);
    expect(layout.y).toBeCloseTo(0, 6);
  });

  it("uses screen height when iOS reports a shorter visual viewport", () => {
    const viewport = getStageViewportSize({
      innerWidth: IPHONE_16_PRO_VIEWPORT.width,
      innerHeight: 852,
      visualViewport: {
        width: IPHONE_16_PRO_VIEWPORT.width,
        height: 852,
      },
      screen: {
        width: IPHONE_16_PRO_VIEWPORT.width,
        height: IPHONE_16_PRO_VIEWPORT.height,
      },
    });
    const layout = computeStageLayout(viewport.width, viewport.height, "cover");

    expect(viewport.height).toBe(IPHONE_16_PRO_VIEWPORT.height);
    expect(layout.scale).toBeCloseTo(IPHONE_16_PRO_VIEWPORT.width / DESIGN.width, 6);
    expect(layout.scaleY).toBeCloseTo(IPHONE_16_PRO_VIEWPORT.width / DESIGN.width, 6);
    expect(layout.y).toBeCloseTo(0, 6);
  });

  it("keeps large cover overflow centered for non-phone debug viewports", () => {
    const layout = computeStageLayout(500, 852, "cover");
    const renderedHeight = DESIGN.height * layout.scale;

    expect(renderedHeight - 852).toBeGreaterThan(120);
    expect(layout.scaleY).toBeCloseTo(layout.scaleX, 6);
    expect(layout.y).toBeCloseTo((852 - renderedHeight) / 2, 6);
  });
});
