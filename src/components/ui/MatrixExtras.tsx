import { useState, useEffect, useMemo, useRef, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";

// ============================================
// MatrixAvatar - Procedural avatar generator
// ============================================

function hashCode(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

interface MatrixAvatarProps {
  name?: string;
  isAnon?: boolean;
  isTheOne?: boolean;
  size?: number;
  className?: string;
}

export function MatrixAvatar({
  name = "unknown",
  isAnon = false,
  isTheOne = false,
  size = 64,
  className = "",
}: MatrixAvatarProps) {
  const hash = useMemo(() => hashCode(String(name || "unknown")), [name]);
  const grid = useMemo(() => {
    const cells: boolean[] = [];
    for (let i = 0; i < 15; i += 1) {
      cells.push(((hash >> i) & 1) === 1);
    }
    return cells;
  }, [hash]);

  const color = isAnon ? "#333" : isTheOne ? "#FFD700" : "#00FF41";
  const glowFilter = isAnon
    ? "none"
    : isTheOne
      ? "drop-shadow(0 0 8px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 15px rgba(255, 255, 255, 0.5))"
      : "drop-shadow(0 0 4px rgba(0, 255, 65, 0.6))";

  if (isAnon) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`bg-matrix-panel border border-matrix-ghost flex items-center justify-center overflow-hidden ${className}`}
      >
        <span className="text-matrix-primary font-black text-body opacity-60">?</span>
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative p-1 transition-transform duration-300 hover:scale-105 ${
        isTheOne
          ? "bg-yellow-900/20 border border-yellow-500/50"
          : "bg-matrix-panel-strong border border-matrix-dim"
      } ${className}`}
    >
      {isTheOne && (
        <div className="absolute inset-0 bg-white opacity-10 animate-pulse mix-blend-overlay" />
      )}
      <svg viewBox="0 0 5 5" className="w-full h-full" style={{ filter: glowFilter }}>
        {grid.map((filled, i) => {
          if (!filled) return null;
          const r = Math.floor(i / 3);
          const c = i % 3;
          return (
            <g key={i}>
              <rect x={c} y={r} width="1" height="1" fill={color} />
              {c < 2 && <rect x={4 - c} y={r} width="1" height="1" fill={color} />}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ============================================
// ScrambleText - Text scramble animation
// ============================================

const DEFAULT_CHARS = "01XYZA@#$%";

interface ScrambleTextProps {
  text: string;
  className?: string;
  chars?: string;
  durationMs?: number;
  fps?: number;
  loop?: boolean;
  loopDelayMs?: number;
  active?: boolean;
  startScrambled?: boolean;
}

function scrambleValue(text: string, chars: string): string {
  const safeChars = chars && chars.length ? chars : DEFAULT_CHARS;
  return String(text)
    .split("")
    .map((char) => (char === " " ? " " : safeChars[Math.floor(Math.random() * safeChars.length)]))
    .join("");
}

export function ScrambleText({
  text,
  className = "",
  chars = DEFAULT_CHARS,
  durationMs = 900,
  fps = 30,
  loop = false,
  loopDelayMs = 2000,
  active = true,
  startScrambled = false,
}: ScrambleTextProps) {
  const [display, setDisplay] = useState(() => {
    if (!active || !startScrambled || !text) return text || "";
    return scrambleValue(text, chars);
  });

  useEffect(() => {
    if (!active || !text) {
      setDisplay(text || "");
      return;
    }

    const safeChars = chars && chars.length ? chars : DEFAULT_CHARS;
    const frameInterval = fps > 0 ? 1000 / fps : 33;
    let raf = 0;
    let timeout: number = 0;
    let startTime = 0;
    let lastFrame = 0;
    let cancelled = false;

    if (startScrambled) {
      setDisplay(scrambleValue(text, safeChars));
    }

    const runFrame = (now: number) => {
      if (cancelled) return;
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      if (elapsed - lastFrame < frameInterval) {
        raf = requestAnimationFrame(runFrame);
        return;
      }
      lastFrame = elapsed;

      const progress = durationMs > 0 ? Math.min(elapsed / durationMs, 1) : 1;
      const revealCount = Math.floor(progress * text.length);

      const next = text
        .split("")
        .map((char, idx) => {
          if (idx < revealCount) return char;
          return safeChars[Math.floor(Math.random() * safeChars.length)];
        })
        .join("");

      setDisplay(next);

      if (progress < 1) {
        raf = requestAnimationFrame(runFrame);
      } else if (loop) {
        timeout = window.setTimeout(() => {
          startTime = 0;
          lastFrame = 0;
          raf = requestAnimationFrame(runFrame);
        }, loopDelayMs);
      } else {
        setDisplay(text);
      }
    };

    raf = requestAnimationFrame(runFrame);

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      if (timeout) clearTimeout(timeout);
    };
  }, [active, chars, durationMs, fps, loop, loopDelayMs, startScrambled, text]);

  return <span className={className}>{display}</span>;
}

// ============================================
// DecodingText - Simpler decode animation
// ============================================

interface DecodingTextProps {
  text: string;
  className?: string;
}

export function DecodingText({ text = "", className = "" }: DecodingTextProps) {
  const [display, setDisplay] = useState(() => String(text || ""));
  const chars = "0101XYZA@#$%";

  useEffect(() => {
    const target = String(text || "");
    if (!target) return;

    setDisplay(target);
    let iterations = 0;
    const step = Math.max(1, Math.ceil(target.length / 12));
    const intervalMs = 24;
    const interval = setInterval(() => {
      setDisplay(() => {
        const baseText = String(target);
        return baseText
          .split("")
          .map((_char, index) => {
            if (index < iterations) return baseText[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
      });

      if (iterations >= target.length) clearInterval(interval);
      iterations += step;
    }, intervalMs);

    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{display}</span>;
}

// ============================================
// SignalBox - Landing page variant of AsciiBox
// ============================================

interface SignalBoxProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function SignalBox({ title = "SIGNAL", children, className = "" }: SignalBoxProps) {
  return (
    <div className={`relative flex flex-col matrix-panel ${className}`}>
      <div className="flex items-center text-matrix-primary leading-none text-heading p-2 border-b border-matrix-ghost">
        <span className="font-black uppercase bg-matrix-panel-strong px-2 py-1 border border-matrix-ghost mr-2">
          <DecodingText text={title} />
        </span>
        <span className="flex-1 text-matrix-ghost truncate">
          --------------------------------------------------
        </span>
      </div>
      <div className="p-4 relative z-10 h-full">{children}</div>
      <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-matrix-primary opacity-60" />
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-matrix-primary opacity-60" />
    </div>
  );
}

// ============================================
// MatrixInput - Styled input field
// ============================================

interface MatrixInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function MatrixInput({ label, className = "", ...props }: MatrixInputProps) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-caption text-matrix-muted uppercase font-bold">{label}</span>
      <input
        className="h-10 bg-matrix-panel border border-matrix-ghost px-3 text-body text-matrix-bright placeholder:text-matrix-dim outline-none focus:border-matrix-primary focus:ring-2 focus:ring-matrix-primary/20"
        {...props}
      />
    </label>
  );
}

// ============================================
// MatrixSelect - Custom dropdown select
// ============================================

interface MatrixSelectOption {
  value: string;
  label: string;
}

interface MatrixSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: MatrixSelectOption[];
  className?: string;
}

export function MatrixSelect({
  label,
  value,
  onChange,
  options,
  className = "",
}: MatrixSelectProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const selected = options.find((o) => o.value === value);

  const updatePos = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 1, left: rect.left, width: rect.width });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePos();
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);
    return () => {
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [open, updatePos]);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <span className="text-caption text-matrix-muted uppercase font-bold block mb-2">
          {label}
        </span>
      )}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full h-10 bg-matrix-panel border px-3 text-body font-mono text-matrix-primary uppercase outline-none flex items-center justify-between transition-colors cursor-pointer ${
          open ? "border-matrix-primary" : "border-matrix-ghost hover:border-matrix-dim"
        }`}
      >
        <span>{selected?.label ?? ""}</span>
        <span className={`text-matrix-dim text-caption transition-transform ${open ? "rotate-180" : ""}`}>▼</span>
      </button>
      {open &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[9998]" onClick={() => setOpen(false)} />
            <div
              className="fixed z-[9999] matrix-panel border border-matrix-primary/30 py-1 shadow-[0_0_20px_rgba(0,255,65,0.1)]"
              style={{ top: pos.top, left: pos.left, width: pos.width }}
            >
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-caption font-mono uppercase font-bold transition-colors ${
                    opt.value === value
                      ? "bg-matrix-primary/15 text-matrix-primary"
                      : "text-matrix-muted hover:bg-matrix-primary/10 hover:text-matrix-primary"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}

// ============================================
// TypewriterText - Typewriter effect
// ============================================

interface TypewriterTextProps {
  text: string;
  className?: string;
  startDelayMs?: number;
  speedMs?: number;
  cursor?: boolean;
  cursorClassName?: string;
  loop?: boolean;
  loopDelayMs?: number;
  active?: boolean;
}

export function TypewriterText({
  text,
  className = "",
  startDelayMs = 0,
  speedMs = 22,
  cursor = true,
  cursorClassName = "",
  loop = false,
  loopDelayMs = 1200,
  active = true,
}: TypewriterTextProps) {
  const [count, setCount] = useState(() => (!active || !text ? text.length : 0));

  useEffect(() => {
    if (!active || !text) {
      setCount(text?.length || 0);
      return;
    }

    let timeout: number = 0;
    let cancelled = false;
    const safeSpeed = Math.max(8, Number(speedMs) || 0);
    const safeDelay = Math.max(0, Number(startDelayMs) || 0);

    const step = (index: number) => {
      if (cancelled) return;
      setCount(index);
      if (index < text.length) {
        timeout = window.setTimeout(() => step(index + 1), safeSpeed);
      } else if (loop) {
        timeout = window.setTimeout(() => step(0), loopDelayMs);
      }
    };

    setCount(0);
    timeout = window.setTimeout(() => step(1), safeDelay);

    return () => {
      cancelled = true;
      if (timeout) clearTimeout(timeout);
    };
  }, [active, loop, loopDelayMs, speedMs, startDelayMs, text]);

  const visibleText = text?.slice(0, count) || "";

  return (
    <span className={`inline-flex items-baseline ${className}`}>
      {text && <span className="sr-only">{text}</span>}
      <span aria-hidden="true" className="whitespace-pre">
        {visibleText}
      </span>
      {cursor && (
        <span aria-hidden="true" className={`ml-1 inline-block leading-none animate-pulse ${cursorClassName}`}>
          |
        </span>
      )}
    </span>
  );
}

// ============================================
// ConnectionStatus - Connection indicator
// ============================================

interface ConnectionStatusProps {
  status?: "STABLE" | "UNSTABLE" | "LOST";
  title?: string;
  className?: string;
}

export function ConnectionStatus({ status = "STABLE", title, className = "" }: ConnectionStatusProps) {
  const [bit, setBit] = useState("0");

  useEffect(() => {
    if (status !== "STABLE") return;
    const interval = setInterval(() => {
      setBit(Math.random() > 0.5 ? "1" : "0");
    }, 150);
    return () => clearInterval(interval);
  }, [status]);

  const configs = {
    STABLE: { color: "text-matrix-primary", indicator: bit },
    UNSTABLE: { color: "text-yellow-400", indicator: "!" },
    LOST: { color: "text-red-500/90", indicator: "×" },
  };

  const current = configs[status] || configs.STABLE;

  return (
    <div
      title={title}
      className={`matrix-header-chip font-matrix transition-all duration-700 ${current.color} ${className}`}
    >
      <div className="flex items-center">
        <span className="text-caption text-matrix-dim mr-1">[</span>
        <span className="text-caption w-[10px] inline-block text-center font-black">{current.indicator}</span>
        <span className="text-caption text-matrix-dim ml-1">]</span>
      </div>
    </div>
  );
}

// ============================================
// DataRow - Key-value display row
// ============================================

interface DataRowProps {
  label: string;
  value: string | number;
  subValue?: string;
  valueClassName?: string;
}

export function DataRow({ label, value, subValue, valueClassName = "" }: DataRowProps) {
  return (
    <div className="flex justify-between items-center border-b border-matrix-ghost py-2 group hover:bg-matrix-panel transition-colors px-2">
      <span className="text-caption text-matrix-muted uppercase font-bold leading-none">{label}</span>
      <div className="flex items-center space-x-3">
        {subValue && <span className="text-caption text-matrix-dim italic">{subValue}</span>}
        <span className={`font-black tracking-tight text-body ${valueClassName}`}>{value}</span>
      </div>
    </div>
  );
}

// ============================================
// LeaderboardRow - Ranking row
// ============================================

interface LeaderboardRowProps {
  rank: number;
  name: string;
  value: string | number;
  isAnon?: boolean;
  isSelf?: boolean;
  isTheOne?: boolean;
  className?: string;
}

export function LeaderboardRow({
  rank,
  name,
  value,
  isAnon = false,
  isSelf = false,
  isTheOne,
  className = "",
}: LeaderboardRowProps) {
  const highlight = isSelf ? "bg-matrix-panel-strong border-l-2 border-l-matrix-primary" : "";
  const rankValue = Number(rank);
  const showGold = Boolean(isTheOne ?? rankValue === 1);
  const formattedRank = String(Math.max(0, rankValue)).padStart(2, "0");
  const formattedValue = typeof value === "number" ? value.toLocaleString() : value;

  return (
    <div
      className={`flex justify-between items-center py-3 px-2 border-b border-matrix-ghost hover:bg-matrix-panel group ${highlight} ${className}`}
    >
      <div className="flex items-center space-x-3">
        <span className={`text-caption w-6 ${rankValue <= 3 ? "text-matrix-primary font-bold" : "text-matrix-muted"}`}>
          {formattedRank}
        </span>
        <MatrixAvatar name={name} isAnon={isAnon} isTheOne={showGold} size={24} />
        <span
          className={`text-body uppercase font-bold tracking-tight ${
            isAnon ? "text-matrix-dim blur-[1px]" : "text-matrix-bright"
          }`}
        >
          {name}
        </span>
      </div>
      <span className="text-body font-bold text-matrix-primary">{formattedValue}</span>
    </div>
  );
}

// ============================================
// LiveSniffer - Animated log stream
// ============================================

export function LiveSniffer() {
  const events = useMemo(
    () => [
      ">> INTERCEPTING DATA STREAM...",
      ">> QUANTIFYING TOKEN FLOW [OK]",
      ">> NEURAL ANALYSIS COMPLETE",
      ">> SYNCING TO MATRIX [1/1]",
      ">> BATCH PROCESSED: 42 CALLS",
      ">> HOOKING NEW ENDPOINT",
      ">> CAPTURE MODE: ACTIVE",
    ],
    [],
  );

  const [logs, setLogs] = useState(["[SYSTEM] Live sniffer initialized", "[SOCKET] Connection established"]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setLogs((prev) => [...prev.slice(-4), events[i % events.length]]);
      i++;
    }, 1500);
    return () => clearInterval(interval);
  }, [events]);

  return (
    <div className="font-matrix text-caption text-matrix-muted space-y-2 h-full flex flex-col justify-end">
      {logs.map((log, idx) => (
        <div key={idx} className="animate-pulse border-l-2 border-matrix-ghost pl-2 truncate">
          {log}
        </div>
      ))}
    </div>
  );
}

