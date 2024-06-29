import { onRequest } from "firebase-functions/v2/https";
import { AlchemyWebhookEvent, PushNotification } from "./models.js";
import { interpretTransaction } from "./interpreter/index.js";
import * as logger from "firebase-functions/logger";
import { getFunctions } from "firebase-admin/functions";

// TODO: Should verify that the request is coming from Alchemy
export const handleTransaction = onRequest(async (request, response) => {
  try {
    const webhookEvent = request.body as AlchemyWebhookEvent;
    let hash;

    logger.log("Received webhook event", webhookEvent);

    if (webhookEvent.type === "MINED_TRANSACTION") {
      hash = webhookEvent.event.transaction.hash;
    } else if (webhookEvent.type === "ADDRESS_ACTIVITY") {
      hash = webhookEvent.event.activity[0].hash;
    }

    if (hash == null) {
      logger.log("Received non-transaction webhook event", webhookEvent);
      response.send("OK");
      return;
    }

    const interpreted = await interpretTransaction({
      hash: hash,
      chainID: 1, // TODO: get network from webhookEvent
    });

    if (interpreted == null) {
      logger.warn("No interpretation found for transaction", hash);
      response.send("OK");
      return;
    }

    const { address, title, body } = interpreted;
    const notification: PushNotification = {
      address,
      title,
      body,
    };

    logger.log("Publishing notification to topic", notification);

    const queue = getFunctions().taskQueue<PushNotification>(
      "sendPushNotificationTask",
    );

    await queue.enqueue(notification).catch((e) => {
      logger.error("Error while publishing message", e);
    });

    response.send("OK");
  } catch (e) {
    logger.error("Error while handling transaction", e);
    response.send("OK");
  }
});
