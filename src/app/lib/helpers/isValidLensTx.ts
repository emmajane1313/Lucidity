import { ethers } from "ethers";
import { LENS_CHAIN_ID } from "../constants";

const isValidLensTx = (raw: any, expectedTo?: string): boolean => {
  if (Number(raw?.chainId) !== LENS_CHAIN_ID || !ethers.isAddress(raw?.to)) {
    return false;
  }

  if (
    expectedTo &&
    String(raw?.to).toLowerCase() !== expectedTo.toLowerCase()
  ) {
    return false;
  }

  try {
    return BigInt(raw?.value ?? 0) === BigInt(0);
  } catch (err: any) {
    return false;
  }
};

export default isValidLensTx;
