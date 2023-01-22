import dayjs from "dayjs";
import { FastifyInstance } from "fastify";
import { prisma } from "./lib/prisma";
import { createResponseError } from "./utils/response.error";
import {
  createHabitBodySchema,
  getDayParamasSchema,
  toggleHabitParamsSchema,
} from "./utils/schemas";

export async function appRoutes(app: FastifyInstance) {
  app.post("/habits", async (request, ctx) => {
    try {
      const { title, weekDays } = createHabitBodySchema.parse(request.body);

      const today = dayjs().startOf("day").toDate();

      const habit = await prisma.habit.create({
        data: {
          title,
          created_at: today,
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

      return ctx.send({
        habits: completedHabits,
      });
    } catch (error) {
      return createResponseError(error, ctx);
    }
  });

  app.patch("/habits/:id/toggle", async (request, ctx) => {
    try {
      const { id } = toggleHabitParamsSchema.parse(request.params);
      const { date } = getDayParamasSchema.parse(request.body);

      const parsedDate = dayjs(date).startOf("day").toDate();

      let day = await prisma.day.findUnique({
        where: {
          date: parsedDate,
        },
      });

      if (!day) {
        day = await prisma.day.create({
          data: {
            date: parsedDate,
          },
        });
      }

      const dayHabit = await prisma.dayHabit.findUnique({
        where: {
          day_id_habit_id: {
            day_id: day.id,
            habit_id: id,
          },
        },
      });

      if (dayHabit) {
        await prisma.dayHabit.delete({
          where: {
            id: dayHabit.id,
          },
        });
      } else {
        await prisma.dayHabit.create({
          data: {
            day_id: day.id,
            habit_id: id,
          },
        });
      }

      return ctx.status(204).send();
    } catch (error) {
      return createResponseError(error, ctx);
    }
  });

  app.get("/summary", async (request, ctx) => {
    try {
      const summary = await prisma.$queryRaw`
      SELECT 
        D.id, 
        D.date,
        (
          SELECT 
            cast(count(*) as float)
          FROM day_habits DH
          WHERE DH.day_id = D.id
        ) as completed,
        (
          SELECT
            cast(count(*) as float)
          FROM habit_week_days HDW
          JOIN habits H
            ON H.id = HDW.habit_id
          WHERE
            HDW.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
            AND H.created_at <= D.date
        ) as amount
      FROM days D
    `;

      return summary;
    } catch (error) {
      return createResponseError(error, ctx);
    }
  });
}
