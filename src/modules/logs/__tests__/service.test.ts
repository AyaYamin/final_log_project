import { describe, expect, it, vi } from "vitest";

import { LogsService } from "../service.js";

describe("LogsService", () => {
  it("ingests valid logs", async () => {
    const repository = {
      insertMany: vi.fn().mockResolvedValue(undefined),
    };

    const service = new LogsService(
      repository as any
    );

    const result = await service.ingest({
      logs: [
        {
          timestamp: "2026-08-07T10:00:00Z",
          level: "info",
          service: "auth",
          message: "login",
        },
      ],
    });

    expect(repository.insertMany)
      .toHaveBeenCalledTimes(1);

    expect(result.accepted)
      .toBe(1);

    expect(result.rejected)
      .toEqual([]);
  });


  it("returns logs with next cursor", async () => {
  const logs = [
    {
      id: "11111111-1111-1111-1111-111111111111",
      timestamp: new Date("2026-08-07T10:00:00Z"),
      level: "info",
      service: "auth",
      message: "one",
      attributes: null,
      createdAt: new Date(),
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      timestamp: new Date("2026-08-07T09:00:00Z"),
      level: "error",
      service: "auth",
      message: "two",
      attributes: null,
      createdAt: new Date(),
    },
  ];

  const repository = {
    insertMany: vi.fn(),
    find: vi.fn().mockResolvedValue({
      rows: logs,
      hasMore: true,
    }),
  };

  const service = new LogsService(
    repository as any
  );

  const result = await service.find({
    limit: 1,
    service: undefined,
    level: undefined,
    since: undefined,
    until: undefined,
    q: undefined,
    cursor: undefined,
    attributes: {},
  });

  expect(repository.find).toHaveBeenCalledOnce();

  expect(result.logs).toHaveLength(1);

  expect(result.logs[0].message).toBe("one");

  expect(result.next_cursor).not.toBeNull();
});
});