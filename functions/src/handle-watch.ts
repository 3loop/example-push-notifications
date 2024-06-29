import {
  CONFIG_COLLECTION,
  FCM_TOKENS_COLLECTION,
  WEBHOOKS_COLLECTION,
} from "./constants.js";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { Alchemy, Network, WebhookType } from "alchemy-sdk";
import { getFirestore } from "firebase-admin/firestore";
import { Config, Webhook } from "./models.js";
import logger from "firebase-functions/logger";
import { HttpsError } from "firebase-functions/v2/https";

// URL of deployed handleTransaction function
const NETWORK = Network.ETH_MAINNET;

export const onAddressWatch = onDocumentCreated(
  `${FCM_TOKENS_COLLECTION}/{address}`,
  async (event) => {
    const address = event.params.address;
    const db = getFirestore();

    const defaultWebhook = db.collection(WEBHOOKS_COLLECTION).doc("default"); // TODO: Add support for multiple webhooks in real app
    const configDocument = db.collection(CONFIG_COLLECTION).doc("webhook");

    const [webhook, config] = await Promise.all([
      defaultWebhook.get().then((snapshot) => {
        if (!snapshot.exists) {
          return null;
        }
        const webhook = snapshot.data() as Webhook;
        return webhook;
      }),
      configDocument.get().then((snapshot) => {
        if (!snapshot.exists) {
          return null;
        }
        const config = snapshot.data() as Config;
        return config;
      }),
    ]);

    if (config == null) {
      throw new HttpsError("internal", "App webhook configuration not found");
    }

    const alchemy = new Alchemy({
      authToken: config.apiKey,
      network: NETWORK,
    });

    if (webhook) {
      // TODO: Remove address when no subscribers are left
      await alchemy.notify.updateWebhook(webhook.id, {
        addAddresses: [address],
      });
      logger.log(`Address added to webhook: ${address}`);
    } else {
      const resp = await alchemy.notify.createWebhook(
        config.webhookUrl,
        WebhookType.ADDRESS_ACTIVITY,
        {
          addresses: [address],
          network: NETWORK,
        },
      );

      await defaultWebhook.set({
        id: resp.id,
        url: config.webhookUrl,
      });

      logger.log(`Webhook created: ${resp.id}`);
    }

    logger.log(`New address added: ${address}`);
  },
);
