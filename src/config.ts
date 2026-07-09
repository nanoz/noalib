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

export const STATUS_BAR_MASKS = {
  left: { left: 92, top: 66, width: 278, height: 82 },
  right: { left: 830, top: 66, width: 288, height: 82 },
} as const;

export const WATERMARK = {
  text: "SPECIMEN — NON VALABLE",
  left: 520,
  top: 1062,
} as const;

export const TEMPLATE_SRC = "/ticket-template.png";
export const PARIS_TIME_ZONE = "Europe/Paris";
