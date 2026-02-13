import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import InteractionShowcasePage from "@/pages/InteractionShowcasePage";

const mockState = vi.hoisted(() => ({
  activeDialog: null as string | null,
  openDialog: vi.fn(),
  closeDialog: vi.fn(),
}));

const mockDialogs = [
  { id: "d1", title: "Confirm Action", description: "Are you sure?", style: "confirm" },
  { id: "d2", title: "Feedback Form", description: "Give us feedback", style: "form" },
  { id: "d3", title: "Alert", description: "Something happened", style: "alert" },
];

vi.mock("@/viewmodels/useInteractionShowcaseViewModel", () => ({
  useInteractionShowcaseViewModel: () => ({
    toasts: [
      { id: "t1", title: "Success Toast", description: "Well done", variant: "success", variantLabel: "Success" },
      { id: "t2", title: "Error Toast", description: "Something failed", variant: "error", variantLabel: "Error" },
      { id: "t3", title: "Warning Toast", description: "Watch out", variant: "warning", variantLabel: "Warning" },
      { id: "t4", title: "Info Toast", description: "FYI", variant: "info", variantLabel: "Info" },
      { id: "t5", title: "Default Toast", description: "Neutral", variant: "default", variantLabel: "Default" },
    ],
    dialogs: mockDialogs,
    variantLabels: [
      { variant: "default", label: "Default" },
      { variant: "success", label: "Success" },
      { variant: "error", label: "Error" },
      { variant: "warning", label: "Warning" },
      { variant: "info", label: "Info" },
    ],
    activeDialog: mockState.activeDialog,
    openDialog: mockState.openDialog,
    closeDialog: mockState.closeDialog,
    getDialogById: (id: string) => mockDialogs.find((d) => d.id === id),
  }),
}));

describe("InteractionShowcasePage", () => {
  beforeEach(() => {
    mockState.activeDialog = null;
    mockState.openDialog.mockClear();
    mockState.closeDialog.mockClear();
  });

  it("renders toast variants section", () => {
    render(<InteractionShowcasePage />);
    expect(screen.getByText("TOAST VARIANTS")).toBeInTheDocument();
  });

  it("renders all variants section", () => {
    render(<InteractionShowcasePage />);
    expect(screen.getByText("ALL VARIANTS")).toBeInTheDocument();
  });

  it("renders dialog showcase section", () => {
    render(<InteractionShowcasePage />);
    expect(screen.getByText("DIALOG SHOWCASE")).toBeInTheDocument();
  });

  it("renders all five toast variant types", () => {
    render(<InteractionShowcasePage />);
    expect(screen.getByText("Success Toast")).toBeInTheDocument();
    expect(screen.getByText("Error Toast")).toBeInTheDocument();
    expect(screen.getByText("Warning Toast")).toBeInTheDocument();
    expect(screen.getByText("Info Toast")).toBeInTheDocument();
    expect(screen.getByText("Default Toast")).toBeInTheDocument();
  });

  it("toggles active toast when clicked", () => {
    render(<InteractionShowcasePage />);
    const successToast = screen.getByText("Success Toast").closest("button")!;
    expect(successToast.className).toContain("border-matrix-primary/15");
    fireEvent.click(successToast);
    expect(successToast.className).toContain("border-matrix-primary/40");
    fireEvent.click(successToast);
    expect(successToast.className).toContain("border-matrix-primary/15");
  });

  it("clicking a different toast deactivates the previous one", () => {
    render(<InteractionShowcasePage />);
    const successToast = screen.getByText("Success Toast").closest("button")!;
    const errorToast = screen.getByText("Error Toast").closest("button")!;
    fireEvent.click(successToast);
    expect(successToast.className).toContain("border-matrix-primary/40");
    fireEvent.click(errorToast);
    expect(errorToast.className).toContain("border-matrix-primary/40");
    expect(successToast.className).toContain("border-matrix-primary/15");
  });

  it("renders variant labels in the ALL VARIANTS section", () => {
    render(<InteractionShowcasePage />);
    expect(screen.getAllByText("Default").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Success").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Error").length).toBeGreaterThanOrEqual(1);
  });

  it("renders dialog trigger buttons with style names", () => {
    render(<InteractionShowcasePage />);
    expect(screen.getByText("[CONFIRM]")).toBeInTheDocument();
    expect(screen.getByText("[FORM]")).toBeInTheDocument();
    expect(screen.getByText("[ALERT]")).toBeInTheDocument();
  });

  it("calls openDialog when a dialog trigger is clicked", () => {
    render(<InteractionShowcasePage />);
    fireEvent.click(screen.getByText("[CONFIRM]"));
    expect(mockState.openDialog).toHaveBeenCalledWith("d1");
  });

  it("renders confirm dialog overlay when activeDialog is set", () => {
    mockState.activeDialog = "d1";
    render(<InteractionShowcasePage />);
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    // Confirm dialog shows [CONFIRM] button in overlay
    expect(screen.getByText("[CANCEL]")).toBeInTheDocument();
  });

  it("renders form dialog with input field when style is 'form'", () => {
    mockState.activeDialog = "d2";
    render(<InteractionShowcasePage />);
    expect(screen.getByText("Give us feedback")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("type your feedback...")).toBeInTheDocument();
    expect(screen.getByText("[OK]")).toBeInTheDocument();
  });

  it("renders alert dialog with [OK] button when style is 'alert'", () => {
    mockState.activeDialog = "d3";
    render(<InteractionShowcasePage />);
    expect(screen.getByText("Something happened")).toBeInTheDocument();
    expect(screen.getByText("[OK]")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("type your feedback...")).not.toBeInTheDocument();
  });

  it("calls closeDialog when cancel button is clicked", () => {
    mockState.activeDialog = "d1";
    render(<InteractionShowcasePage />);
    fireEvent.click(screen.getByText("[CANCEL]"));
    expect(mockState.closeDialog).toHaveBeenCalled();
  });

  it("calls closeDialog when backdrop is clicked", () => {
    mockState.activeDialog = "d1";
    render(<InteractionShowcasePage />);
    const backdrop = document.querySelector(".fixed.inset-0.z-50") as HTMLElement;
    fireEvent.click(backdrop);
    expect(mockState.closeDialog).toHaveBeenCalled();
  });
});
