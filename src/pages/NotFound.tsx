import { MatrixRain, ScrambleText, TypewriterText } from "@/components/ui/MatrixExtras";
import { MatrixButton } from "@/components/ui/MatrixButton";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[var(--matrix-bg)] flex items-center justify-center p-4">
      <MatrixRain />
      <div className="relative z-10 text-center">
        <ScrambleText
          text="404"
          className="font-mono text-6xl text-matrix-primary glow-text block mb-4"
          loop
          loopDelayMs={4000}
        />
        <TypewriterText
          text="> ERROR: node not found in the matrix"
          className="font-mono text-sm text-matrix-muted block mb-2"
          speedMs={25}
        />
        <p className="font-mono text-xs text-matrix-dim mb-8">
          the requested path does not exist in this reality
        </p>
        <MatrixButton
          onClick={() => { window.location.href = "/"; }}
        >
          [RETURN TO BASE]
        </MatrixButton>
      </div>
    </div>
  );
}
