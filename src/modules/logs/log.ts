export type LogLevel =
    | "debug"
    | "info"
    | "warn"
    | "error";

export type AttributeValue =
    | string
    | number
    | boolean;

export type Attributes = Record<
    string,
    AttributeValue
>;

export interface LogEntry {

    timestamp: Date;

    level: LogLevel;

    service: string;

    message: string;

    attributes?: Attributes;
}

export interface LogInsert {

    timestamp: Date;

    level: LogLevel;

    service: string;

    message: string;

    attributes?: Attributes;
}

export interface ValidationError {

    index: number;

    reason: string;
}

export interface ValidationResult {

    accepted: LogInsert[];

    rejected: ValidationError[];
}