import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import HelpPage from "@/pages/HelpPage";

const mockState = vi.hoisted(() => ({
  resources: [
    { icon: "book", title: "Documentation", desc: "Read the docs" },
    { icon: "chat", title: "Support", desc: "Contact support" },
  ],
  filteredFAQs: [
    { q: "How to link bank account?", a: "Go to settings and link your bank account." },
    { q: "How to export data?", a: "Use the export button in settings." },
  ] as Array<{ q: string; a: string }>,
  totalFAQs: 2,
}));

vi.mock("@/viewmodels/useHelpViewModel", () => ({
  useHelpViewModel: () => mockState,
}));

describe("HelpPage", () => {
  beforeEach(() => {
    mockState.resources = [
      { icon: "book", title: "Documentation", desc: "Read the docs" },
      { icon: "chat", title: "Support", desc: "Contact support" },
    ];
    mockState.filteredFAQs = [
      { q: "How to link bank account?", a: "Go to settings and link your bank account." },
      { q: "How to export data?", a: "Use the export button in settings." },
    ];
    mockState.totalFAQs = 2;
  });

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

  it("renders FAQ questions and answers", () => {
    render(<HelpPage />);
    expect(screen.getByText(/How to link bank account/)).toBeInTheDocument();
    expect(screen.getByText(/How to export data/)).toBeInTheDocument();
  });

  it("renders search input with placeholder", () => {
    render(<HelpPage />);
    expect(screen.getByPlaceholderText("search help topics...")).toBeInTheDocument();
  });
});

describe("HelpPage with no matching FAQs", () => {
  beforeEach(() => {
    mockState.resources = [{ icon: "book", title: "Documentation", desc: "Read the docs" }];
    mockState.filteredFAQs = [];
    mockState.totalFAQs = 0;
  });

  it("shows no matching results message when filteredFAQs is empty", () => {
    render(<HelpPage />);
    expect(screen.getByText("no matching results")).toBeInTheDocument();
  });
});
