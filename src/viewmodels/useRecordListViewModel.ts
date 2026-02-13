// ViewModel for the Record List page.
// Composes model logic with data source — View consumes this hook only.

import { useMemo } from "react";
import { transactions } from "@/data/mock";
import { classifyDirection, formatSignedAmount, classifyStatus } from "@/models/record-list";
import type { AmountDirection, StatusVariant } from "@/models/record-list";

export interface RecordRow {
  id: number;
  name: string;
  category: string;
  date: string;
  amount: number;
  direction: AmountDirection;
  formattedAmount: string;
  status: string;
  statusVariant: StatusVariant;
}

export function useRecordListViewModel() {
  const records: RecordRow[] = useMemo(
    () =>
      transactions.map((tx) => ({
        id: tx.id,
        name: tx.name,
        category: tx.category,
        date: tx.date,
        amount: tx.amount,
        direction: classifyDirection(tx.amount),
        formattedAmount: formatSignedAmount(tx.amount),
        status: tx.status,
        statusVariant: classifyStatus(tx.status),
      })),
    [],
  );

  return { records, totalCount: records.length };
}
