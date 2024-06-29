import { getFirestore } from "firebase-admin/firestore";
import {
  ADDRESS_ABI_COLLECTION,
  SIGNATURE_ABI_COLLECTION,
} from "../constants.js";
import { FirestoreAbi } from "../models.js";
import {
  ContractAbiResult,
  EtherscanStrategyResolver,
  FourByteStrategyResolver,
  OpenchainStrategyResolver,
  SourcifyStrategyResolver,
  VanillaAbiStore,
} from "@3loop/transaction-decoder";

export const abiStore: VanillaAbiStore = {
  strategies: [
    EtherscanStrategyResolver(),
    SourcifyStrategyResolver(),
    FourByteStrategyResolver(),
    OpenchainStrategyResolver(),
  ],
  get: async ({ address, signature, event, chainID }) => {
    const db = getFirestore();
    const addressDoc = await db
      .collection(ADDRESS_ABI_COLLECTION)
      .doc(address.toLowerCase())
      .get();

    if (addressDoc.exists) {
      const data = addressDoc.data() as FirestoreAbi;
      return {
        status: "success",
        result: {
          type: "address",
          address: address,
          event: event,
          signature: signature,
          chainID: chainID,
          abi: data.abi,
        },
      } as ContractAbiResult;
    }

    const signatureOrEvent = signature ?? event;

    if (signatureOrEvent != null) {
      const signatureDoc = await db
        .collection(SIGNATURE_ABI_COLLECTION)
        .doc(signatureOrEvent)
        .get();

      if (signatureDoc.exists) {
        const data = signatureDoc.data() as FirestoreAbi;
        return {
          status: "success",
          result:
            signatureOrEvent === signature
              ? {
                type: "func",
                address: address,
                signature: signature,
                chainID: chainID,
                abi: data.abi,
              }
              : {
                type: "event",
                address: address,
                signature: signature,
                chainID: chainID,
                abi: data.abi,
              },
        } as ContractAbiResult;
      }
    }

    return {
      status: "empty",
      result: null,
    };
  },
  set: async (key, value) => {
    const db = getFirestore();
    if (value.status === "success" && value.result.type === "address") {
      await db
        .collection(ADDRESS_ABI_COLLECTION)
        .doc(key.address.toLowerCase())
        .set({ abi: value.result.abi }, { merge: true });
    } else if (value.status === "success") {
      const docId = value.result.type === "func" ? key.signature : key.event;

      await db
        .collection(SIGNATURE_ABI_COLLECTION)
        .doc(docId!)
        .set(
          { abi: value.result.abi, type: value.result.type },
          { merge: true },
        );
    }
  },
};
