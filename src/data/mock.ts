// Centralized mock data for all pages.
// Type definitions live in @/models/types.ts — edit those to match your domain.

import type {
  Account,
  ActivityItem,
  CreditCard,
  Transaction,
  Budget,
  MonthlyBudget,
  Goal,
  PortfolioItem,
  FAQ,
  ShowcaseToast,
  ShowcaseDialog,
  LifeAiTimelineEvent,
  LifeAiStat,
  LifeAiHeatmapPoint,
} from "@/models/types";

// -- Wallet --
export const accounts: Account[] = [
  { name: "Main Account", balance: 12450.8, currency: "USD", change: "+2.4%" },
  { name: "Savings", balance: 8200.0, currency: "USD", change: "+5.1%" },
  { name: "Investment", balance: 23100.5, currency: "USD", change: "+8.7%" },
];

export const walletActivity: ActivityItem[] = [
  { desc: "Transfer to Savings", amount: -500, date: "Today" },
  { desc: "Received from John", amount: 250, date: "Yesterday" },
  { desc: "ATM Withdrawal", amount: -200, date: "Feb 9" },
  { desc: "Refund - Amazon", amount: 45.99, date: "Feb 8" },
];

// -- Cards --
export const creditCards: CreditCard[] = [
  { name: "Sapphire Reserve", bank: "Chase", network: "visa", number: "4532 **** **** 7890", expiry: "09/28", balance: 3250.0, limit: 10000, color: "from-blue-600 to-blue-800" },
  { name: "Premier World", bank: "HSBC", network: "mastercard", number: "5412 **** **** 3456", expiry: "03/27", balance: 1820.5, limit: 5000, color: "from-purple-600 to-purple-800" },
  { name: "Centurion", bank: "American Express", network: "amex", number: "3742 **** **** 1234", expiry: "12/29", balance: 8400.0, limit: 25000, color: "from-neutral-800 to-neutral-950" },
];

// -- Transactions --
export const transactions: Transaction[] = [
  { id: 1, name: "Netflix Subscription", category: "Entertainment", amount: -15.99, date: "Feb 11, 2026", status: "Completed" },
  { id: 2, name: "Salary Deposit", category: "Income", amount: 5200.0, date: "Feb 10, 2026", status: "Completed" },
  { id: 3, name: "Grocery Store", category: "Food", amount: -82.4, date: "Feb 10, 2026", status: "Completed" },
  { id: 4, name: "Freelance Payment", category: "Income", amount: 1200.0, date: "Feb 8, 2026", status: "Completed" },
  { id: 5, name: "Electric Bill", category: "Utilities", amount: -145.0, date: "Feb 7, 2026", status: "Completed" },
  { id: 6, name: "Restaurant", category: "Food", amount: -56.8, date: "Feb 6, 2026", status: "Completed" },
  { id: 7, name: "Gas Station", category: "Transport", amount: -42.0, date: "Feb 5, 2026", status: "Pending" },
  { id: 8, name: "Online Transfer", category: "Transfer", amount: -300.0, date: "Feb 4, 2026", status: "Completed" },
  { id: 9, name: "Gym Membership", category: "Health", amount: -49.99, date: "Feb 3, 2026", status: "Completed" },
  { id: 10, name: "Dividend Income", category: "Income", amount: 85.5, date: "Feb 2, 2026", status: "Completed" },
];

// -- Budget --
export const budgets: Budget[] = [
  { category: "Food & Dining", spent: 420, limit: 600 },
  { category: "Transportation", spent: 180, limit: 300 },
  { category: "Entertainment", spent: 95, limit: 150 },
  { category: "Shopping", spent: 310, limit: 400 },
  { category: "Utilities", spent: 245, limit: 250 },
];

