import { Account, SessionClient } from "@lens-protocol/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { SetStateAction } from "react";

export interface LensConnected {
  profile?: Account;
  sessionClient?: SessionClient;
  address?: `0x${string}`
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
  Cuenta = "Cuenta",
  Info = "Info",
}

export type CambioElementoProps = {
  dict: any;
};
