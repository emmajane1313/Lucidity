import { SetStateAction, useState } from "react";
import { enableSignless } from "@lens-protocol/client/actions";
import { ethers } from "ethers";
import { useConfig } from "wagmi";
import { LensConnected } from "../../Common/types/common.types";
import isValidLensTx from "@/app/lib/helpers/isValidLensTx";
import obtenerCartera from "@/app/lib/helpers/obtenerCartera";

const useSignless = (
  lensConnected: LensConnected | undefined,
  setSigner: (e: SetStateAction<boolean>) => void
) => {
  const config = useConfig();
  const [signlessLoading, setSignlessLoading] = useState<boolean>(false);

  const handleSignless = async () => {
    if (!lensConnected?.sessionClient) return;
    setSignlessLoading(true);
    try {
      const res = await enableSignless(lensConnected?.sessionClient);

      if (res.isErr()) {
        console.error(res.error);
      } else if (
        !isValidLensTx(
          (res.value as any)?.raw,
          lensConnected?.profile?.address
        )
      ) {
        console.error("Invalid transaction request");
      } else {
        const cartera = await obtenerCartera(config, true);
        const provider = new ethers.BrowserProvider({
          request: (args: { method: string; params?: any }) =>
            cartera.request(args as any),
        } as ethers.Eip1193Provider);

        const signer = await provider.getSigner(cartera.account.address);

        const tx = {
          chainId: (res.value as any)?.raw?.chainId,
          from: (res.value as any)?.raw?.from,
          to: (res.value as any)?.raw?.to,
          nonce: (res.value as any)?.raw?.nonce,
          gasLimit: (res.value as any)?.raw?.gasLimit,
          maxFeePerGas: (res.value as any)?.raw?.maxFeePerGas,
          maxPriorityFeePerGas: (res.value as any)?.raw?.maxPriorityFeePerGas,
          value: (res.value as any)?.raw?.value,
          data: (res.value as any)?.raw?.data,
        };
        const txResponse = await signer.sendTransaction(tx);
        await txResponse.wait();

        setSigner?.(false);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setSignlessLoading(false);
  };

  return {
    signlessLoading,
    handleSignless,
  };
};

export default useSignless;
