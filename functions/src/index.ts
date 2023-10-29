import { initializeApp } from "firebase-admin/app";
import { handleTransaction } from "./handle-transaction.js";
import { sendPushNotification } from "./send-push-notification.js";

initializeApp();

export { handleTransaction, sendPushNotification };
