import { useState } from "react";
import { AsciiBox } from "@/components/ui/AsciiBox";
import { MatrixButton } from "@/components/ui/MatrixButton";
import { MatrixRain, MatrixInput, DecodingText } from "@/components/ui/MatrixExtras";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="relative min-h-screen bg-[var(--matrix-bg)] flex items-center justify-center p-4">
      <MatrixRain />
      <div className="relative z-10 w-full max-w-sm">
        <AsciiBox title="SYSTEM LOGIN">
          <div className="space-y-4">
            <div className="text-center mb-4">
              <DecodingText
                text="[MATRIX]"
                className="font-mono text-lg text-matrix-primary glow-text"
              />
              <p className="font-mono text-xs text-matrix-dim mt-1">
                authentication required
              </p>
            </div>

            <div className="space-y-3">
              <MatrixInput
                label="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@matrix.sys"
              />
              <MatrixInput
                label="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <MatrixButton className="w-full">[AUTHENTICATE]</MatrixButton>

            <p className="font-mono text-[10px] text-matrix-dim text-center">
              &gt; forgot access? contact sysadmin
            </p>
          </div>
        </AsciiBox>
      </div>
    </div>
  );
}
