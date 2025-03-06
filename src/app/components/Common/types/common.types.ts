import { Account, SessionClient } from "@lens-protocol/client";


export interface LensConnected {
  profile?: Account;
  sessionClient?: SessionClient;
  address?: `0x${string}`;
}


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
