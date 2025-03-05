import { useEffect, useState } from "react";
import { Flujo } from "../../Modals/types/modals.types";
import { Account } from "@lens-protocol/client";
import { getAccountWorkflows } from "../../../../../graphql/queries/getAccountWorkflows";

const useCuenta = () => {
  const [cuentaCargando, setCuentaCargando] = useState<boolean>(false);
  const [flujosCargando, setFlujosCargando] = useState<boolean>(false);
  const [masFlujosCargando, setMasFlujosCargando] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<{ hasMore: boolean; skip: number }>({
    hasMore: true,
    skip: 0,
  });
  const [flujos, setFlujos] = useState<Flujo[]>([]);
  const [cuenta, setCuenta] = useState<
    | {
        perfil: Account;
        direccion: `0x${string}`;
      }
    | undefined
  >();

  const handleCuenta = async () => {
    setCuentaCargando(true);
    try {
    } catch (err: any) {
      console.error(err.message);
    }
    setCuentaCargando(false);
  };

  const handleMasFlujos = async () => {
    if (!cuenta?.direccion) return;

    setMasFlujosCargando(true);
    try {
      const datos = await getAccountWorkflows(cuenta?.direccion, hasMore.skip);

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
        })),
      ]);
    } catch (err: any) {
      console.error(err.message);
    }
    setMasFlujosCargando(false);
  };

  const handleFlujos = async () => {
    if (!cuenta?.direccion) return;

    setFlujosCargando(true);
    try {
      const datos = await getAccountWorkflows(cuenta?.direccion, 0);

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

    if (!cuenta) {
      handleCuenta();
    }
  }, []);

  return {
    cuentaCargando,
    flujosCargando,
    flujos,
    handleMasFlujos,
    hasMore,
    masFlujosCargando
  };
};
export default useCuenta;
