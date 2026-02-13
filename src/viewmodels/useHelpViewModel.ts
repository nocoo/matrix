// ViewModel for the Help page.
// Composes model logic with data source — View consumes this hook only.

import { useMemo } from "react";
import { faqs } from "@/data/mock";
import { filterFAQs, faqCount } from "@/models/help";

export interface FAQItem {
  q: string;
  a: string;
}

export interface ResourceItem {
  icon: string;
  title: string;
  desc: string;
}

const resources: ResourceItem[] = [
  { icon: "book", title: "Getting Started Guide", desc: "Learn the basics of managing your finances" },
  { icon: "message-circle", title: "Contact Support", desc: "Chat with our team for help" },
  { icon: "file-text", title: "API Documentation", desc: "Integrate with third-party services" },
];

export function useHelpViewModel(searchQuery = "") {
  const allFAQs: FAQItem[] = faqs;
  const filteredFAQs = useMemo(() => filterFAQs(faqs, searchQuery), [searchQuery]);
  const totalFAQs = faqCount(faqs);

  return { resources, allFAQs, filteredFAQs, totalFAQs };
}
