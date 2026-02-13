import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SettingsPage from "@/pages/SettingsPage";

describe("SettingsPage", () => {
  it("renders general settings section", () => {
    render(<SettingsPage />);
    expect(screen.getByText("GENERAL")).toBeInTheDocument();
  });

  it("renders theme, language, and currency settings", () => {
    render(<SettingsPage />);
    expect(screen.getByText("Theme")).toBeInTheDocument();
    expect(screen.getByText("DARK")).toBeInTheDocument();
    expect(screen.getByText("Language")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Currency")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
  });

  it("renders notifications section", () => {
    render(<SettingsPage />);
    expect(screen.getByText("NOTIFICATIONS")).toBeInTheDocument();
    expect(screen.getByText("Email notifications")).toBeInTheDocument();
    expect(screen.getByText("Push notifications")).toBeInTheDocument();
    expect(screen.getByText("Weekly digest")).toBeInTheDocument();
  });

  it("renders danger zone section", () => {
    render(<SettingsPage />);
    expect(screen.getByText("DANGER ZONE")).toBeInTheDocument();
    expect(screen.getByText("Delete Account")).toBeInTheDocument();
    expect(screen.getByText("[DELETE]")).toBeInTheDocument();
  });
});
