"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { createContext, SetStateAction, useEffect, useState } from "react";
import { Context, PublicClient, testnet } from "@lens-protocol/client";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import {
  LensConnected,
  Pantalla,
} from "./components/Common/types/common.types";
import { Flujo } from "./components/Modals/types/modals.types";
import { Usuario } from "./components/Chat/types/chat.types";
import { StorageClient } from "@lens-chain/storage-client";
import { chains } from "@lens-chain/sdk/viem";
import OpenAI from "openai";

export const config = createConfig(
  getDefaultConfig({
    appName: "Lucidity",
    walletConnectProjectId: process.env
      .NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
    appUrl: "https://lucidity.agentmeme.xyz",
    appIcon: "https://lucidity.agentmeme.xyz/favicon.ico",
    chains: [chains.testnet],
    transports: {
      [chains.testnet.id]: http("https://rpc.testnet.lens.dev"),
    },
    ssr: true,
  })
);

const queryClient = new QueryClient();

export const ModalContext = createContext<
  | {
      clienteLens: PublicClient<Context> | undefined;
      clienteAlmacenamiento: StorageClient;
      lensConectado: LensConnected | undefined;
      setLensConectado: (e: SetStateAction<LensConnected | undefined>) => void;
      flujo: Flujo | undefined;
      setFlujo: (e: SetStateAction<Flujo | undefined>) => void;
      error: string | undefined;
      setError: (e: SetStateAction<string | undefined>) => void;
      setConnect: (e: SetStateAction<boolean>) => void;
      connect: boolean;
      setCrearCuenta: (e: SetStateAction<boolean>) => void;
      crearCuenta: boolean;
      pantalla: Pantalla;
      setPantalla: (e: SetStateAction<Pantalla>) => void;
      signless: boolean;
      setSignless: (e: SetStateAction<boolean>) => void;
      setMensajes: (
        e: SetStateAction<
          {
            contenido: string;
            usuario: Usuario;
            flujos?: Flujo[];
            flujo?: object;
            action?: string;
          }[]
        >
      ) => void;
      mensajes: {
        contenido: string;
        usuario: Usuario;
        flujos?: Flujo[];
        flujo?: object;
        action?: string;
      }[];
      agente: string | undefined;
      setAgente: (e: SetStateAction<string | undefined>) => void;
      openAI: OpenAI | undefined;
      setOpenAI: (e: SetStateAction<OpenAI | undefined>) => void;
      thread:
        | (OpenAI.Beta.Threads.Thread & {
            _request_id?: string | null;
          })
        | undefined;
      setThread: (
        e: SetStateAction<
          | (OpenAI.Beta.Threads.Thread & {
              _request_id?: string | null;
            })
          | undefined
        >
      ) => void;
      assistant:
        | (OpenAI.Beta.Assistants.Assistant & {
            _request_id?: string | null;
          })
        | undefined;
      setAssistant: (
        e: SetStateAction<
          | (OpenAI.Beta.Assistants.Assistant & {
              _request_id?: string | null;
            })
          | undefined
        >
      ) => void;
    }
  | undefined
>(undefined);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [clienteLens, setClienteLens] = useState<PublicClient | undefined>();
  const [agente, setAgente] = useState<string | undefined>();
  const clienteAlmacenamiento = StorageClient.create();
  const [lensConectado, setLensConectado] = useState<LensConnected>();
  const [signless, setSignless] = useState<boolean>(false);
  const [flujo, setFlujo] = useState<Flujo>();
  const [error, setError] = useState<string | undefined>();
  const [connect, setConnect] = useState<boolean>(false);
  const [crearCuenta, setCrearCuenta] = useState<boolean>(false);
  const [pantalla, setPantalla] = useState<Pantalla>(Pantalla.Chat);
  const [openAI, setOpenAI] = useState<OpenAI>();
  const [mensajes, setMensajes] = useState<
    {
      contenido: string;
      usuario: Usuario;
      flujos?: Flujo[];
      flujo?: object;
      action?: string;
    }[]
  >([]);
  const [assistant, setAssistant] = useState<
    | (OpenAI.Beta.Assistants.Assistant & {
        _request_id?: string | null;
      })
    | undefined
  >();
  const [thread, setThread] = useState<
    OpenAI.Beta.Threads.Thread & {
      _request_id?: string | null;
    }
  >();

  useEffect(() => {
    if (!clienteLens) {
      setClienteLens(
        PublicClient.create({
          environment: testnet,
          storage: window.localStorage,
        })
      );
    }
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          customTheme={{
            "--ck-font-family": '"Nerd Semi", cursive',
          }}
        >
          <ModalContext.Provider
            value={{
              assistant,
              setAssistant,
              thread,
              setThread,
              clienteLens,
              clienteAlmacenamiento,
              openAI,
              setOpenAI,
              lensConectado,
              setLensConectado,
              flujo,
              setFlujo,
              error,
              setError,
              connect,
              setConnect,
              crearCuenta,
              setCrearCuenta,
              pantalla,
              setPantalla,
              signless,
              setSignless,
              mensajes,
              setMensajes,
              agente,
              setAgente,
            }}
          >
            {children}
          </ModalContext.Provider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
