import { useEffect, useState } from "react";
import { Flujo } from "../../Modals/types/modals.types";
import { getAllWorkflows } from "../../../../../graphql/queries/getAllWorkflows";
import { getWorkflows } from "../../../../../graphql/queries/getWorkflows";
import { STORAGE_NODE } from "@/app/lib/constants";
import { LensConnected } from "../../Common/types/common.types";
import { Account, evmAddress, PublicClient } from "@lens-protocol/client";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";

const useFlujos = (lensConectado: LensConnected, lensClient: PublicClient) => {
  const [flujosCargando, setFlujosCargando] = useState<boolean>(false);
  const [masFlujosCargando, setMasFlujosCargando] = useState<boolean>(false);
  const [flujos, setFlujos] = useState<Flujo[]>([]);
  const [buscarCargando, setBuscarCargando] = useState<boolean>(false);
  const [buscar, setBuscar] = useState<string>("");
  const [hasMore, setHasMore] = useState<{ hasMore: boolean; skip: number }>({
    hasMore: true,
    skip: 0,
  });
  const profileCache = new Map<string, Account>();

  const handleBuscar = async () => {
    setBuscarCargando(true);
    try {
      let datos;

      if (buscar?.trim() == "") {
        datos = await getAllWorkflows(0);
      } else {
        const searchTerms = buscar.split(" ").filter(Boolean);
        const orConditions = searchTerms.flatMap((term) => [
          { description_contains_nocase: term },
          { name_contains_nocase: term },
          { tags_contains_nocase: term },
          { workflow_contains_nocase: term },
        ]);

        setBuscar("");

        datos = await getWorkflows({
          workflowMetadata_: {
            or: orConditions,
          },
        });
      }

      setFlujos(
        await Promise.all(
          datos?.data?.workflowCreateds?.map(async (flujo: any) => {
            if (!profileCache.get(flujo?.creator)) {
              const result = await fetchAccountsAvailable(
                lensConectado?.sessionClient ?? lensClient,
                {
                  managedBy: evmAddress(flujo?.creator),
                  includeOwned: true,
                }
              );


              if (result.isErr()) {
                setBuscarCargando(false);

                return;
              }

              const profile = result?.value.items[0]?.account as Account;
              let picture = "";
              if (profile?.metadata?.picture) {
                const pictureKey =
                  profile.metadata.picture.split("lens://")?.[1];
                const cadena = await fetch(`${STORAGE_NODE}/${pictureKey}`);
                const json = await cadena.json();
                picture = json.item;
              }

              profileCache.set(flujo?.creator, {
                ...profile,
                metadata: {
                  ...profile?.metadata!,
                  picture,
                },
              });
            }

            return {
              tags: flujo?.workflowMetadata?.tags?.split(", "),
              name: flujo?.workflowMetadata?.name,
              creator: flujo?.creator,
              counter: flujo?.counter,
              description: flujo?.workflowMetadata?.description,
              cover: flujo?.workflowMetadata?.cover,
              workflow: JSON.parse(flujo?.workflowMetadata?.workflow),
              setup: flujo?.workflowMetadata?.setup?.split(", "),
              profile: profileCache.get(flujo?.creator),
            };
          })
        )
      );
    } catch (err: any) {
      console.error(err.message);
    }

    setBuscarCargando(false);
  };

  const handleMasFlujos = async () => {
    setMasFlujosCargando(true);
    try {
      const datos = await getAllWorkflows(hasMore.skip);

      setHasMore({
        hasMore: datos?.data?.workflowCreateds?.length == 20 ? true : false,
        skip: datos?.data?.workflowCreateds?.length == 20 ? 20 : 0,
      });

      setFlujos([
        ...flujos,
        ...(await Promise.all(
          datos?.data?.workflowCreateds?.map(async (flujo: any) => {
            if (!profileCache.get(flujo?.creator)) {
              const result = await fetchAccountsAvailable(
                lensConectado?.sessionClient ?? lensClient,
                {
                  managedBy: evmAddress(flujo?.creator),
                  includeOwned: true,
                }
              );

              if (result.isErr()) {
                setMasFlujosCargando(false);
                return;
              }

              const profile = result?.value.items[0]?.account as Account;
              let picture = "";
              if (profile?.metadata?.picture) {
                const pictureKey =
                  profile.metadata.picture.split("lens://")?.[1];
                const cadena = await fetch(`${STORAGE_NODE}/${pictureKey}`);
                const json = await cadena.json();
                picture = json.item;
              }

              profileCache.set(flujo?.creator, {
                ...profile,
                metadata: {
                  ...profile?.metadata!,
                  picture,
                },
              });
            }

            return {
              tags: flujo?.workflowMetadata?.tags?.split(", "),
              name: flujo?.workflowMetadata?.name,
              creator: flujo?.creator,
              counter: flujo?.counter,
              description: flujo?.workflowMetadata?.description,
              cover: flujo?.workflowMetadata?.cover,
              workflow: JSON.parse(flujo?.workflowMetadata?.workflow),
              setup: flujo?.workflowMetadata?.setup?.split(", "),
              profile: profileCache.get(flujo?.creator),
            };
          })
        )),
      ]);
    } catch (err: any) {
      console.error(err.message);
    }
    setMasFlujosCargando(false);
  };

  const handleFlujos = async () => {
    setFlujosCargando(true);
    try {
      const datos = await getAllWorkflows(0);

      setHasMore({
        hasMore: datos?.data?.workflowCreateds?.length == 20 ? true : false,
        skip: datos?.data?.workflowCreateds?.length == 20 ? 20 : 0,
      });

      setFlujos(
        await Promise.all(
          datos?.data?.workflowCreateds?.map(async (flujo: any) => {
            if (
              !profileCache.get(flujo?.creator) &&
              lensConectado?.sessionClient
            ) {
              const result = await fetchAccountsAvailable(
                lensConectado?.sessionClient,
                {
                  managedBy: evmAddress(flujo?.creator),
                  includeOwned: true,
                }
              );

              if (result.isErr()) {
                setMasFlujosCargando(false);
                return;
              }

              const profile = result?.value.items[0]?.account as Account;
              let picture = "";
              if (profile?.metadata?.picture) {
                const pictureKey =
                  profile.metadata.picture.split("lens://")?.[1];
                const cadena = await fetch(`${STORAGE_NODE}/${pictureKey}`);
                const json = await cadena.json();
                picture = json.item;
              }

              profileCache.set(flujo?.creator, {
                ...profile,
                metadata: {
                  ...profile?.metadata!,
                  picture,
                },
              });
            }

            return {
              tags: flujo?.workflowMetadata?.tags?.split(", "),
              name: flujo?.workflowMetadata?.name,
              creator: flujo?.creator,
              counter: flujo?.counter,
              description: flujo?.workflowMetadata?.description,
              cover: flujo?.workflowMetadata?.cover,
              workflow: JSON.parse(flujo?.workflowMetadata?.workflow),
              setup: flujo?.workflowMetadata?.setup?.split(", "),
              profile: profileCache.get(flujo?.creator),
            };
          })
        )
      );
    } catch (err: any) {
      console.error(err.message);
    }

    setFlujosCargando(false);
  };

  useEffect(() => {
    if (flujos?.length < 1) {
      handleFlujos();
    }
  }, []);

  return {
    flujosCargando,
    flujos,
    buscar,
    setBuscar,
    buscarCargando,
    handleBuscar,
    masFlujosCargando,
    handleMasFlujos,
    hasMore,
  };
};

export default useFlujos;
