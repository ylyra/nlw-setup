import { env } from "./env";

import cors from "@fastify/cors";
import fastify from "fastify";
import { appRoutes } from "./routes";

const app = fastify();

app.register(cors);

app.register(appRoutes);

app.listen(
  {
    port: env.PORT,
    host: "0.0.0.0",
  },
  (err, address) => {
    if (err) {
      console.error(err);

      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  }
);
