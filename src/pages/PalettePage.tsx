import { AsciiBox } from "@/components/ui/AsciiBox";
import { CHART_COLORS, withAlpha } from "@/lib/palette";

export default function PalettePage() {
  return (
    <div className="space-y-4">
      <AsciiBox title="MATRIX THEME COLORS">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: "primary", value: "#00FF41" },
            { name: "bright", value: "#33FF66" },
            { name: "muted", value: "#00CC33" },
            { name: "dim", value: "#006622" },
            { name: "ghost", value: "#003311" },
            { name: "bg", value: "#050505" },
            { name: "panel", value: "rgba(0,10,0,0.7)" },
            { name: "panel-strong", value: "rgba(0,15,0,0.85)" },
          ].map((color) => (
            <div key={color.name} className="space-y-1">
              <div
                className="h-10 rounded border border-matrix-primary/20"
                style={{ backgroundColor: color.value }}
              />
              <p className="font-mono text-[10px] text-matrix-dim">{color.name}</p>
              <p className="font-mono text-[10px] text-matrix-muted">{color.value}</p>
            </div>
          ))}
        </div>
      </AsciiBox>

      <AsciiBox title="CHART PALETTE (24 COLORS)">
        <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
          {CHART_COLORS.map((color, i) => (
            <div key={i} className="text-center">
              <div
                className="h-8 w-full rounded border border-matrix-primary/10"
                style={{ backgroundColor: color }}
              />
              <p className="font-mono text-[8px] text-matrix-dim mt-0.5">{i + 1}</p>
            </div>
          ))}
        </div>
      </AsciiBox>

      <AsciiBox title="ALPHA VARIATIONS">
        <div className="flex gap-2">
          {[0.1, 0.2, 0.4, 0.6, 0.8, 1.0].map((alpha) => (
            <div key={alpha} className="flex-1 text-center">
              <div
                className="h-10 rounded"
                style={{ backgroundColor: withAlpha("#00FF41", alpha) }}
              />
              <p className="font-mono text-[10px] text-matrix-dim mt-1">{alpha}</p>
            </div>
          ))}
        </div>
      </AsciiBox>
    </div>
  );
}
