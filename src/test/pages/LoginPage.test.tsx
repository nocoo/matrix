import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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

  it("updates email input on change", () => {
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText("operator@matrix.sys") as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput.value).toBe("test@example.com");
  });

  it("updates password input on change", () => {
    render(<LoginPage />);
    const passwordInput = screen.getByPlaceholderText("••••••••") as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: "secret123" } });
    expect(passwordInput.value).toBe("secret123");
  });

  it("renders MatrixRain background", () => {
    render(<LoginPage />);
    expect(screen.getByTestId("matrix-rain")).toBeInTheDocument();
  });
});
