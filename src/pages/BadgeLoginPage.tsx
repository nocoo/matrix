import { useState } from "react";
import { AsciiBox } from "@/components/ui/AsciiBox";
import { MatrixButton } from "@/components/ui/MatrixButton";

export default function BadgeLoginPage() {
  const [badgeId, setBadgeId] = useState("");

  return (
    <div className="min-h-screen bg-[var(--matrix-bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <AsciiBox title="BADGE AUTHENTICATION">
          <div className="space-y-4">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-matrix-primary/30 mb-3">
                <span className="font-mono text-2xl text-matrix-primary">[ID]</span>
              </div>
              <p className="font-mono text-xs text-matrix-dim">
                scan your badge or enter ID
              </p>
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase text-matrix-dim block mb-1">
                badge id
              </label>
              <input
                type="text"
                value={badgeId}
                onChange={(e) => setBadgeId(e.target.value)}
                placeholder="XXXX-XXXX-XXXX"
                className="w-full bg-transparent border border-matrix-primary/20 px-3 py-2 font-mono text-sm text-matrix-primary text-center tracking-widest placeholder:text-matrix-dim outline-none focus:border-matrix-primary/50"
              />
            </div>

            <MatrixButton className="w-full">[VERIFY]</MatrixButton>

            <div className="text-center">
              <a
                href="/login"
                className="font-mono text-[10px] text-matrix-muted hover:text-matrix-primary transition-colors"
              >
                &gt; use email login instead
              </a>
            </div>
          </div>
        </AsciiBox>
      </div>
    </div>
  );
}
