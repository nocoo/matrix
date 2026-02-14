import { useEffect, useState } from "react";

export default function LoadingPage() {
  const [progress, setProgress] = useState(0);
  const [lines, setLines] = useState<string[]>([]);

  const bootMessages = [
    "initializing kernel...",
    "loading matrix subsystem...",
    "mounting encrypted volumes...",
    "connecting to neural network...",
    "syncing financial data streams...",
    "calibrating visualization engine...",
    "establishing secure channels...",
    "verifying system integrity...",
    "loading user profile...",
    "system ready.",
  ];

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (current < bootMessages.length) {
        setLines((prev) => [...prev, bootMessages[current]]);
        setProgress(((current + 1) / bootMessages.length) * 100);
        current++;
      } else {
        clearInterval(interval);
      }
    }, 400);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[var(--matrix-bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="border border-matrix-primary/20 p-6 matrix-panel">
          {/* Header */}
          <div className="text-center mb-6">
            <p className="font-mono text-lg text-matrix-primary glow-text">[MATRIX]</p>
            <p className="font-mono text-[10px] text-matrix-dim mt-1 uppercase tracking-widest">
              system boot sequence
            </p>
          </div>

          {/* Boot log */}
          <div className="font-mono text-xs space-y-1 mb-4 min-h-[200px]">
            {lines.map((line, i) => (
              <p key={i} className="text-matrix-muted">
                <span className="text-matrix-dim">[{String(i).padStart(2, "0")}]</span>{" "}
                {line}
              </p>
            ))}
            {progress < 100 && (
              <p className="text-matrix-primary animate-pulse">_</p>
            )}
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="h-1.5 w-full bg-matrix-primary/10 overflow-hidden">
              <div
                className="h-full bg-matrix-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="font-mono text-[10px] text-matrix-dim text-right">
              {progress.toFixed(0)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
