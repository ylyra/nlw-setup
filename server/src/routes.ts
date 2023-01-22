import dayjs from "dayjs";
import { FastifyInstance } from "fastify";
import { prisma } from "./lib/prisma";
import { createResponseError } from "./utils/response.error";
import { createHabitBodySchema, getDayParamasSchema } from "./utils/schemas";

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
      return createResponseError(error, ctx);
    }
  });

  app.get("/habits/day", async (request, ctx) => {
    try {
      const { date } = getDayParamasSchema.parse(request.query);

      const parsedDate = dayjs(date).startOf("day");
      const weekDay = parsedDate.day();

      const possibleHabits = await prisma.habit.findMany({
        where: {
          created_at: {
            lte: date,
          },
          weekDays: {
            some: {
              week_day: weekDay,
            },
          },
        },
      });

      const day = await prisma.day.findUnique({
        where: {
          date: parsedDate.toDate(),
        },
        include: {
          dayHabits: true,
        },
      });

      const completedHabits = possibleHabits.map((habit) => ({
        ...habit,
        completed:
          day?.dayHabits.some((dayHabit) => dayHabit.habit_id === habit.id) ??
          false,
      }));

      return ctx.send(completedHabits);
    } catch (error) {
      return createResponseError(error, ctx);
    }
  });
}
