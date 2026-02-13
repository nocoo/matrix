import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HelpPage from "@/pages/HelpPage";

vi.mock("@/viewmodels/useHelpViewModel", () => ({
  useHelpViewModel: (query = "") => ({
    resources: [
      { icon: "book", title: "Documentation", desc: "Read the docs" },
      { icon: "chat", title: "Support", desc: "Contact support" },
    ],
    filteredFAQs: query
      ? [{ q: "How to link bank account?", a: "Go to settings and link your bank account." }]
      : [
          { q: "How to link bank account?", a: "Go to settings and link your bank account." },
          { q: "How to export data?", a: "Use the export button in settings." },
        ],
    allFAQs: [
      { q: "How to link bank account?", a: "Go to settings and link your bank account." },
      { q: "How to export data?", a: "Use the export button in settings." },
    ],
    totalFAQs: 2,
  }),
}));

describe("HelpPage", () => {
  it("renders search section", () => {
    render(<HelpPage />);
    expect(screen.getByText("SEARCH")).toBeInTheDocument();
  });

  it("renders resources section", () => {
    render(<HelpPage />);
    expect(screen.getByText("RESOURCES")).toBeInTheDocument();
  });

  it("renders FAQ section", () => {
    render(<HelpPage />);
    expect(screen.getByText("FREQUENTLY ASKED QUESTIONS")).toBeInTheDocument();
  });

  it("renders resource titles", () => {
    render(<HelpPage />);
    expect(screen.getByText("Documentation")).toBeInTheDocument();
    expect(screen.getByText("Support")).toBeInTheDocument();
  });
});
