import { describe, it, expect } from "vitest";
import { filterFAQs, faqCount } from "@/models/help";

describe("help model", () => {
  const faqs = [
    { q: "How do I add a bank account?", a: "Go to Wallet." },
    { q: "Can I export transactions?", a: "Yes, use CSV export." },
  ];

  it("returns all when query is empty", () => {
    expect(filterFAQs(faqs, "")).toHaveLength(2);
    expect(filterFAQs(faqs, "  ")).toHaveLength(2);
  });

  it("filters by question text", () => {
    expect(filterFAQs(faqs, "bank")).toHaveLength(1);
  });

  it("filters by answer text", () => {
    expect(filterFAQs(faqs, "CSV")).toHaveLength(1);
  });

  it("counts FAQs", () => {
    expect(faqCount(faqs)).toBe(2);
  });
});