// ============================================
// Sparkline - Mini line chart
// ============================================

interface SparklineProps {
  values?: number[];
  data?: number[];
  width?: number;
  height?: number;
  color?: string;
}

export function Sparkline({ values, data, width = 200, height = 40, color = "#00FF41" }: SparklineProps) {
  const pts_source = values ?? data;
  if (!pts_source || pts_source.length < 2) return null;

  const min = Math.min(...pts_source);
  const max = Math.max(...pts_source);
  const span = max - min || 1;
  const padX = 4;
  const padY = 4;

  const pts = pts_source.map((v, i) => {
    const x = padX + (i * (width - padX * 2)) / (pts_source.length - 1);
    const y = padY + (1 - (v - min) / span) * (height - padY * 2);
    return { x, y };
  });

  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <path
        className="drop-shadow-[0_0_10px_rgba(0,255,65,0.22)]"
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// ============================================
// MatrixRain - Background rain effect
// ============================================

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const settings = {
      scale: 0.5,
      fps: 8,
      baseFontSize: 16,
      spacing: 1.4,
      trailAlpha: 0.12,
      speed: 0.85,
      resetChance: 0.985,
      highlightChance: 0.05,
    };

    const characters = "01XYZA@#$%";
    let animationFrameId = 0;
    let resizeFrameId = 0;
    let lastFrameTime = 0;
    let drops: number[] = [];
    let fontSize = 12;
    let columnPitch = 16;
    let isVisible = document.visibilityState !== "hidden";

    const resize = () => {
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      const width = Math.max(1, Math.floor(canvas.offsetWidth * settings.scale));
      const height = Math.max(1, Math.floor(canvas.offsetHeight * settings.scale));
      canvas.width = width;
      canvas.height = height;

      fontSize = Math.max(8, Math.round(settings.baseFontSize * settings.scale));
      columnPitch = Math.max(10, Math.round(fontSize * settings.spacing));
      const columns = Math.ceil(canvas.width / columnPitch);
      drops = Array.from({ length: columns }, () => Math.random() * -100);

      ctx.font = `${fontSize}px monospace`;
      ctx.textBaseline = "top";
      ctx.imageSmoothingEnabled = false;
    };

    const handleResize = () => {
      if (resizeFrameId) cancelAnimationFrame(resizeFrameId);
      resizeFrameId = requestAnimationFrame(resize);
    };

    const drawFrame = () => {
      ctx.fillStyle = `rgba(5, 5, 5, ${settings.trailAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const char = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillStyle = Math.random() < settings.highlightChance ? "#E8FFE9" : "#00FF41";
        ctx.fillText(char, i * columnPitch, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > settings.resetChance) {
          drops[i] = 0;
        }
        drops[i] += settings.speed;
      }
    };

    const loop = (time: number) => {
      if (!isVisible) return;
      const frameInterval = 1000 / settings.fps;
      if (time - lastFrameTime >= frameInterval) {
        drawFrame();
        lastFrameTime = time;
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (!isVisible) return;
      lastFrameTime = performance.now();
      animationFrameId = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
    };

    const handleVisibility = () => {
      isVisible = document.visibilityState !== "hidden";
      if (isVisible) {
        stop();
        start();
      } else {
        stop();
      }
    };

    resize();
    start();

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      stop();
      if (resizeFrameId) cancelAnimationFrame(resizeFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none opacity-100"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

// ============================================
// CircuitBackground - Cyberpunk circuit board sidebar decoration
// ============================================

export function CircuitBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 240 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ══════════════════════════════════════════
            LAYER 1 — Vertical bus lines (primary grid)
            ══════════════════════════════════════════ */}
        <g stroke="rgba(0,255,65,0.05)" strokeWidth="1" fill="none">
          {/* Left bus pair */}
          <path d="M 12 0 V 900" />
          <path d="M 20 0 V 900" />
          {/* Left-center bus */}
          <path d="M 55 0 V 900" />
          {/* Center bus pair */}
          <path d="M 110 0 V 900" />
          <path d="M 118 0 V 900" />
          {/* Right-center bus */}
          <path d="M 165 0 V 900" />
          {/* Right bus pair */}
          <path d="M 210 0 V 900" />
          <path d="M 220 0 V 900" />
          {/* Far edges */}
          <path d="M 5 0 V 900" strokeWidth="0.5" />
          <path d="M 235 0 V 900" strokeWidth="0.5" />
        </g>

        {/* ══════════════════════════════════════════
            LAYER 2 — Dense horizontal traces with right-angle routing
            ══════════════════════════════════════════ */}
        <g stroke="rgba(0,255,65,0.05)" strokeWidth="1" fill="none">
          {/* Band 0-50 */}
          <path d="M 12 20 H 55 V 35 H 110" />
          <path d="M 118 15 H 165 V 40 H 220" />
          <path d="M 20 45 H 80 V 30 H 165" />

          {/* Band 50-100 */}
          <path d="M 12 60 H 40 V 80 H 110 V 65 H 165" />
          <path d="M 165 70 H 195 V 90 H 220" />
          <path d="M 55 85 H 90 V 70 H 118" />
          <path d="M 20 95 H 70 V 80 H 55" />

          {/* Band 100-150 */}
          <path d="M 12 110 H 55 V 130 H 90 V 110 H 118" />
          <path d="M 118 120 H 145 V 140 H 210" />
          <path d="M 20 140 H 40 V 125 H 55" />
          <path d="M 165 135 H 190 V 115 H 220" />
          <path d="M 80 145 H 110" />

          {/* Band 150-200 */}
          <path d="M 12 160 H 35 V 180 H 80 V 165 H 110" />
          <path d="M 118 170 H 150 V 190 H 210" />
          <path d="M 55 185 H 75 V 170 H 90" />
          <path d="M 20 195 H 50 V 175 H 55" />
          <path d="M 165 195 H 200 V 180 H 220" />

          {/* Band 200-250 */}
          <path d="M 12 210 H 55 V 230 H 100 V 215 H 118" />
          <path d="M 118 225 H 155 V 240 H 210" />
          <path d="M 20 240 H 45 V 220 H 55" />
          <path d="M 165 235 H 185 V 210 H 220" />
          <path d="M 70 245 H 110" />

          {/* Band 250-300 */}
          <path d="M 12 260 H 40 V 280 H 90 V 265 H 118" />
          <path d="M 118 270 H 150 V 290 H 200 V 275 H 220" />
          <path d="M 55 285 H 75 V 270 H 80" />
          <path d="M 20 295 H 60 V 280 H 55" />
          <path d="M 165 290 H 190 V 260 H 210" />

          {/* Band 300-350 */}
          <path d="M 12 310 H 55 V 330 H 95 V 315 H 110" />
          <path d="M 118 320 H 145 V 340 H 195 V 325 H 220" />
          <path d="M 20 340 H 50 V 325 H 55" />
          <path d="M 65 345 H 110" />
          <path d="M 165 335 H 185 V 310 H 210" />

          {/* Band 350-400 */}
          <path d="M 12 360 H 40 V 380 H 85 V 365 H 118" />
          <path d="M 118 375 H 160 V 390 H 210" />
          <path d="M 55 385 H 70 V 370 H 80" />
          <path d="M 20 395 H 55 V 380 H 50" />
          <path d="M 165 395 H 200 V 370 H 220" />

          {/* Band 400-450 */}
          <path d="M 12 410 H 55 V 430 H 100 V 415 H 118" />
          <path d="M 118 425 H 155 V 440 H 200 V 420 H 220" />
          <path d="M 20 440 H 45 V 420 H 55" />
          <path d="M 75 445 H 110" />
          <path d="M 165 440 H 185 V 410 H 210" />

          {/* Band 450-500 */}
          <path d="M 12 460 H 35 V 480 H 80 V 465 H 110" />
          <path d="M 118 470 H 150 V 490 H 195 V 475 H 220" />
          <path d="M 55 485 H 75 V 470 H 90" />
          <path d="M 20 495 H 50 V 475 H 55" />
          <path d="M 165 490 H 200 V 460 H 210" />

          {/* Band 500-550 */}
          <path d="M 12 510 H 55 V 530 H 90 V 515 H 118" />
          <path d="M 118 520 H 145 V 540 H 210" />
          <path d="M 20 540 H 40 V 520 H 55" />
          <path d="M 165 535 H 190 V 510 H 220" />
          <path d="M 70 545 H 110" />

          {/* Band 550-600 */}
          <path d="M 12 560 H 40 V 580 H 85 V 565 H 110" />
          <path d="M 118 570 H 155 V 590 H 200 V 575 H 220" />
          <path d="M 55 585 H 75 V 570 H 80" />
          <path d="M 20 595 H 55 V 580 H 50" />
          <path d="M 165 590 H 185 V 560 H 210" />

          {/* Band 600-650 */}
          <path d="M 12 610 H 55 V 630 H 95 V 615 H 118" />
          <path d="M 118 625 H 150 V 640 H 195 V 620 H 220" />
          <path d="M 20 640 H 45 V 620 H 55" />
          <path d="M 65 645 H 110" />
          <path d="M 165 640 H 200 V 610 H 210" />

          {/* Band 650-700 */}
          <path d="M 12 660 H 35 V 680 H 80 V 665 H 110" />
          <path d="M 118 670 H 145 V 690 H 200 V 680 H 220" />
          <path d="M 55 685 H 75 V 670 H 90" />
          <path d="M 20 695 H 60 V 680 H 55" />
          <path d="M 165 690 H 190 V 660 H 210" />

          {/* Band 700-750 */}
          <path d="M 12 710 H 55 V 730 H 90 V 715 H 118" />
          <path d="M 118 720 H 155 V 740 H 210" />
          <path d="M 20 740 H 40 V 720 H 55" />
          <path d="M 165 735 H 195 V 710 H 220" />
          <path d="M 70 745 H 110" />

          {/* Band 750-800 */}
          <path d="M 12 760 H 40 V 780 H 85 V 765 H 110" />
          <path d="M 118 770 H 150 V 790 H 200 V 775 H 220" />
          <path d="M 55 785 H 75 V 770 H 80" />
          <path d="M 20 795 H 55 V 780 H 50" />
          <path d="M 165 790 H 185 V 760 H 210" />

          {/* Band 800-850 */}
          <path d="M 12 810 H 55 V 830 H 100 V 815 H 118" />
          <path d="M 118 825 H 155 V 840 H 195 V 820 H 220" />
          <path d="M 20 840 H 45 V 820 H 55" />
          <path d="M 75 845 H 110" />
          <path d="M 165 840 H 200 V 810 H 210" />

          {/* Band 850-900 */}
          <path d="M 12 860 H 35 V 880 H 80 V 865 H 110" />
          <path d="M 118 870 H 150 V 890 H 210" />
          <path d="M 55 885 H 75 V 870 H 90" />
          <path d="M 20 895 H 60 V 875 H 55" />
          <path d="M 165 885 H 190 V 860 H 220" />
        </g>

        {/* ══════════════════════════════════════════
            LAYER 3 — Pipe / conduit patterns (double-walled)
            ══════════════════════════════════════════ */}
        <g stroke="rgba(0,255,65,0.04)" strokeWidth="3" fill="none">
          {/* Vertical conduits */}
          <path d="M 38 0 V 200" />
          <path d="M 38 220 V 450" />
          <path d="M 38 470 V 700" />
          <path d="M 38 720 V 900" />

          <path d="M 140 0 V 180" />
          <path d="M 140 200 V 420" />
          <path d="M 140 440 V 650" />
          <path d="M 140 670 V 900" />

          <path d="M 190 0 V 250" />
          <path d="M 190 270 V 500" />
          <path d="M 190 520 V 750" />
          <path d="M 190 770 V 900" />

          {/* Horizontal conduits */}
          <path d="M 0 50 H 80" />
          <path d="M 130 50 H 240" />
          <path d="M 0 200 H 120" />
          <path d="M 155 200 H 240" />
          <path d="M 0 350 H 100" />
          <path d="M 160 350 H 240" />
          <path d="M 0 500 H 120" />
          <path d="M 155 500 H 240" />
          <path d="M 0 650 H 100" />
          <path d="M 160 650 H 240" />
          <path d="M 0 800 H 120" />
          <path d="M 155 800 H 240" />
        </g>

        {/* Conduit inner walls (thinner, slightly brighter) */}
        <g stroke="rgba(0,255,65,0.03)" strokeWidth="1" fill="none" strokeDasharray="4 2">
          {/* Inner vertical */}
          <path d="M 36 0 V 200" />
          <path d="M 40 0 V 200" />
          <path d="M 36 220 V 450" />
          <path d="M 40 220 V 450" />
          <path d="M 36 470 V 700" />
          <path d="M 40 470 V 700" />
          <path d="M 36 720 V 900" />
          <path d="M 40 720 V 900" />

          <path d="M 138 0 V 180" />
          <path d="M 142 0 V 180" />
          <path d="M 138 200 V 420" />
          <path d="M 142 200 V 420" />
          <path d="M 138 440 V 650" />
          <path d="M 142 440 V 650" />
          <path d="M 138 670 V 900" />
          <path d="M 142 670 V 900" />

          <path d="M 188 0 V 250" />
          <path d="M 192 0 V 250" />
          <path d="M 188 270 V 500" />
          <path d="M 192 270 V 500" />
          <path d="M 188 520 V 750" />
          <path d="M 192 520 V 750" />
          <path d="M 188 770 V 900" />
          <path d="M 192 770 V 900" />
        </g>

        {/* T-junction and elbow fittings at conduit breaks */}
        <g stroke="rgba(0,255,65,0.06)" strokeWidth="0.5" fill="none">
          {/* T-junctions on conduit 38 */}
          <rect x="33" y="198" width="10" height="4" />
          <rect x="33" y="218" width="10" height="4" />
          <rect x="33" y="448" width="10" height="4" />
          <rect x="33" y="468" width="10" height="4" />
          <rect x="33" y="698" width="10" height="4" />
          <rect x="33" y="718" width="10" height="4" />

          {/* T-junctions on conduit 140 */}
          <rect x="135" y="178" width="10" height="4" />
          <rect x="135" y="198" width="10" height="4" />
          <rect x="135" y="418" width="10" height="4" />
          <rect x="135" y="438" width="10" height="4" />
          <rect x="135" y="648" width="10" height="4" />
          <rect x="135" y="668" width="10" height="4" />

          {/* T-junctions on conduit 190 */}
          <rect x="185" y="248" width="10" height="4" />
          <rect x="185" y="268" width="10" height="4" />
          <rect x="185" y="498" width="10" height="4" />
          <rect x="185" y="518" width="10" height="4" />
          <rect x="185" y="748" width="10" height="4" />
          <rect x="185" y="768" width="10" height="4" />

          {/* Elbow connectors at horizontal conduit ends */}
          <path d="M 78 48 L 82 48 L 82 52 L 78 52 Z" />
          <path d="M 128 48 L 132 48 L 132 52 L 128 52 Z" />
          <path d="M 98 348 L 102 348 L 102 352 L 98 352 Z" />
          <path d="M 158 348 L 162 348 L 162 352 L 158 352 Z" />
          <path d="M 98 648 L 102 648 L 102 652 L 98 652 Z" />
          <path d="M 158 648 L 162 648 L 162 652 L 158 652 Z" />
        </g>

        {/* ══════════════════════════════════════════
            LAYER 4 — Dense via holes / solder pads
            ══════════════════════════════════════════ */}
        <g fill="rgba(0,255,65,0.07)" stroke="rgba(0,255,65,0.10)" strokeWidth="0.5">
          {/* Pads at every trace junction — organized by vertical band */}
          {/* x ≈ 12-20 region */}
          <rect x="10" y="18" width="4" height="4" />
          <rect x="18" y="58" width="4" height="4" />
          <rect x="10" y="108" width="4" height="4" />
          <rect x="18" y="138" width="4" height="4" />
          <rect x="10" y="158" width="4" height="4" />
          <rect x="18" y="193" width="4" height="4" />
          <rect x="10" y="208" width="4" height="4" />
          <rect x="18" y="238" width="4" height="4" />
          <rect x="10" y="258" width="4" height="4" />
          <rect x="18" y="293" width="4" height="4" />
          <rect x="10" y="308" width="4" height="4" />
          <rect x="18" y="338" width="4" height="4" />
          <rect x="10" y="358" width="4" height="4" />
          <rect x="18" y="393" width="4" height="4" />
          <rect x="10" y="408" width="4" height="4" />
          <rect x="18" y="438" width="4" height="4" />
          <rect x="10" y="458" width="4" height="4" />
          <rect x="18" y="493" width="4" height="4" />
          <rect x="10" y="508" width="4" height="4" />
          <rect x="18" y="538" width="4" height="4" />
          <rect x="10" y="558" width="4" height="4" />
          <rect x="18" y="593" width="4" height="4" />
          <rect x="10" y="608" width="4" height="4" />
          <rect x="18" y="638" width="4" height="4" />
          <rect x="10" y="658" width="4" height="4" />
          <rect x="18" y="693" width="4" height="4" />
          <rect x="10" y="708" width="4" height="4" />
          <rect x="18" y="738" width="4" height="4" />
          <rect x="10" y="758" width="4" height="4" />
          <rect x="18" y="793" width="4" height="4" />
          <rect x="10" y="808" width="4" height="4" />
          <rect x="18" y="838" width="4" height="4" />
          <rect x="10" y="858" width="4" height="4" />
          <rect x="18" y="893" width="4" height="4" />

          {/* x ≈ 55 region */}
          <rect x="53" y="33" width="4" height="4" />
          <rect x="53" y="83" width="4" height="4" />
          <rect x="53" y="128" width="4" height="4" />
          <rect x="53" y="183" width="4" height="4" />
          <rect x="53" y="228" width="4" height="4" />
          <rect x="53" y="283" width="4" height="4" />
          <rect x="53" y="328" width="4" height="4" />
          <rect x="53" y="383" width="4" height="4" />
          <rect x="53" y="428" width="4" height="4" />
          <rect x="53" y="483" width="4" height="4" />
          <rect x="53" y="528" width="4" height="4" />
          <rect x="53" y="583" width="4" height="4" />
          <rect x="53" y="628" width="4" height="4" />
          <rect x="53" y="683" width="4" height="4" />
          <rect x="53" y="728" width="4" height="4" />
          <rect x="53" y="783" width="4" height="4" />
          <rect x="53" y="828" width="4" height="4" />
          <rect x="53" y="883" width="4" height="4" />

          {/* x ≈ 80-100 region */}
          <rect x="78" y="28" width="4" height="4" />
          <rect x="88" y="78" width="4" height="4" />
          <rect x="83" y="128" width="4" height="4" />
          <rect x="88" y="178" width="4" height="4" />
          <rect x="78" y="228" width="4" height="4" />
          <rect x="98" y="278" width="4" height="4" />
          <rect x="83" y="328" width="4" height="4" />
          <rect x="78" y="378" width="4" height="4" />
          <rect x="88" y="428" width="4" height="4" />
          <rect x="93" y="478" width="4" height="4" />
          <rect x="78" y="528" width="4" height="4" />
          <rect x="83" y="578" width="4" height="4" />
          <rect x="88" y="628" width="4" height="4" />
          <rect x="93" y="678" width="4" height="4" />
          <rect x="78" y="728" width="4" height="4" />
          <rect x="83" y="778" width="4" height="4" />
          <rect x="88" y="828" width="4" height="4" />
          <rect x="78" y="878" width="4" height="4" />

          {/* x ≈ 110-118 region */}
          <rect x="108" y="13" width="4" height="4" />
          <rect x="116" y="63" width="4" height="4" />
          <rect x="108" y="118" width="4" height="4" />
          <rect x="116" y="168" width="4" height="4" />
          <rect x="108" y="213" width="4" height="4" />
          <rect x="116" y="263" width="4" height="4" />
          <rect x="108" y="313" width="4" height="4" />
          <rect x="116" y="368" width="4" height="4" />
          <rect x="108" y="413" width="4" height="4" />
          <rect x="116" y="463" width="4" height="4" />
          <rect x="108" y="513" width="4" height="4" />
          <rect x="116" y="568" width="4" height="4" />
          <rect x="108" y="613" width="4" height="4" />
          <rect x="116" y="668" width="4" height="4" />
          <rect x="108" y="713" width="4" height="4" />
          <rect x="116" y="768" width="4" height="4" />
          <rect x="108" y="818" width="4" height="4" />
          <rect x="116" y="868" width="4" height="4" />

          {/* x ≈ 145-165 region */}
          <rect x="143" y="38" width="4" height="4" />
          <rect x="153" y="88" width="4" height="4" />
          <rect x="163" y="133" width="4" height="4" />
          <rect x="148" y="188" width="4" height="4" />
          <rect x="153" y="233" width="4" height="4" />
          <rect x="163" y="288" width="4" height="4" />
          <rect x="148" y="338" width="4" height="4" />
          <rect x="158" y="388" width="4" height="4" />
          <rect x="163" y="438" width="4" height="4" />
          <rect x="148" y="488" width="4" height="4" />
          <rect x="153" y="533" width="4" height="4" />
          <rect x="163" y="588" width="4" height="4" />
          <rect x="148" y="638" width="4" height="4" />
          <rect x="153" y="688" width="4" height="4" />
          <rect x="163" y="733" width="4" height="4" />
          <rect x="148" y="788" width="4" height="4" />
          <rect x="158" y="838" width="4" height="4" />
          <rect x="163" y="883" width="4" height="4" />

          {/* x ≈ 195-220 region */}
          <rect x="193" y="28" width="4" height="4" />
          <rect x="208" y="63" width="4" height="4" />
          <rect x="218" y="88" width="4" height="4" />
          <rect x="193" y="138" width="4" height="4" />
          <rect x="208" y="178" width="4" height="4" />
          <rect x="218" y="208" width="4" height="4" />
          <rect x="193" y="233" width="4" height="4" />
          <rect x="208" y="273" width="4" height="4" />
          <rect x="218" y="323" width="4" height="4" />
          <rect x="193" y="368" width="4" height="4" />
          <rect x="208" y="388" width="4" height="4" />
          <rect x="218" y="418" width="4" height="4" />
          <rect x="193" y="458" width="4" height="4" />
          <rect x="208" y="488" width="4" height="4" />
          <rect x="218" y="533" width="4" height="4" />
          <rect x="193" y="568" width="4" height="4" />
          <rect x="208" y="588" width="4" height="4" />
          <rect x="218" y="638" width="4" height="4" />
          <rect x="193" y="688" width="4" height="4" />
          <rect x="208" y="738" width="4" height="4" />
          <rect x="218" y="773" width="4" height="4" />
          <rect x="193" y="808" width="4" height="4" />
          <rect x="208" y="838" width="4" height="4" />
          <rect x="218" y="873" width="4" height="4" />
        </g>

        {/* ══════════════════════════════════════════
            LAYER 5 — IC chip outlines with pin arrays
            ══════════════════════════════════════════ */}
        <g fill="none" stroke="rgba(0,255,65,0.05)" strokeWidth="0.5">
          {/* Chip 1 — top left */}
          <rect x="60" y="25" width="24" height="14" />
          <line x1="64" y1="25" x2="64" y2="19" />
          <line x1="70" y1="25" x2="70" y2="19" />
          <line x1="76" y1="25" x2="76" y2="19" />
          <line x1="64" y1="39" x2="64" y2="45" />
          <line x1="70" y1="39" x2="70" y2="45" />
          <line x1="76" y1="39" x2="76" y2="45" />

          {/* Chip 2 — top right */}
          <rect x="155" y="55" width="28" height="14" />
          <line x1="160" y1="55" x2="160" y2="49" />
          <line x1="167" y1="55" x2="167" y2="49" />
          <line x1="174" y1="55" x2="174" y2="49" />
          <line x1="160" y1="69" x2="160" y2="75" />
          <line x1="167" y1="69" x2="167" y2="75" />
          <line x1="174" y1="69" x2="174" y2="75" />

          {/* Chip 3 — upper center */}
          <rect x="85" y="108" width="26" height="12" />
          <line x1="90" y1="108" x2="90" y2="102" />
          <line x1="97" y1="108" x2="97" y2="102" />
          <line x1="104" y1="108" x2="104" y2="102" />
          <line x1="90" y1="120" x2="90" y2="126" />
          <line x1="97" y1="120" x2="97" y2="126" />
          <line x1="104" y1="120" x2="104" y2="126" />

          {/* Chip 4 — mid left */}
          <rect x="48" y="255" width="22" height="14" />
          <line x1="52" y1="255" x2="52" y2="249" />
          <line x1="58" y1="255" x2="58" y2="249" />
          <line x1="64" y1="255" x2="64" y2="249" />
          <line x1="52" y1="269" x2="52" y2="275" />
          <line x1="58" y1="269" x2="58" y2="275" />
          <line x1="64" y1="269" x2="64" y2="275" />

          {/* Chip 5 — mid center */}
          <rect x="125" y="310" width="30" height="14" />
          <line x1="130" y1="310" x2="130" y2="304" />
          <line x1="137" y1="310" x2="137" y2="304" />
          <line x1="144" y1="310" x2="144" y2="304" />
          <line x1="150" y1="310" x2="150" y2="304" />
          <line x1="130" y1="324" x2="130" y2="330" />
          <line x1="137" y1="324" x2="137" y2="330" />
          <line x1="144" y1="324" x2="144" y2="330" />
          <line x1="150" y1="324" x2="150" y2="330" />

          {/* Chip 6 — mid right */}
          <rect x="180" y="375" width="24" height="12" />
          <line x1="185" y1="375" x2="185" y2="369" />
          <line x1="191" y1="375" x2="191" y2="369" />
          <line x1="197" y1="375" x2="197" y2="369" />
          <line x1="185" y1="387" x2="185" y2="393" />
          <line x1="191" y1="387" x2="191" y2="393" />
          <line x1="197" y1="387" x2="197" y2="393" />

          {/* Chip 7 — lower left */}
          <rect x="55" y="470" width="26" height="14" />
          <line x1="60" y1="470" x2="60" y2="464" />
          <line x1="67" y1="470" x2="67" y2="464" />
          <line x1="74" y1="470" x2="74" y2="464" />
          <line x1="60" y1="484" x2="60" y2="490" />
          <line x1="67" y1="484" x2="67" y2="490" />
          <line x1="74" y1="484" x2="74" y2="490" />

          {/* Chip 8 — center area */}
          <rect x="100" y="530" width="28" height="14" />
          <line x1="105" y1="530" x2="105" y2="524" />
          <line x1="112" y1="530" x2="112" y2="524" />
          <line x1="119" y1="530" x2="119" y2="524" />
          <line x1="105" y1="544" x2="105" y2="550" />
          <line x1="112" y1="544" x2="112" y2="550" />
          <line x1="119" y1="544" x2="119" y2="550" />

          {/* Chip 9 — lower right */}
          <rect x="170" y="620" width="24" height="12" />
          <line x1="175" y1="620" x2="175" y2="614" />
          <line x1="181" y1="620" x2="181" y2="614" />
          <line x1="187" y1="620" x2="187" y2="614" />
          <line x1="175" y1="632" x2="175" y2="638" />
          <line x1="181" y1="632" x2="181" y2="638" />
          <line x1="187" y1="632" x2="187" y2="638" />

          {/* Chip 10 — bottom left */}
          <rect x="45" y="710" width="22" height="14" />
          <line x1="50" y1="710" x2="50" y2="704" />
          <line x1="56" y1="710" x2="56" y2="704" />
          <line x1="50" y1="724" x2="50" y2="730" />
          <line x1="56" y1="724" x2="56" y2="730" />

          {/* Chip 11 — bottom center */}
          <rect x="110" y="775" width="30" height="14" />
          <line x1="115" y1="775" x2="115" y2="769" />
          <line x1="122" y1="775" x2="122" y2="769" />
          <line x1="129" y1="775" x2="129" y2="769" />
          <line x1="135" y1="775" x2="135" y2="769" />
          <line x1="115" y1="789" x2="115" y2="795" />
          <line x1="122" y1="789" x2="122" y2="795" />
          <line x1="129" y1="789" x2="129" y2="795" />
          <line x1="135" y1="789" x2="135" y2="795" />

          {/* Chip 12 — bottom right */}
          <rect x="175" y="850" width="26" height="12" />
          <line x1="180" y1="850" x2="180" y2="844" />
          <line x1="187" y1="850" x2="187" y2="844" />
          <line x1="194" y1="850" x2="194" y2="844" />
          <line x1="180" y1="862" x2="180" y2="868" />
          <line x1="187" y1="862" x2="187" y2="868" />
          <line x1="194" y1="862" x2="194" y2="868" />
        </g>

        {/* ══════════════════════════════════════════
            LAYER 6 — Static LED dots (no animations)
            ══════════════════════════════════════════ */}
        <g>
          <rect x="19" y="59" width="2" height="2" fill="#00ff41" opacity="0.12" />
          <rect x="89" y="79" width="2" height="2" fill="#00ff41" opacity="0.08" />
          <rect x="54" y="129" width="2" height="2" fill="#00ff41" opacity="0.10" />
          <rect x="164" y="134" width="2" height="2" fill="#00ff41" opacity="0.06" />
          <rect x="109" y="214" width="2" height="2" fill="#00ff41" opacity="0.10" />
          <rect x="209" y="234" width="2" height="2" fill="#00ff41" opacity="0.08" />
          <rect x="54" y="284" width="2" height="2" fill="#00ff41" opacity="0.12" />
          <rect x="149" y="339" width="2" height="2" fill="#00ff41" opacity="0.07" />
          <rect x="19" y="394" width="2" height="2" fill="#00ff41" opacity="0.10" />
          <rect x="164" y="439" width="2" height="2" fill="#00ff41" opacity="0.09" />
          <rect x="89" y="479" width="2" height="2" fill="#00ff41" opacity="0.11" />
          <rect x="219" y="534" width="2" height="2" fill="#00ff41" opacity="0.06" />
          <rect x="54" y="584" width="2" height="2" fill="#00ff41" opacity="0.10" />
          <rect x="109" y="614" width="2" height="2" fill="#00ff41" opacity="0.08" />
          <rect x="194" y="689" width="2" height="2" fill="#00ff41" opacity="0.12" />
          <rect x="19" y="739" width="2" height="2" fill="#00ff41" opacity="0.07" />
          <rect x="164" y="789" width="2" height="2" fill="#00ff41" opacity="0.10" />
          <rect x="89" y="829" width="2" height="2" fill="#00ff41" opacity="0.09" />
          <rect x="219" y="874" width="2" height="2" fill="#00ff41" opacity="0.11" />
          <rect x="54" y="894" width="2" height="2" fill="#00ff41" opacity="0.08" />
        </g>

        {/* ══════════════════════════════════════════
            LAYER 7 — Extra fine traces (secondary routing)
            ══════════════════════════════════════════ */}
        <g stroke="rgba(0,255,65,0.035)" strokeWidth="0.5" fill="none">
          {/* Diagonal routing */}
          <path d="M 20 50 L 40 70 H 55" />
          <path d="M 165 90 L 180 105 V 130" />
          <path d="M 55 150 L 75 170 H 110" />
          <path d="M 118 190 L 140 210 V 240" />
          <path d="M 20 250 L 40 270 H 55" />
          <path d="M 165 290 L 185 310 V 340" />
          <path d="M 55 350 L 75 370 H 110" />
          <path d="M 118 400 L 135 415 H 165" />
          <path d="M 20 450 L 40 470 H 55" />
          <path d="M 165 490 L 185 510 V 530" />
          <path d="M 55 550 L 75 570 H 110" />
          <path d="M 118 600 L 140 620 V 640" />
          <path d="M 20 650 L 40 670 H 55" />
          <path d="M 165 690 L 185 710 V 730" />
          <path d="M 55 750 L 75 770 H 110" />
          <path d="M 118 800 L 135 815 H 165" />
          <path d="M 20 850 L 40 870 H 55" />
          <path d="M 165 880 L 185 895 V 900" />

          {/* Short stubs / test points */}
          <line x1="12" y1="40" x2="12" y2="48" />
          <line x1="220" y1="45" x2="220" y2="53" />
          <line x1="12" y1="140" x2="12" y2="148" />
          <line x1="220" y1="155" x2="220" y2="163" />
          <line x1="12" y1="240" x2="12" y2="248" />
          <line x1="220" y1="255" x2="220" y2="263" />
          <line x1="12" y1="340" x2="12" y2="348" />
          <line x1="220" y1="365" x2="220" y2="373" />
          <line x1="12" y1="440" x2="12" y2="448" />
          <line x1="220" y1="475" x2="220" y2="483" />
          <line x1="12" y1="540" x2="12" y2="548" />
          <line x1="220" y1="575" x2="220" y2="583" />
          <line x1="12" y1="640" x2="12" y2="648" />
          <line x1="220" y1="665" x2="220" y2="673" />
          <line x1="12" y1="740" x2="12" y2="748" />
          <line x1="220" y1="775" x2="220" y2="783" />
          <line x1="12" y1="840" x2="12" y2="848" />
          <line x1="220" y1="875" x2="220" y2="883" />
        </g>

        {/* ══════════════════════════════════════════
            LAYER 8 — Ground plane hatching (very faint)
            ══════════════════════════════════════════ */}
        <g stroke="rgba(0,255,65,0.015)" strokeWidth="0.5" fill="none">
          {/* Sparse cross-hatch areas representing ground fill */}
          {/* Top zone */}
          <path d="M 0 10 L 10 0" />
          <path d="M 0 30 L 30 0" />
          <path d="M 225 10 L 240 0" />
          <path d="M 225 30 L 240 15" />
          {/* Mid zones */}
          <path d="M 0 300 L 10 290" />
          <path d="M 0 320 L 20 300" />
          <path d="M 225 300 L 240 285" />
          <path d="M 225 320 L 240 305" />
          {/* Bottom zones */}
          <path d="M 0 600 L 10 590" />
          <path d="M 0 620 L 20 600" />
          <path d="M 225 600 L 240 585" />
          <path d="M 225 620 L 240 605" />
          <path d="M 0 880 L 15 865" />
          <path d="M 0 900 L 20 880" />
          <path d="M 225 880 L 240 865" />
          <path d="M 225 900 L 240 885" />
        </g>
      </svg>

      {/* ── Subtle scanline overlay (sidebar-specific) ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,65,0.015) 3px, rgba(0,255,65,0.015) 4px)",
        }}
      />
    </div>
  );
}

// ============================================
// BootScreen - Loading/boot screen
// ============================================

interface BootScreenProps {
  onSkip?: () => void;
}

export function BootScreen({ onSkip }: BootScreenProps) {
  const canSkip = Boolean(onSkip);
  const asciiArt = `
███╗   ███╗ █████╗ ████████╗██████╗ ██╗██╗  ██╗
████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗██║╚██╗██╔╝
██╔████╔██║███████║   ██║   ██████╔╝██║ ╚███╔╝ 
██║╚██╔╝██║██╔══██║   ██║   ██╔══██╗██║ ██╔██╗ 
██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║██║██╔╝ ██╗
╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝
`;

  return (
    <div
      className={`bg-matrix-dark text-matrix-primary font-matrix flex flex-col items-center justify-center p-8 text-center text-body ${
        canSkip ? "cursor-pointer" : ""
      }`}
      onClick={canSkip ? onSkip : undefined}
      role={canSkip ? "button" : undefined}
      tabIndex={canSkip ? 0 : undefined}
    >
      <pre className="text-caption leading-[1.2] mb-6 text-matrix-muted select-none">{asciiArt}</pre>
      <div className="animate-pulse tracking-[0.3em] text-caption font-bold mb-4 uppercase">
        INITIALIZING NEURAL INTERFACE...
      </div>
      <div className="w-64 h-1 bg-matrix-panel-strong relative overflow-hidden">
        <div className="absolute inset-0 bg-matrix-primary animate-[loader_2s_linear_infinite]" />
      </div>
      {canSkip && <p className="mt-6 text-caption text-matrix-muted uppercase">Click to skip</p>}
      <style>{`@keyframes loader { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>
    </div>
  );
}

// ============================================
// Motion Preference Utilities
// ============================================

// ============================================
// FloatingPortal - Portal-based floating panel
// Prevents clipping by overflow:hidden parents.
// Uses same pattern as MatrixSelect.
// ============================================

interface FloatingPortalProps {
  triggerRef: React.RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  /** Offset in pixels below the trigger element */
  offsetY?: number;
  /** Alignment relative to trigger */
  align?: "left" | "right";
  /** Minimum width in pixels (defaults to trigger width) */
  minWidth?: number;
}

export function FloatingPortal({
  triggerRef,
  open,
  onClose,
  children,
  className = "",
  offsetY = 1,
  align = "left",
  minWidth,
}: FloatingPortalProps) {
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const updatePos = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + offsetY,
      left: align === "right" ? rect.right : rect.left,
      width: rect.width,
    });
  }, [triggerRef, offsetY, align]);

  useEffect(() => {
    if (!open) return;
    updatePos();
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);
    return () => {
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [open, updatePos]);

  if (!open) return null;

  const style: React.CSSProperties = {
    top: pos.top,
    left: align === "right" ? undefined : pos.left,
    right: align === "right" ? window.innerWidth - pos.left : undefined,
    minWidth: minWidth ?? pos.width,
  };

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998]" onClick={onClose} />
      <div
        className={`fixed z-[9999] ${className}`}
        style={style}
      >
        {children}
      </div>
    </>,
    document.body,
  );
}


