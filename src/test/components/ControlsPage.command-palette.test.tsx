import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The command palette effect that we're testing lives inside ControlsPage but
// runs synchronously on state change. To exercise it without instantiating the
// entire 900-line component tree we mock the viewmodel and re-render with a
// flipped `commandOpen` flag.

const mockState = vi.hoisted(() => ({
	commandOpen: false,
}));

vi.mock("@/viewmodels/useControlsViewModel", async () => {
	const { useState, useCallback, useMemo } = await import("react");
	return {
		useControlsViewModel: () => {
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
			const [dropdownOpen, setDropdownOpen] = useState(false);
			const [popoverOpen, setPopoverOpen] = useState(false);
			const [contextMenuOpen, setContextMenuOpen] = useState(false);
			const [contextMenuPos] = useState({ x: 0, y: 0 });
			const [accordionOpen, setAccordionOpen] = useState<string | null>(null);
			const [toggleBold, setToggleBold] = useState(false);
			const [toggleItalic, setToggleItalic] = useState(false);
			const [toggleAlign, setToggleAlign] = useState("left");
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
			const [toastMessage] = useState<{ tone: string; text: string } | null>(null);
			const [page1, setPage1] = useState(1);
			const [page2, setPage2] = useState(1);
			const [stepperIndex] = useState(0);
			const [navTab, setNavTab] = useState("overview");
			const [navPill, setNavPill] = useState("all");
			const [navUnderline, setNavUnderline] = useState("inbox");

			const noop = useCallback(() => {}, []);
			const empty = useMemo(() => [], []);

			return {
				sliderValue,
				setSliderValue,
				sliderValue2,
				setSliderValue2,
				switchA,
				setSwitchA,
				switchB,
				setSwitchB,
				checkbox,
				setCheckbox,
				selectValue,
				setSelectValue,
				radioValue,
				setRadioValue,
				activeTab,
				setActiveTab,
				dialogOpen,
				setDialogOpen,
				alertDialogOpen,
				setAlertDialogOpen,
				commandOpen: mockState.commandOpen,
				setCommandOpen: (v: boolean) => {
					mockState.commandOpen = v;
				},
				dropdownOpen,
				setDropdownOpen,
				popoverOpen,
				setPopoverOpen,
				contextMenuOpen,
				setContextMenuOpen,
				contextMenuPos,
				handleContextMenu: noop,
				accordionOpen,
				setAccordionOpen,
				toggleBold,
				setToggleBold,
				toggleItalic,
				setToggleItalic,
				toggleAlign,
				setToggleAlign,
				progress1: 35,
				progress2: 62,
				sheetOpen,
				setSheetOpen,
				compactDialogOpen,
				setCompactDialogOpen,
				scrollDialogOpen,
				setScrollDialogOpen,
				deleteDialogOpen,
				setDeleteDialogOpen,
				discardDialogOpen,
				setDiscardDialogOpen,
				filterPopoverOpen,
				setFilterPopoverOpen,
				profilePopoverOpen,
				setProfilePopoverOpen,
				settingsPopoverOpen,
				setSettingsPopoverOpen,
				collapsible1,
				setCollapsible1,
				collapsible2,
				setCollapsible2,
				toastMessage,
				fireToast: noop,
				page1,
				setPage1,
				page2,
				setPage2,
				stepperIndex,
				stepperNext: noop,
				stepperPrev: noop,
				stepperReset: noop,
				navTab,
				setNavTab,
				navPill,
				setNavPill,
				navUnderline,
				setNavUnderline,
				invoices: empty,
				transfers: empty,
				solidPills: empty,
				softPills: empty,
				outlinePills: empty,
				gradientPills: empty,
				people: empty,
				kpis: empty,
				timeline: empty,
				keyValues: empty,
				stepperSteps: empty,
			};
		},
	};
});

// Skip pages/DashboardLayout heaviness — we only exercise ControlsPage.
import ControlsPage from "@/pages/controls/ControlsPage";

describe("ControlsPage command palette focus", () => {
	beforeEach(() => {
		mockState.commandOpen = false;
	});

	afterEach(() => {
		mockState.commandOpen = false;
	});

	it("focuses the command palette input as soon as it opens", () => {
		const { rerender } = render(
			<MemoryRouter>
				<ControlsPage />
			</MemoryRouter>,
		);

		// Palette closed on first render — no input yet.
		expect(screen.queryByPlaceholderText("type a command...")).not.toBeInTheDocument();

		// Flip the hoisted state and re-render — the palette mounts and its
		// effect should focus the input synchronously.
		act(() => {
			mockState.commandOpen = true;
		});
		rerender(
			<MemoryRouter>
				<ControlsPage />
			</MemoryRouter>,
		);

		const input = screen.getByPlaceholderText("type a command...");
		expect(input).toHaveFocus();
	});
});
