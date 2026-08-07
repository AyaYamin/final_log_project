import { describe, expect, it } from "vitest";
import { parseIngestRequest } from "../validators.js";

describe("parseIngestRequest", () => {
  it("accepts a valid request", () => {
    const body = {
      logs: [
        {
          timestamp: "2026-08-07T10:00:00Z",
          level: "info",
          service: "auth",
          message: "login success",
        },
      ],
    };

    const result = parseIngestRequest(body);

    expect(result.logs).toHaveLength(1);
    expect(result.logs[0].level).toBe("info");
  });

  it("throws on invalid level", () => {
    const body = {
      logs: [
        {
          timestamp: "2026-08-07T10:00:00Z",
          level: "wrong",
          service: "auth",
          message: "test",
        },
      ],
    };

    expect(() => parseIngestRequest(body)).toThrow();
  });

  it("throws when service is missing", () => {
    const body = {
      logs: [
        {
          timestamp: "2026-08-07T10:00:00Z",
          level: "info",
          message: "test",
        },
      ],
    };

    expect(() => parseIngestRequest(body)).toThrow();
  });

  it("throws when message is empty", () => {
    const body = {
      logs: [
        {
          timestamp: "2026-08-07T10:00:00Z",
          level: "info",
          service: "auth",
          message: "",
        },
      ],
    };

    expect(() => parseIngestRequest(body)).toThrow();
  });
});