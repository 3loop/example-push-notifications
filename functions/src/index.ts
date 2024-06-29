import { initializeApp } from "firebase-admin/app";
import { handleTransaction } from "./handle-transaction.js";
import { sendPushNotificationTask } from "./send-push-notification.js";
import { onAddressWatch } from "./handle-watch.js";

initializeApp();

export { handleTransaction, sendPushNotificationTask, onAddressWatch };
