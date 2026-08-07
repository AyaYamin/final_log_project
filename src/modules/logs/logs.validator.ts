import { z } from "zod";

const levels = [
    "debug",
    "info",
    "warn",
    "error",
] as const;

const attributesSchema = z
    .record(
        z.string(),
        z.union([
            z.string(),
            z.number(),
            z.boolean(),
        ])
    )
    .optional();

export const logSchema = z.object({

    timestamp: z
        .string()
        .datetime(),

    level: z.enum(levels),

    service: z
        .string()
        .min(1),

    message: z
        .string()
        .min(1),

    attributes: attributesSchema,
});

export const batchSchema = z.object({

    logs: z.array(logSchema),
});