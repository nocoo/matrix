import { useTranslation } from "react-i18next";
import { AsciiBox } from "@/components/ui/AsciiBox";
import { MatrixButton } from "@/components/ui/MatrixButton";
import { BackendStatus } from "@/components/ui/VibeComponents";

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <AsciiBox title={t("pages.settings.general")}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-sm text-matrix-primary">{t("pages.settings.theme")}</p>
              <p className="font-mono text-xs text-matrix-dim">{t("pages.settings.themeDesc")}</p>
            </div>
            <span className="font-mono text-xs text-matrix-muted px-2 py-1 bg-matrix-primary/10">
              {t("pages.settings.dark")}
            </span>
          </div>
          <div className="border-t border-matrix-primary/10" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-sm text-matrix-primary">{t("pages.settings.language")}</p>
              <p className="font-mono text-xs text-matrix-dim">{t("pages.settings.languageDesc")}</p>
            </div>
            <span className="font-mono text-xs text-matrix-muted">{t("pages.settings.languageValue")}</span>
          </div>
          <div className="border-t border-matrix-primary/10" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-sm text-matrix-primary">{t("pages.settings.currency")}</p>
              <p className="font-mono text-xs text-matrix-dim">{t("pages.settings.currencyDesc")}</p>
            </div>
            <span className="font-mono text-xs text-matrix-muted">{t("pages.settings.currencyValue")}</span>
          </div>
        </div>
      </AsciiBox>

      <AsciiBox title={t("pages.settings.notifications")}>
        <div className="space-y-3">
          {([
            "pages.settings.emailNotifications",
            "pages.settings.pushNotifications",
            "pages.settings.weeklyDigest",
          ] as const).map((labelKey) => (
            <div key={labelKey} className="flex items-center justify-between">
              <span className="font-mono text-sm text-matrix-muted">{t(labelKey)}</span>
              <div className="flex items-center gap-1.5">
                <BackendStatus status="active" />
                <span className="font-mono text-xs text-matrix-primary">[{t("common.on")}]</span>
              </div>
            </div>
          ))}
        </div>
      </AsciiBox>

      <AsciiBox title={t("pages.settings.dangerZone")}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-sm text-red-400">{t("pages.settings.deleteAccount")}</p>
            <p className="font-mono text-xs text-matrix-dim">{t("pages.settings.deleteAccountDesc")}</p>
          </div>
          <MatrixButton size="small">
            [{t("common.delete")}]
          </MatrixButton>
        </div>
      </AsciiBox>
    </div>
  );
}
