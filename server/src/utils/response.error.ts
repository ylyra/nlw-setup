import { FastifyReply } from "fastify";
import { ZodError } from "zod";

export function createResponseError(error: unknown, ctx: FastifyReply) {
  if (error instanceof ZodError) {
    return ctx.status(400).send({
      statusCode: 400,
      message: "Zod errors",
      errors: error.errors,
    });
  }

  return ctx.status(500).send({
    statusCode: 500,
    message: "Internal server error",
    errors: [error],
  });
}
