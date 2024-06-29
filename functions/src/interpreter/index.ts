import { TransactionDecoder } from "@3loop/transaction-decoder";
import { contractMetaStore } from "./get-contract-meta.js";
import { getPublicClient } from "./rpc-provider.js";
import { abiStore } from "./get-contract-abi.js";
import * as logger from "firebase-functions/logger";
import * as Interpreter from "./interpreter.js";

const decoder = new TransactionDecoder({
  getPublicClient,
  abiStore,
  contractMetaStore,
  logging: true,
});

export async function interpretTransaction({
  hash,
  chainID,
}: {
  hash: string;
  chainID: number;
}) {
  try {
    const decoded = await decoder.decodeTransaction({
      hash,
      chainID,
    });

    if (decoded == null) {
      return undefined;
    }

    return Interpreter.interpretTransaction(decoded);
  } catch (e) {
    logger.error(
      "Error while decoding and interpreting transaction",
      JSON.stringify(e, null, 2),
    );
    return undefined;
  }
}
