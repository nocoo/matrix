import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useInteractionShowcaseViewModel } from "@/viewmodels/useInteractionShowcaseViewModel";

describe("useInteractionShowcaseViewModel", () => {
  it("returns toast demos with variantLabel", () => {
    const { result } = renderHook(() => useInteractionShowcaseViewModel());
    expect(result.current.toasts.length).toBeGreaterThan(0);
    result.current.toasts.forEach((t) => {
      expect(t).toHaveProperty("id");
      expect(t).toHaveProperty("title");
      expect(t).toHaveProperty("description");
      expect(t).toHaveProperty("variant");
      expect(t).toHaveProperty("variantLabel");
      expect(typeof t.variantLabel).toBe("string");
    });
  });

  it("returns dialog demos with required fields", () => {
    const { result } = renderHook(() => useInteractionShowcaseViewModel());
    expect(result.current.dialogs.length).toBeGreaterThan(0);
    result.current.dialogs.forEach((d) => {
      expect(d).toHaveProperty("id");
      expect(d).toHaveProperty("title");
      expect(d).toHaveProperty("description");
      expect(d).toHaveProperty("style");
    });
  });

  it("manages dialog open/close state", () => {
    const { result } = renderHook(() => useInteractionShowcaseViewModel());
    expect(result.current.activeDialog).toBeNull();

    act(() => result.current.openDialog("d1"));
    expect(result.current.activeDialog).toBe("d1");

    act(() => result.current.closeDialog());
    expect(result.current.activeDialog).toBeNull();
  });

  it("getDialogById returns correct dialog", () => {
    const { result } = renderHook(() => useInteractionShowcaseViewModel());
    const firstDialog = result.current.dialogs[0];
    const found = result.current.getDialogById(firstDialog.id);
    expect(found).toEqual(firstDialog);
  });

  it("getDialogById returns undefined for unknown id", () => {
    const { result } = renderHook(() => useInteractionShowcaseViewModel());
    expect(result.current.getDialogById("nonexistent")).toBeUndefined();
  });

  it("returns variant labels for all variants", () => {
    const { result } = renderHook(() => useInteractionShowcaseViewModel());
    expect(result.current.variantLabels).toHaveLength(5);
    result.current.variantLabels.forEach((vl) => {
      expect(vl).toHaveProperty("variant");
      expect(vl).toHaveProperty("label");
    });
  });
});
