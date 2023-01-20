import { env } from "./env";

import fastify from "fastify";

const app = fastify();

app.get("/", () => {
  return { hello: "world" };
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
