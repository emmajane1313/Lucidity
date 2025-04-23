import { Account, SessionClient } from "@lens-protocol/client";


export interface LensConnected {
  profile?: Account;
  sessionClient?: SessionClient;
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
