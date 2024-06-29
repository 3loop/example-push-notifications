export interface PushToken {
  token: string;
  updatedAt: number;
  platform: "ios" | "android" | "webpush";
}

export interface PushNotification {
  address: string;
  title: string;
  body: string;
}

export interface FirestoreAbi {
  abi: string;
}

export interface Interpreter {
  schema: string;
  canInterpret: string;
  id: string;
}

export interface InterpretedTransaction {
  title: string;
  body: string;
  address: string;
}

export interface Webhook {
  id: string;
  url: string;
}

export interface Config {
  apiKey: string;
  webhookUrl: string;
}

export type AlchemyWebhookType =
  | "MINED_TRANSACTION"
  | "DROPPED_TRANSACTION"
  | "ADDRESS_ACTIVITY";

export interface AlchemyWebhookEvent {
  webhookId: string;
  id: string;
  createdAt: Date;
  type: AlchemyWebhookType;
  event: Record<any, any>;
}
