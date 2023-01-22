import dayjs from "dayjs";
import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { prisma } from "./lib/prisma";
import { createHabitBodySchema } from "./utils/schemas";

export async function appRoutes(app: FastifyInstance) {
  app.post("/habits", async (request, ctx) => {
    try {
      const { title, weekDays } = createHabitBodySchema.parse(request.body);

      const habit = await prisma.habit.create({
        data: {
          title,
          created_at: dayjs().startOf("day").toDate(),
          weekDays: {
            create: weekDays.map((weekDay) => ({ week_day: weekDay })),
          },
        },
      });

      return ctx.status(201).send(habit);
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          statusCode: 400,
          message: "Zod errors",
          errors: error.errors,
        };
      }

      return {
        statusCode: 500,
        message: "Internal server error",
        errors: [error],
      };
    }
  });
}
