import { describe, it, expect } from "vitest";
import { buildLiveResponse } from "@/models/live";

describe("live model", () => {
  describe("buildLiveResponse", () => {
    it("returns status ok with the given version", () => {
      const result = buildLiveResponse("1.2.3");
      expect(result).toEqual({ status: "ok", version: "1.2.3" });
    });

    it("always sets status to ok", () => {
      const result = buildLiveResponse("0.0.1");
      expect(result.status).toBe("ok");
    });

    it("preserves the exact version string", () => {
      const result = buildLiveResponse("2.0.0-beta.1");
      expect(result.version).toBe("2.0.0-beta.1");
    });

    it("uses the injected __APP_VERSION__ value", () => {
      const result = buildLiveResponse(__APP_VERSION__);
      expect(result.version).toBe(__APP_VERSION__);
      expect(result.status).toBe("ok");
    });
  });
});
