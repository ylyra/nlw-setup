import { env } from "./env";

import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import fastify from "fastify";

const app = fastify();
const prisma = new PrismaClient();

app.register(cors);

app.get("/", async () => {
  const habits = await prisma.habit.findMany();
  return { habits };
});

app.listen(
  {
    port: env.PORT,
  },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  }
);