export const monthlyBudgetData: MonthlyBudget[] = [
  { month: "Jul", budget: 1500, actual: 1200 },
  { month: "Aug", budget: 1500, actual: 1400 },
  { month: "Sep", budget: 1600, actual: 1550 },
  { month: "Oct", budget: 1600, actual: 1300 },
  { month: "Nov", budget: 1700, actual: 1800 },
  { month: "Dec", budget: 1700, actual: 1650 },
];

// -- Goals --
export const goals: Goal[] = [
  { name: "Emergency Fund", target: 10000, saved: 7500, icon: "shield" },
  { name: "Vacation Trip", target: 5000, saved: 2200, icon: "plane" },
  { name: "New Car", target: 30000, saved: 12000, icon: "car" },
  { name: "Home Down Payment", target: 60000, saved: 18000, icon: "home" },
];

// -- Analytics --
export const analyticsWeekly = [
  { day: "Mon", income: 1200, expense: 800 },
  { day: "Tue", income: 900, expense: 1100 },
  { day: "Wed", income: 1500, expense: 700 },
  { day: "Thu", income: 800, expense: 900 },
  { day: "Fri", income: 2000, expense: 1200 },
  { day: "Sat", income: 600, expense: 1500 },
  { day: "Sun", income: 400, expense: 500 },
];

export const analyticsCategories = [
  { name: "Food", value: 35 },
  { name: "Bills", value: 25 },
  { name: "Shopping", value: 20 },
  { name: "Transport", value: 12 },
  { name: "Other", value: 8 },
];

export const analyticsTrend = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  value: 5000 + Math.sin(i / 3) * 2000 + Math.random() * 1000,
}));

export const analyticsStats = [
  { label: "Avg. Daily Spend", value: "$142", change: "-3.2%" },
  { label: "Transactions/Day", value: "8.4", change: "+1.5%" },
  { label: "Savings Rate", value: "24%", change: "+2.1%" },
  { label: "Top Category", value: "Food", change: "35%" },
];

// -- Cash Flow --
export const monthlyFlow = [
  { month: "Jul", inflow: 6200, outflow: 4800 },
  { month: "Aug", inflow: 5800, outflow: 5200 },
  { month: "Sep", inflow: 7100, outflow: 4900 },
  { month: "Oct", inflow: 6500, outflow: 5500 },
  { month: "Nov", inflow: 8200, outflow: 6100 },
  { month: "Dec", inflow: 7400, outflow: 5800 },
  { month: "Jan", inflow: 6800, outflow: 5300 },
  { month: "Feb", inflow: 7900, outflow: 5100 },
];

// -- Investments --
export const portfolio: PortfolioItem[] = [
  { name: "Stocks", value: 45000, allocation: 45, change: "+12.4%", up: true },
  { name: "Bonds", value: 20000, allocation: 20, change: "+3.2%", up: true },
  { name: "Real Estate", value: 15000, allocation: 15, change: "+7.8%", up: true },
  { name: "Crypto", value: 10000, allocation: 10, change: "-5.1%", up: false },
  { name: "Cash", value: 10000, allocation: 10, change: "+0.5%", up: true },
];

export const performanceData = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  value: 80000 + Math.sin(i / 2) * 10000 + i * 2000 + Math.random() * 3000,
}));

// -- Help --
export const faqs: FAQ[] = [
  { q: "How do I add a new bank account?", a: "Go to Wallet > Add Money > Link Bank Account." },
  { q: "How are budget limits calculated?", a: "Budget limits are set monthly and reset on the 1st." },
  { q: "Can I export my transactions?", a: "Yes, go to Transactions > Filter > Export CSV." },
  { q: "How do I change my notification settings?", a: "Settings > Notifications > Toggle preferences." },
];

// -- Interaction Showcase --
export const showcaseToasts: ShowcaseToast[] = [
  { id: "t1", title: "Changes saved", description: "Your profile has been updated successfully.", variant: "success" },
  { id: "t2", title: "New message", description: "You have a new notification from the system.", variant: "default" },
  { id: "t3", title: "Payment failed", description: "Your card was declined. Please try another method.", variant: "error" },
  { id: "t4", title: "Storage almost full", description: "You have used 90% of your available storage.", variant: "warning" },
  { id: "t5", title: "Update available", description: "A new version of the app is ready to install.", variant: "info" },
];

