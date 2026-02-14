import { useState } from "react";
import { AsciiBox } from "@/components/ui/AsciiBox";
import { MatrixButton } from "@/components/ui/MatrixButton";
import { useInteractionShowcaseViewModel } from "@/viewmodels/useInteractionShowcaseViewModel";
import { cn } from "@/lib/utils";

export default function InteractionShowcasePage() {
  const {
    toasts,
    dialogs,
    variantLabels,
    activeDialog,
    openDialog,
    closeDialog,
    getDialogById,
  } = useInteractionShowcaseViewModel();

  const [activeToast, setActiveToast] = useState<string | null>(null);

  const currentDialog = activeDialog ? getDialogById(activeDialog) : undefined;

  return (
    <div className="space-y-4">
      {/* Toast variants */}
      <AsciiBox title="TOAST VARIANTS">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {toasts.map((toast) => (
            <button
              key={toast.id}
              onClick={() => setActiveToast(activeToast === toast.id ? null : toast.id)}
              className={cn(
                "text-left border p-3 transition-colors font-mono",
                activeToast === toast.id
                  ? "border-matrix-primary/40 bg-matrix-primary/10"
                  : "border-matrix-primary/15 hover:border-matrix-primary/30"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={cn(
                    "text-[10px] uppercase px-1.5 py-0.5",
                    toast.variant === "success" && "bg-matrix-primary/20 text-matrix-primary",
                    toast.variant === "error" && "bg-red-500/20 text-red-400",
                    toast.variant === "warning" && "bg-yellow-500/20 text-yellow-400",
                    toast.variant === "info" && "bg-blue-500/20 text-blue-400",
                    toast.variant === "default" && "bg-matrix-primary/10 text-matrix-muted"
                  )}
                >
                  {toast.variantLabel}
                </span>
              </div>
              <p className="text-sm text-matrix-primary">{toast.title}</p>
              <p className="text-xs text-matrix-dim mt-0.5">{toast.description}</p>
            </button>
          ))}
        </div>
      </AsciiBox>

      {/* Variant labels */}
      <AsciiBox title="ALL VARIANTS">
        <div className="flex flex-wrap gap-2">
          {variantLabels.map(({ variant, label }) => (
            <span
              key={variant}
              className="font-mono text-xs border border-matrix-primary/20 px-2 py-1 text-matrix-muted"
            >
              {label}
            </span>
          ))}
        </div>
      </AsciiBox>

      {/* Dialog triggers */}
      <AsciiBox title="DIALOG SHOWCASE">
        <div className="flex flex-wrap gap-3">
          {dialogs.map((d) => (
            <MatrixButton key={d.id} onClick={() => openDialog(d.id)}>
              [{d.style.toUpperCase()}]
            </MatrixButton>
          ))}
        </div>
      </AsciiBox>

      {/* Dialog overlay */}
      {currentDialog && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={closeDialog}
          />
          <div className="fixed inset-x-4 top-[25%] z-50 mx-auto max-w-md">
            <AsciiBox title={currentDialog.title.toUpperCase()}>
              <div className="space-y-3">
                <p className="font-mono text-xs text-matrix-muted">
                  {currentDialog.description}
                </p>
                {currentDialog.style === "form" && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="type your feedback..."
                      className="w-full bg-transparent border border-matrix-primary/20 px-3 py-2 font-mono text-sm text-matrix-primary placeholder:text-matrix-dim outline-none focus:border-matrix-primary/40"
                    />
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <MatrixButton variant="ghost" onClick={closeDialog}>
                    [CANCEL]
                  </MatrixButton>
                  <MatrixButton onClick={closeDialog}>
                    {currentDialog.style === "confirm" ? "[CONFIRM]" : "[OK]"}
                  </MatrixButton>
                </div>
              </div>
            </AsciiBox>
          </div>
        </>
      )}
    </div>
  );
}
