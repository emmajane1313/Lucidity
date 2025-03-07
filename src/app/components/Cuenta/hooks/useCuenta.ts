import { useEffect, useState } from "react";
import { Flujo } from "../../Modals/types/modals.types";
import { getAccountWorkflows } from "../../../../../graphql/queries/getAccountWorkflows";
import { LensConnected } from "../../Common/types/common.types";

const useCuenta = (lensConectado: LensConnected) => {
  const [flujosCargando, setFlujosCargando] = useState<boolean>(false);
  const [masFlujosCargando, setMasFlujosCargando] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<{ hasMore: boolean; skip: number }>({
    hasMore: true,
    skip: 0,
  });
  const [flujos, setFlujos] = useState<Flujo[]>([]);

  const handleMasFlujos = async () => {
    if (!lensConectado?.address) return;

    setMasFlujosCargando(true);
    try {
      const datos = await getAccountWorkflows(
        lensConectado?.address,
        hasMore.skip
      );

      setHasMore({
        hasMore: datos?.data?.workflowCreateds?.length == 20 ? true : false,
        skip: datos?.data?.workflowCreateds?.length == 20 ? 20 : 0,
      });

      setFlujos([
        ...flujos,
        ...datos?.data?.workflowCreateds?.map((flujo: any) => ({
          tags: flujo?.workflowMetadata?.tags?.split(", "),
          creator: flujo?.creator,
          counter: flujo?.counter,
          name: flujo?.workflowMetadata?.name,
          description: flujo?.workflowMetadata?.description,
          cover: flujo?.workflowMetadata?.cover,
          setup: flujo?.workflowMetadata?.setup?.split(", "),
          links: flujo?.workflowMetadata?.links,
          workflow: JSON.parse(flujo?.workflowMetadata?.workflow),
          profile: lensConectado?.profile,
        })),
      ]);
    } catch (err: any) {
      console.error(err.message);
    }
    setMasFlujosCargando(false);
  };

  const handleFlujos = async () => {
    if (!lensConectado?.address) return;

    setFlujosCargando(true);
    try {
      const datos = await getAccountWorkflows(lensConectado?.address, 0);

      setHasMore({
        hasMore: datos?.data?.workflowCreateds?.length == 20 ? true : false,
        skip: datos?.data?.workflowCreateds?.length == 20 ? 20 : 0,
      });

      setFlujos(
        datos?.data?.workflowCreateds?.map((flujo: any) => ({
          tags: flujo?.workflowMetadata?.tags?.split(", "),
          creator: flujo?.creator,
          counter: flujo?.counter,
          name: flujo?.workflowMetadata?.name,
          description: flujo?.workflowMetadata?.description,
          cover: flujo?.workflowMetadata?.cover,
          setup: flujo?.workflowMetadata?.setup?.split(", "),
          links: flujo?.workflowMetadata?.links,
          workflow: JSON.parse(flujo?.workflowMetadata?.workflow),
          profile: lensConectado?.profile,
        }))
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
    handleMasFlujos,
    hasMore,
    masFlujosCargando,
  };
};
export default useCuenta;
