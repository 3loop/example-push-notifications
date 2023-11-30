import { FCM_TOKENS_COLLECTION, WEBHOOKS_COLLECTION } from "./constants.js";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { Alchemy, Network, WebhookType } from "alchemy-sdk";
import { getFirestore } from "firebase-admin/firestore";
import { Webhook } from "./models.js";
import logger from "firebase-functions/logger";

const AUTH_TOKEN = "";
// URL of deployed handleTransaction function
const WEBHOOK_URL = "";
const NETWORK = Network.ETH_MAINNET;

const settings = {
  authToken: AUTH_TOKEN,
  network: NETWORK,
};

const alchemy = new Alchemy(settings);

export const onAddressWatch = onDocumentCreated(
  `${FCM_TOKENS_COLLECTION}/{address}`,
  async (event) => {
    const address = event.params.address;
    const db = getFirestore();

    const defaultWebhook = db.collection(WEBHOOKS_COLLECTION).doc("default"); // TODO: Add support for multiple webhooks in real app

    const webhook = await defaultWebhook.get().then((snapshot) => {
      if (!snapshot.exists) {
        return null;
      }
      const webhook = snapshot.data() as Webhook;
      return webhook;
    });

    if (webhook) {
      // TODO: Remove address when no subscribers are left
      await alchemy.notify.updateWebhook(webhook.id, {
        addAddresses: [address],
      });
      logger.log(`Address added to webhook: ${address}`);
    } else {
      const resp = await alchemy.notify.createWebhook(
        WEBHOOK_URL,
        WebhookType.ADDRESS_ACTIVITY,
        {
          addresses: [address],
          network: NETWORK,
        },
      );

      await defaultWebhook.set({
        id: resp.id,
        url: WEBHOOK_URL,
      });

      logger.log(`Webhook created: ${resp.id}`);
    }

    logger.log(`New address added: ${address}`);
  },
);
