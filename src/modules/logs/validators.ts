import { z } from "zod";

import { LogQuery } from "./types.js";
import { decodeCursor } from "./cursor.js";
import { CursorError } from "./cursor.js";

const schema = z.object({
  service: z.string().optional(),

  level: z
    .enum([
      "debug",
      "info",
      "warn",
      "error",
    ])
    .optional(),

  since: z.string().datetime().optional(),

  until: z.string().datetime().optional(),

  q: z.string().optional(),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(1000)
    .default(100),

  cursor: z.string().optional(),
});

export function parseLogQuery(
  raw: unknown
): LogQuery {
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0].message
    );
  }

  const data = parsed.data;

  if (data.cursor) {
  try {
    decodeCursor(data.cursor);
  } catch (err) {
    if (err instanceof CursorError) {
      throw new Error("invalid cursor");
    }
    throw err;
  }
}

  const attributes: Record<
    string,
    string | number | boolean
  > = {};

  if (
    raw &&
    typeof raw === "object"
  ) {
    for (const [key, value] of Object.entries(
      raw as Record<string, unknown>
    )) {
      if (
        key.startsWith("attr.") &&
        value !== undefined
      ) {
        attributes[key.substring(5)] =
           value as string | number | boolean;
      }
    }
  }

  const since = data.since
    ? new Date(data.since)
    : undefined;

  const until = data.until
    ? new Date(data.until)
    : undefined;

  if (
    since &&
    until &&
    until <= since
  ) {
    throw new Error(
      "until must be after since"
    );
  }

  return {
    service: data.service,
    level: data.level,
    since,
    until,
    q: data.q,
    limit: data.limit,
    cursor: data.cursor,
    attributes,
  };
}


const logSchema = z.object({
  timestamp: z.coerce.date(),

  level: z.enum([
    "debug",
    "info",
    "warn",
    "error",
  ]),

  service: z.string().min(1),

  message: z.string().min(1),

attributes: z
  .record(
    z.string(),
    z.union([
      z.string(),
      z.number(),
      z.boolean(),
    ])
  )
  .nullable()
  .optional()
  .default(null),
});

const ingestSchema = z.object({
  logs: z
  .array(logSchema)
  .max(1000, "Maximum 1000 logs per request")
});

export type IngestRequest = z.infer<
  typeof ingestSchema
>;

export function parseIngestRequest(
  raw: unknown
): IngestRequest {
  const parsed =
    ingestSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0].message
    );
  }

  return parsed.data;
}