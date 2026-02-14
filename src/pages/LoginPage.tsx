import { useState, useEffect } from "react";
import { AsciiBox } from "@/components/ui/AsciiBox";
import { MatrixButton } from "@/components/ui/MatrixButton";
import {
  MatrixRain,
  MatrixInput,
  DecodingText,
  ScrambleText,
  TypewriterText,
  ConnectionStatus,
  Sparkline,
  LiveSniffer,
} from "@/components/ui/MatrixExtras";

const SYSTEM_LOGS = [
  "> INITIALIZING SECURE CHANNEL...",
  "> CRYPTOGRAPHIC HANDSHAKE [OK]",
  "> LOADING AUTHENTICATION MODULE",
  "> NEURAL LINK ESTABLISHED",
  "> AWAITING CREDENTIALS...",
];

function SystemClock() {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString("en-US", { hour12: false }));
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return <span>{time}</span>;
}

function BootLog() {
  const [lines, setLines] = useState<string[]>([]);
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < SYSTEM_LOGS.length) {
        setLines((prev) => [...prev, SYSTEM_LOGS[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 600);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="font-mono text-[10px] text-matrix-dim space-y-0.5 h-[70px] overflow-hidden">
      {lines.map((line, idx) => (
        <div
          key={idx}
          className="border-l border-matrix-primary/20 pl-2 animate-[fadeIn_0.3s_ease-in]"
        >
          {line}
        </div>
      ))}
    </div>
  );
}

const SPARKLINE_DATA = [12, 18, 9, 24, 15, 31, 22, 19, 27, 14, 33, 20, 16, 28, 11, 25];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sessionId] = useState(
    () => `0x${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
  );

  return (
    <div className="relative min-h-screen bg-[var(--matrix-bg)] flex items-center justify-center p-4 overflow-hidden">
      {/* Background layers */}
      <MatrixRain />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-[var(--matrix-bg)]/30 to-[var(--matrix-bg)]/80 pointer-events-none" />
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,65,0.1)_2px,rgba(0,255,65,0.1)_4px)]" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Top system bar */}
        <div className="flex items-center justify-between px-2 pb-2 font-mono text-[10px] text-matrix-dim">
          <div className="flex items-center gap-2">
            <ConnectionStatus status="STABLE" />
            <span>SECURE CHANNEL</span>
          </div>
          <div className="flex items-center gap-3">
            <span>SESSION: {sessionId}</span>
            <SystemClock />
          </div>
        </div>

        <AsciiBox title="SYSTEM ACCESS" subtitle="AUTH-V7.2">
          <div className="space-y-5">
            {/* ASCII logo + title */}
            <div className="text-center space-y-2">
              <pre className="text-[8px] leading-[1.15] text-matrix-primary/60 select-none font-mono">{`
 ██████╗██╗   ██╗██████╗ ██████╗
██╔════╝╚██╗ ██╔╝██╔══██╗██╔══██╗
██║      ╚████╔╝ ██████╔╝██████╔╝
██║       ╚██╔╝  ██╔══██╗██╔═══╝
╚██████╗   ██║   ██████╔╝██║
 ╚═════╝   ╚═╝   ╚═════╝ ╚═╝`.trim()}</pre>
              <ScrambleText
                text="MATRIX AUTHENTICATION GATEWAY"
                className="font-mono text-sm text-matrix-primary font-bold tracking-[0.2em] block glow-text"
                loop
                loopDelayMs={4000}
                durationMs={1200}
              />
              <DecodingText
                text="[ NEURAL IDENTITY VERIFICATION PROTOCOL ]"
                className="font-mono text-[10px] text-matrix-muted block"
              />
            </div>

            {/* Divider with sparkline */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-matrix-primary/15" />
              <div className="opacity-60">
                <Sparkline values={SPARKLINE_DATA} width={100} height={20} />
              </div>
              <div className="flex-1 h-px bg-matrix-primary/15" />
            </div>

            {/* Boot log sequence */}
            <BootLog />

            {/* Form area */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 bg-matrix-primary animate-pulse" />
                <TypewriterText
                  text="ENTER CREDENTIALS TO PROCEED"
                  className="font-mono text-[10px] text-matrix-primary font-bold tracking-widest"
                  speedMs={40}
                  startDelayMs={3200}
                />
              </div>
              <MatrixInput
                label="operator id"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@matrix.sys"
              />
              <MatrixInput
                label="passphrase"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
              />
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <MatrixButton className="w-full">[ AUTHENTICATE ]</MatrixButton>
              <div className="flex items-center justify-between">
                <a
                  href="/badge-login"
                  className="font-mono text-[10px] text-matrix-dim hover:text-matrix-primary transition-colors"
                >
                  &gt; badge authentication
                </a>
                <span className="font-mono text-[10px] text-matrix-dim">
                  &gt; forgot access? contact sysadmin
                </span>
              </div>
            </div>

            {/* Bottom system info */}
            <div className="border-t border-matrix-primary/10 pt-3 space-y-2">
              {/* Live sniffer mini */}
              <div className="h-[60px] overflow-hidden opacity-70">
                <LiveSniffer />
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between font-mono text-[9px] text-matrix-dim">
                <div className="flex items-center gap-3">
                  <span>PROTOCOL: TLS-Q/256</span>
                  <span>LATENCY: 12ms</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>NODE: MX-7741</span>
                  <span>v7.2.0-rc.1</span>
                </div>
              </div>
            </div>
          </div>
        </AsciiBox>

        {/* Bottom decorative bar */}
        <div className="flex items-center justify-between px-2 pt-2 font-mono text-[9px] text-matrix-dim/50">
          <span>MATRIX SYSTEMS INC. ©2026</span>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-matrix-primary/30" />
            <div className="w-1 h-1 bg-matrix-primary/50" />
            <div className="w-1 h-1 bg-matrix-primary/70" />
            <div className="w-1 h-1 bg-matrix-primary animate-pulse" />
          </div>
          <span>ALL CONNECTIONS MONITORED</span>
        </div>
      </div>

      {/* Keyframe for boot log fade-in */}
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
