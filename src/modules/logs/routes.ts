import { FastifyInstance } from "fastify";
import { LogsController } from "./controller.js";

const controller = new LogsController();

export async function logRoutes(
  app: FastifyInstance
) {
  app.post(
    "/logs",
    controller.ingest.bind(controller)
  );

  app.get(
    "/logs",
    controller.find.bind(controller)
  );


   // Part 7: Aggregation
  app.get(
    "/logs/aggregate",
    controller.aggregate.bind(controller)
  );
}