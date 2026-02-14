import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "@/pages/LoginPage";

// Mock all animated/canvas components to static renders
vi.mock("@/components/ui/MatrixExtras", () => ({
  MatrixRain: () => <div data-testid="matrix-rain" />,
  DecodingText: ({ text, className }: { text: string; className?: string }) => (
    <span className={className}>{text}</span>
  ),
  ScrambleText: ({ text, className }: { text: string; className?: string }) => (
    <span className={className}>{text}</span>
  ),
  TypewriterText: ({ text, className }: { text: string; className?: string }) => (
    <span className={className}>{text}</span>
  ),
  ConnectionStatus: ({ status }: { status: string }) => (
    <span data-testid="connection-status">[{status}]</span>
  ),
  Sparkline: () => <svg data-testid="sparkline" />,
  LiveSniffer: () => <div data-testid="live-sniffer">LIVE SNIFFER</div>,
  MatrixInput: ({
    label,
    className = "",
    ...props
  }: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <label className={className}>
      <span>{label}</span>
      <input {...props} />
    </label>
  ),
}));

describe("LoginPage", () => {
  it("renders MatrixRain background", () => {
    render(<LoginPage />);
    expect(screen.getByTestId("matrix-rain")).toBeInTheDocument();
  });

  it("renders the system access title", () => {
    render(<LoginPage />);
    expect(screen.getByText("SYSTEM ACCESS")).toBeInTheDocument();
  });

  it("renders scramble text gateway title", () => {
    render(<LoginPage />);
    expect(screen.getByText("MATRIX AUTHENTICATION GATEWAY")).toBeInTheDocument();
  });

  it("renders neural protocol subtitle", () => {
    render(<LoginPage />);
    expect(screen.getByText("[ NEURAL IDENTITY VERIFICATION PROTOCOL ]")).toBeInTheDocument();
  });

  it("renders credential prompt", () => {
    render(<LoginPage />);
    expect(screen.getByText("ENTER CREDENTIALS TO PROCEED")).toBeInTheDocument();
  });

  it("renders email and password inputs", () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText("operator@matrix.sys")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••••••")).toBeInTheDocument();
  });

  it("renders authenticate button", () => {
    render(<LoginPage />);
    expect(screen.getByText("[ AUTHENTICATE ]")).toBeInTheDocument();
  });

  it("renders forgot access link", () => {
    render(<LoginPage />);
    expect(screen.getByText("> forgot access? contact sysadmin")).toBeInTheDocument();
  });

  it("updates email input on change", () => {
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText("operator@matrix.sys") as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "neo@matrix.sys" } });
    expect(emailInput.value).toBe("neo@matrix.sys");
  });

  it("updates password input on change", () => {
    render(<LoginPage />);
    const passwordInput = screen.getByPlaceholderText("••••••••••••") as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: "followthewhiterabbit" } });
    expect(passwordInput.value).toBe("followthewhiterabbit");
  });

  it("renders connection status indicator", () => {
    render(<LoginPage />);
    expect(screen.getByTestId("connection-status")).toBeInTheDocument();
  });

  it("renders sparkline visualization", () => {
    render(<LoginPage />);
    expect(screen.getByTestId("sparkline")).toBeInTheDocument();
  });

  it("renders live sniffer", () => {
    render(<LoginPage />);
    expect(screen.getByTestId("live-sniffer")).toBeInTheDocument();
  });

  it("renders system info footer", () => {
    render(<LoginPage />);
    expect(screen.getByText("PROTOCOL: TLS-Q/256")).toBeInTheDocument();
    expect(screen.getByText("MATRIX SYSTEMS INC. ©2026")).toBeInTheDocument();
  });

  it("renders session ID", () => {
    render(<LoginPage />);
    const sessionText = screen.getByText(/SESSION: 0x/);
    expect(sessionText).toBeInTheDocument();
  });
});
