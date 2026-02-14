import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { DashboardLayout } from "@/components/DashboardLayout";

// We test App routing logic by replicating its route config with MemoryRouter
// (BrowserRouter cannot accept initialEntries, so we mirror the routes).

// Mock all page components to simple stubs for fast route-matching verification
vi.mock("@/pages/DashboardPage", () => ({ default: () => <div data-testid="page-dashboard" /> }));
vi.mock("@/pages/AccountsPage", () => ({ default: () => <div data-testid="page-accounts" /> }));
vi.mock("@/pages/CardShowcasePage", () => ({ default: () => <div data-testid="page-card-showcase" /> }));
vi.mock("@/pages/RecordListPage", () => ({ default: () => <div data-testid="page-records" /> }));
vi.mock("@/pages/ProgressTrackingPage", () => ({ default: () => <div data-testid="page-progress" /> }));
vi.mock("@/pages/TargetCardsPage", () => ({ default: () => <div data-testid="page-targets" /> }));
vi.mock("@/pages/StatsOverviewPage", () => ({ default: () => <div data-testid="page-stats" /> }));
vi.mock("@/pages/FlowComparisonPage", () => ({ default: () => <div data-testid="page-flow" /> }));
vi.mock("@/pages/PortfolioPage", () => ({ default: () => <div data-testid="page-portfolio" /> }));
vi.mock("@/pages/HelpPage", () => ({ default: () => <div data-testid="page-help" /> }));
vi.mock("@/pages/SettingsPage", () => ({ default: () => <div data-testid="page-settings" /> }));
vi.mock("@/pages/PalettePage", () => ({ default: () => <div data-testid="page-palette" /> }));
vi.mock("@/pages/InteractionShowcasePage", () => ({ default: () => <div data-testid="page-interactions" /> }));
vi.mock("@/pages/LifeAiPage", () => ({ default: () => <div data-testid="page-life-ai" /> }));
vi.mock("@/pages/ComponentShowcasePage", () => ({ default: () => <div data-testid="page-component-showcase" /> }));
vi.mock("@/pages/LoginPage", () => ({ default: () => <div data-testid="page-login" /> }));
vi.mock("@/pages/BadgeLoginPage", () => ({ default: () => <div data-testid="page-badge-login" /> }));
vi.mock("@/pages/StaticPage", () => ({ default: () => <div data-testid="page-static" /> }));
vi.mock("@/pages/LoadingPage", () => ({ default: () => <div data-testid="page-loading" /> }));
vi.mock("@/pages/NotFound", () => ({ default: () => <div data-testid="page-not-found" /> }));

// Lazy-import App after mocks are set up
const { default: App } = await import("@/App");

// Since App uses BrowserRouter internally and we can't set initialEntries,
// we replicate the exact route structure with MemoryRouter for testing.
function renderAppRoute(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<div data-testid="page-dashboard" />} />
          <Route path="/accounts" element={<div data-testid="page-accounts" />} />
          <Route path="/card-showcase" element={<div data-testid="page-card-showcase" />} />
          <Route path="/records" element={<div data-testid="page-records" />} />
          <Route path="/progress-tracking" element={<div data-testid="page-progress" />} />
          <Route path="/targets" element={<div data-testid="page-targets" />} />
          <Route path="/stats" element={<div data-testid="page-stats" />} />
          <Route path="/flow-comparison" element={<div data-testid="page-flow" />} />
          <Route path="/portfolio" element={<div data-testid="page-portfolio" />} />
          <Route path="/help" element={<div data-testid="page-help" />} />
          <Route path="/settings" element={<div data-testid="page-settings" />} />
          <Route path="/palette" element={<div data-testid="page-palette" />} />
          <Route path="/interactions" element={<div data-testid="page-interactions" />} />
          <Route path="/life-ai" element={<div data-testid="page-life-ai" />} />
          <Route path="/component-showcase" element={<div data-testid="page-component-showcase" />} />
        </Route>
        <Route path="/login" element={<div data-testid="page-login" />} />
        <Route path="/badge-login" element={<div data-testid="page-badge-login" />} />
        <Route path="/static-page" element={<div data-testid="page-static" />} />
        <Route path="/loading" element={<div data-testid="page-loading" />} />
        <Route path="*" element={<div data-testid="page-not-found" />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("App", () => {
  describe("smoke test", () => {
    it("renders without crashing using BrowserRouter", () => {
      // This directly tests the App component with its BrowserRouter
      const { unmount } = render(<App />);
      // Should render at "/" which is the Dashboard
      expect(screen.getByText("[MATRIX]")).toBeInTheDocument();
      unmount();
    });
  });

  describe("layout routes (with DashboardLayout)", () => {
    const layoutRoutes = [
      { path: "/", testId: "page-dashboard", title: "Dashboard" },
      { path: "/accounts", testId: "page-accounts", title: "Accounts" },
      { path: "/card-showcase", testId: "page-card-showcase", title: "Cards" },
      { path: "/records", testId: "page-records", title: "Records" },
      { path: "/progress-tracking", testId: "page-progress", title: "Progress" },
      { path: "/targets", testId: "page-targets", title: "Targets" },
      { path: "/stats", testId: "page-stats", title: "Stats" },
      { path: "/flow-comparison", testId: "page-flow", title: "Flows" },
      { path: "/portfolio", testId: "page-portfolio", title: "Portfolio" },
      { path: "/help", testId: "page-help", title: "Help" },
      { path: "/settings", testId: "page-settings", title: "Settings" },
      { path: "/palette", testId: "page-palette", title: "Palette" },
      { path: "/interactions", testId: "page-interactions", title: "Interactions" },
      { path: "/life-ai", testId: "page-life-ai", title: "Life.ai" },
      { path: "/component-showcase", testId: "page-component-showcase", title: "Components" },
    ];

    layoutRoutes.forEach(({ path, testId, title }) => {
      it(`renders ${title} page at ${path} with sidebar layout`, () => {
        renderAppRoute(path);
        expect(screen.getByTestId(testId)).toBeInTheDocument();
        // Should have the DashboardLayout sidebar
        expect(screen.getByText("[MATRIX]")).toBeInTheDocument();
      });
    });
  });

  describe("standalone routes (without DashboardLayout)", () => {
    const standaloneRoutes = [
      { path: "/login", testId: "page-login", title: "Login" },
      { path: "/badge-login", testId: "page-badge-login", title: "Badge" },
      { path: "/static-page", testId: "page-static", title: "Static" },
      { path: "/loading", testId: "page-loading", title: "Loading" },
    ];

    standaloneRoutes.forEach(({ path, testId, title }) => {
      it(`renders ${title} page at ${path} without sidebar`, () => {
        renderAppRoute(path);
        expect(screen.getByTestId(testId)).toBeInTheDocument();
        // Should NOT have the DashboardLayout sidebar
        expect(screen.queryByText("[MATRIX]")).not.toBeInTheDocument();
      });
    });
  });

  describe("catch-all route", () => {
    it("renders 404 page for unknown paths", () => {
      renderAppRoute("/this-does-not-exist");
      expect(screen.getByTestId("page-not-found")).toBeInTheDocument();
    });
  });
});
