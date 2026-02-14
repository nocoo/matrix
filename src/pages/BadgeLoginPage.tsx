import { useState } from "react";
import { AsciiBox } from "@/components/ui/AsciiBox";
import { MatrixButton } from "@/components/ui/MatrixButton";
import { MatrixInput, TypewriterText } from "@/components/ui/MatrixExtras";

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
              <TypewriterText
                text="scan your badge or enter ID"
                className="font-mono text-xs text-matrix-dim block"
                speedMs={30}
              />
            </div>

            <MatrixInput
              label="badge id"
              type="text"
              value={badgeId}
              onChange={(e) => setBadgeId(e.target.value)}
              placeholder="XXXX-XXXX-XXXX"
              className="text-center tracking-widest"
            />

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
