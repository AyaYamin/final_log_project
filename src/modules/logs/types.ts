export type LogLevel =
  | "debug"
  | "info"
  | "warn"
  | "error";

export interface LogQuery {
  service?: string;

  level?: LogLevel;

  since?: Date;

  until?: Date;

  q?: string;

  limit: number;

  cursor?: string;

  attributes: Record<string,  string | number | boolean>;
}

export interface CursorPayload {
  timestamp: string;

  id: string;
}

export interface LogResponse {
  logs: unknown[];

  next_cursor: string | null;
}


export interface LogInsert {
  timestamp: Date;

  level: LogLevel;

  service: string;

  message: string;

  attributes: Record<
    string,
    string | number | boolean
  > | null;
}


export interface AggregateResult {

  total: number;

  byLevel: Record<
    LogLevel,
    number
  >;

  byService: Record<
    string,
    number
  >;

}