import { DecodedTx } from "@3loop/transaction-decoder";
import {
  Interpreter,
  QuickjsConfig,
  QuickjsInterpreterLive,
  TransactionInterpreter,
} from "@3loop/transaction-interpreter";
import { Effect, Layer } from "effect";

const config = Layer.succeed(QuickjsConfig, {
  runtimeConfig: { timeout: 1000 },
});

export const InterpreterLive = Layer.provide(QuickjsInterpreterLive, config);

export const emptyInterpreter: Interpreter = {
  schema: `function transformEvent(event){
    return event
};
`,
  id: "empty",
};

export const interpretTransaction = (decodedTx: DecodedTx) => {
  const program = Effect.gen(function* () {
    const interpreterService = yield* TransactionInterpreter;

    let interpreter = interpreterService.findInterpreter(decodedTx);

    if (interpreter == null) {
      interpreter = emptyInterpreter;
    }

    const result = yield* interpreterService.interpretTx(
      decodedTx,
      interpreter,
    );

    console.log("Interpreted result", JSON.stringify(result, null, 2));

    return {
      address: decodedTx.toAddress!,
      title: "Transaction",
      body: "Transaction executed successfully",
    };
  });

  const runnable = Effect.provide(program, InterpreterLive);
  return Effect.runPromise(runnable).catch((error: unknown) => {
    console.error("Interpertation error", JSON.stringify(error, null, 2));
    return undefined;
  });
};
