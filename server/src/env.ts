import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import { z } from "zod";

import { TypeOf } from "zod";

const withDevDefault = <T extends z.ZodTypeAny>(schema: T, val: TypeOf<T>) =>
  process.env["NODE_ENV"] !== "production" ? schema.default(val) : schema;

const schema = z.object({
  PORT: withDevDefault(z.string(), "3333").transform(Number),
  DATABASE_URL: z.string(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(parsed.error.format(), null, 4)
  );
  process.exit(1);
}

export const env = parsed.data;
