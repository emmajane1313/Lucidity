import { useEffect, useState } from "react";
import { Flujo } from "../../Modals/types/modals.types";
import { getAccountWorkflows } from "../../../../../graphql/queries/getAccountWorkflows";
import { LensConnected } from "../../Common/types/common.types";
import { INFURA_GATEWAY } from "@/app/lib/constants";

const useCuenta = (
  lensConectado: LensConnected,
  address: `0x${string}` | undefined
) => {
  const [flujosCargando, setFlujosCargando] = useState<boolean>(false);
  const [masFlujosCargando, setMasFlujosCargando] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<{ hasMore: boolean; skip: number }>({
    hasMore: true,
    skip: 0,
  });
  const [flujos, setFlujos] = useState<Flujo[]>([]);

  const handleMasFlujos = async () => {
    if (!address) return;

    setMasFlujosCargando(true);
    try {
      const datos = await getAccountWorkflows(
        address,
        hasMore.skip
      );

      setHasMore({
        hasMore: datos?.data?.workflowCreateds?.length == 20 ? true : false,
        skip: datos?.data?.workflowCreateds?.length == 20 ? 20 : 0,
      });

      setFlujos([
        ...flujos,
        ...(await Promise.all(
          datos?.data?.workflowCreateds?.map(async (flujo: any) => {
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
              creator: flujo?.creator,
              counter: flujo?.counter,
              name: metadata?.name,
              description: metadata?.description,
              cover: metadata?.cover,
              setup: metadata?.setup
                ?.replace(/, /g, ",")
                ?.split(",")
                ?.filter((item: string) => item.trim() !== ""),
              links: metadata?.links,
              workflow: JSON.parse(metadata?.workflow),
              profile: lensConectado?.profile,
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
    if (!address) return;

    setFlujosCargando(true);
    try {
      const datos = await getAccountWorkflows(address, 0);

      setHasMore({
        hasMore: datos?.data?.workflowCreateds?.length == 20 ? true : false,
        skip: datos?.data?.workflowCreateds?.length == 20 ? 20 : 0,
      });

      setFlujos(
        await Promise.all(
          datos?.data?.workflowCreateds?.map(async (flujo: any) => {
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
              creator: flujo?.creator,
              counter: flujo?.counter,
              name: metadata?.name,
              description: metadata?.description,
              cover: metadata?.cover,
              setup: metadata?.setup
                ?.replace(/, /g, ",")
                ?.split(",")
                ?.filter((item: string) => item.trim() !== ""),
              links: metadata?.links,
              workflow: JSON.parse(metadata?.workflow),
              profile: lensConectado?.profile,
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
    handleMasFlujos,
    hasMore,
    masFlujosCargando,
  };
};
export default useCuenta;
