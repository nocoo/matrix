// ViewModel for the Card Showcase page.
// Composes model logic with data source — View consumes this hook only.

import { useMemo, useCallback } from "react";
import { creditCards } from "@/data/mock";
import { computeUtilization, deriveColorScheme, formatBalance } from "@/models/card-showcase";
import type { CardColorScheme } from "@/models/card-showcase";
import type { CreditCard } from "@/models/types";

export interface CardPresentation extends CreditCard {
  colorScheme: CardColorScheme;
  utilization: number;
}

export function useCardShowcaseViewModel(showBalance: boolean) {
  const cards: CardPresentation[] = useMemo(
    () =>
      creditCards.map((card) => ({
        ...card,
        colorScheme: deriveColorScheme(card.network),
        utilization: computeUtilization(card.balance, card.limit),
      })),
    [],
  );

  const formatBal = useCallback(
    (balance: number) => formatBalance(balance, showBalance),
    [showBalance],
  );

  return { cards, cardCount: cards.length, formatBalance: formatBal };
}
