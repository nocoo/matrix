// Pure business logic for the Interaction Showcase page.
// No React dependency — fully testable with plain unit tests.

import type { ToastVariant } from "@/models/types";

export function toastVariantLabel(variant: ToastVariant): string {
  const labels: Record<ToastVariant, string> = {
    default: "Default",
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Info",
  };
  return labels[variant];
}

export const ALL_TOAST_VARIANTS: ToastVariant[] = [
  "default",
  "success",
  "error",
  "warning",
  "info",
];
