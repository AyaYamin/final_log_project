import { FastifyInstance } from "fastify";
import { isReady } from "../../plugins/health.js";

export async function healthRoutes(app: FastifyInstance) {
    app.get("/health", async (_, reply) => {
        if (!isReady()) {
            return reply.status(503).send({
                status: "starting",
            });
        }

        return reply.send({
            status: "ok",
        });
    });
}