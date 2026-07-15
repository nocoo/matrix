import { BrowserRouter, Route, Routes } from "react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import AccountsPage from "@/pages/AccountsPage";
import CardShowcasePage from "@/pages/CardShowcasePage";
import ComponentShowcasePage from "@/pages/ComponentShowcasePage";
import ButtonsPage from "@/pages/controls/ButtonsPage";
import ControlsPage from "@/pages/controls/ControlsPage";
import DataDisplayPage from "@/pages/controls/DataDisplayPage";
import FeedbackPage from "@/pages/controls/FeedbackPage";
import FormsPage from "@/pages/controls/FormsPage";
import NavigationPage from "@/pages/controls/NavigationPage";
import OverlaysPage from "@/pages/controls/OverlaysPage";
import PillsPage from "@/pages/controls/PillsPage";
import TablesPage from "@/pages/controls/TablesPage";
import DashboardPage from "@/pages/DashboardPage";
import FlowComparisonPage from "@/pages/FlowComparisonPage";
import HelpPage from "@/pages/HelpPage";
import InteractionShowcasePage from "@/pages/InteractionShowcasePage";
import LifeAiPage from "@/pages/LifeAiPage";
import LoadingPage from "@/pages/LoadingPage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";
import PalettePage from "@/pages/PalettePage";
import PortfolioPage from "@/pages/PortfolioPage";
import ProgressTrackingPage from "@/pages/ProgressTrackingPage";
import RecordListPage from "@/pages/RecordListPage";
import SettingsPage from "@/pages/SettingsPage";
import StaticPage from "@/pages/StaticPage";
import StatsOverviewPage from "@/pages/StatsOverviewPage";

const App = () => (
	<BrowserRouter>
		<Routes>
			{/* Layout route: sidebar + header wraps all dashboard pages */}
			<Route element={<DashboardLayout />}>
				<Route path="/" element={<DashboardPage />} />
				<Route path="/accounts" element={<AccountsPage />} />
				<Route path="/card-showcase" element={<CardShowcasePage />} />
				<Route path="/records" element={<RecordListPage />} />
				<Route path="/progress-tracking" element={<ProgressTrackingPage />} />

				<Route path="/stats" element={<StatsOverviewPage />} />
				<Route path="/flow-comparison" element={<FlowComparisonPage />} />
				<Route path="/portfolio" element={<PortfolioPage />} />
				<Route path="/help" element={<HelpPage />} />
				<Route path="/settings" element={<SettingsPage />} />
				<Route path="/palette" element={<PalettePage />} />
				<Route path="/interactions" element={<InteractionShowcasePage />} />
				<Route path="/life-ai" element={<LifeAiPage />} />
				<Route path="/component-showcase" element={<ComponentShowcasePage />} />
				<Route path="/controls" element={<ControlsPage />} />
				<Route path="/buttons" element={<ButtonsPage />} />
				<Route path="/feedback" element={<FeedbackPage />} />
				<Route path="/overlays" element={<OverlaysPage />} />
				<Route path="/data-display" element={<DataDisplayPage />} />
				<Route path="/navigation" element={<NavigationPage />} />
				<Route path="/forms" element={<FormsPage />} />
				<Route path="/tables" element={<TablesPage />} />
				<Route path="/pills" element={<PillsPage />} />
			</Route>
			{/* Standalone pages (no sidebar) */}
			<Route path="/login" element={<LoginPage />} />
			<Route path="/static-page" element={<StaticPage />} />
			<Route path="/loading" element={<LoadingPage />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	</BrowserRouter>
);

export default App;
