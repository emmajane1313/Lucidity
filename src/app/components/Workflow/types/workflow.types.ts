import {
  ImageMetadata,
  Post,
  PublicClient,
  TextOnlyMetadata,
} from "@lens-protocol/client";
import { LensConnected } from "../../Common/types/common.types";
import { StorageClient } from "@lens-protocol/storage-node-client";
import { SetStateAction } from "react";
import { Flujo } from "../../Modals/types/modals.types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export type InteraccionesProps = {
  clienteLens: PublicClient;
  lensConectado: LensConnected;
  storageClient: StorageClient;
  setError: (e: SetStateAction<string | undefined>) => void;
  setSignless: (e: SetStateAction<boolean>) => void;
  flujo: Flujo | undefined;
  router: AppRouterInstance;
  dict: any;
};

export type MetadataProps = {
  metadata: string;
  data: TextOnlyMetadata | ImageMetadata;
};

export type PublicacionProps = {
  activity: Post;
  router: AppRouterInstance;
  lensConnected: LensConnected;
  setError: (e: SetStateAction<string | undefined>) => void;
  setSignless: (e: SetStateAction<boolean>) => void;
  storageClient: StorageClient;
  post?: boolean;
  dict: any;
};
