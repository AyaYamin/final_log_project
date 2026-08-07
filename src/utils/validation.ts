import {
    ValidationResult,
    LogInsert,
} from "../modules/logs/log.js";

import {
    logSchema,
} from "../modules/logs/logs.validator.js";

export function validateLogs(
    logs: unknown[]
): ValidationResult {

    const accepted: LogInsert[] = [];

    const rejected: ValidationResult["rejected"] = [];

    const maxFuture =
        Date.now() +
        5 * 60 * 1000;

    logs.forEach((item, index) => {

        const result =
            logSchema.safeParse(item);

        if (!result.success) {

            rejected.push({

                index,

                reason:
                    result.error.issues[0].message,
            });

            return;
        }

        const log = result.data;

        const date = new Date(
            log.timestamp
        );

        if (
            date.getTime() >
            maxFuture
        ) {

            rejected.push({

                index,

                reason:
                    "timestamp is more than five minutes in the future",
            });

            return;
        }

        accepted.push({

            timestamp: date,

            level: log.level,

            service: log.service,

            message: log.message,

            attributes: log.attributes,
        });
    });

    return {

        accepted,

        rejected,
    };
}