import { useEffect, useState } from "react";
import { Flujo } from "../../Modals/types/modals.types";
import { getAllWorkflows } from "../../../../../graphql/queries/getAllWorkflows";
import { getWorkflows } from "../../../../../graphql/queries/getWorkflows";

const useFlujos = () => {
  const [flujosCargando, setFlujosCargando] = useState<boolean>(false);
  const [masFlujosCargando, setMasFlujosCargando] = useState<boolean>(false);
  const [flujos, setFlujos] = useState<Flujo[]>([]);
  const [buscarCargando, setBuscarCargando] = useState<boolean>(false);
  const [buscar, setBuscar] = useState<string>("");
  const [hasMore, setHasMore] = useState<{ hasMore: boolean; skip: number }>({
    hasMore: true,
    skip: 0,
  });

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
        datos?.data?.workflowCreateds?.map((flujo: any) => ({
          tags: flujo?.workflowMetadata?.tags?.split(", "),
          name: flujo?.workflowMetadata?.name,
          description: flujo?.workflowMetadata?.description,
          cover: flujo?.workflowMetadata?.cover,
          workflow: JSON.parse(flujo?.workflowMetadata?.workflow),
          setup: flujo?.workflowMetadata?.setup?.split(", "),
        }))
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
        ...datos?.data?.workflowCreateds?.map((flujo: any) => ({
          tags: flujo?.workflowMetadata?.tags?.split(", "),
          name: flujo?.workflowMetadata?.name,
          description: flujo?.workflowMetadata?.description,
          cover: flujo?.workflowMetadata?.cover,
          workflow: JSON.parse(flujo?.workflowMetadata?.workflow),
          setup: flujo?.workflowMetadata?.setup?.split(", "),
        })),
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
        datos?.data?.workflowCreateds?.map((flujo: any) => ({
          tags: flujo?.workflowMetadata?.tags?.split(", "),
          name: flujo?.workflowMetadata?.name,
          description: flujo?.workflowMetadata?.description,
          cover: flujo?.workflowMetadata?.cover,
          workflow: JSON.parse(flujo?.workflowMetadata?.workflow),
          setup: flujo?.workflowMetadata?.setup?.split(", "),
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
