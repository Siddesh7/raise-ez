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

export async function transferDonation(
  from: string,
  campaignId: string,
  amount: string
) {
  const result = await writeContract(config, {
    abi: CROWDFUNDING_CONTRACT_ABI,
    address: getChainConfig().target as any,
    functionName: "donateToCampaign",
    args: [from, campaignId, amount],
  });
}
export async function callWriteFunction(from, campaignId, amount) {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-mumbai.g.alchemy.com/v2/1ObE0PIpsFlEXG3NQCsRkNM8K5vAL8rP",
      {
        name: "polygon-mumbai",
        chainId: 80001,
      }
    );
    const signer = new ethers.Wallet(
      "e50373bb18239cbaeef7f72375bba501dafddf277ba3ceb5a079e7a85ee94116",
      provider
    );
    console.log("Signer address:", await signer.getAddress());
    const contract = new ethers.Contract(
      "0xDC7D896CdEd424eF48Ddf10E4344dF9cf8CE3fe3",
      CROWDFUNDING_CONTRACT_ABI,
      signer
    );

    const txResponse = await contract.donateToCampaign(from, "3", "1");
    const receipt = await txResponse.wait();
    console.log("Transaction receipt:", receipt);
  } catch (error) {
    console.error("Error calling write function:", error);
  }
}
