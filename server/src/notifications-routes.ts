import { FastifyInstance } from "fastify";
import WebPush from "web-push";
import { z } from "zod";
import { env } from "./env";
import { sendPushBody } from "./utils/schemas";

//console.log(WebPush.generateVAPIDKeys());

const publicKey = env.WEB_PUSH_PUBLIC_KEY;
const privateKey = env.WEB_PUSH_PRIVATE_KEY;

WebPush.setVapidDetails("http://localhost:3333", publicKey, privateKey);

export async function notificationRoutes(app: FastifyInstance) {
  app.get("/push/public_key", () => {
    return {
      publicKey,
    };
  });

  app.post("/push/register", (_, reply) => {
    console.log("register");

    return reply.status(201).send({
      message: "Registered",
    });
  });

  app.post("/push/send", async (req, reply) => {
    try {
      const { subscription } = sendPushBody.parse(req.body);

      await WebPush.sendNotification(subscription, "Hello world");

      return reply.status(201).send({
        message: "Sent",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          message: "Invalid body",
          errors: error.errors,
        });
      }
    }
  });
}
