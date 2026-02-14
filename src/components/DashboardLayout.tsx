import { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard, Wallet, CreditCard, ArrowLeftRight,
  PiggyBank, Target, BarChart3, TrendingUp,
  LineChart, HelpCircle, Settings, Search,
  ChevronRight, LogOut, Palette, LogIn, IdCard,
  ExternalLink, FileText, Layers, HeartPulse,
  Loader, Menu, X, FileQuestion, Component,
  RectangleEllipsis, MousePointerClick, Bell, Layers2,
  Eye, Navigation, FormInput, Table, Tag, Github,
} from "lucide-react";
import { cn } from "@/lib/utils";

// -- Navigation data model --

interface NavItem {
  title: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
  external?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "BLOCKS",
    defaultOpen: true,
    items: [
      { title: "Dashboard", icon: LayoutDashboard, path: "/" },
      { title: "Accounts", icon: Wallet, path: "/accounts" },
      { title: "Cards", icon: CreditCard, path: "/card-showcase" },
      { title: "Records", icon: ArrowLeftRight, path: "/records", badge: 6 },
      { title: "Progress", icon: PiggyBank, path: "/progress-tracking" },
      { title: "Targets", icon: Target, path: "/targets" },
      { title: "Life.ai", icon: HeartPulse, path: "/life-ai" },
      { title: "Components", icon: Component, path: "/component-showcase" },
    ],
  },
  {
    label: "CHARTS",
    defaultOpen: true,
    items: [
      { title: "Stats", icon: BarChart3, path: "/stats" },
      { title: "Flows", icon: TrendingUp, path: "/flow-comparison", badge: 2 },
      { title: "Portfolio", icon: LineChart, path: "/portfolio" },
    ],
  },
  {
    label: "PAGES",
    defaultOpen: true,
    items: [
      { title: "Login", icon: LogIn, path: "/login", external: true },
      { title: "Badge", icon: IdCard, path: "/badge-login", external: true },
      { title: "Static", icon: FileText, path: "/static-page", external: true },
      { title: "Loading", icon: Loader, path: "/loading", external: true },
      { title: "404", icon: FileQuestion, path: "/404", external: true },
    ],
  },
  {
    label: "SYSTEM",
    defaultOpen: true,
    items: [
      { title: "Help", icon: HelpCircle, path: "/help" },
      { title: "Palette", icon: Palette, path: "/palette" },
      { title: "Interactions", icon: Layers, path: "/interactions" },
      { title: "Settings", icon: Settings, path: "/settings" },
    ],
  },
  {
    label: "CONTROLS",
    defaultOpen: true,
    items: [
      { title: "Controls", icon: RectangleEllipsis, path: "/controls" },
      { title: "Buttons", icon: MousePointerClick, path: "/buttons" },
      { title: "Feedback", icon: Bell, path: "/feedback" },
      { title: "Overlays", icon: Layers2, path: "/overlays" },
      { title: "Data", icon: Eye, path: "/data-display" },
      { title: "Navigation", icon: Navigation, path: "/navigation" },
      { title: "Forms", icon: FormInput, path: "/forms" },
      { title: "Tables", icon: Table, path: "/tables" },
      { title: "Pills", icon: Tag, path: "/pills" },
    ],
  },
];

// Map route paths to page titles
const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/accounts": "Accounts",
  "/card-showcase": "Cards",
  "/records": "Records",
  "/progress-tracking": "Progress",
  "/targets": "Targets",
  "/stats": "Stats",
  "/flow-comparison": "Flows",
  "/portfolio": "Portfolio",
  "/help": "Help",
  "/settings": "Settings",
  "/palette": "Palette",
  "/interactions": "Interactions",
  "/life-ai": "Life.ai",
  "/component-showcase": "Components",
  "/controls": "Controls",
  "/buttons": "Buttons",
  "/feedback": "Feedback",
  "/overlays": "Overlays",
  "/data-display": "Data",
  "/navigation": "Navigation",
  "/forms": "Forms",
  "/tables": "Tables",
  "/pills": "Pills",
};

// -- Nav group section --

