import {
  fetchAccountsAvailable,
  revokeAuthentication,
} from "@lens-protocol/client/actions";
import { SetStateAction, useEffect, useState } from "react";
import { LensConnected } from "../../Common/types/common.types";
import { createWalletClient, custom } from "viem";
import { chains } from "@lens-network/sdk/viem";
import { evmAddress, PublicClient } from "@lens-protocol/client";
import { STORAGE_NODE } from "@/app/lib/constants";

const useConnect = (
  lensConectado: LensConnected,
  lensClient: PublicClient,
  setError: (e: SetStateAction<string | undefined>) => void,
  setLensConectado: (e: SetStateAction<LensConnected | undefined>) => void,
  setCrearCuenta: (e: SetStateAction<boolean>) => void,
  setConnect: (e: SetStateAction<boolean>) => void,
  isConnected: boolean,
  address?: `0x${string}` | undefined
) => {
  const [lensCargando, setLensCargando] = useState<boolean>(false);

  const handleConnectarse = async () => {
    if (!lensConectado?.address || !lensClient) return;
    setLensCargando(true);
    try {
      const signer = createWalletClient({
        chain: chains.testnet,
        transport: custom(window.ethereum!),
        account: lensConectado?.address,
      });
      const accounts = await fetchAccountsAvailable(lensClient, {
        managedBy: evmAddress(signer.account.address),
        includeOwned: true,
      });

      if (accounts.isErr()) {
        setLensCargando(false);
        return;
      }

      if (accounts.value.items?.[0]?.account?.address) {
        const authenticated = await lensClient.login({
          accountOwner: {
            account: evmAddress(accounts.value.items?.[0]?.account?.address),
            owner: signer.account?.address?.toLowerCase(),
          },
          signMessage: (message) => signer.signMessage({ message }),
        });

        if (authenticated.isErr()) {
          console.error(authenticated.error);
          setError?.("Error Authenticating");
          setLensCargando(false);
          return;
        }

        const sessionClient = authenticated.value;

        let picture = "";

        try {
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
        } catch (err: any) {
          console.error(err.message);
        }

        setLensConectado?.({
          address: lensConectado?.address,

          sessionClient,
          profile: {
            ...accounts.value.items?.[0]?.account,
            metadata: {
              ...accounts.value.items?.[0]?.account?.metadata!,
              picture,
            },
          },
        });
      } else {
        const authenticatedOnboarding = await lensClient.login({
          onboardingUser: {
            wallet: signer.account.address,
          },
          signMessage: (message) => signer.signMessage({ message }),
        });

        if (authenticatedOnboarding.isErr()) {
          console.error(authenticatedOnboarding.error);
          setError?.("Error Onboarding");

          setLensCargando(false);
          return;
        }

        const sessionClient = authenticatedOnboarding.value;

        setLensConectado?.({
          address: lensConectado?.address,
          sessionClient,
        });

        setCrearCuenta?.(true);
        setConnect?.(false);
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setLensCargando(false);
  };

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

        try {
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
        } catch (err: any) {
          console.error(err.message);
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

  const salir = async () => {
    setLensCargando(true);
    try {
      const auth = await lensConectado?.sessionClient?.getAuthenticatedUser();

      if (auth?.isOk()) {
        const res = await revokeAuthentication(lensConectado?.sessionClient!, {
          authenticationId: auth.value?.authenticationId,
        });

        setLensConectado?.(undefined);
        window.localStorage.removeItem("lens.testnet.credentials");
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setLensCargando(false);
  };

  useEffect(() => {
    if (lensConectado?.address && lensClient && !lensConectado?.profile) {
      resumeLensSession();
    }
  }, [lensConectado?.address, lensClient]);

  useEffect(() => {
    if (!lensConectado?.address && lensConectado?.profile && lensClient) {
      salir();
    }
  }, [lensConectado?.address]);

  useEffect(() => {
    if (isConnected && !lensConectado?.address) {
      setLensConectado({
        ...lensConectado,
        address: address,
      });
    }
  }, [isConnected]);

  return {
    lensCargando,
    salir,
    handleConnectarse,
  };
};

export default useConnect;
