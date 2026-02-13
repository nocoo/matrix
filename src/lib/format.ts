// ============================================
// Format Utilities
// ============================================

/**
 * Format duration in seconds to human readable string
 */
export function formatDuration(seconds: number): string {
  if (seconds === null || seconds === undefined || isNaN(seconds)) {
    return "-";
  }

  if (seconds === 0) return "0s";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(" ");
}

/**
 * Format duration in milliseconds to human readable string
 */
export function formatDurationMs(ms: number): string {
  if (ms === null || ms === undefined || isNaN(ms)) {
    return "-";
  }
  return formatDuration(Math.floor(ms / 1000));
}

/**
 * Format ISO date to relative time (e.g., "5m ago")
 */
export function formatRelativeTime(isoDate: string): string {
  if (!isoDate) return "-";

  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "-";

  const now = Date.now();
  const diff = now - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}

/**
 * Format ISO date to readable format
 */
export function formatDate(isoDate: string): string {
  if (!isoDate) return "-";

  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format ISO date to absolute time in UTC+8 (HH:mm:ss)
 */
export function formatTimeUTC8(isoDate: string): string {
  if (!isoDate) return "-";

  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "-";

  const utc8Date = new Date(date.getTime() + 8 * 60 * 60 * 1000);

  const hours = utc8Date.getUTCHours().toString().padStart(2, "0");
  const minutes = utc8Date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = utc8Date.getUTCSeconds().toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Format exit code to status string (uppercase)
 */
export function formatExitCode(exitCode: number | null): string {
  if (exitCode == null) return "RUNNING";
  if (exitCode === 0) return "OK";
  if (exitCode === -1) return "INTERRUPTED";
  return "FAILED";
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Format percentage (0-1 to "80%")
 */
export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}
