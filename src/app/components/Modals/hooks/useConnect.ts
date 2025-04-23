import {
  fetchAccountsAvailable,
  revokeAuthentication,
} from "@lens-protocol/client/actions";
import { SetStateAction, useEffect, useState } from "react";
import { LensConnected } from "../../Common/types/common.types";
import { createWalletClient, custom } from "viem";
import { chains } from "@lens-chain/sdk/viem";
import { evmAddress, PublicClient } from "@lens-protocol/client";

const useConnect = (
  lensConectado: LensConnected,
  address: `0x${string}` | undefined,
  lensClient: PublicClient,
  setError: (e: SetStateAction<string | undefined>) => void,
  setLensConectado: (e: SetStateAction<LensConnected | undefined>) => void,
  setCrearCuenta: (e: SetStateAction<boolean>) => void,
  setConnect: (e: SetStateAction<boolean>) => void,
  dict: any
) => {
  const [lensCargando, setLensCargando] = useState<boolean>(false);

  const handleConectarse = async () => {
    if (!address || !lensClient) return;
    setLensCargando(true);
    try {
      const signer = createWalletClient({
        chain: chains.mainnet,
        transport: custom(window.ethereum!),
        account: address,
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
          setError?.(dict.Home.auth);
          setLensCargando(false);
          return;
        }

        const sessionClient = authenticated.value;

        setLensConectado?.((prev) => ({
          ...prev,
          sessionClient,
          profile: accounts.value.items?.[0]?.account,
        }));
      } else {
        const authenticatedOnboarding = await lensClient.login({
          onboardingUser: {
            wallet: signer.account.address,
          },
          signMessage: (message) => signer.signMessage({ message }),
        });

        if (authenticatedOnboarding.isErr()) {
          console.error(authenticatedOnboarding.error);
          setError?.(dict.Home.onboard);

          setLensCargando(false);
          return;
        }

        const sessionClient = authenticatedOnboarding.value;

        setLensConectado?.((prev) => ({
          ...prev,
          sessionClient,
        }));

        setCrearCuenta?.(true);
        setConnect?.(false);
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setLensCargando(false);
  };

  const salir = async () => {
    setLensCargando(true);
    try {
      const auth = lensConectado?.sessionClient?.getAuthenticatedUser();

      if (auth?.isOk()) {
        const res = await revokeAuthentication(lensConectado?.sessionClient!, {
          authenticationId: auth.value?.authenticationId,
        });

        setLensConectado?.((prev) => ({
          ...prev,
          sessionClient: undefined,
          profile: undefined,
        }));
        window.localStorage.removeItem("lens.mainnet.credentials");
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setLensCargando(false);
  };

  useEffect(() => {
    if (!address && lensConectado?.profile && lensClient) {
      salir();
    }
  }, [address]);

  return {
    lensCargando,
    salir,
    handleConectarse,
  };
};

export default useConnect;
