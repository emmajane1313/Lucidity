import { useEffect, useState } from "react";
import { Flujo } from "../../Modals/types/modals.types";
import { getAllWorkflows } from "../../../../../graphql/queries/getAllWorkflows";
import { getWorkflows } from "../../../../../graphql/queries/getWorkflows";
import { LensConnected } from "../../Common/types/common.types";
import { Account, evmAddress, PublicClient } from "@lens-protocol/client";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";
import { INFURA_GATEWAY } from "@/app/lib/constants";

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

              if (result.isOk()) {
                profileCache.set(
                  flujo?.creator,
                  result?.value.items[0]?.account as Account
                );
              }
            }

            let metadata = flujo?.workflowMetadata;

            if (!metadata) {
              const json = await fetch(
                `${INFURA_GATEWAY}/ipfs/${flujo?.uri?.split("ipfs://")?.[1]}`
              );
              metadata = await json.json();
            }

            return {
              tags: metadata?.tags
                ?.replace(/, /g, ",")
                ?.split(",")
                ?.filter((item: string) => item.trim() !== ""),
              name: metadata?.name,
              creator: flujo?.creator,
              counter: flujo?.counter,
              description: metadata?.description,
              cover: metadata?.cover,
              workflow: JSON.parse(metadata?.workflow),
              setup: metadata?.setup
                ?.replace(/, /g, ",")
                ?.split(",")
                ?.filter((item: string) => item.trim() !== ""),
              links: metadata?.links,
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

              if (result.isOk()) {
                profileCache.set(
                  flujo?.creator,
                  result?.value.items[0]?.account as Account
                );
              }
            }

            let metadata = flujo?.workflowMetadata;

            if (!metadata) {
              const json = await fetch(
                `${INFURA_GATEWAY}/ipfs/${flujo?.uri?.split("ipfs://")?.[1]}`
              );
              metadata = await json.json();
            }

            return {
              tags: metadata?.tags
                ?.replace(/, /g, ",")
                ?.split(",")
                ?.filter((item: string) => item.trim() !== ""),
              name: metadata?.name,
              creator: flujo?.creator,
              counter: flujo?.counter,
              description: metadata?.description,
              cover: metadata?.cover,
              workflow: JSON.parse(metadata?.workflow),
              setup: metadata?.setup
                ?.replace(/, /g, ",")
                ?.split(",")
                ?.filter((item: string) => item.trim() !== ""),
              links: metadata?.links,
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
              (lensConectado?.sessionClient || lensClient)
            ) {
              const result = await fetchAccountsAvailable(
                lensConectado?.sessionClient ?? lensClient,
                {
                  managedBy: evmAddress(flujo?.creator),
                  includeOwned: true,
                }
              );

              if (result.isOk()) {
                profileCache.set(
                  flujo?.creator,
                  result?.value.items[0]?.account as Account
                );
              }
            }

            let metadata = flujo?.workflowMetadata;

            if (!metadata) {
              const json = await fetch(
                `${INFURA_GATEWAY}/ipfs/${flujo?.uri?.split("ipfs://")?.[1]}`
              );
              metadata = await json.json();
            }

            return {
              tags: metadata?.tags
                ?.replace(/, /g, ",")
                ?.split(",")
                ?.filter((item: string) => item.trim() !== ""),
              name: metadata?.name,
              creator: flujo?.creator,
              counter: flujo?.counter,
              description: metadata?.description,
              cover: metadata?.cover,
              workflow: JSON.parse(metadata?.workflow),
              setup: metadata.setup
                ?.replace(/, /g, ",")
                ?.split(",")
                ?.filter((item: string) => item.trim() !== ""),
              links: metadata?.links,
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
    if (flujos?.length < 1 && lensClient) {
      handleFlujos();
    }
  }, [lensClient]);

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
