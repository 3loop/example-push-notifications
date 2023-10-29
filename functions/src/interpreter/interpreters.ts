import { Interpreter } from "../models.js";

const aave2 = [
  {
    id: "aave-repay",
    schema: `
{
    "title": "Aave Repay",
    "body": "User repaid " & assetsSent[1].amount & " " & assetsSent[1].symbol,
    "address": fromAddress
}
      `,
    canInterpret:
      "methodCall.name = \"repay\" and  toAddress = \"0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9\" ? true : false",
  },
  {
    id: "aave-deposit",
    schema: `
{
    "title": "Aave Deposit",
    "body": "User deposited " & assetsSent[0].amount & " " & assetsSent[0].symbol,
    "address": fromAddress
}
      `,
    canInterpret:
      "methodCall.name = \"deposit\" and  toAddress = \"0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9\" ? true : false",
  },
  {
    id: "aave-borrow",
    schema: `
{
    "title": "Aave Borrow",
    "body": "User borrowed " & assetsReceived[1].amount & " " & assetsReceived[1].symbol,
    "address": fromAddress
}
      `,
    canInterpret:
      "methodCall.name = \"borrow\" and  toAddress = \"0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9\" ? true : false",
  },
  {
    id: "aave-withdraw",
    schema: `
{
    "title": "Aave Withdraw",
    "body": "User withdrew " & assetsReceived[0].amount & " " & assetsReceived[0].symbol,
    "address": fromAddress
}
      `,
    canInterpret:
      "methodCall.name = \"withdraw\" and  toAddress = \"0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9\" ? true : false",
  },
] as const;

export const interpreters: Interpreter[] = [...aave2];
