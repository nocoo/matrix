// Shared amount formatting and classification utilities.
// Used by both accounts and record-list models.

export type AmountDirection = "positive" | "negative";

export function classifyDirection(amount: number): AmountDirection {
  return amount > 0 ? "positive" : "negative";
}

export function formatSignedAmount(amount: number): string {
  const prefix = amount > 0 ? "+" : "";
  return `${prefix}$${Math.abs(amount).toFixed(2)}`;
}
