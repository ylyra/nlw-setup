import { z } from "zod";

export const createHabitBodySchema = z.object({
  title: z.string().min(1, "Title must be at least 1 character long"),
  weekDays: z.array(
    z
      .number()
      .min(0, "Week day must be between 0 and 6")
      .max(6, "Week day must be between 0 and 6")
  ),
});

export const getDayParamasSchema = z.object({
  date: z.coerce.date(),
});

export const toggleHabitParamsSchema = z.object({
  id: z.string().uuid(),
});

export const sendPushBody = z.object({
  subscription: z.object({
    endpoint: z.string(),
    expirationTime: z.string().nullable(),
    keys: z.object({
      p256dh: z.string(),
      auth: z.string(),
    }),
  }),
});
