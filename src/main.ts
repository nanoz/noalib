import "./styles.css";
import {
  DESIGN,
  OVERLAYS,
  STATUS_BAR_MASKS,
  TEMPLATE_SRC,
  UPDATE_INTERVAL_MS,
  WATERMARK,
} from "./config";
import { computeValidityWindow, formatNaolibDate, parseNowParameter } from "./date";
import { computeStageLayout, getFitMode, type FitMode, type StageLayout } from "./layout";

type AppState = {
  debug: boolean;
  fitMode: FitMode;
  fixedNow: Date | null;
  layout: StageLayout;
  startText: string;
  endText: string;
};

const params = new URLSearchParams(window.location.search);
const fixedNow = parseNowParameter(params.get("now"));
const hasInvalidNow = params.has("now") && fixedNow === null;
const state: AppState = {
  debug: params.get("debug") === "1",
  fitMode: getFitMode(params),
  fixedNow,
  layout: computeStageLayout(window.innerWidth, window.innerHeight, getFitMode(params)),
  startText: "",
  endText: "",
};

if (hasInvalidNow && import.meta.env.DEV) {
  console.warn("Invalid now query parameter; falling back to the real current time.");
}

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) {
  throw new Error("Missing #app root");
}

app.innerHTML = `
  <main id="viewport" aria-label="mTicket Naolib non valable">
    <section id="stage">
      <img id="ticket-template" src="${TEMPLATE_SRC}" alt="Mockup de ticket Naolib non valable" />
      <div class="status-mask status-mask--left" aria-hidden="true"></div>
      <div class="status-mask status-mask--right" aria-hidden="true"></div>
      <div class="date-mask date-mask--start" aria-hidden="true"></div>
      <div class="date-mask date-mask--end" aria-hidden="true"></div>
      <div id="start-date" class="date-overlay date-overlay--start"></div>
      <div id="end-date" class="date-overlay date-overlay--end"></div>
      <!-- <div class="safety-mark">${WATERMARK.text}</div> -->
    </section>
    <aside id="debug-panel" hidden></aside>
    <div id="asset-error" role="alert" hidden>Missing asset: ${TEMPLATE_SRC}</div>
  </main>
`;

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Ticket DOM failed to initialize: ${selector}`);
  }

  return element;
}

const stage = requireElement<HTMLElement>("#stage");
const viewport = requireElement<HTMLElement>("#viewport");
const template = requireElement<HTMLImageElement>("#ticket-template");
const startDate = requireElement<HTMLDivElement>("#start-date");
const endDate = requireElement<HTMLDivElement>("#end-date");
const debugPanel = requireElement<HTMLElement>("#debug-panel");
const assetError = requireElement<HTMLElement>("#asset-error");

function applyOverlayGeometry(): void {
  stage.style.setProperty("--design-width", `${DESIGN.width}px`);
  stage.style.setProperty("--design-height", `${DESIGN.height}px`);
  stage.style.setProperty("--start-mask-left", `${OVERLAYS.startDate.mask.left}px`);
  stage.style.setProperty("--start-mask-top", `${OVERLAYS.startDate.mask.top}px`);
  stage.style.setProperty("--start-mask-width", `${OVERLAYS.startDate.mask.width}px`);
  stage.style.setProperty("--start-mask-height", `${OVERLAYS.startDate.mask.height}px`);
  stage.style.setProperty("--start-text-left", `${OVERLAYS.startDate.text.left}px`);
  stage.style.setProperty("--start-text-top", `${OVERLAYS.startDate.text.top}px`);
  stage.style.setProperty("--end-mask-left", `${OVERLAYS.endDate.mask.left}px`);
  stage.style.setProperty("--end-mask-top", `${OVERLAYS.endDate.mask.top}px`);
  stage.style.setProperty("--end-mask-width", `${OVERLAYS.endDate.mask.width}px`);
  stage.style.setProperty("--end-mask-height", `${OVERLAYS.endDate.mask.height}px`);
  stage.style.setProperty("--end-text-left", `${OVERLAYS.endDate.text.left}px`);
  stage.style.setProperty("--end-text-top", `${OVERLAYS.endDate.text.top}px`);
  stage.style.setProperty("--status-left-left", `${STATUS_BAR_MASKS.left.left}px`);
  stage.style.setProperty("--status-left-top", `${STATUS_BAR_MASKS.left.top}px`);
  stage.style.setProperty("--status-left-width", `${STATUS_BAR_MASKS.left.width}px`);
  stage.style.setProperty("--status-left-height", `${STATUS_BAR_MASKS.left.height}px`);
  stage.style.setProperty("--status-right-left", `${STATUS_BAR_MASKS.right.left}px`);
  stage.style.setProperty("--status-right-top", `${STATUS_BAR_MASKS.right.top}px`);
  stage.style.setProperty("--status-right-width", `${STATUS_BAR_MASKS.right.width}px`);
  stage.style.setProperty("--status-right-height", `${STATUS_BAR_MASKS.right.height}px`);
  stage.style.setProperty("--watermark-left", `${WATERMARK.left}px`);
  stage.style.setProperty("--watermark-top", `${WATERMARK.top}px`);
}

function referenceNow(): Date {
  return state.fixedNow ?? new Date();
}

function renderDates(): void {
  const validity = computeValidityWindow(referenceNow());
  state.startText = formatNaolibDate(validity.start);
  state.endText = formatNaolibDate(validity.end);
  startDate.textContent = state.startText;
  endDate.textContent = state.endText;
  renderDebugPanel();
}

function getViewportSize(): { width: number; height: number } {
  const visualViewport = window.visualViewport;
  if (visualViewport) {
    return {
      width: visualViewport.width || window.innerWidth,
      height: visualViewport.height || window.innerHeight,
    };
  }

  const rect = viewport.getBoundingClientRect();

  return {
    width: rect.width || window.innerWidth,
    height: rect.height || window.innerHeight,
  };
}

function renderLayout(): void {
  const { width, height } = getViewportSize();
  state.layout = computeStageLayout(width, height, state.fitMode);
  stage.style.transform = `translate3d(${state.layout.x}px, ${state.layout.y}px, 0) scale(${state.layout.scale})`;
  renderDebugPanel();
}

function renderDebugPanel(): void {
  debugPanel.hidden = !state.debug;
  stage.classList.toggle("is-debug", state.debug);

  if (!state.debug) {
    return;
  }

  debugPanel.textContent = [
    `canvas: ${DESIGN.width} x ${DESIGN.height}`,
    `viewport: ${Math.round(getViewportSize().width)} x ${Math.round(getViewportSize().height)}`,
    `screen: ${Math.round(window.screen.width)} x ${Math.round(window.screen.height)}`,
    `fit: ${state.fitMode}`,
    `scale: ${state.layout.scale.toFixed(4)}`,
    `start: ${state.startText}`,
    `end: ${state.endText}`,
  ].join("\n");
}

function handleVisibilityChange(): void {
  if (document.visibilityState === "visible") {
    renderDates();
    renderLayout();
  }
}

template.addEventListener("error", () => {
  if (import.meta.env.DEV) {
    assetError.hidden = false;
  }
});

applyOverlayGeometry();
renderLayout();
renderDates();

window.addEventListener("resize", renderLayout, { passive: true });
window.addEventListener("orientationchange", renderLayout, { passive: true });
document.addEventListener("visibilitychange", handleVisibilityChange);
window.setInterval(renderDates, UPDATE_INTERVAL_MS);
