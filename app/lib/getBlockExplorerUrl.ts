export enum BlockExplorerDataType {
  Transaction = "tx",
  Address = "address",
}
export const getBlockExplorerUrl = (path: string) => {
  return `https://mumbai.polygonscan.com/address/${path}`;
};
