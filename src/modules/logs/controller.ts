import { FastifyReply, FastifyRequest } from "fastify";

import { LogsService } from "./service.js";
import { parseLogQuery } from "./validators.js";

//const service = new LogsService();
export const service = new LogsService();

export class LogsController {

  /*
  async aggregate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const result =
      await service.aggregate();

    return reply
      .status(200)
      .send(result);

  } catch (error) {
    return reply.status(500).send({
      error:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    });
  }
}*/

  // POST /logs
 async ingest(
  request: FastifyRequest,
  reply: FastifyReply
) {

    const body = request.body;

    const result =
        await service.ingest(body);


    return reply
        .status(201)
        .send(result);
}

/*

  // GET /logs
  async find(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const query = parseLogQuery(request.query);

      const result = await service.find(query);

      return reply.status(200).send(result);

    } catch (error) {
      return reply.status(400).send({
        error:
          error instanceof Error
            ? error.message
            : "Bad Request",
      });
    }
  }*/

    async find(
  request: FastifyRequest,
  reply: FastifyReply
) {

    const query =
        parseLogQuery(request.query);


    const result =
        await service.find(query);


    return reply
        .status(200)
        .send(result);
}

async aggregate(
  request: FastifyRequest,
  reply: FastifyReply
) {

    const result =
        await service.aggregate();


    return reply
        .status(200)
        .send(result);
}
}