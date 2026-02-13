// Pure business logic for the Life.ai demo page.
// No React dependency — fully testable with plain unit tests.

import type { LifeAiTimelineEvent } from "@/models/types";

/** Count events that have a color (i.e. categorized activities) */
export function countActiveEvents(events: LifeAiTimelineEvent[]): number {
  return events.filter((e) => e.color).length;
}

/** Compute total calories from timeline events whose subtitle contains "kcal" */
export function computeTotalCalories(events: LifeAiTimelineEvent[]): number {
  return events.reduce((sum, e) => {
    if (!e.subtitle) return sum;
    const match = e.subtitle.match(/(\d[\d,]*)\s*kcal/i);
    if (!match) return sum;
    return sum + parseInt(match[1].replace(",", ""), 10);
  }, 0);
}

/** Navigate date by a number of days (positive = forward, negative = back) */
export function shiftDate(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
