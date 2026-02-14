import { BootScreen } from "@/components/ui/MatrixExtras";

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-[var(--matrix-bg)] flex items-center justify-center">
      <BootScreen />
    </div>
  );
}
