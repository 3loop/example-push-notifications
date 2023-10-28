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
