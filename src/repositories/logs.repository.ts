import { db } from "../db/index.js";

import {
    logs,
} from "../db/schema.js";

import {
    LogInsert,
} from "../modules/logs/log.js";

export class LogsRepository {

    async insertMany(
        rows: LogInsert[]
    ) {

        if (
            rows.length === 0
        ) {
            return;
        }
await db.transaction(
    async (tx) => {

        await tx
            .insert(logs)
            .values(rows);

    }
);
    }
}