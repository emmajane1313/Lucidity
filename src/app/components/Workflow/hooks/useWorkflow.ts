import { useEffect, useState } from "react";
import { Flujo } from "../../Modals/types/modals.types";
import { getWorkflow } from "../../../../../graphql/queries/getWorkflow";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";
import { evmAddress, PublicClient } from "@lens-protocol/client";
import { STORAGE_NODE } from "@/app/lib/constants";

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

        profile = {
          ...accounts.value.items?.[0]?.account,
          metadata: {
            ...accounts.value.items?.[0]?.account?.metadata!,
            picture,
          },
        };
      }


      setFlujo({
        tags: data?.data?.workflowCreateds?.[0]?.workflowMetadata?.tags?.split(
          ", "
        ),
        creator: data?.data?.workflowCreateds?.[0]?.creator,
        counter: data?.data?.workflowCreateds?.[0]?.counter,
        name: data?.data?.workflowCreateds?.[0]?.workflowMetadata?.name,
        description:
          data?.data?.workflowCreateds?.[0]?.workflowMetadata?.description,
        cover: data?.data?.workflowCreateds?.[0]?.workflowMetadata?.cover,
        setup:
          data?.data?.workflowCreateds?.[0]?.workflowMetadata?.setup?.split(
            ", "
          ),
        workflow: JSON.parse(
          data?.data?.workflowCreateds?.[0]?.workflowMetadata?.workflow
        ),
        profile,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setFlujoCargando(false);
  };

  useEffect(() => {
    if (counter && !flujo) {
      handleFlujo();
    }
  }, [counter]);

  return {
    flujo,
    flujoCargando,
  };
};

export default useWorkflow;
