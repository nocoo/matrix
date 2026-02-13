// Pure business logic for the Card Showcase page.
// No React dependency — fully testable with plain unit tests.

import type { CreditCard } from "@/models/types";

export function computeUtilization(balance: number, limit: number): number {
  if (limit === 0) return 0;
  return Math.round((balance / limit) * 100);
}

export interface CardColorScheme {
  textMuted: string;
  textSecondary: string;
  textPrimary: string;
  chipHighContrast: boolean;
  overlayOpacity: { large: string; small: string };
}

export function deriveColorScheme(network: CreditCard["network"]): CardColorScheme {
  const isBlack = network === "amex";
  return {
    textMuted: isBlack ? "text-amber-200/60" : "text-white/60",
    textSecondary: isBlack ? "text-amber-100/80" : "text-white/80",
    textPrimary: isBlack ? "text-amber-50" : "text-white",
    chipHighContrast: isBlack,
    overlayOpacity: {
      large: isBlack ? "bg-white/[0.03]" : "bg-white/[0.06]",
      small: isBlack ? "bg-white/[0.02]" : "bg-white/[0.04]",
    },
  };
}

export function formatBalance(balance: number, visible: boolean): string {
  return visible ? `$${balance.toLocaleString()}` : "******";
}
