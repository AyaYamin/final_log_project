import {
    pgTable,
    uuid,
    timestamp,
    text,
    jsonb,
    index,
} from "drizzle-orm/pg-core";

export const logs = pgTable(
    "logs",
    {
        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        timestamp: timestamp("timestamp", {
            withTimezone: true,
            mode: "date",
        }).notNull(),

        level: text("level").notNull(),

        service: text("service").notNull(),

        message: text("message").notNull(),

        attributes: jsonb("attributes").$type<
            Record<string, string | number | boolean>
        >(),

        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "date",
        })
            .defaultNow()
            .notNull(),
    },
   (table) => ({

    timestampIdx:
        index("logs_timestamp_idx")
        .on(table.timestamp),


    levelIdx:
        index("logs_level_idx")
        .on(table.level),


    serviceIdx:
        index("logs_service_idx")
        .on(table.service),


    serviceTimestampIdx:
        index("logs_service_timestamp_idx")
        .on(
            table.service,
            table.timestamp
        ),


    levelTimestampIdx:
        index("logs_level_timestamp_idx")
        .on(
            table.level,
            table.timestamp
        ),

})
);