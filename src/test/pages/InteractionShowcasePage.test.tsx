import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import InteractionShowcasePage from "@/pages/InteractionShowcasePage";

vi.mock("@/viewmodels/useInteractionShowcaseViewModel", () => ({
  useInteractionShowcaseViewModel: () => ({
    toasts: [
      { id: "t1", title: "Success", description: "Operation completed", variant: "default", variantLabel: "Default" },
    ],
    dialogs: [
      { id: "d1", title: "Confirm", description: "Are you sure?", style: "confirm" },
    ],
    variantLabels: [
      { variant: "default", label: "Default" },
      { variant: "success", label: "Success" },
      { variant: "destructive", label: "Destructive" },
      { variant: "warning", label: "Warning" },
      { variant: "info", label: "Info" },
    ],
    activeDialog: null,
    openDialog: vi.fn(),
    closeDialog: vi.fn(),
    getDialogById: vi.fn(),
  }),
}));

describe("InteractionShowcasePage", () => {
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
});
