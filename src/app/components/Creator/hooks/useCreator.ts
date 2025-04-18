import { Account, evmAddress, PublicClient } from "@lens-protocol/client";
import { useEffect, useState } from "react";
import { Flujo } from "../../Modals/types/modals.types";
import { getAccountWorkflows } from "../../../../../graphql/queries/getAccountWorkflows";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";

const useCreator = (creator: string, lensClient: PublicClient) => {
  const [creadorCargando, setCreadorCargando] = useState<boolean>(false);
  const [flujosCargando, setFlujosCargando] = useState<boolean>(false);
  const [masFlujosCargando, setMasFlujosCargando] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<{ hasMore: boolean; skip: number }>({
    hasMore: true,
    skip: 0,
  });
  const [flujos, setFlujos] = useState<Flujo[]>([]);
  const [creador, setCreador] = useState<
    Account & {
      creador: string;
    }
  >();

  const handleCreador = async () => {
    setCreadorCargando(true);
    try {
      const accounts = await fetchAccountsAvailable(lensClient!, {
        managedBy: evmAddress(creator),
        includeOwned: true,
      });

      if (accounts.isErr()) {
        setCreadorCargando(false);

        return;
      }

      setCreador?.({
        ...accounts.value.items?.[0]?.account,
        creador: creator,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setCreadorCargando(false);
  };

  const handleMasFlujos = async () => {
    if (!creador?.creador) return;

    setMasFlujosCargando(true);
    try {
      const datos = await getAccountWorkflows(creador?.creador, hasMore.skip);

      setHasMore({
        hasMore: datos?.data?.workflowCreateds?.length == 20 ? true : false,
        skip: datos?.data?.workflowCreateds?.length == 20 ? 20 : 0,
      });

      setFlujos([
        ...flujos,
        ...datos?.data?.workflowCreateds?.map((flujo: any) => ({
          tags: flujo?.workflowMetadata?.tags
            ?.replace(/, /g, ",")
            ?.split(",")
            ?.filter((item: string) => item.trim() !== ""),
          creator: flujo?.creator,
          counter: flujo?.counter,
          name: flujo?.workflowMetadata?.name,
          description: flujo?.workflowMetadata?.description,
          cover: flujo?.workflowMetadata?.cover,
          setup: flujo?.workflowMetadata?.setup
            ?.replace(/, /g, ",")
            ?.split(",")
            ?.filter((item: string) => item.trim() !== ""),
          links: flujo?.workflowMetadata?.links,
          workflow: JSON.parse(flujo?.workflowMetadata?.workflow),
          profile: creador,
        })),
      ]);
    } catch (err: any) {
      console.error(err.message);
    }
    setMasFlujosCargando(false);
  };

  const handleFlujos = async () => {
    if (!creador?.creador) return;

    setFlujosCargando(true);
    try {
      const datos = await getAccountWorkflows(creador?.creador, 0);

      setHasMore({
        hasMore: datos?.data?.workflowCreateds?.length == 20 ? true : false,
        skip: datos?.data?.workflowCreateds?.length == 20 ? 20 : 0,
      });

      setFlujos(
        datos?.data?.workflowCreateds?.map((flujo: any) => ({
          tags: flujo?.workflowMetadata?.tags
            ?.replace(/, /g, ",")
            ?.split(",")
            ?.filter((item: string) => item.trim() !== ""),
          creator: flujo?.creator,
          counter: flujo?.counter,
          name: flujo?.workflowMetadata?.name,
          description: flujo?.workflowMetadata?.description,
          cover: flujo?.workflowMetadata?.cover,
          setup: flujo?.workflowMetadata?.setup
            ?.replace(/, /g, ",")
            ?.split(",")
            ?.filter((item: string) => item.trim() !== ""),
          links: flujo?.workflowMetadata?.links,
          workflow: JSON.parse(flujo?.workflowMetadata?.workflow),
          profile: creador,
        }))
      );
    } catch (err: any) {
      console.error(err.message);
    }

    setFlujosCargando(false);
  };

  useEffect(() => {
    if (!creador && creator && lensClient) {
      handleCreador();
    }
  }, [creator, lensClient]);

  useEffect(() => {
    if (flujos?.length < 1 && creador && lensClient) {
      handleFlujos();
    }
  }, [creador, lensClient]);

  return {
    creadorCargando,
    hasMore,
    flujos,
    flujosCargando,
    handleMasFlujos,
    masFlujosCargando,
    creador,
  };
};

export default useCreator;
