import { useTranslation } from "react-i18next";

export function LanguageToggle() {
	const { i18n } = useTranslation();
	const nextLang = i18n.language.startsWith("zh") ? "en" : "zh";
	const label = i18n.language.startsWith("zh") ? "中" : "EN";
	const tooltip = nextLang === "en" ? "切换为英文" : "Switch to Chinese";

	return (
		<button
			type="button"
			onClick={() => i18n.changeLanguage(nextLang)}
			className="flex h-7 items-center justify-center px-1.5 font-mono text-[10px] text-matrix-dim hover:text-matrix-primary transition-colors"
			aria-label={tooltip}
			title={tooltip}
		>
			[{label}]
		</button>
	);
}
