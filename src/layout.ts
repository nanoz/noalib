import { DESIGN } from "./config";

export type FitMode = "cover" | "contain";

export type StageLayout = {
  scale: number;
  x: number;
  y: number;
};

export type StageViewportSize = {
  width: number;
  height: number;
};

export type StageViewportSource = {
  innerWidth: number;
  innerHeight: number;
  visualViewport?: Pick<VisualViewport, "width" | "height"> | null;
};

export function getFitMode(params: URLSearchParams): FitMode {
  return params.get("fit") === "contain" ? "contain" : "cover";
}

export function getStageViewportSize(source: StageViewportSource): StageViewportSize {
  const visualViewport = source.visualViewport;

  return {
    width: Math.max(source.innerWidth, visualViewport?.width ?? 0),
    height: Math.max(source.innerHeight, visualViewport?.height ?? 0),
  };
}

export function computeStageLayout(
  viewportWidth: number,
  viewportHeight: number,
  fitMode: FitMode,
): StageLayout {
  const scale =
    fitMode === "contain"
      ? Math.min(viewportWidth / DESIGN.width, viewportHeight / DESIGN.height)
      : Math.max(viewportWidth / DESIGN.width, viewportHeight / DESIGN.height);
  const renderedHeight = DESIGN.height * scale;
  const verticalOverflow = renderedHeight - viewportHeight;
  const shouldPreserveBottomChrome =
    fitMode === "cover" && verticalOverflow > 0 && verticalOverflow <= 120;

  return {
    scale,
    x: (viewportWidth - DESIGN.width * scale) / 2,
    y: shouldPreserveBottomChrome ? -verticalOverflow : -verticalOverflow / 2,
  };
}
