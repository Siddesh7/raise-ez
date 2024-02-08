import {getAccount, readContract, writeContract} from "@wagmi/core";

import {createConfig, http} from "@wagmi/core";
import {polygonMumbai} from "@wagmi/core/chains";
import {CROWDFUNDING_CONTRACT_ABI} from "../constants";
import {getChainConfig} from ".";
import {ethers} from "ethers";

const config = createConfig({
  chains: [polygonMumbai],
  transports: {
    [polygonMumbai.id]: http(
      "https://polygon-mumbai.g.alchemy.com/v2/1ObE0PIpsFlEXG3NQCsRkNM8K5vAL8rP"
    ),
  },
});
export async function getCampaign(id: string) {
  const result = await readContract(config, {
    abi: CROWDFUNDING_CONTRACT_ABI,
    address: getChainConfig().target as any,
    functionName: "getCampaign",
    args: [id],
  });
  return result;
}
export async function checkIfBalanceExists(wallet: string) {
  const result = await readContract(config, {
    abi: CROWDFUNDING_CONTRACT_ABI,
    address: getChainConfig().target as any,
    functionName: "getDepositorBalance",
    args: [wallet],
  });
  return result;
}
