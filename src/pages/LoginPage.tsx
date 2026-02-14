import { useState } from "react";
import { AsciiBox } from "@/components/ui/AsciiBox";
import { MatrixButton } from "@/components/ui/MatrixButton";
import { MatrixRain } from "@/components/ui/MatrixExtras";

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
              <p className="font-mono text-lg text-matrix-primary glow-text">[MATRIX]</p>
              <p className="font-mono text-xs text-matrix-dim mt-1">
                authentication required
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-mono text-[10px] uppercase text-matrix-dim block mb-1">
                  email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@matrix.sys"
                  className="w-full bg-transparent border border-matrix-primary/20 px-3 py-2 font-mono text-sm text-matrix-primary placeholder:text-matrix-dim outline-none focus:border-matrix-primary/50"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase text-matrix-dim block mb-1">
                  password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent border border-matrix-primary/20 px-3 py-2 font-mono text-sm text-matrix-primary placeholder:text-matrix-dim outline-none focus:border-matrix-primary/50"
                />
              </div>
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
