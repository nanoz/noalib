import { PARIS_TIME_ZONE } from "./config";

const MINUTE_MS = 60_000;
const START_OFFSET_MINUTES = -50;
const END_OFFSET_MINUTES = 10;

export type ValidityWindow = {
  start: Date;
  end: Date;
};

export function computeValidityWindow(now: Date): ValidityWindow {
  return {
    start: new Date(now.getTime() + START_OFFSET_MINUTES * MINUTE_MS),
    end: new Date(now.getTime() + END_OFFSET_MINUTES * MINUTE_MS),
  };
}

export function millisecondsUntilNextMinute(now: Date): number {
  const elapsedInCurrentMinute = now.getSeconds() * 1000 + now.getMilliseconds();

  return elapsedInCurrentMinute === 0 ? MINUTE_MS : MINUTE_MS - elapsedInCurrentMinute;
}

export function formatNaolibDate(date: Date): string {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: PARIS_TIME_ZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";

  return `${part("day")} ${part("month")} ${part("year")}, ${part("hour")}:${part("minute")}`;
}

export function parseNowParameter(value: string | null): Date | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}
