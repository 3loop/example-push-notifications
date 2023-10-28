import { getFirestore } from "firebase-admin/firestore";
import { ADDRESS_ABI_COLLECTION } from "../constants.js";
import { ContractData, ContractType } from "@3loop/transaction-decoder";
import { getProvider } from "./rpc-provider.js";
import { Contract } from "ethers";
import { ERC20 } from "../abi/erc20.js";

export const contractMetaStore = {
  get: async ({
    address,
    chainID,
  }: {
    address: string;
    chainID: number;
  }): Promise<ContractData | null> => {
    const db = getFirestore();
    const addressDoc = await db
      .collection(ADDRESS_ABI_COLLECTION)
      .doc(address.toLowerCase())
      .get();

    if (addressDoc.exists) {
      return addressDoc.data() as ContractData;
    }

    // NOTE: We should make this as a resolution strategy for contract meta store
    try {
      // NOTE: Try to fetch erc20 meta
      const erc20 = await fetchErc20Meta({
        contractAddress: address,
        chainID,
      });
      if (erc20 != null) {
        await db
          .collection(ADDRESS_ABI_COLLECTION)
          .doc(address.toLowerCase())
          .set(erc20);

        return erc20;
      }
    } catch (e) {
      // NOTE: Failed to fetch erc20
      console.log(e);
    }

    return {
      address,
      contractName: "Unknown",
      contractAddress: address,
      tokenSymbol: "Unknown",
      type: "OTHER",
      chainID,
    };
  },
  set: async () => {
    console.error("Not implemented");
  },
};

export const fetchErc20Meta = async ({
  contractAddress,
  chainID,
}: {
  contractAddress: string;
  chainID: number;
}) => {
  const provider = getProvider(chainID);

  const inst = new Contract(contractAddress, ERC20, provider);

  const name = (await inst.name()) as string | null;

  if (name == null) {
    return null;
  }

  const [symbol, decimals] = await Promise.all([
    inst.symbol() as Promise<string>,
    inst.decimals() as Promise<number>,
  ]);

  if (symbol == null || decimals == null) {
    return null;
  }

  const meta: ContractData = {
    address: contractAddress,
    contractAddress,
    contractName: name,
    tokenSymbol: symbol,
    decimals: Number(decimals),
    type: "ERC20" as ContractType,
    chainID,
  };

  return meta;
};
