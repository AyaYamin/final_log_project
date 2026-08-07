import {
    FastifyError,
    FastifyReply,
    FastifyRequest,
} from "fastify";


export function errorHandler(
    error: FastifyError | Error,
    request: FastifyRequest,
    reply: FastifyReply
) {

    request.log.error(error);


    // Fastify validation errors
    if (
        "validation" in error &&
        error.validation
    ) {

        return reply
            .status(400)
            .send({
                error: "Validation error",
                details: error.validation,
            });
    }


    // Errors with status codes
    if (
        "statusCode" in error &&
        error.statusCode
    ) {

        return reply
            .status(error.statusCode)
            .send({
                error: error.message,
            });
    }


    // Application errors
    if (
        error instanceof Error
    ) {

        return reply
            .status(400)
            .send({
                error: error.message,
            });
    }


    return reply
        .status(500)
        .send({
            error:"Internal server error",
        });
}