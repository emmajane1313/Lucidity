import { SetStateAction, useState } from "react";
import { evmAddress } from "@lens-protocol/client";
import { createWalletClient, custom } from "viem";
import { chains } from "@lens-network/sdk/viem";
import { v4 as uuidv4 } from "uuid";
import { StorageClient } from "@lens-protocol/storage-node-client";
import {
  createAccountWithUsername,
  fetchAccount,
} from "@lens-protocol/client/actions";
import { LensConnected } from "../../Common/types/common.types";
import { STORAGE_NODE } from "@/app/lib/constants";
import pollResult from "@/app/lib/helpers/pollResult";

const useCrearCuenta = (
  lensConnected: LensConnected | undefined,
  setLensConnected:
    | ((e: SetStateAction<LensConnected | undefined>) => void)
    | undefined,
  setCreateAccount: (e: SetStateAction<boolean>) => void,
  storageClient: StorageClient,
  setNotification: (e: SetStateAction<string | undefined>) => void
) => {
  const [account, setAccount] = useState<{
    localname: string;
    bio: string;
    username: string;
    pfp?: Blob;
  }>({
    localname: "",
    bio: "",
    username: "",
  });
  const [accountLoading, setAccountLoading] = useState<boolean>(false);

  const handleCreateAccount = async () => {
    if (!lensConnected?.address || !lensConnected?.sessionClient) return;
    setAccountLoading(true);
    try {
      const signer = createWalletClient({
        chain: chains.testnet,
        transport: custom(window.ethereum!),
        account: lensConnected?.address,
      });

      let picture = {};

      if (account?.pfp) {
        const res = await fetch("/api/ipfs", {
          method: "POST",
          body: account?.pfp,
        });
        const json = await res.json();
        const { uri } = await storageClient.uploadAsJson({
          type: "image/png",
          item: "ipfs://" + json?.cid,
        });

        picture = {
          picture: uri,
        };
      }

      const { uri } = await storageClient.uploadAsJson({
        $schema: "https://json-schemas.lens.dev/account/1.0.0.json",
        lens: {
          id: uuidv4(),
          name: account?.localname,
          bio: account?.bio,
          ...picture,
        },
      });

      const accountResponse = await createAccountWithUsername(
        lensConnected?.sessionClient,
        {
          accountManager: [evmAddress(signer.account.address)],
          username: {
            localName: account?.username,
          },
          metadataUri: uri,
        }
      );

      if (accountResponse.isErr()) {
        setAccountLoading(false);
        setNotification("Something went wrong. Try again? :/");
        return;
      }

      if (
        (accountResponse.value as any)?.message?.includes(
          "username already exists"
        )
      ) {
        setNotification("Username Already Taken. Try something else?");
        setAccountLoading(false);
        return;
      }

      if ((accountResponse.value as any)?.hash) {
        const res = await pollResult(
          (accountResponse.value as any)?.hash,
          lensConnected?.sessionClient
        );

        if (res) {
          const newAcc = await fetchAccount(lensConnected?.sessionClient, {
            username: {
              localName: account?.username,
            },
          });

          if (newAcc.isErr()) {
            setAccountLoading(false);
            return;
          }

          if (newAcc.value?.address) {
            const ownerSigner =
              await lensConnected?.sessionClient?.switchAccount({
                account: newAcc.value?.address,
              });

            if (ownerSigner?.isOk()) {
              let picture = "";

              try {
                const cadena = await fetch(
                  `${STORAGE_NODE}/${
                    newAcc.value?.metadata?.picture?.split("lens://")?.[1]
                  }`
                );

                if (cadena) {
                  const json = await cadena.json();
                  picture = json.item;
                }
              } catch (err: any) {
                console.error(err.message);
              }

              setLensConnected?.({
                ...lensConnected,
                profile: {
                  ...newAcc.value,
                  metadata: {
                    ...(newAcc.value?.metadata as any),
                    picture,
                  },
                },
                sessionClient: ownerSigner?.value,
              });
              setCreateAccount(false);
              setAccount({
                localname: "",
                bio: "",
                username: "",
              });
            }
          } else {
            console.error(accountResponse);
            setNotification?.("Error with Fetching New Account");
            setAccountLoading(false);
            return;
          }
        } else {
          console.error(accountResponse);
          setNotification?.("Error with Account Creation");
          setAccountLoading(false);
          return;
        }
      } else {
        console.error(accountResponse);
        setNotification?.("Error with Account Creation");
        setAccountLoading(false);
        return;
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setAccountLoading(false);
  };

  return {
    account,
    setAccount,
    accountLoading,
    handleCreateAccount,
  };
};

export default useCrearCuenta;
