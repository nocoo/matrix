import { useState, useEffect, useMemo, useRef, type ReactNode } from "react";

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
        className="h-10 bg-matrix-panel border border-matrix-ghost px-3 text-body text-matrix-bright outline-none focus:border-matrix-primary focus:ring-2 focus:ring-matrix-primary/20"
        {...props}
      />
    </label>
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
  values: number[];
  width?: number;
  height?: number;
}

export function Sparkline({ values, width = 200, height = 40 }: SparklineProps) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const padX = 4;
  const padY = 4;

  const pts = values.map((v, i) => {
    const x = padX + (i * (width - padX * 2)) / (values.length - 1);
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
        stroke="#00FF41"
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


