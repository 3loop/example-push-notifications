import { DecodedTx } from "@3loop/transaction-decoder";
import { InterpretedTransaction, Interpreter } from "../models.js";
import jsonata from "jsonata";

export async function findAndRunInterpreter(
  decoded: DecodedTx,
  interpretors: Interpreter[],
): Promise<InterpretedTransaction | undefined> {
  // TODO: This is a naive implementation, we can store interpretations in a indexed way
  for (const interpreter of interpretors) {
    const canInterpret = jsonata(interpreter.canInterpret);
    const canInterpretResult = await canInterpret
      .evaluate(decoded)
      .catch(() => false);

    if (!canInterpretResult) {
      continue;
    }

    const expression = jsonata(interpreter.schema);

    return expression.evaluate(decoded);
  }
  return undefined;
}
