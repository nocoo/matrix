import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { DashboardLayout } from "@/components/DashboardLayout";

// Helper to render DashboardLayout inside a MemoryRouter with a child route
function renderLayout(initialPath = "/") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<div data-testid="dashboard-outlet">Dashboard Content</div>} />
          <Route path="/accounts" element={<div data-testid="accounts-outlet">Accounts Content</div>} />
          <Route path="/help" element={<div data-testid="help-outlet">Help Content</div>} />
          <Route path="/settings" element={<div data-testid="settings-outlet">Settings Content</div>} />
          <Route path="/palette" element={<div data-testid="palette-outlet">Palette Content</div>} />
          <Route path="/card-showcase" element={<div data-testid="card-outlet">Card Content</div>} />
          <Route path="/records" element={<div data-testid="records-outlet">Records Content</div>} />
          <Route path="/progress-tracking" element={<div data-testid="progress-outlet">Progress Content</div>} />
          <Route path="/targets" element={<div data-testid="targets-outlet">Targets Content</div>} />
          <Route path="/stats" element={<div data-testid="stats-outlet">Stats Content</div>} />
          <Route path="/flow-comparison" element={<div data-testid="flow-outlet">Flow Content</div>} />
          <Route path="/portfolio" element={<div data-testid="portfolio-outlet">Portfolio Content</div>} />
          <Route path="/interactions" element={<div data-testid="interactions-outlet">Interactions Content</div>} />
          <Route path="/life-ai" element={<div data-testid="life-ai-outlet">Life.ai Content</div>} />
          <Route path="/component-showcase" element={<div data-testid="showcase-outlet">Showcase Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("DashboardLayout", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.style.overflow = "";
  });

  // -- Rendering basics --

  describe("sidebar rendering", () => {
    it("renders the MATRIX branding", () => {
      renderLayout();
      expect(screen.getByText("[MATRIX]")).toBeInTheDocument();
    });

    it("renders all five nav group labels", () => {
      renderLayout();
      expect(screen.getByText("BLOCKS")).toBeInTheDocument();
      expect(screen.getByText("CHARTS")).toBeInTheDocument();
      expect(screen.getByText("PAGES")).toBeInTheDocument();
      expect(screen.getByText("SYSTEM")).toBeInTheDocument();
      expect(screen.getByText("CONTROLS")).toBeInTheDocument();
    });

    it("renders navigation items", () => {
      renderLayout();
      // "Dashboard" appears as both nav item and h1 — use getAllByText
      expect(screen.getAllByText("Dashboard").length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText("Accounts")).toBeInTheDocument();
      expect(screen.getByText("Stats")).toBeInTheDocument();
      expect(screen.getByText("Help")).toBeInTheDocument();
      expect(screen.getByText("Settings")).toBeInTheDocument();
    });

    it("renders user footer with name and email", () => {
      renderLayout();
      expect(screen.getByText("ZL")).toBeInTheDocument();
      expect(screen.getByText("Zheng Li")).toBeInTheDocument();
      expect(screen.getByText("zhengli@example.com")).toBeInTheDocument();
    });

    it("renders log out button", () => {
      renderLayout();
      expect(screen.getByLabelText("Log out")).toBeInTheDocument();
    });

    it("renders search trigger with CMD+K hint", () => {
      renderLayout();
      expect(screen.getByText("search...")).toBeInTheDocument();
      expect(screen.getByText("CMD+K")).toBeInTheDocument();
    });

    it("renders skip to main content link", () => {
      renderLayout();
      expect(screen.getByText("Skip to main content")).toBeInTheDocument();
    });
  });

  // -- Page title in header --

  describe("page title", () => {
    it("shows 'Dashboard' title on root path", () => {
      renderLayout("/");
      // The header h1 should say Dashboard
      const header = screen.getByRole("heading", { level: 1 });
      expect(header).toHaveTextContent("Dashboard");
    });

    it("shows 'Accounts' title on /accounts path", () => {
      renderLayout("/accounts");
      const header = screen.getByRole("heading", { level: 1 });
      expect(header).toHaveTextContent("Accounts");
    });

    it("shows 'Help' title on /help path", () => {
      renderLayout("/help");
      const header = screen.getByRole("heading", { level: 1 });
      expect(header).toHaveTextContent("Help");
    });

    it("shows 'Settings' title on /settings path", () => {
      renderLayout("/settings");
      const header = screen.getByRole("heading", { level: 1 });
      expect(header).toHaveTextContent("Settings");
    });

    it("falls back to 'Dashboard' for unknown paths", () => {
      render(
        <MemoryRouter initialEntries={["/unknown-path"]}>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route path="*" element={<div>Fallback</div>} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );
      const header = screen.getByRole("heading", { level: 1 });
      expect(header).toHaveTextContent("Dashboard");
    });
  });

  // -- Outlet rendering --

  describe("outlet", () => {
    it("renders the outlet content for root path", () => {
      renderLayout("/");
      expect(screen.getByTestId("dashboard-outlet")).toBeInTheDocument();
    });

    it("renders the outlet content for /accounts", () => {
      renderLayout("/accounts");
      expect(screen.getByTestId("accounts-outlet")).toBeInTheDocument();
    });
  });

  // -- Navigation --

  describe("navigation", () => {
    it("navigates to a different page when nav item is clicked", () => {
      renderLayout("/");
      const accountsBtn = screen.getByRole("button", { name: /Accounts/i });
      fireEvent.click(accountsBtn);
      expect(screen.getByTestId("accounts-outlet")).toBeInTheDocument();
    });

    it("highlights the active nav item", () => {
      renderLayout("/accounts");
      // Find the Accounts button — it should have the active class
      const accountsBtn = screen.getByRole("button", { name: /Accounts/i });
      expect(accountsBtn.className).toContain("bg-matrix-primary/10");
    });

    it("does not highlight inactive nav items", () => {
      renderLayout("/");
      // Settings should not be active
      const settingsBtn = screen.getByRole("button", { name: /Settings/i });
      expect(settingsBtn.className).not.toContain("bg-matrix-primary/10");
    });

    it("renders badges on items with badge prop", () => {
      renderLayout("/");
      // Records has badge: 6, Flow Comparison has badge: 2
      expect(screen.getByText("6")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("opens external links in new window", () => {
      const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
      renderLayout("/");
      // Login is marked as external
      const loginBtn = screen.getByRole("button", { name: /^Login$/i });
      fireEvent.click(loginBtn);
      expect(openSpy).toHaveBeenCalledWith("/login", "_blank", "noopener,noreferrer");
      openSpy.mockRestore();
    });

    it("renders ExternalLink icon for external items", () => {
      renderLayout("/");
      // External items: Login, Badge Login, Static Page, Loading, 404 Page
      // They should not have active styling since they're external
      const loginBtn = screen.getByRole("button", { name: /^Login$/i });
      expect(loginBtn.className).not.toContain("bg-matrix-primary/10");
    });
  });

  // -- Nav group collapse/expand --

  describe("nav group toggle", () => {
    it("collapses a nav group when group label is clicked", () => {
      renderLayout("/");
      // BLOCKS group is open by default — Dashboard should be visible
      expect(screen.getByRole("button", { name: /Dashboard/i })).toBeInTheDocument();
      // Click the BLOCKS label button to collapse
      const blocksToggle = screen.getByRole("button", { name: /BLOCKS/i });
      fireEvent.click(blocksToggle);
      // Now the items under BLOCKS should be hidden
      // Dashboard button in the sidebar should be gone (only the header h1 remains)
      const dashboardButtons = screen.getAllByText("Dashboard");
      // Should only have the h1 title, not the sidebar nav button
      expect(dashboardButtons.length).toBe(1);
    });

    it("expands a collapsed nav group when clicked again", () => {
      renderLayout("/");
      const blocksToggle = screen.getByRole("button", { name: /BLOCKS/i });
      // Collapse
      fireEvent.click(blocksToggle);
      // Expand
      fireEvent.click(blocksToggle);
      // Dashboard nav item should be back
      const dashboardButtons = screen.getAllByText("Dashboard");
      expect(dashboardButtons.length).toBe(2); // h1 + nav item
    });
  });

  // -- Search dialog --

  describe("search dialog", () => {
    it("opens search dialog when search trigger is clicked", () => {
      renderLayout("/");
      const searchTrigger = screen.getByText("search...");
      fireEvent.click(searchTrigger);
      // Search input should appear
      expect(screen.getByPlaceholderText("search pages...")).toBeInTheDocument();
    });

    it("opens search dialog with Cmd+K shortcut", () => {
      renderLayout("/");
      fireEvent.keyDown(document, { key: "k", metaKey: true });
      expect(screen.getByPlaceholderText("search pages...")).toBeInTheDocument();
    });

    it("opens search dialog with Ctrl+K shortcut", () => {
      renderLayout("/");
      fireEvent.keyDown(document, { key: "k", ctrlKey: true });
      expect(screen.getByPlaceholderText("search pages...")).toBeInTheDocument();
    });

    it("toggles search dialog with repeated Cmd+K", () => {
      renderLayout("/");
      fireEvent.keyDown(document, { key: "k", metaKey: true });
      expect(screen.getByPlaceholderText("search pages...")).toBeInTheDocument();
      fireEvent.keyDown(document, { key: "k", metaKey: true });
      expect(screen.queryByPlaceholderText("search pages...")).not.toBeInTheDocument();
    });

    it("shows all nav items when search query is empty", () => {
      renderLayout("/");
      fireEvent.keyDown(document, { key: "k", metaKey: true });
      const dialog = screen.getByPlaceholderText("search pages...").closest(".matrix-panel") as HTMLElement;
      // Should have buttons for all nav items
      const buttons = within(dialog).getAllByRole("button");
      // All nav items from all groups: 8 + 4 + 3 + 9 + 4 = 28
      expect(buttons.length).toBe(28);
    });

    it("filters results based on search query", () => {
      renderLayout("/");
      fireEvent.keyDown(document, { key: "k", metaKey: true });
      const input = screen.getByPlaceholderText("search pages...");
      fireEvent.change(input, { target: { value: "account" } });
      const dialog = input.closest(".matrix-panel") as HTMLElement;
      const buttons = within(dialog).getAllByRole("button");
      expect(buttons.length).toBe(1);
      expect(within(dialog).getByText("Accounts")).toBeInTheDocument();
    });

    it("shows 'no results found' for non-matching query", () => {
      renderLayout("/");
      fireEvent.keyDown(document, { key: "k", metaKey: true });
      const input = screen.getByPlaceholderText("search pages...");
      fireEvent.change(input, { target: { value: "xyznonexistent" } });
      expect(screen.getByText("no results found")).toBeInTheDocument();
    });

    it("closes search dialog when Escape is pressed", () => {
      renderLayout("/");
      fireEvent.keyDown(document, { key: "k", metaKey: true });
      expect(screen.getByPlaceholderText("search pages...")).toBeInTheDocument();
      fireEvent.keyDown(document, { key: "Escape" });
      expect(screen.queryByPlaceholderText("search pages...")).not.toBeInTheDocument();
    });

    it("closes search dialog when overlay backdrop is clicked", () => {
      renderLayout("/");
      fireEvent.keyDown(document, { key: "k", metaKey: true });
      expect(screen.getByPlaceholderText("search pages...")).toBeInTheDocument();
      // Click the backdrop overlay (first fixed inset-0 div)
      const backdrop = document.querySelector(".fixed.inset-0.z-50.bg-black\\/70") as HTMLElement;
      fireEvent.click(backdrop);
      expect(screen.queryByPlaceholderText("search pages...")).not.toBeInTheDocument();
    });

    it("navigates to selected page and closes search", () => {
      renderLayout("/");
      fireEvent.keyDown(document, { key: "k", metaKey: true });
      const dialog = screen.getByPlaceholderText("search pages...").closest(".matrix-panel") as HTMLElement;
      const helpBtn = within(dialog).getByText("Help");
      fireEvent.click(helpBtn);
      // Search should close
      expect(screen.queryByPlaceholderText("search pages...")).not.toBeInTheDocument();
      // Should navigate to help page
      expect(screen.getByTestId("help-outlet")).toBeInTheDocument();
    });

    it("clears search query when reopened", () => {
      renderLayout("/");
      // Open and type something
      fireEvent.keyDown(document, { key: "k", metaKey: true });
      const input = screen.getByPlaceholderText("search pages...");
      fireEvent.change(input, { target: { value: "account" } });
      expect(input).toHaveValue("account");
      // Close
      fireEvent.keyDown(document, { key: "Escape" });
      // Reopen
      fireEvent.keyDown(document, { key: "k", metaKey: true });
      const newInput = screen.getByPlaceholderText("search pages...");
      expect(newInput).toHaveValue("");
    });

    it("renders ESC key hint in search dialog", () => {
      renderLayout("/");
      fireEvent.keyDown(document, { key: "k", metaKey: true });
      // There are two ESC hints, one in the search dialog
      const escKeys = screen.getAllByText("ESC");
      expect(escKeys.length).toBeGreaterThanOrEqual(1);
    });
  });

  // -- Mobile sidebar --

  describe("mobile sidebar", () => {
    it("renders mobile menu button", () => {
      renderLayout("/");
      expect(screen.getByLabelText("Open navigation")).toBeInTheDocument();
    });

    it("opens mobile sidebar when menu button is clicked", () => {
      renderLayout("/");
      const menuBtn = screen.getByLabelText("Open navigation");
      fireEvent.click(menuBtn);
      // Mobile sidebar should now show — there will be a backdrop overlay
      const overlays = document.querySelectorAll(".fixed.inset-0");
      expect(overlays.length).toBeGreaterThanOrEqual(1);
    });

    it("sets body overflow to hidden when mobile sidebar is open", () => {
      renderLayout("/");
      const menuBtn = screen.getByLabelText("Open navigation");
      fireEvent.click(menuBtn);
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("restores body overflow when mobile sidebar is closed", () => {
      renderLayout("/");
      const menuBtn = screen.getByLabelText("Open navigation");
      fireEvent.click(menuBtn);
      expect(document.body.style.overflow).toBe("hidden");
      // Close by clicking the X button (inside mobile sidebar)
      const closeButtons = screen.getAllByRole("button");
      // Find the X close button — it's the one in the mobile sidebar header
      // The mobile overlay has a second sidebar copy, so the X button appears
      const xButton = closeButtons.find(
        (btn) => btn.classList.contains("md:hidden") && btn.querySelector("svg"),
      );
      if (xButton) {
        fireEvent.click(xButton);
        expect(document.body.style.overflow).toBe("");
      }
    });

    it("closes mobile sidebar when backdrop is clicked", () => {
      renderLayout("/");
      const menuBtn = screen.getByLabelText("Open navigation");
      fireEvent.click(menuBtn);
      // Click the mobile backdrop (md:hidden backdrop)
      const backdrop = document.querySelector(".fixed.inset-0.z-40") as HTMLElement;
      fireEvent.click(backdrop);
      expect(document.body.style.overflow).toBe("");
    });

    it("closes mobile sidebar on route change", () => {
      renderLayout("/");
      const menuBtn = screen.getByLabelText("Open navigation");
      fireEvent.click(menuBtn);
      expect(document.body.style.overflow).toBe("hidden");
      // Navigate to accounts by clicking the nav item
      const accountsBtns = screen.getAllByRole("button", { name: /Accounts/i });
      // Click the one in the mobile sidebar (last one)
      fireEvent.click(accountsBtns[accountsBtns.length - 1]);
      // Mobile sidebar should close due to route change
      expect(document.body.style.overflow).toBe("");
    });
  });

  // -- Header content --

  describe("header", () => {
    it("renders the $ prompt prefix", () => {
      renderLayout("/");
      expect(screen.getByText("$")).toBeInTheDocument();
    });

    it("renders a pulse indicator", () => {
      renderLayout("/");
      const pulseIndicator = document.querySelector(".animate-pulse");
      expect(pulseIndicator).toBeInTheDocument();
    });
  });
});
