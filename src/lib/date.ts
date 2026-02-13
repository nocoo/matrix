// ============================================
// Date Utilities
// All functions use LOCAL time, not UTC
// ============================================

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Format date as YYYY-MM-DD using local time
 */
function formatLocalDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Extract date key (YYYY-MM-DD) from ISO string or Date using local time
 */
export function getDateKey(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatLocalDate(d);
}

/**
 * Get number of days ago from now (using local dates)
 */
export function getDaysAgo(isoDate: string): number {
  const date = new Date(isoDate);
  const now = new Date();

  const dateKey = getDateKey(date);
  const todayKey = getDateKey(now);

  const dateTime = new Date(dateKey).getTime();
  const todayTime = new Date(todayKey).getTime();

  return Math.floor((todayTime - dateTime) / (24 * 60 * 60 * 1000));
}

/**
 * Check if date is today (local time)
 */
export function isToday(isoDate: string): boolean {
  return getDaysAgo(isoDate) === 0;
}

/**
 * Get weekday name
 */
export function getWeekday(weekday: number | string): string {
  if (weekday === "*") return "Daily";
  if (typeof weekday === "string") return weekday;
  return WEEKDAY_NAMES[weekday] || "?";
}

/**
 * Format schedule time
 */
export function formatScheduleTime(
  hour: number | string,
  minute: number | string,
): string {
  const h =
    hour === "*"
      ? "*"
      : typeof hour === "string"
        ? hour
        : String(hour).padStart(2, "0");
  const m =
    minute === "*"
      ? "*"
      : typeof minute === "string"
        ? minute
        : String(minute).padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * Get array of date keys between start and end (inclusive, local time)
 */
export function getDateRange(startDate: string, endDate: string): string[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const result: string[] = [];

  const cursor = new Date(start);
  while (cursor <= end) {
    result.push(getDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return result;
}

/**
 * Get date N days ago (local time)
 */
export function getDateNDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return getDateKey(date);
}

/**
 * Get today's date key (local time)
 */
export function getTodayKey(): string {
  return getDateKey(new Date());
}
