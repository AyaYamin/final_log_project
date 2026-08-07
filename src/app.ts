import Fastify from "fastify";

import compress from "@fastify/compress";

import { errorHandler } from "./middleware/error.js";

import { healthRoutes } from "./modules/logs/health.js";

import { logRoutes } from "./modules/logs/routes.js";


export async function buildApp() {

    const app = Fastify({

        trustProxy: true,

        bodyLimit:
            1024 * 1024 * 5,

        logger: {

            transport:
                process.env.NODE_ENV === "development"
                    ? {
                        target: "pino-pretty",
                    }
                    : undefined,
        },
    });


    // Compression
    await app.register(
        compress,
        {
            threshold: 0,
        }
    );


    // Routes
    await healthRoutes(app);

    await logRoutes(app);


    // Global error handler
    app.setErrorHandler(
        errorHandler
    );


    // 404 handler
    app.setNotFoundHandler(
        async (
            request,
            reply
        ) => {

            return reply
                .status(404)
                .send({

                    error:
                        "Route not found",

                    path:
                        request.url,
                });
        }
    );


    return app;
}