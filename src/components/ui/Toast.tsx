// ============================================
// Toast - Fixed-position notification
// ============================================

import { useEffect } from "react";

export type ToastTone = "success" | "error";

interface ToastProps {
  tone: ToastTone;
  message: string;
  detail?: string | null;
  onClose: () => void;
  durationMs?: number;
  className?: string;
}

export function Toast({ tone, message, detail, onClose, durationMs, className }: ToastProps) {
  useEffect(() => {
    if (!durationMs) return;

    const timer = setTimeout(() => {
      onClose();
    }, durationMs);

    return () => {
      clearTimeout(timer);
    };
  }, [durationMs, onClose]);

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 matrix-panel p-4 max-w-sm cursor-pointer ${className ?? ""}`}
      onClick={onClose}
    >
      <div className="flex items-center gap-3">
        <span
          className={`w-3 h-3 rounded-full ${tone === "success" ? "bg-success" : "bg-error"}`}
        ></span>
        <div>
          <p className={`font-bold ${tone === "success" ? "text-matrix-primary" : "text-error"}`}>{message}</p>
          {detail ? <p className="text-caption text-matrix-dim">{detail}</p> : null}
        </div>
      </div>
    </div>
  );
}
