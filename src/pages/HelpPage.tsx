import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AsciiBox } from "@/components/ui/AsciiBox";
import { MatrixInput } from "@/components/ui/MatrixExtras";
import { useHelpViewModel } from "@/viewmodels/useHelpViewModel";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { resources, filteredFAQs, totalFAQs } = useHelpViewModel(searchQuery);
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* Search */}
      <AsciiBox title={t("pages.help.search")}>
        <MatrixInput
          label={t("common.search").replace("...", "")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("pages.help.searchPlaceholder")}
        />
        <p className="font-mono text-[10px] text-matrix-dim mt-1">
          {t("pages.help.showing", { count: filteredFAQs.length, total: totalFAQs })}
        </p>
      </AsciiBox>

      {/* Resources */}
      <AsciiBox title={t("pages.help.resources")}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {resources.map((res) => (
            <div
              key={res.title}
              className="border border-matrix-primary/15 p-3 hover:border-matrix-primary/30 transition-colors"
            >
              <p className="font-mono text-xs text-matrix-dim mb-1">[{res.icon}]</p>
              <p className="font-mono text-sm text-matrix-primary">{res.title}</p>
              <p className="font-mono text-xs text-matrix-muted mt-1">{res.desc}</p>
            </div>
          ))}
        </div>
      </AsciiBox>

      {/* FAQs */}
      <AsciiBox title={t("pages.help.faq")}>
        <div className="space-y-3">
          {filteredFAQs.map((faq, i) => (
            <div key={i} className="border-b border-matrix-primary/10 pb-2 last:border-0 last:pb-0">
              <p className="font-mono text-sm text-matrix-primary">
                &gt; {faq.q}
              </p>
              <p className="font-mono text-xs text-matrix-muted mt-1 pl-2">
                {faq.a}
              </p>
            </div>
          ))}
          {filteredFAQs.length === 0 && (
            <p className="font-mono text-xs text-matrix-dim text-center py-4">
              {t("pages.help.noResults")}
            </p>
          )}
        </div>
      </AsciiBox>
    </div>
  );
}
