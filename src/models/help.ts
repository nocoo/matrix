// Pure business logic for the Help page.
// No React dependency — fully testable with plain unit tests.

import type { FAQ } from "@/models/types";

export function filterFAQs(items: FAQ[], query: string): FAQ[] {
  if (!query.trim()) return items;
  const lower = query.toLowerCase();
  return items.filter((faq) => faq.q.toLowerCase().includes(lower) || faq.a.toLowerCase().includes(lower));
}

export function faqCount(items: FAQ[]): number {
  return items.length;
}
