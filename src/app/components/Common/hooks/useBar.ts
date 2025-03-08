import { SetStateAction, useEffect, useState } from "react";
import { LensConnected, Pantalla } from "../types/common.types";
import { evmAddress, PublicClient } from "@lens-protocol/client";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";
import { STORAGE_NODE } from "@/app/lib/constants";

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

        let picture = "";

        if (accounts.value.items?.[0]?.account?.metadata?.picture) {
          const cadena = await fetch(
            `${STORAGE_NODE}/${
              accounts.value.items?.[0]?.account?.metadata?.picture?.split(
                "lens://"
              )?.[1]
            }`
          );

          if (cadena) {
            const json = await cadena.json();
            picture = json.item;
          }
        }
        setLensConectado?.({
          ...lensConectado,

          profile: {
            ...accounts.value.items?.[0]?.account,
            metadata: {
              ...accounts.value.items?.[0]?.account?.metadata!,
              picture,
            },
          },
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
