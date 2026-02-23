import { useTranslation } from "react-i18next";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const nextLang = i18n.language.startsWith("zh") ? "en" : "zh";
  const label = i18n.language.startsWith("zh") ? "中" : "EN";

  return (
    <button
      onClick={() => i18n.changeLanguage(nextLang)}
      className="flex h-7 items-center justify-center px-1.5 font-mono text-[10px] text-matrix-dim hover:text-matrix-primary transition-colors"
      aria-label={`Switch language to ${nextLang === "zh" ? "Chinese" : "English"}`}
    >
      [{label}]
    </button>
  );
}
