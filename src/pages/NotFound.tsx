import { MatrixRain } from "@/components/ui/MatrixExtras";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[var(--matrix-bg)] flex items-center justify-center p-4">
      <MatrixRain />
      <div className="relative z-10 text-center">
        <p className="font-mono text-6xl text-matrix-primary glow-text mb-4">404</p>
        <p className="font-mono text-sm text-matrix-muted mb-2">
          &gt; ERROR: node not found in the matrix
        </p>
        <p className="font-mono text-xs text-matrix-dim mb-8">
          the requested path does not exist in this reality
        </p>
        <a
          href="/"
          className="inline-block font-mono text-sm text-matrix-primary border border-matrix-primary/30 rounded px-6 py-2 hover:bg-matrix-primary/10 transition-colors"
        >
          [RETURN TO BASE]
        </a>
      </div>
    </div>
  );
}
