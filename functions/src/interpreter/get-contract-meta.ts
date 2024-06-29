import { getFirestore } from "firebase-admin/firestore";
import { CONTRACT_METADATA_COLLECTION } from "../constants.js";
import {
  ContractData,
  ERC20RPCStrategyResolver,
  NFTRPCStrategyResolver,
  VanillaContractMetaStore,
} from "@3loop/transaction-decoder";

export const contractMetaStore: VanillaContractMetaStore = {
  strategies: [ERC20RPCStrategyResolver, NFTRPCStrategyResolver],

  get: async ({ address }) => {
    const db = getFirestore();
    const addressDoc = await db
      .collection(CONTRACT_METADATA_COLLECTION)
      .doc(address.toLowerCase())
      .get();

    if (addressDoc.exists) {
      const data = addressDoc.data() as ContractData;
      return {
        status: "success",
        result: data,
      };
    }

    return {
      status: "empty",
      result: null,
    };
  },
  set: async (key, value) => {
    const db = getFirestore();
    if (value.status === "success") {
      await db
        .collection(CONTRACT_METADATA_COLLECTION)
        .doc(key.address.toLowerCase())
        .set(value.result);
    }
  },
};
