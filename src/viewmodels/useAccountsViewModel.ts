// ViewModel for the Accounts page.
// Composes model logic with data source — View consumes this hook only.

import { useMemo } from "react";
import { accounts, walletActivity } from "@/data/mock";
import { classifyDirection, formatSignedAmount, computeActivitySummary } from "@/models/accounts";

export interface AccountItem {
  name: string;
  balance: number;
  change: string;
}

export interface ActivityRow {
  desc: string;
  amount: number;
  date: string;
  direction: "positive" | "negative";
  formattedAmount: string;
}

export function useAccountsViewModel() {
  const accountList: AccountItem[] = useMemo(
    () => accounts.map((a) => ({ name: a.name, balance: a.balance, change: a.change })),
    [],
  );

  const activityList: ActivityRow[] = useMemo(
    () =>
      walletActivity.map((item) => ({
        ...item,
        direction: classifyDirection(item.amount),
        formattedAmount: formatSignedAmount(item.amount),
      })),
    [],
  );

  const activitySummary = useMemo(() => computeActivitySummary(walletActivity), []);

  return { accountList, activityList, activitySummary };
}
