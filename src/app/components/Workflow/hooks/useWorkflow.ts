import { useEffect, useState } from "react";
import { Flujo } from "../../Modals/types/modals.types";
import { getWorkflow } from "../../../../../graphql/queries/getWorkflow";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";
import { evmAddress, PublicClient } from "@lens-protocol/client";
import { INFURA_GATEWAY } from "@/app/lib/constants";

const useWorkflow = (counter: string, lensClient: PublicClient) => {
  const [flujo, setFlujo] = useState<Flujo>();
  const [flujoCargando, setFlujoCargando] = useState<boolean>(false);

  const handleFlujo = async () => {
    setFlujoCargando(true);
    try {
      const data = await getWorkflow(Number(counter));

      const accounts = await fetchAccountsAvailable(lensClient!, {
        managedBy: evmAddress(data?.data?.workflowCreateds?.[0]?.creator),
        includeOwned: true,
      });

      let profile = undefined;
      if (accounts.isOk()) {
        profile = accounts.value.items?.[0]?.account;
      }

      let metadata = data?.data?.workflowCreateds?.[0]?.workflowMetadata;

      if (!metadata) {
        const json = await fetch(
          `${INFURA_GATEWAY}/ipfs/${
            data?.data?.workflowCreateds?.[0]?.uri?.split("ipfs://")?.[1]
          }`
        );
        metadata = await json.json();
      }

      setFlujo({
        tags: metadata?.tags
          ?.replace(/, /g, ",")
          ?.split(",")
          ?.filter((item: string) => item.trim() !== ""),
        creator: data?.data?.workflowCreateds?.[0]?.creator,
        counter: data?.data?.workflowCreateds?.[0]?.counter,
        name: metadata?.name,
        description: metadata?.description,
        cover: metadata?.cover,
        setup: metadata?.setup
          ?.replace(/, /g, ",")
          ?.split(",")
          ?.filter((item: string) => item.trim() !== ""),
        links: metadata?.links,
        workflow: JSON.parse(metadata?.workflow),
        profile,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setFlujoCargando(false);
  };

  useEffect(() => {
    if (counter && !flujo && lensClient) {
      handleFlujo();
    }
  }, [counter, lensClient]);

  return {
    flujo,
    flujoCargando,
  };
};

export default useWorkflow;
