import { AsciiBox } from "@/components/ui/AsciiBox";
import { ConnectionStatus } from "@/components/ui";
import { useTargetCardsViewModel } from "@/viewmodels/useTargetCardsViewModel";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, string> = {
  shield: "[#]",
  plane: "[>]",
  car: "[=]",
  home: "[^]",
};

export default function TargetCardsPage() {
  const { goals } = useTargetCardsViewModel();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <AsciiBox key={goal.name} title={goal.name.toUpperCase()}>
            <div className="space-y-3">
              {/* Icon and status */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg text-matrix-primary">
                  {ICON_MAP[goal.icon] ?? "[?]"}
                </span>
                <span
                  className={cn(
                    "font-mono text-[10px] uppercase px-2 py-0.5 flex items-center gap-1",
                    goal.onTrack
                      ? "bg-matrix-primary/10 text-matrix-primary"
                      : "bg-yellow-500/10 text-yellow-500"
                  )}
                >
                  <ConnectionStatus
                    status={goal.onTrack ? "STABLE" : "UNSTABLE"}
                  />
                  {goal.onTrack ? "on track" : "behind"}
                </span>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between font-mono text-xs mb-1">
                  <span className="text-matrix-muted">
                    ${goal.saved.toLocaleString()} / ${goal.target.toLocaleString()}
                  </span>
                  <span className="text-matrix-primary">{goal.percent}%</span>
                </div>
                <div className="h-2 w-full bg-matrix-primary/10 overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all",
                      goal.onTrack ? "bg-matrix-primary" : "bg-yellow-500"
                    )}
                    style={{ width: `${goal.percent}%` }}
                  />
                </div>
              </div>

              {/* Monthly target */}
              <div className="font-mono text-[10px] text-matrix-dim">
                need ${goal.monthlyTarget.toLocaleString()}/month to reach target
              </div>
            </div>
          </AsciiBox>
        ))}
      </div>
    </div>
  );
}
