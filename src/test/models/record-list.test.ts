import { describe, it, expect } from "vitest";
import { classifyStatus } from "@/models/record-list";

describe("record-list model", () => {
  it("classifies Completed as success", () => {
    expect(classifyStatus("Completed")).toBe("success");
  });

  it("classifies Pending as warning", () => {
    expect(classifyStatus("Pending")).toBe("warning");
  });
});
