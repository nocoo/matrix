import { AsciiBox } from "@/components/ui/AsciiBox";
import { ConnectionStatus } from "@/components/ui";
import { useRecordListViewModel } from "@/viewmodels/useRecordListViewModel";
import { cn } from "@/lib/utils";

export default function RecordListPage() {
  const { records, totalCount } = useRecordListViewModel();

  return (
    <div className="space-y-4">
      <p className="font-mono text-xs text-matrix-dim">
        {totalCount} records found
      </p>

      <AsciiBox title="TRANSACTION LOG">
        <div className="space-y-0">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 font-mono text-[10px] uppercase text-matrix-dim border-b border-matrix-primary/15 pb-1.5 mb-1">
            <span className="col-span-4">name</span>
            <span className="col-span-2">category</span>
            <span className="col-span-2">date</span>
            <span className="col-span-2 text-right">amount</span>
            <span className="col-span-2 text-right">status</span>
          </div>

          {/* Rows */}
          {records.map((record) => (
            <div
              key={record.id}
              className="grid grid-cols-12 gap-2 font-mono text-xs py-1.5 border-b border-matrix-primary/5 last:border-0 hover:bg-matrix-primary/5 transition-colors"
            >
              <span className="col-span-4 text-matrix-muted truncate">
                {record.name}
              </span>
              <span className="col-span-2 text-matrix-dim truncate">
                {record.category}
              </span>
              <span className="col-span-2 text-matrix-dim text-[11px]">
                {record.date}
              </span>
              <span
                className={cn(
                  "col-span-2 text-right",
                  record.direction === "positive" ? "text-matrix-primary" : "text-red-400"
                )}
              >
                {record.formattedAmount}
              </span>
              <span className="col-span-2 flex items-center justify-end gap-1">
                <ConnectionStatus
                  status={record.statusVariant === "success" ? "STABLE" : "UNSTABLE"}
                />
                <span
                  className={cn(
                    "inline-block px-1.5 py-0.5 text-[10px]",
                    record.statusVariant === "success"
                      ? "bg-matrix-primary/10 text-matrix-primary"
                      : "bg-yellow-500/10 text-yellow-500"
                  )}
                >
                  {record.status}
                </span>
              </span>
            </div>
          ))}
        </div>
      </AsciiBox>
    </div>
  );
}
