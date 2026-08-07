import { LogsRepository } from "./repository.js";

import { encodeCursor } from "./cursor.js";

import {
  LogInsert,
  LogQuery,
} from "./types.js";

import {
  parseIngestRequest,
} from "./validators.js";

export class LogsService {
  constructor(
    private readonly repository =
      new LogsRepository()
  ) {}

  async ingest(
    body: unknown
  ) {
    const request =
      parseIngestRequest(body);

    const rows: LogInsert[] =
      request.logs.map((log) => ({
        timestamp: log.timestamp,
        level: log.level,
        service: log.service,
        message: log.message,
        attributes: log.attributes ?? null,
      }));

    await this.repository.insertMany(rows);

    return {
      accepted: rows.length,
      rejected: [],
    };
  }

  async find(
    query: LogQuery
  ) {
    const {
      rows,
      hasMore,
    } =
      await this.repository.find(query);

    const logs =
      hasMore
        ? rows.slice(0, query.limit)
        : rows;

    let nextCursor: string | null = null;

    if (hasMore && logs.length > 0) {
      const last =
        logs[logs.length - 1];

      nextCursor =
        encodeCursor({
          timestamp:
            last.timestamp.toISOString(),
          id: last.id,
        });
    }

    return {
      logs,
      next_cursor: nextCursor,
    };
  }

  async deleteExpiredLogs(days: number) {

    const expirationDate = new Date();

    expirationDate.setDate(
        expirationDate.getDate() - days
    );


    return this.repository.deleteOlderThan(
        expirationDate
    );
}

  async aggregate() {
  const result = await this.repository.aggregate();

  return {
    total: result.total,
    byLevel: result.byLevel,
    byService: result.byService,
  };
}
}