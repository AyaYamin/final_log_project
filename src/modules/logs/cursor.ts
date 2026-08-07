import { Buffer } from "node:buffer";

export interface CursorPayload {
  timestamp: string;
  id: string;
}

export class CursorError extends Error {
  constructor(message = "Invalid cursor") {
    super(message);
    this.name = "CursorError";
  }
}

export function encodeCursor(payload: CursorPayload): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function decodeCursor(cursor: string): CursorPayload {
  try {
    const decoded = Buffer.from(cursor, "base64url").toString("utf8");

    const parsed = JSON.parse(decoded);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof parsed.timestamp !== "string" ||
      typeof parsed.id !== "string"
    ) {
      throw new CursorError();
    }

    return parsed;
  } catch {
    throw new CursorError();
  }
}