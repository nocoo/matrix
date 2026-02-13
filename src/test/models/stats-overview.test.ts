import { describe, it, expect } from "vitest";
import { classifyChange, changeToColorClass } from "@/models/stats-overview";

describe("stats-overview model", () => {
  it("classifies positive changes", () => {
    expect(classifyChange("+2.4%")).toBe("positive");
  });

  it("classifies negative changes", () => {
    expect(classifyChange("-3.2%")).toBe("negative");
  });

  it("classifies neutral changes", () => {
    expect(classifyChange("35%")).toBe("neutral");
  });

  it("maps positive to matrix-primary color", () => {
    expect(changeToColorClass("positive")).toBe("text-matrix-primary");
  });

  it("maps negative to red color", () => {
    expect(changeToColorClass("negative")).toBe("text-red-500");
  });
});
