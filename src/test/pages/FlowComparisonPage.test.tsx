import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import FlowComparisonPage from "@/pages/FlowComparisonPage";

vi.mock("@/viewmodels/useFlowComparisonViewModel", () => ({
  useFlowComparisonViewModel: () => ({
    summary: { totalInflow: 15000, totalOutflow: 11000, netFlow: 4000 },
    flowData: [{ month: "Jan", inflow: 5000, outflow: 3500 }],
    netFlowData: [{ month: "Jan", inflow: 5000, outflow: 3500, net: 1500 }],
  }),
}));

describe("FlowComparisonPage", () => {
  it("renders flow summary sections", () => {
    render(<FlowComparisonPage />);
    expect(screen.getByText("TOTAL INFLOW")).toBeInTheDocument();
    expect(screen.getByText("TOTAL OUTFLOW")).toBeInTheDocument();
    expect(screen.getByText("NET FLOW")).toBeInTheDocument();
  });

  it("renders chart sections", () => {
    render(<FlowComparisonPage />);
    expect(screen.getByText("MONTHLY CASH FLOW")).toBeInTheDocument();
    expect(screen.getByText("NET FLOW BREAKDOWN")).toBeInTheDocument();
  });

  it("renders table headers", () => {
    render(<FlowComparisonPage />);
    expect(screen.getByText("month")).toBeInTheDocument();
  });
});
