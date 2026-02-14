// ============================================
// Controls Model
// Pure mock data for all Controls showcase pages.
// Zero React — just data generation.
// ============================================

// ── Table rows ────────────────────────────────
export interface InvoiceRow {
  id: string;
  customer: string;
  status: "paid" | "pending" | "overdue";
  amount: string;
  date: string;
}

export function createMockInvoices(): InvoiceRow[] {
  return [
    { id: "INV-001", customer: "NEBUCHADNEZZAR CREW", status: "paid", amount: "$4,200.00", date: "2026-02-01" },
    { id: "INV-002", customer: "ZION DEFENSE CORP", status: "pending", amount: "$1,850.00", date: "2026-02-05" },
    { id: "INV-003", customer: "ORACLE CONSULTING", status: "paid", amount: "$7,300.00", date: "2026-02-08" },
    { id: "INV-004", customer: "MEROVINGIAN LLC", status: "overdue", amount: "$3,600.00", date: "2026-01-15" },
    { id: "INV-005", customer: "KEYMAKER LABS", status: "paid", amount: "$920.00", date: "2026-02-12" },
  ];
}

// ── Transfer items ────────────────────────────
export interface TransferItem {
  label: string;
  type: string;
  direction: "in" | "out";
  amount: string;
}

export function createMockTransfers(): TransferItem[] {
  return [
    { label: "Wire transfer to Zion", type: "WIRE", direction: "out", amount: "$12,400" },
    { label: "ACH payout from Oracle", type: "ACH", direction: "in", amount: "$8,750" },
    { label: "Vendor payment to Keymaker", type: "VENDOR", direction: "out", amount: "$3,200" },
  ];
}

// ── Pill data arrays ──────────────────────────
export interface PillData {
  label: string;
  className: string;
}

export function createSolidPills(): PillData[] {
  return [
    { label: "ACTIVE", className: "bg-matrix-primary text-black" },
    { label: "SUCCESS", className: "bg-green-600 text-black" },
    { label: "WARNING", className: "bg-yellow-500 text-black" },
    { label: "ERROR", className: "bg-red-500 text-black" },
    { label: "MUTED", className: "bg-matrix-dim text-black" },
  ];
}

export function createSoftPills(): PillData[] {
  return [
    { label: "NEURAL", className: "bg-blue-500/15 text-blue-400 border border-blue-500/30" },
    { label: "QUANTUM", className: "bg-teal-500/15 text-teal-400 border border-teal-500/30" },
    { label: "CIPHER", className: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30" },
    { label: "SIGNAL", className: "bg-rose-500/15 text-rose-400 border border-rose-500/30" },
    { label: "FLUX", className: "bg-amber-500/15 text-amber-400 border border-amber-500/30" },
  ];
}

export function createOutlinePills(): PillData[] {
  return [
    { label: "OUTLINE", className: "border border-matrix-ghost text-matrix-muted" },
    { label: "PRIMARY", className: "border border-matrix-primary/40 text-matrix-primary" },
    { label: "SUCCESS", className: "border border-green-500/40 text-green-400" },
    { label: "WARNING", className: "border border-yellow-500/40 text-yellow-400" },
    { label: "ERROR", className: "border border-red-500/40 text-red-400" },
  ];
}

export function createGradientPills(): PillData[] {
  return [
    { label: "PHOSPHOR", className: "bg-gradient-to-r from-green-800 to-green-400 text-black" },
    { label: "TERMINAL", className: "bg-gradient-to-br from-emerald-700 to-lime-400 text-black" },
    { label: "CYPHER", className: "bg-gradient-to-b from-green-500 to-emerald-900 text-black" },
    { label: "NEON", className: "bg-gradient-to-tl from-lime-500 to-green-700 text-black" },
    { label: "MATRIX", className: "bg-gradient-to-tr from-emerald-400 to-green-900 text-black" },
  ];
}

// ── People list (data display) ────────────────
export interface PersonEntry {
  name: string;
  email: string;
  status: "active" | "inactive";
}

export function createMockPeople(): PersonEntry[] {
  return [
    { name: "NEO", email: "neo@matrix.zion", status: "active" },
    { name: "MORPHEUS", email: "morpheus@nebuchadnezzar.zion", status: "active" },
    { name: "TRINITY", email: "trinity@nebuchadnezzar.zion", status: "active" },
    { name: "AGENT SMITH", email: "smith@machine.city", status: "inactive" },
  ];
}

// ── KPI data ──────────────────────────────────
export interface KpiEntry {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "flat";
}

export function createMockKpis(): KpiEntry[] {
  return [
    { label: "OPERATIONS", value: "48,291", change: "+12.5%", trend: "up" },
    { label: "AGENTS", value: "2,841", change: "+8.2%", trend: "up" },
    { label: "ANOMALIES", value: "24.3%", change: "-3.1%", trend: "down" },
    { label: "AVG LATENCY", value: "4m 32s", change: "0%", trend: "flat" },
  ];
}

// ── Timeline events ───────────────────────────
export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  time: string;
  status: "success" | "info" | "warning" | "special" | "primary";
}

export function createMockTimeline(): TimelineEvent[] {
  return [
    { id: "t1", title: "Deployment succeeded", description: "Matrix v2.1 deployed to production", time: "2 hours ago", status: "success" },
    { id: "t2", title: "Code merged", description: "Branch neural-link merged to main", time: "4 hours ago", status: "info" },
    { id: "t3", title: "Anomaly detected", description: "Unusual traffic pattern in Sector 7", time: "6 hours ago", status: "warning" },
    { id: "t4", title: "Milestone reached", description: "1M operations processed", time: "1 day ago", status: "special" },
    { id: "t5", title: "System initialized", description: "Neural interface v2.0 online", time: "2 days ago", status: "primary" },
  ];
}

// ── Key-value pairs ───────────────────────────
export interface KeyValuePair {
  key: string;
  value: string;
}

export function createMockKeyValues(): KeyValuePair[] {
  return [
    { key: "Status", value: "OPERATIONAL" },
    { key: "Protocol", value: "ZION-ALPHA" },
    { key: "Initialized", value: "2026-01-01" },
    { key: "Last Sync", value: "2 minutes ago" },
    { key: "Region", value: "SECTOR-7G" },
    { key: "API Calls", value: "1,247,832" },
  ];
}

// ── Stepper steps ─────────────────────────────
export interface StepperStep {
  label: string;
  description: string;
}

export function createStepperSteps(): StepperStep[] {
  return [
    { label: "AUTHENTICATE", description: "Verify neural signature" },
    { label: "CONFIGURE", description: "Set interface parameters" },
    { label: "CALIBRATE", description: "Tune signal frequency" },
    { label: "REVIEW", description: "Confirm all settings" },
    { label: "ACTIVATE", description: "Initialize connection" },
  ];
}
