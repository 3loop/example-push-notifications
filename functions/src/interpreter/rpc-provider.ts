import { JsonRpcProvider } from "ethers";

const urls: Record<number, string> = {
  1: "mainet-url",
  5: "https://rpc.ankr.com/eth_goerli",
};

const providers: Record<number, JsonRpcProvider> = {};

export function getProvider(chainID: number): JsonRpcProvider | undefined {
  let provider = providers[chainID];
  if (provider != null) {
    return provider;
  }

  const url = urls[chainID];
  if (url != null) {
    provider = new JsonRpcProvider(url);
    providers[chainID] = provider;
    return provider;
  }

  return undefined;
}