export const showcaseDialogs: ShowcaseDialog[] = [
  { id: "d1", title: "About Matrix", description: "Matrix is a cyberpunk terminal dashboard built with React, TypeScript, and Tailwind CSS.", style: "info" },
  { id: "d2", title: "Send Feedback", description: "Let us know how we can improve your experience.", style: "form" },
  { id: "d3", title: "Delete Account", description: "This action cannot be undone. All your data will be permanently removed from our servers.", style: "confirm" },
];

// -- Life.ai Demo --

export const lifeAiStats: LifeAiStat[] = [
  { title: "Steps", value: "8,432", subtitle: "Goal: 10,000", trend: { value: 12.5, label: "vs last week" } },
  { title: "Sleep", value: "7h 24m", subtitle: "Deep: 2h 10m", trend: { value: -3.2, label: "vs avg" } },
  { title: "Heart Rate", value: "72 bpm", subtitle: "Resting avg", trend: { value: 0, label: "stable" } },
  { title: "Calories", value: "2,180", subtitle: "Burned today", trend: { value: 8.1, label: "vs target" } },
];

export const lifeAiTimeline: LifeAiTimelineEvent[] = [
  { id: "e1", time: "06:30", title: "Wake up", subtitle: "Sleep score 85", color: "bg-blue-500" },
  { id: "e2", time: "07:00", title: "Morning run", subtitle: "5.2 km in 28 min", color: "bg-green-500" },
  { id: "e3", time: "08:00", title: "Breakfast", subtitle: "420 kcal" },
  { id: "e4", time: "09:00", title: "Deep work", subtitle: "Focus session 90 min", color: "bg-purple-500" },
  { id: "e5", time: "12:30", title: "Lunch", subtitle: "680 kcal" },
  { id: "e6", time: "14:00", title: "Meeting", subtitle: "Design review", color: "bg-orange-500" },
  { id: "e7", time: "17:00", title: "Gym", subtitle: "Upper body + core", color: "bg-green-500" },
  { id: "e8", time: "19:00", title: "Dinner", subtitle: "550 kcal" },
  { id: "e9", time: "21:00", title: "Reading", subtitle: "45 min" },
  { id: "e10", time: "22:30", title: "Sleep", color: "bg-blue-500" },
];

/** Generate a year of heatmap data with realistic-looking values */
function generateHeatmapData(year: number): LifeAiHeatmapPoint[] {
  const data: LifeAiHeatmapPoint[] = [];
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  const current = new Date(start);
  let seed = 42;
  const pseudoRandom = () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  while (current <= end) {
    const m = String(current.getMonth() + 1).padStart(2, "0");
    const d = String(current.getDate()).padStart(2, "0");
    const date = `${year}-${m}-${d}`;
    // ~20% days with 0, rest 1-12
    const val = pseudoRandom() < 0.2 ? 0 : Math.ceil(pseudoRandom() * 12);
    data.push({ date, value: val });
    current.setDate(current.getDate() + 1);
  }
  return data;
}

export const lifeAiHeatmapData: LifeAiHeatmapPoint[] = generateHeatmapData(2026);

export const lifeAiWeeklySteps = [
  { label: "Mon", value: 7200 },
  { label: "Tue", value: 8400 },
  { label: "Wed", value: 6800 },
  { label: "Thu", value: 9100 },
  { label: "Fri", value: 8432 },
  { label: "Sat", value: 11200 },
  { label: "Sun", value: 5600 },
];

