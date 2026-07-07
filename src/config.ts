export const DESIGN = {
  width: 1206,
  height: 2622,
} as const;

export const IPHONE_16_PRO_VIEWPORT = {
  width: 402,
  height: 874,
} as const;

export const OVERLAYS = {
  startDate: {
    mask: { left: 130, top: 1200, width: 460, height: 62 },
    text: { left: 145, top: 1202 },
  },
  endDate: {
    mask: { left: 130, top: 1377, width: 460, height: 62 },
    text: { left: 145, top: 1381 },
  },
} as const;

export const WATERMARK = {
  text: "SPECIMEN — NON VALABLE",
  left: 520,
  top: 1062,
} as const;

export const TEMPLATE_SRC = "/ticket-template.png";
export const UPDATE_INTERVAL_MS = 30_000;
export const PARIS_TIME_ZONE = "Europe/Paris";
