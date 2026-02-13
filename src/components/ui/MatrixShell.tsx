import type { ReactNode } from "react";
import { MatrixRain, MatrixAvatar } from "./MatrixExtras";

interface MatrixShellProps {
  title?: string;
  headerRight?: ReactNode;
  headerStatus?: ReactNode;
  children: ReactNode;
  footerLeft?: ReactNode;
  footerRight?: ReactNode;
  contentClassName?: string;
  rootClassName?: string;
  hideHeader?: boolean;
  showRain?: boolean;
  showAvatar?: boolean;
  avatarName?: string;
}

export function MatrixShell({
  title = "Matrix",
  headerRight,
  headerStatus,
  children,
  footerLeft,
  footerRight,
  contentClassName = "",
  rootClassName = "",
  hideHeader = false,
  showRain = false,
  showAvatar = false,
  avatarName = "matrix",
}: MatrixShellProps) {
  return (
    <div
      className={`min-h-screen bg-matrix-dark text-matrix-primary font-matrix p-4 md:p-8 flex flex-col leading-tight text-body selection:bg-matrix-primary selection:text-black overflow-hidden ${rootClassName}`}
    >
      {showRain && (
        <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
          <MatrixRain />
        </div>
      )}

      <div className="matrix-scanline-overlay pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />

      <div
        className={`relative z-10 flex flex-col min-h-screen matrix-shell-content ${contentClassName}`}
      >
        {!hideHeader && (
          <header className="flex justify-between border-b border-[#00FF41]/20 pb-3 mb-6 items-center shrink-0">
            <div className="flex items-center space-x-6">
              <div className="flex items-center gap-3 uppercase select-none">
                {showAvatar && <MatrixAvatar name={avatarName} size={32} />}
                <span
                  className="text-[#00ff00] font-black text-2xl md:text-3xl glow-text"
                  style={{ letterSpacing: "-1px" }}
                >
                  {title}
                </span>
                <span
                  className="text-[#00ff00] font-extralight text-sm md:text-base"
                  style={{ letterSpacing: "2px" }}
                >
                  Dashboard
                </span>
              </div>
              <div className="flex items-center space-x-4 text-caption text-matrix-muted uppercase font-bold">
                {headerStatus || (
                  <span className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-matrix-primary rounded-full mr-2 animate-pulse" />
                    System Online
                  </span>
                )}
              </div>
            </div>

            {headerRight}
          </header>
        )}

        <main className="flex-1">{children}</main>

        <footer className="mt-6 pt-3 border-t border-matrix-ghost flex justify-between text-caption uppercase font-bold tracking-[0.3em] text-matrix-dim shrink-0">
          <div className="flex space-x-10 items-center">
            {footerLeft || <span>Matrix Dashboard v1.0</span>}
          </div>
          <div className="flex items-center space-x-3">
            {footerRight || <span className="font-bold">matrix + opencode</span>}
          </div>
        </footer>
      </div>
    </div>
  );
}
