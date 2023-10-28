import { getFirestore } from "firebase-admin/firestore";
import { ADDRESS_ABI_COLLECTION, SIGNATURE_ABI_COLLECTION } from "../constants.js";
import { FirestoreAbi } from "../models.js";
import {
  EtherscanStrategyResolver,
  FourByteStrategyResolver,
} from "@3loop/transaction-decoder";

interface GetContractAbiParams {
  address: string;
  signature?: string | undefined;
  event?: string | undefined;
  chainID: number;
}

interface SetContractAbiParams {
  address?: Record<string, string>;
  func?: Record<string, string>;
  event?: Record<string, string>;
}

export const abiStore = {
  strategies: [EtherscanStrategyResolver(), FourByteStrategyResolver()],
  get: async ({ address, signature, event }: GetContractAbiParams) => {
    const db = getFirestore();
    const addressDoc = await db
      .collection(ADDRESS_ABI_COLLECTION)
      .doc(address.toLowerCase())
      .get();
    if (addressDoc.exists) {
      const data = addressDoc.data() as FirestoreAbi;
      return data.abi;
    }

    const signatureOrEvent = signature ?? event;

    if (signatureOrEvent != null) {
      const signatureDoc = await db
        .collection(SIGNATURE_ABI_COLLECTION)
        .doc(signatureOrEvent)
        .get();

      if (signatureDoc.exists) {
        const data = signatureDoc.data() as FirestoreAbi;
        return `[${data.abi}]`;
      }
    }

    return null;
  },
  set: async ({ address, func = {}, event = {} }: SetContractAbiParams) => {
    const db = getFirestore();

    if (address != null) {
      const abis = Object.entries(address);
      // ADDRESS_ABI_COLLECTION
      await Promise.all(
        abis.map(([address, abi]) => {
          return db
            .collection(ADDRESS_ABI_COLLECTION)
            .doc(address.toLowerCase())
            .set({ abi }, { merge: true });
        }),
      );
    }

    const signature = {
      ...func,
      ...event,
    };

    if (signature != null) {
      const fragments = Object.entries(signature);

      await Promise.all(
        fragments.map(([sig, abi]) => {
          return db
            .collection(SIGNATURE_ABI_COLLECTION)
            .doc(sig)
            .set({ abi }, { merge: true });
        }),
      );
    }
  },
};
