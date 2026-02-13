import { AsciiBox } from "@/components/ui/AsciiBox";
import { MatrixButton } from "@/components/ui/MatrixButton";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <AsciiBox title="GENERAL">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-sm text-matrix-primary">Theme</p>
              <p className="font-mono text-xs text-matrix-dim">Matrix terminal (always dark)</p>
            </div>
            <span className="font-mono text-xs text-matrix-muted px-2 py-1 rounded bg-matrix-primary/10">
              DARK
            </span>
          </div>
          <div className="border-t border-matrix-primary/10" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-sm text-matrix-primary">Language</p>
              <p className="font-mono text-xs text-matrix-dim">Interface language</p>
            </div>
            <span className="font-mono text-xs text-matrix-muted">English</span>
          </div>
          <div className="border-t border-matrix-primary/10" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-sm text-matrix-primary">Currency</p>
              <p className="font-mono text-xs text-matrix-dim">Display currency</p>
            </div>
            <span className="font-mono text-xs text-matrix-muted">USD</span>
          </div>
        </div>
      </AsciiBox>

      <AsciiBox title="NOTIFICATIONS">
        <div className="space-y-3">
          {["Email notifications", "Push notifications", "Weekly digest"].map((label) => (
            <div key={label} className="flex items-center justify-between">
              <span className="font-mono text-sm text-matrix-muted">{label}</span>
              <span className="font-mono text-xs text-matrix-primary">[ON]</span>
            </div>
          ))}
        </div>
      </AsciiBox>

      <AsciiBox title="DANGER ZONE">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-sm text-red-400">Delete Account</p>
            <p className="font-mono text-xs text-matrix-dim">Permanently remove all data</p>
          </div>
          <MatrixButton size="sm" variant="ghost">
            [DELETE]
          </MatrixButton>
        </div>
      </AsciiBox>
    </div>
  );
}
