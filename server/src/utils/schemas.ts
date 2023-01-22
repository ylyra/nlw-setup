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
