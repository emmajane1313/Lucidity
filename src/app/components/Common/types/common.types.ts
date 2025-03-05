import { Account, SessionClient } from "@lens-protocol/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { SetStateAction } from "react";

export interface LensConnected {
  profile?: Account;
  sessionClient?: SessionClient;
}


export type LeftBarProps = {
  setAbrirBar: (e: SetStateAction<boolean>) => void;
  router: AppRouterInstance;
  abrirBar: boolean;
  setPantalla: (e: SetStateAction<Pantalla>) => void;
  pantalla: Pantalla;
  dict: any;
  lensConectado: LensConnected | undefined;
};

export type CambioProps = {
  pantalla: Pantalla;
  dict: any;
};

export enum Pantalla {
  Workflows = "Workflows",
  Crear = "Crear",
  Chat = "Chat",
  Cuenta = "Cuenta"
}

export type CambioElementoProps = {
  dict: any;
};
