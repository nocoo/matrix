import { useState } from "react";
import { AsciiBox } from "@/components/ui/AsciiBox";
import { MatrixButton } from "@/components/ui/MatrixButton";
import { useCardShowcaseViewModel } from "@/viewmodels/useCardShowcaseViewModel";
import { cn } from "@/lib/utils";

export default function CardShowcasePage() {
  const [showBalance, setShowBalance] = useState(true);
  const { cards, cardCount, formatBalance } = useCardShowcaseViewModel(showBalance);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-matrix-dim">
          {cardCount} cards in vault
        </p>
        <MatrixButton size="sm" onClick={() => setShowBalance(!showBalance)}>
          {showBalance ? "[HIDE]" : "[SHOW]"}
        </MatrixButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <AsciiBox key={card.number} title={card.name.toUpperCase()}>
            <div className="space-y-3">
              {/* Card header */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-matrix-dim">{card.bank}</span>
                <span className="font-mono text-[10px] uppercase text-matrix-muted">
                  {card.network}
                </span>
              </div>

              {/* Card number */}
              <p className="font-mono text-sm text-matrix-muted tracking-wider">
                {card.number}
              </p>

              {/* Balance */}
              <div>
                <p className="font-mono text-[10px] uppercase text-matrix-dim">balance</p>
                <p className="font-mono text-lg text-matrix-primary">
                  {formatBalance(card.balance)}
                </p>
              </div>

              {/* Utilization bar */}
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] text-matrix-dim mb-1">
                  <span>utilization</span>
                  <span>{card.utilization}%</span>
                </div>
                <div className="h-1.5 w-full bg-matrix-primary/10 overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all",
                      card.utilization > 80 ? "bg-red-500" :
                      card.utilization > 50 ? "bg-yellow-500" :
                      "bg-matrix-primary"
                    )}
                    style={{ width: `${card.utilization}%` }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between font-mono text-[10px] text-matrix-dim">
                <span>exp {card.expiry}</span>
                <span>limit ${card.limit.toLocaleString()}</span>
              </div>
            </div>
          </AsciiBox>
        ))}
      </div>
    </div>
  );
}
