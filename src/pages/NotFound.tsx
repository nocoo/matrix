import { useTranslation } from "react-i18next";
import { MatrixRain, ScrambleText, TypewriterText } from "@/components/ui/MatrixExtras";
import { MatrixButton } from "@/components/ui/MatrixButton";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen bg-[var(--matrix-bg)] flex items-center justify-center p-4">
      <MatrixRain />
      <div className="relative z-10 text-center">
        <ScrambleText
          text={t("pages.notFound.title")}
          className="font-mono text-6xl text-matrix-primary glow-text block mb-4"
          loop
          loopDelayMs={4000}
        />
        <TypewriterText
          text={t("pages.notFound.error")}
          className="font-mono text-sm text-matrix-muted block mb-2"
          speedMs={25}
        />
        <p className="font-mono text-xs text-matrix-dim mb-8">
          {t("pages.notFound.description")}
        </p>
        <MatrixButton
          onClick={() => { window.location.href = "/"; }}
        >
          [{t("pages.notFound.returnToBase")}]
        </MatrixButton>
      </div>
    </div>
  );
}
