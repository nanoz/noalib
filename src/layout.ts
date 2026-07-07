import { DESIGN } from "./config";

export type FitMode = "cover" | "contain";

export type StageLayout = {
  scale: number;
  x: number;
  y: number;
};

export function getFitMode(params: URLSearchParams): FitMode {
  return params.get("fit") === "contain" ? "contain" : "cover";
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

  return {
    scale,
    x: (viewportWidth - DESIGN.width * scale) / 2,
    y: (viewportHeight - DESIGN.height * scale) / 2,
  };
}
