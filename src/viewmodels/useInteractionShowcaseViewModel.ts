// ViewModel for the Interaction Showcase page.
// Composes model logic with data source — View consumes this hook only.

import { useMemo, useCallback, useState } from "react";
import { showcaseToasts, showcaseDialogs } from "@/data/mock";
import { toastVariantLabel, ALL_TOAST_VARIANTS } from "@/models/interaction-showcase";
import type { ShowcaseToast, ShowcaseDialog, ToastVariant } from "@/models/types";

export interface ToastDemo extends ShowcaseToast {
  variantLabel: string;
}

export type DialogDemo = ShowcaseDialog;

export function useInteractionShowcaseViewModel() {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const toasts: ToastDemo[] = useMemo(
    () =>
      showcaseToasts.map((t) => ({
        ...t,
        variantLabel: toastVariantLabel(t.variant),
      })),
    [],
  );

  const dialogs: DialogDemo[] = useMemo(() => showcaseDialogs, []);

  const toastVariants = useMemo(() => ALL_TOAST_VARIANTS, []);

  const variantLabels = useMemo(
    () => ALL_TOAST_VARIANTS.map((v) => ({ variant: v, label: toastVariantLabel(v) })),
    [],
  );

  const openDialog = useCallback((id: string) => setActiveDialog(id), []);
  const closeDialog = useCallback(() => setActiveDialog(null), []);

  const getDialogById = useCallback(
    (id: string): DialogDemo | undefined => dialogs.find((d) => d.id === id),
    [dialogs],
  );

  return {
    toasts,
    dialogs,
    toastVariants,
    variantLabels,
    activeDialog,
    openDialog,
    closeDialog,
    getDialogById,
  };
}
