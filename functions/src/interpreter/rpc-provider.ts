import { PublicClientObject } from "@3loop/transaction-decoder";
import { createPublicClient, http } from "viem";

const providerConfigs: Record<number, any> = {
  1: {
    rpcUrl: "https://rpc.ankr.com/eth",
  },
  11155111: { rpcUrl: "https://rpc.ankr.com/eth_sepolia" },
};

const providers: Record<number, PublicClientObject> = {};

export function getPublicClient(
  chainID: number,
): PublicClientObject | undefined {
  let provider = providers[chainID];

  if (provider != null) {
    return provider;
  }

  const url = providerConfigs[chainID].rpcUrl;

  if (url != null) {
    provider = {
      client: createPublicClient({
        transport: http(url),
      }),
      config: {
        supportTraceAPI: providerConfigs[chainID]?.supportTraceAPI ?? true,
      },
    };

    providers[chainID] = provider;
    return provider;
  }

  return undefined;
}
