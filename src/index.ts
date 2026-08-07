import { buildApp } from "./app.js";

import { config } from "./config/config.js";

import { checkDatabase, client } from "./db/index.js";

import { runMigrations } from "./db/migrate.js";

import { startRetentionWorker } from "./workers/retention.worker.js";

import { service } from "./modules/logs/controller.js";

import { setReady } from "./plugins/health.js";


async function bootstrap() {

    try {

        console.log("Checking database...");

        await checkDatabase();


        console.log("Database connected");


        console.log("Running migrations...");

        await runMigrations();


        console.log("Migrations completed");


        const app =
            await buildApp();


        startRetentionWorker(service);


        setReady();


        app.addHook(
            "onClose",
            async () => {

                await client.end();

            }
        );


        await app.listen({

            host:
                "0.0.0.0",

            port:
                config.port,

        });


        app.log.info(
            `Listening on ${config.port}`
        );


    } catch (err) {


        console.error(err);

        process.exit(1);

    }
}


bootstrap();