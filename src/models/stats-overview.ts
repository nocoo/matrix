// Pure business logic for the Stats Overview page.
// No React dependency — fully testable with plain unit tests.

type ChangeDirection = "positive" | "negative" | "neutral";

export function classifyChange(change: string): ChangeDirection {
  if (change.startsWith("+")) return "positive";
  if (change.startsWith("-")) return "negative";
  return "neutral";
}

export function changeToColorClass(direction: ChangeDirection): string {
  switch (direction) {
    case "positive":
      return "text-matrix-primary";
    case "negative":
      return "text-red-500";
    default:
      return "text-matrix-muted";
  }
}
