import * as logger from "firebase-functions/logger";
import { getFirestore } from "firebase-admin/firestore";
import { TokenMessage, getMessaging } from "firebase-admin/messaging";
import { FCM_TOKENS_COLLECTION } from "./constants.js";
import { PushNotification, type PushToken } from "./models.js";
import { onTaskDispatched } from "firebase-functions/v2/tasks";

function getAllTokens(address: string) {
  const db = getFirestore();
  return db
    .collection(FCM_TOKENS_COLLECTION)
    .doc(address.toLowerCase())
    .collection("tokens")
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        return undefined;
      }
      return snapshot.docs.map((doc) => {
        return doc.data() as PushToken;
      });
    });
}

export const sendPushNotificationTask = onTaskDispatched<PushNotification>(
  {
    retryConfig: {
      maxAttempts: 3,
      minBackoffSeconds: 30,
    },
  },
  async (request) => {
    const { address, title, body } = request.data;

    const tokens = await getAllTokens(address);

    if (tokens == null) {
      logger.log("No tokens found for address", address);
      return;
    }

    logger.log(`Sending push notification to ${tokens.length} tokens`);

    const messages: TokenMessage[] = tokens.map((token) => {
      return {
        token: token.token,
        notification: {
          title,
          body,
        },
      };
    });

    const messaging = getMessaging();
    await messaging.sendEach(messages).then((_response) => {
      // TODO: delete all expired tokens
    });
  },
);
