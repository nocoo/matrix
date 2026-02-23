import { useTranslation } from "react-i18next";
import { AsciiBox } from "@/components/ui/AsciiBox";
import { DecodingText } from "@/components/ui/MatrixExtras";
import { MatrixButton } from "@/components/ui/MatrixButton";

export default function StaticPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[var(--matrix-bg)] p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <AsciiBox title={t("pages.static.termsOfService")}>
          <div className="space-y-4 font-mono text-xs text-matrix-muted leading-relaxed">
            <p>
              <DecodingText
                text="> last updated: 2026-02-13"
                className="text-matrix-dim"
              />
            </p>
            <p>
              By accessing and using the Matrix Dashboard System, you agree to be bound by these
              terms and conditions. The system is provided &quot;as is&quot; without warranty of any kind.
            </p>
            <p>
              All data displayed within the dashboard is for demonstration purposes only. No real
              financial transactions are processed through this system.
            </p>
            <p>
              Users are responsible for maintaining the security of their access credentials.
              Unauthorized access attempts will be logged and reported.
            </p>
            <p className="text-matrix-dim">
              {t("pages.static.endOfDocument")}
            </p>
          </div>
        </AsciiBox>

        <div className="text-center">
          <MatrixButton
            onClick={() => { window.location.href = "/"; }}
          >
            {t("pages.static.returnToDashboard")}
          </MatrixButton>
        </div>
      </div>
    </div>
  );
}
