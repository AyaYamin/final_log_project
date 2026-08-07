import {
  and,
  desc,
  eq,
  gte,
  ilike,
  lt,
  or,
  sql,
  SQL,
} from "drizzle-orm";

import { logs } from "../../db/schema.js";
import { LogQuery } from "./types.js";
import { decodeCursor } from "./cursor.js";

export class LogQueryBuilder {
  buildWhere(query: LogQuery): SQL | undefined {
    const conditions: SQL[] = [];

    // Service filter
    if (query.service) {
      conditions.push(eq(logs.service, query.service));
    }

    // Level filter
    if (query.level) {
      conditions.push(eq(logs.level, query.level));
    }

    // Since filter
    if (query.since) {
      conditions.push(gte(logs.timestamp, query.since));
    }

    // Until filter
    if (query.until) {
      conditions.push(lt(logs.timestamp, query.until));
    }

    // Message search
    if (query.q) {
      conditions.push(
        ilike(logs.message, `%${query.q}%`)
      );
    }

    // JSONB attribute filters
    for (const [key, value] of Object.entries(query.attributes)) {
      conditions.push(
        sql`${logs.attributes} @> ${JSON.stringify({
          [key]: value,
        })}::jsonb`
      );
    }

    // Cursor filter
    if (query.cursor) {
  const cursor = decodeCursor(query.cursor);

  conditions.push(
    or(
      lt(logs.timestamp, new Date(cursor.timestamp)),
      and(
        eq(logs.timestamp, new Date(cursor.timestamp)),
        lt(logs.id, cursor.id)
      )!
    )!
  );
}

    if (conditions.length === 0) {
      return undefined;
    }

    return and(...conditions);
  }

  buildOrder() {
    return [
      desc(logs.timestamp),
      desc(logs.id),
    ];
  }

  buildLimit(limit: number) {
    return limit + 1;
  }
}