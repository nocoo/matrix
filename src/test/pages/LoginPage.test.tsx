import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LoginPage from "@/pages/LoginPage";

// Mock MatrixRain since it uses canvas
vi.mock("@/components/ui/MatrixExtras", () => ({
  MatrixRain: () => <div data-testid="matrix-rain" />,
}));

describe("LoginPage", () => {
  it("renders the system login title", () => {
    render(<LoginPage />);
    expect(screen.getByText("SYSTEM LOGIN")).toBeInTheDocument();
  });

  it("renders matrix header", () => {
    render(<LoginPage />);
    expect(screen.getByText("[MATRIX]")).toBeInTheDocument();
    expect(screen.getByText("authentication required")).toBeInTheDocument();
  });

  it("renders email and password inputs", () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText("operator@matrix.sys")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });

  it("renders authenticate button", () => {
    render(<LoginPage />);
    expect(screen.getByText("[AUTHENTICATE]")).toBeInTheDocument();
  });

  it("renders forgot access text", () => {
    render(<LoginPage />);
    expect(screen.getByText("> forgot access? contact sysadmin")).toBeInTheDocument();
  });
});
