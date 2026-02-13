import { describe, it, expect } from "vitest";
import {
  shouldFetchGithubStars,
  shouldRunLiveSniffer,
  shouldScrambleText,
} from "@/components/ui/matrix-utils";

describe("matrix-utils", () => {
  describe("shouldFetchGithubStars", () => {
    it("returns true with no constraints", () => {
      expect(shouldFetchGithubStars({})).toBe(true);
    });

    it("returns false when screenshotCapture is true", () => {
      expect(shouldFetchGithubStars({ screenshotCapture: true })).toBe(false);
    });

    it("returns false when prefersReducedMotion is true", () => {
      expect(shouldFetchGithubStars({ prefersReducedMotion: true })).toBe(false);
    });

    it("returns false when both are true (screenshotCapture takes priority)", () => {
      expect(
        shouldFetchGithubStars({
          screenshotCapture: true,
          prefersReducedMotion: true,
        }),
      ).toBe(false);
    });
  });

  describe("shouldRunLiveSniffer", () => {
    it("returns true with no constraints", () => {
      expect(shouldRunLiveSniffer({})).toBe(true);
    });

    it("returns false when screenshotMode is true", () => {
      expect(shouldRunLiveSniffer({ screenshotMode: true })).toBe(false);
    });

    it("returns false when prefersReducedMotion is true", () => {
      expect(shouldRunLiveSniffer({ prefersReducedMotion: true })).toBe(false);
    });
  });

  describe("shouldScrambleText", () => {
    it("returns true with no constraints", () => {
      expect(shouldScrambleText({})).toBe(true);
    });

    it("returns false when screenshotMode is true", () => {
      expect(shouldScrambleText({ screenshotMode: true })).toBe(false);
    });

    it("returns true when prefersReducedMotion is true but scrambleRespectReducedMotion is false", () => {
      expect(
        shouldScrambleText({
          prefersReducedMotion: true,
          scrambleRespectReducedMotion: false,
        }),
      ).toBe(true);
    });

    it("returns false when both scrambleRespectReducedMotion and prefersReducedMotion are true", () => {
      expect(
        shouldScrambleText({
          scrambleRespectReducedMotion: true,
          prefersReducedMotion: true,
        }),
      ).toBe(false);
    });
  });
});
