import { onRequest } from "firebase-functions/v2/https";
import { PubSub } from "@google-cloud/pubsub";
import { SEND_PUSH_TOPIC } from "./constants.js";
import { PushNotification } from "./models.js";
import { interpretTransaction } from "./interpreter/index.js";
import * as logger from "firebase-functions/logger";

const pubSubClient = new PubSub();

export const handleTransaction = onRequest(async (request, response) => {
  const interpreted = await interpretTransaction({
    hash: request.body.hash,
    chainID: request.body.chainID,
  });

  if (interpreted == null) {
    logger.warn("No interpretation found for transaction", request.body.hash);
    response.send("OK");
    return;
  }

  const { address, title, body } = interpreted;
  const notification: PushNotification = {
    address,
    title,
    body,
  };

  await pubSubClient.topic(SEND_PUSH_TOPIC).publishMessage({
    json: notification,
  });

  response.send("OK");
});
