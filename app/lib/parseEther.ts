import {ethers} from "ethers";

export default function parseEther(ether: string): string {
  return ethers.utils.parseEther(ether).toString();
}
