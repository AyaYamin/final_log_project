import { LogsService } from "../modules/logs/service.js";


export function startRetentionWorker(
    logService: LogsService
) {

    const days =
        Number(
            process.env.LOG_RETENTION_DAYS ?? 30
        );


    const interval =
        Number(
            process.env.RETENTION_INTERVAL ?? 3600000
        );


    async function cleanup() {

        try {

            const deleted =
                await logService.deleteExpiredLogs(
                    days
                );


            console.log(
                `[Retention] deleted ${deleted} logs`
            );


        } catch(error) {

            console.error(
                "[Retention] error",
                error
            );

        }
    }


    cleanup();


    setInterval(
        cleanup,
        interval
    );
}