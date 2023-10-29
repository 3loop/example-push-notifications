import { TransactionDecoder } from "@3loop/transaction-decoder";
import { contractMetaStore } from "./get-contract-meta.js";
import { getProvider } from "./rpc-provider.js";
import { abiStore } from "./get-contract-abi.js";
import { findAndRunInterpreter } from "./utils.js";
import { interpreters } from "./interpreters.js";
import * as logger from "firebase-functions/logger";

const decoder = new TransactionDecoder({
  getProvider,
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
    console.log("Decoding transaction", hash);
    const decoded = await decoder.decodeTransaction({
      hash,
      chainID,
    })

    console.log("Decoded transaction", decoded);
    if (decoded == null) {
      return undefined;
    }
    const interpreted = await findAndRunInterpreter(decoded, interpreters);

    return interpreted;
  } catch (e) {
    logger.error(
      "Error while decoding and interpreting transaction",
      JSON.stringify(e, null, 2),
    );
    return undefined;
  }
}