export const lifeAiMonthlySleep = [
  { label: "Jan", value: 7.2 },
  { label: "Feb", value: 7.5 },
  { label: "Mar", value: 6.8 },
  { label: "Apr", value: 7.1 },
  { label: "May", value: 7.4 },
  { label: "Jun", value: 7.0 },
  { label: "Jul", value: 6.9 },
  { label: "Aug", value: 7.3 },
  { label: "Sep", value: 7.6 },
  { label: "Oct", value: 7.1 },
  { label: "Nov", value: 7.4 },
  { label: "Dec", value: 7.2 },
];

export const lifeAiActivityBreakdown = [
  { label: "Running", value: 35 },
  { label: "Gym", value: 25 },
  { label: "Walking", value: 20 },
  { label: "Cycling", value: 12 },
  { label: "Yoga", value: 8 },
];

// SlotBarChart demo data -- sleep stages (category bars, equal height, color by type)
export const lifeAiSleepSlots: { color: string; label: string }[] = [
  // Deep sleep (indigo-800), Core (indigo-500), REM (green-600), Awake (orange-500)
  { color: "bg-indigo-500", label: "Core 15m" },
  { color: "bg-indigo-500", label: "Core 15m" },
  { color: "bg-indigo-800", label: "Deep 15m" },
  { color: "bg-indigo-800", label: "Deep 15m" },
  { color: "bg-indigo-800", label: "Deep 15m" },
  { color: "bg-indigo-800", label: "Deep 15m" },
  { color: "bg-indigo-500", label: "Core 15m" },
  { color: "bg-indigo-500", label: "Core 15m" },
  { color: "bg-green-600", label: "REM 15m" },
  { color: "bg-green-600", label: "REM 15m" },
  { color: "bg-green-600", label: "REM 15m" },
  { color: "bg-indigo-500", label: "Core 15m" },
  { color: "bg-indigo-500", label: "Core 15m" },
  { color: "bg-indigo-800", label: "Deep 15m" },
  { color: "bg-indigo-800", label: "Deep 15m" },
  { color: "bg-indigo-500", label: "Core 15m" },
  { color: "bg-green-600", label: "REM 15m" },
  { color: "bg-green-600", label: "REM 15m" },
  { color: "bg-indigo-500", label: "Core 15m" },
  { color: "bg-indigo-500", label: "Core 15m" },
  { color: "bg-orange-500", label: "Awake 15m" },
  { color: "bg-indigo-500", label: "Core 15m" },
  { color: "bg-green-600", label: "REM 15m" },
  { color: "bg-green-600", label: "REM 15m" },
  { color: "bg-indigo-500", label: "Core 15m" },
  { color: "bg-indigo-500", label: "Core 15m" },
  { color: "bg-indigo-500", label: "Core 15m" },
  { color: "bg-orange-500", label: "Awake 15m" },
];

// SlotBarChart demo data -- heart rate (value-colored bars, color by BPM zone)
export const lifeAiHeartRateSlots: { color: string; label: string }[] = [
  { color: "bg-green-600", label: "62 bpm" },
  { color: "bg-green-600", label: "58 bpm" },
  { color: "bg-green-600", label: "55 bpm" },
  { color: "bg-green-600", label: "60 bpm" },
  { color: "bg-green-600", label: "65 bpm" },
  { color: "bg-green-600", label: "68 bpm" },
  { color: "bg-yellow-600", label: "72 bpm" },
  { color: "bg-yellow-600", label: "78 bpm" },
  { color: "bg-yellow-600", label: "82 bpm" },
  { color: "bg-orange-600", label: "95 bpm" },
  { color: "bg-red-600", label: "110 bpm" },
  { color: "bg-red-600", label: "125 bpm" },
  { color: "bg-red-600", label: "118 bpm" },
  { color: "bg-orange-600", label: "98 bpm" },
  { color: "bg-yellow-600", label: "85 bpm" },
  { color: "bg-yellow-600", label: "80 bpm" },
  { color: "bg-yellow-600", label: "75 bpm" },
  { color: "bg-green-600", label: "68 bpm" },
  { color: "bg-green-600", label: "64 bpm" },
  { color: "bg-green-600", label: "60 bpm" },
];
