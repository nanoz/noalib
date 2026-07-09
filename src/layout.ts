import { DESIGN } from "./config";

export type FitMode = "cover" | "contain";

export type StageLayout = {
  scale: number;
  scaleX: number;
  scaleY: number;
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
  screen?: Pick<Screen, "width" | "height"> | null;
};

export function getFitMode(params: URLSearchParams): FitMode {
  return params.get("fit") === "contain" ? "contain" : "cover";
}

export function getStageViewportSize(source: StageViewportSource): StageViewportSize {
  const visualViewport = source.visualViewport;
  const width = Math.max(source.innerWidth, visualViewport?.width ?? 0);
  const reportedHeight = Math.max(source.innerHeight, visualViewport?.height ?? 0);
  const screenHeight =
    source.screen && Math.abs(source.screen.width - width) <= 1
      ? source.screen.height
      : 0;

  return {
    width,
    height: Math.max(reportedHeight, screenHeight),
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
  const shouldKeepPhoneMockTopAligned =
    fitMode === "cover" && verticalOverflow > 0 && verticalOverflow <= 120;
  const renderedWidth = DESIGN.width * scale;

  return {
    scale,
    scaleX: scale,
    scaleY: scale,
    x: (viewportWidth - renderedWidth) / 2,
    y: shouldKeepPhoneMockTopAligned ? 0 : -verticalOverflow / 2,
  };
}
