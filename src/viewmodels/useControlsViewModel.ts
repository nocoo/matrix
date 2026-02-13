// ============================================
// ViewModel for all Controls showcase pages.
// Composes model data with local UI state.
// ============================================

import { useMemo, useState, useCallback } from "react";
import {
  createMockInvoices,
  createMockTransfers,
  createSolidPills,
  createSoftPills,
  createOutlinePills,
  createGradientPills,
  createMockPeople,
  createMockKpis,
  createMockTimeline,
  createMockKeyValues,
  createStepperSteps,
} from "@/models/controls";

export function useControlsViewModel() {
  // ── UI state ─────────────────────────────────
  const [sliderValue, setSliderValue] = useState(40);
  const [sliderValue2, setSliderValue2] = useState(70);
  const [switchA, setSwitchA] = useState(true);
  const [switchB, setSwitchB] = useState(false);
  const [checkbox, setCheckbox] = useState(false);
  const [selectValue, setSelectValue] = useState("standard");
  const [radioValue, setRadioValue] = useState("monthly");
  const [activeTab, setActiveTab] = useState("summary");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [accordionOpen, setAccordionOpen] = useState<string | null>("billing");
  const [toggleBold, setToggleBold] = useState(false);
  const [toggleItalic, setToggleItalic] = useState(false);
  const [toggleAlign, setToggleAlign] = useState("left");
  const [progress1] = useState(35);
  const [progress2] = useState(62);

  // ── Overlay state ────────────────────────────
  const [sheetOpen, setSheetOpen] = useState<"left" | "right" | "top" | "bottom" | null>(null);
  const [compactDialogOpen, setCompactDialogOpen] = useState(false);
  const [scrollDialogOpen, setScrollDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const [profilePopoverOpen, setProfilePopoverOpen] = useState(false);
  const [settingsPopoverOpen, setSettingsPopoverOpen] = useState(false);
  const [collapsible1, setCollapsible1] = useState(false);
  const [collapsible2, setCollapsible2] = useState(false);

  // ── Feedback state ───────────────────────────
  const [toastMessage, setToastMessage] = useState<{ tone: "success" | "error" | "warning" | "info"; text: string } | null>(null);

  // ── Navigation state ─────────────────────────
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(5);
  const [stepperIndex, setStepperIndex] = useState(2);
  const [navTab, setNavTab] = useState("overview");
  const [navPill, setNavPill] = useState("day");
  const [navUnderline, setNavUnderline] = useState("all");

  // ── Data (deterministic mocks) ───────────────
  const invoices = useMemo(() => createMockInvoices(), []);
  const transfers = useMemo(() => createMockTransfers(), []);
  const solidPills = useMemo(() => createSolidPills(), []);
  const softPills = useMemo(() => createSoftPills(), []);
  const outlinePills = useMemo(() => createOutlinePills(), []);
  const gradientPills = useMemo(() => createGradientPills(), []);
  const people = useMemo(() => createMockPeople(), []);
  const kpis = useMemo(() => createMockKpis(), []);
  const timeline = useMemo(() => createMockTimeline(), []);
  const keyValues = useMemo(() => createMockKeyValues(), []);
  const stepperSteps = useMemo(() => createStepperSteps(), []);

  // ── Actions ──────────────────────────────────
  const fireToast = useCallback((tone: "success" | "error" | "warning" | "info", text: string) => {
    setToastMessage({ tone, text });
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setContextMenuOpen(true);
  }, []);

  const stepperNext = useCallback(() => {
    setStepperIndex((i) => Math.min(i + 1, 4));
  }, []);

  const stepperPrev = useCallback(() => {
    setStepperIndex((i) => Math.max(i - 1, 0));
  }, []);

  const stepperReset = useCallback(() => {
    setStepperIndex(0);
  }, []);

  return {
    // Controls page state
    sliderValue, setSliderValue,
    sliderValue2, setSliderValue2,
    switchA, setSwitchA,
    switchB, setSwitchB,
    checkbox, setCheckbox,
    selectValue, setSelectValue,
    radioValue, setRadioValue,
    activeTab, setActiveTab,
    dialogOpen, setDialogOpen,
    alertDialogOpen, setAlertDialogOpen,
    commandOpen, setCommandOpen,
    dropdownOpen, setDropdownOpen,
    popoverOpen, setPopoverOpen,
    contextMenuOpen, setContextMenuOpen,
    contextMenuPos, handleContextMenu,
    accordionOpen, setAccordionOpen,
    toggleBold, setToggleBold,
    toggleItalic, setToggleItalic,
    toggleAlign, setToggleAlign,
    progress1, progress2,

    // Overlay state
    sheetOpen, setSheetOpen,
    compactDialogOpen, setCompactDialogOpen,
    scrollDialogOpen, setScrollDialogOpen,
    deleteDialogOpen, setDeleteDialogOpen,
    discardDialogOpen, setDiscardDialogOpen,
    filterPopoverOpen, setFilterPopoverOpen,
    profilePopoverOpen, setProfilePopoverOpen,
    settingsPopoverOpen, setSettingsPopoverOpen,
    collapsible1, setCollapsible1,
    collapsible2, setCollapsible2,

    // Feedback
    toastMessage, fireToast,

    // Navigation
    page1, setPage1,
    page2, setPage2,
    stepperIndex, stepperNext, stepperPrev, stepperReset,
    navTab, setNavTab,
    navPill, setNavPill,
    navUnderline, setNavUnderline,

    // Data
    invoices, transfers,
    solidPills, softPills, outlinePills, gradientPills,
    people, kpis, timeline, keyValues, stepperSteps,
  };
}
