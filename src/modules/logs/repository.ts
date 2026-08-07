import { db } from "../../db/index.js";
import { logs } from "../../db/schema.js";
import { count, sql } from "drizzle-orm";
import { LogQueryBuilder } from "./query-builder.js";
import { LogQuery } from "./types.js";
import { LogInsert } from "./types.js";
import { AggregateResult } from "./types.js";
import { lt } from "drizzle-orm";


export interface FindLogsResult {
  rows: {
    id: string;
    timestamp: Date;
    level: string;
    service: string;
    message: string;
    createdAt: Date;
  }[];
  hasMore: boolean;
}

export class LogsRepository {
  private readonly builder = new LogQueryBuilder();

async insertMany(
  logEntries: LogInsert[]
): Promise<void> {

  //console.log("insertMany start");
  if (logEntries.length === 0) {
    return;
  }


  const chunkSize = 1000;


  for (
    let i = 0;
    i < logEntries.length;
    i += chunkSize
  ) {

    const chunk =
      logEntries.slice(
        i,
        i + chunkSize
      );

    //console.log("before db insert");
    await db
      .insert(logs)
      .values(chunk);

     //console.log("after db insert");
  }
}

  async find(query: LogQuery): Promise<FindLogsResult> {
    const where = this.builder.buildWhere(query);

    const rows = await db
      .select({
        id: logs.id,
        timestamp: logs.timestamp,
        level: logs.level,
        service: logs.service,
        message: logs.message,
        createdAt: logs.createdAt,
      })
      .from(logs)
      .where(where)
      .orderBy(...this.builder.buildOrder())
      .limit(this.builder.buildLimit(query.limit));

    const hasMore = rows.length > query.limit;

    return {
      rows,
      hasMore,
    };
  }

  async aggregate(): Promise<AggregateResult> {

    // Total number of logs
    const totalResult = await db
      .select({
        total: count(),
      })
      .from(logs);

    const total =
      Number(totalResult[0]?.total ?? 0);

    // Count by level
    const levelRows = await db
      .select({
        level: logs.level,
        count: count(),
      })
      .from(logs)
      .groupBy(logs.level);

    // Count by service
    const serviceRows = await db
      .select({
        service: logs.service,
        count: count(),
      })
      .from(logs)
      .groupBy(logs.service);

    const byLevel = {
      debug: 0,
      info: 0,
      warn: 0,
      error: 0,
    };

    for (const row of levelRows) {
      byLevel[
        row.level as keyof typeof byLevel
      ] = Number(row.count);
    }

    const byService: Record<
      string,
      number
    > = {};

    for (const row of serviceRows) {
      byService[row.service] =
        Number(row.count);
    }

    return {
      total,
      byLevel,
      byService,
    };
  }

  async deleteOlderThan(date: Date): Promise<number> {

    const deleted = await db
      .delete(logs)
      .where(
        lt(
          logs.timestamp,
          date
        )
      )
      .returning({
        id: logs.id
      });

    return deleted.length;
  }
}