function NavGroupSection({
  group,
  currentPath,
  onNavigate,
}: {
  group: NavGroup;
  currentPath: string;
  onNavigate: (path: string, external?: boolean) => void;
}) {
  const [open, setOpen] = useState(group.defaultOpen ?? true);

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-1 px-3 py-1.5 text-matrix-dim font-mono text-xs uppercase tracking-widest hover:text-matrix-muted transition-colors"
      >
        <ChevronRight
          className={cn(
            "h-3 w-3 transition-transform duration-200",
            open && "rotate-90"
          )}
          strokeWidth={1.5}
        />
        <span>{group.label}</span>
      </button>
      {open && (
        <div className="flex flex-col gap-px px-2">
          {group.items.map((item) => {
            const isActive = !item.external && currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path, item.external)}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-1.5 text-sm font-mono transition-colors",
                  isActive
                    ? "bg-matrix-primary/10 text-matrix-primary"
                    : "text-matrix-muted hover:bg-matrix-primary/5 hover:text-matrix-primary"
                )}
              >
                <item.icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                <span className="flex-1 text-left truncate uppercase">{item.title}</span>
                {item.external && (
                  <ExternalLink className="h-3 w-3 shrink-0 text-matrix-dim" strokeWidth={1.5} />
                )}
                {item.badge && (
                  <span className="flex h-4 min-w-[16px] items-center justify-center bg-matrix-primary/20 px-1 text-[10px] font-mono text-matrix-primary">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// -- Search dialog --

function SearchDialog({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
}) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const allItems = NAV_GROUPS.flatMap((g) => g.items);
  const filtered = query.trim()
    ? allItems.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      )
    : allItems;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-x-4 top-[20%] z-50 mx-auto max-w-md">
        <div className="matrix-panel border border-matrix-primary/30">
          <div className="flex items-center gap-2 border-b border-matrix-primary/20 px-3 py-2">
            <Search className="h-4 w-4 text-matrix-dim" strokeWidth={1.5} />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="search pages..."
              className="flex-1 bg-transparent font-mono text-sm text-matrix-primary placeholder:text-matrix-dim outline-none"
            />
            <kbd className="border border-matrix-primary/20 px-1.5 py-0.5 font-mono text-[10px] text-matrix-dim">
              ESC
            </kbd>
          </div>
          <div className="max-h-64 overflow-y-auto py-1 matrix-scrollbar">
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-center font-mono text-sm text-matrix-dim">
                no results found
              </p>
            ) : (
              filtered.map((item) => (
                <button
                  key={item.path}
                  onClick={() => onSelect(item.path)}
                  className="flex w-full items-center gap-2.5 px-3 py-2 font-mono text-sm text-matrix-muted hover:bg-matrix-primary/10 hover:text-matrix-primary transition-colors"
                >
                  <item.icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                  <span>{item.title}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// -- Main layout --

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const title = PAGE_TITLES[location.pathname] ?? "Dashboard";

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavigate = useCallback(
    (path: string, external?: boolean) => {
      if (external) {
        window.open(path, "_blank", "noopener,noreferrer");
      } else {
        navigate(path);
      }
    },
    [navigate],
  );

  const handleSearchSelect = useCallback(
    (path: string) => {
      setSearchOpen(false);
      navigate(path);
    },
    [navigate],
  );

  const sidebar = (
    <div className="flex h-full w-[240px] flex-col bg-[var(--matrix-bg)] border-r border-matrix-primary/20">
      {/* Header */}
      <div className="flex h-12 items-center justify-between px-4">
        <span className="font-mono text-sm font-bold uppercase tracking-widest text-matrix-primary glow-text">
          [MATRIX]
        </span>
        <button
          onClick={() => setMobileOpen(false)}
          className="flex h-6 w-6 items-center justify-center text-matrix-dim hover:text-matrix-primary transition-colors md:hidden"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      {/* Search trigger */}
      <div className="px-3 pb-2">
        <button
          onClick={() => setSearchOpen(true)}
          className="flex w-full items-center gap-2 border border-matrix-primary/20 bg-matrix-primary/5 px-2.5 py-1.5 transition-colors hover:border-matrix-primary/40"
        >
          <Search className="h-3.5 w-3.5 text-matrix-dim" strokeWidth={1.5} />
          <span className="flex-1 text-left font-mono text-xs text-matrix-dim">search...</span>
          <kbd className="border border-matrix-primary/15 px-1 py-0.5 font-mono text-[9px] text-matrix-dim">
            CMD+K
          </kbd>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto matrix-scrollbar pt-1">
        {NAV_GROUPS.map((group) => (
          <NavGroupSection
            key={group.label}
            group={group}
            currentPath={location.pathname}
            onNavigate={handleNavigate}
          />
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-matrix-primary/15 px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center border border-matrix-primary/30 bg-matrix-primary/10 font-mono text-xs text-matrix-primary">
            ZL
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-xs text-matrix-primary truncate">Zheng Li</p>
            <p className="font-mono text-[10px] text-matrix-dim truncate">
              zhengli@example.com
            </p>
          </div>
          <button
            aria-label="Log out"
            className="flex h-6 w-6 items-center justify-center text-matrix-dim hover:text-matrix-primary transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-[var(--matrix-bg)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:bg-matrix-primary focus:px-4 focus:py-2 focus:text-sm focus:font-mono focus:text-black"
      >
        Skip to main content
      </a>

      {/* Desktop sidebar */}
      <aside className="hidden md:block sticky top-0 h-screen shrink-0">
        {sidebar}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 md:hidden">
            {sidebar}
          </div>
        </>
      )}

      {/* Main content */}
      <main id="main-content" className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="flex h-12 items-center justify-between px-3 md:px-5 shrink-0 border-b border-matrix-primary/10">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              className="flex h-7 w-7 items-center justify-center text-matrix-dim hover:text-matrix-primary transition-colors md:hidden"
            >
              <Menu className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-matrix-dim">$</span>
              <h1 className="font-mono text-sm uppercase tracking-wider text-matrix-primary">
                {title}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-matrix-dim hidden sm:inline">
              {new Date().toLocaleTimeString("en-US", { hour12: false })}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-matrix-primary animate-pulse" />
            <a
              href="https://github.com/nocoo/matrix"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              className="flex h-7 w-7 items-center justify-center text-matrix-dim hover:text-matrix-primary transition-colors"
            >
              <Github className="h-4 w-4" strokeWidth={1.5} />
            </a>
          </div>
        </header>

        <div className="flex-1 p-2 md:p-3 overflow-y-auto matrix-scrollbar">
          <Outlet />
        </div>
      </main>

      {/* Search */}
      <SearchDialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={handleSearchSelect}
      />
    </div>
  );
}
