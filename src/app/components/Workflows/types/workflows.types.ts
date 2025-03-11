import { SetStateAction } from "react";
import { Flujo } from "../../Modals/types/modals.types";

export type FlujosProps = {
  handleMasFlujos: () => Promise<void>;
  flujos: Flujo[];
  hasMore: {
    skip: number;
    hasMore: boolean;
  };
  setFlujo: (e: SetStateAction<Flujo | undefined>) => void;
  masFlujosCargando: boolean;
  flujosCargando: boolean;
  texto: string;
  otroCargando?: boolean;
  color?: boolean;
};
