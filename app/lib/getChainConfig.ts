export const SUPPORTED_NETWORKS: {name: string; chainId: number}[] = [
  {name: "Mumbai", chainId: 80001},
];

export const getChainConfig = (): {
  name: string;
  chainId: number;
  target: string;
  apiKey: string;
  rpcUrl: string;
} => {
  return {
    name: "Mumbai",
    apiKey: process.env.NEXT_PUBLIC_SPONSOR_API_KEY!,
    chainId: 80001,
    target: "0xDC7D896CdEd424eF48Ddf10E4344dF9cf8CE3fe3",
    rpcUrl: process.env.NEXT_PUBLIC_MUMBAI_RPC_URL!,
  };
};
