import { useState } from "react";
import { AsciiBox } from "@/components/ui/AsciiBox";
import { MatrixInput } from "@/components/ui/MatrixExtras";
import { useHelpViewModel } from "@/viewmodels/useHelpViewModel";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { resources, filteredFAQs, totalFAQs } = useHelpViewModel(searchQuery);

  return (
    <div className="space-y-4">
      {/* Search */}
      <AsciiBox title="SEARCH">
        <MatrixInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="search help topics..."
        />
        <p className="font-mono text-[10px] text-matrix-dim mt-1">
          showing {filteredFAQs.length} of {totalFAQs} entries
        </p>
      </AsciiBox>

      {/* Resources */}
      <AsciiBox title="RESOURCES">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {resources.map((res) => (
            <div
              key={res.title}
              className="border border-matrix-primary/15 rounded p-3 hover:border-matrix-primary/30 transition-colors"
            >
              <p className="font-mono text-xs text-matrix-dim mb-1">[{res.icon}]</p>
              <p className="font-mono text-sm text-matrix-primary">{res.title}</p>
              <p className="font-mono text-xs text-matrix-muted mt-1">{res.desc}</p>
            </div>
          ))}
        </div>
      </AsciiBox>

      {/* FAQs */}
      <AsciiBox title="FREQUENTLY ASKED QUESTIONS">
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
              no matching results
            </p>
          )}
        </div>
      </AsciiBox>
    </div>
  );
}
