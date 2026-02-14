import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import RecordListPage from "@/pages/RecordListPage";

vi.mock("@/components/ui", () => ({
  ConnectionStatus: ({ status }: { status: string }) => (
    <span data-testid="connection-status">[{status}]</span>
  ),
}));

vi.mock("@/viewmodels/useRecordListViewModel", () => ({
  useRecordListViewModel: () => ({
    records: [
      { id: 1, name: "Coffee Shop", category: "Food", date: "Jan 15", amount: -4.5, direction: "negative" as const, formattedAmount: "$4.50", status: "Completed", statusVariant: "success" as const },
      { id: 2, name: "Salary", category: "Income", date: "Jan 14", amount: 3200, direction: "positive" as const, formattedAmount: "+$3,200", status: "Pending", statusVariant: "warning" as const },
    ],
    totalCount: 2,
  }),
}));

describe("RecordListPage", () => {
  it("renders transaction log section", () => {
    render(<RecordListPage />);
    expect(screen.getByText("TRANSACTION LOG")).toBeInTheDocument();
  });

  it("renders record count", () => {
    render(<RecordListPage />);
    expect(screen.getByText(/2 records found/)).toBeInTheDocument();
  });

  it("renders column headers", () => {
    render(<RecordListPage />);
    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText("category")).toBeInTheDocument();
    expect(screen.getByText("status")).toBeInTheDocument();
  });

  it("renders record data", () => {
    render(<RecordListPage />);
    expect(screen.getByText("Coffee Shop")).toBeInTheDocument();
    expect(screen.getByText("Salary")).toBeInTheDocument();
  });
});
