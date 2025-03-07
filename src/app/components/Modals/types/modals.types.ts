import { SetStateAction } from "react";
import { LensConnected } from "../../Common/types/common.types";
import { StorageClient } from "@lens-protocol/storage-node-client";
import { Account, PublicClient } from "@lens-protocol/client";

export type FlujoProps = {
  flujo: Flujo;
  setFlujo: (e: SetStateAction<Flujo | undefined>) => void;
  dict: any;
};

export interface Flujo {
  workflow: object;
  cover: string;
  description: string;
  name: string;
  tags: string[];
  setup: string[];
  links: string[];
  creator: string;
  profile?: Account;
  counter: string;
}

export type ErrorProps = {
  error: string | undefined;
  setError: (e: SetStateAction<string | undefined>) => void;
};

export type ConnectProps = {
  setConnect: (e: SetStateAction<boolean>) => void;
  dict: any;
  lensConectado: LensConnected;
  setError: (e: SetStateAction<string | undefined>) => void;
  setCrearCuenta: (e: SetStateAction<boolean>) => void;
  setLensConectado:
    | ((e: SetStateAction<LensConnected | undefined>) => void)
    | undefined;
  clienteLens: PublicClient;
};

export type CrearCuentaProps = {
  lensConnected: LensConnected | undefined;
  setLensConnected:
    | ((e: SetStateAction<LensConnected | undefined>) => void)
    | undefined;
  setCreateAccount: (e: SetStateAction<boolean>) => void;
  setNotification: (e: SetStateAction<string | undefined>) => void;
  storageClient: StorageClient;
  dict: any;
};

export type SignlessProps = {
  lensConnected: LensConnected | undefined;
  setSignless: (e: SetStateAction<boolean>) => void;
  dict: any;
};
