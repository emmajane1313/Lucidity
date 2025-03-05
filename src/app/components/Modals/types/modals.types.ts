import { SetStateAction } from "react";
import { LensConnected } from "../../Common/types/common.types";
import { StorageClient } from "@lens-protocol/storage-node-client";

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
}

export type ErrorProps = {
  error: string | undefined;
  setError: (e: SetStateAction<string | undefined>) => void;
};


export type CrearCuentaProps = {
  address: `0x${string}` | undefined;
  lensConnected: LensConnected | undefined;
  setLensConnected:
    | ((e: SetStateAction<LensConnected | undefined>) => void)
    | undefined;
  setCreateAccount: (e: SetStateAction<boolean>) => void;
  setIndexer: (e: SetStateAction<string | undefined>) => void;
  setNotification: (e: SetStateAction<string | undefined>) => void;
  storageClient: StorageClient;
};