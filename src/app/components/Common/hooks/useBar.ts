import { SetStateAction, useEffect, useState } from "react";
import { LensConnected } from "../types/common.types";
import { evmAddress, PublicClient } from "@lens-protocol/client";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";

const useBar = (
  lensConectado: LensConnected,
  lensClient: PublicClient,
  setLensConectado: (e: SetStateAction<LensConnected | undefined>) => void,
  isConnected: boolean,
  address?: `0x${string}` | undefined
) => {
  const [abrirBar, setAbrirBar] = useState<boolean>(false);

  const resumeLensSession = async () => {
    try {
      const resumed = await lensClient?.resumeSession();

      if (resumed?.isOk()) {
        const accounts = await fetchAccountsAvailable(lensClient!, {
          managedBy: evmAddress(lensConectado?.address!),
          includeOwned: true,
        });

        if (accounts.isErr()) {
          return;
        }

        setLensConectado?.({
          ...lensConectado,

          profile: accounts.value.items?.[0]?.account,
          sessionClient: resumed?.value,
        });
      }
    } catch (err) {
      console.error("Error al reanudar la sesión:", err);
      return null;
    }
  };

  useEffect(() => {
    if (isConnected && !lensConectado?.address && address) {
      setLensConectado({
        ...lensConectado,
        address: address,
      });
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (lensConectado?.address && lensClient && !lensConectado?.profile) {
      resumeLensSession();
    }
  }, [lensConectado?.address, lensClient]);

  return {
    abrirBar,
    setAbrirBar,
  };
};

export default useBar;
