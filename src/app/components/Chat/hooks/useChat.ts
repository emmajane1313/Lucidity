import { SetStateAction, useEffect, useRef, useState } from "react";
import { Mensaje, Usuario } from "../types/chat.types";
import { Flujo } from "../../Modals/types/modals.types";
import { Account, evmAddress, PublicClient } from "@lens-protocol/client";
import { TextContentBlock } from "openai/resources/beta/threads/messages.mjs";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";
import { LensConnected } from "../../Common/types/common.types";
import { procesarMensaje } from "@/app/lib/helpers/procesarMensaje";

const useChat = (
  setMensajes: (e: SetStateAction<Mensaje[]>) => void,
  mensajes: Mensaje[],
  lensConnected: LensConnected,
  lensClient: PublicClient,
  thread: string | undefined,
  setThread: (e: SetStateAction<string | undefined>) => void
) => {
  const [sendMessageLoading, setSendMessageLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [typedMessage, setTypedMessage] = useState("");
  const profileCache = new Map<string, Account>();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const lastMessageRef = useRef<string | null>(null);

  const handleSendMessage = async (
    mensajes: {
      contenido: string;
      usuario: Usuario;
      flujos?: Flujo[];
      flujo?: object;
      action?: string;
    }[]
  ) => {
    let internal_prompt = prompt;
    if (internal_prompt?.trim() == "") return;
    setSendMessageLoading(true);
    setPrompt("");
    setTypedMessage("");
    try {
      let hilo = thread;
      if (!hilo) {
        const res = await fetch("/api/thread", {
          method: "POST",
        });
        const json = await res.json();
        hilo = json?.threadId;
        setThread(hilo);
      }

      if (!hilo) {
        setSendMessageLoading(false);
        return;
      }

      const run_res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          prompt: internal_prompt,
          thread: hilo,
        }),
      });

      const run_json = await run_res.json();
      if (run_json?.run) {
        const mensajeContenido0 =
          (run_json?.run?.messages?.[0]?.content?.[0] as TextContentBlock)?.text
            ?.value ?? "";

        const mensajeContenido1 =
          (run_json?.run?.messages?.[1]?.content?.[0] as TextContentBlock)?.text
            ?.value ?? "";

        const mensajeExiste0 = mensajes?.some(
          (mensaje) => mensaje.contenido === mensajeContenido0
        );

        const mensajeExiste1 = mensajeContenido1
          ? mensajes?.some((mensaje) => mensaje.contenido === mensajeContenido1)
          : true;

        const nuevosMensajes = [];

        if (!mensajeExiste1 && mensajeContenido1.trim() !== "") {
          nuevosMensajes.push({
            contenido: mensajeContenido1,
            usuario: Usuario.Maquina,
            action: run_json?.run?.output?.[0]?.name,
          });
        }

        if (mensajeContenido0.includes("```json")) {
          nuevosMensajes.push(...procesarMensaje(mensajeContenido0));
        } else if (!mensajeExiste0 && mensajeContenido0.trim() !== "") {
          nuevosMensajes.push({
            contenido: mensajeContenido0,
            usuario: Usuario.Maquina,
            action: run_json?.run?.output?.[0]?.name,
          });
        }

        if (nuevosMensajes.length > 0) {
          setMensajes(
            [
              ...mensajes,
              ...nuevosMensajes,
              run_json?.run?.output?.[0]?.output &&
                ({
                  usuario: Usuario.Flujos,
                  flujos: (await Promise.all(
                    JSON.parse(run_json?.run?.output?.[0]?.output)?.map(
                      async (item: {
                        creator: string;
                        counter: string;
                        workflowMetadata: {
                          workflow: string;
                          name: string;
                          tags: string;
                          description: string;
                          cover: string;
                          setup: string;
                          links: string[];
                        };
                      }) => {
                        if (item.workflowMetadata?.workflow) {
                          if (
                            !profileCache.get(item?.creator) &&
                            (lensClient || lensConnected?.sessionClient)
                          ) {
                            const result = await fetchAccountsAvailable(
                              lensConnected?.sessionClient ?? lensClient,
                              {
                                managedBy: evmAddress(item?.creator),
                                includeOwned: true,
                              }
                            );

                            if (result.isOk()) {
                              const profile = result?.value.items[0]
                                ?.account as Account;
                              
                              profileCache.set(item?.creator, profile);
                            }
                          }

                          return {
                            creator: item.creator,
                            counter: item.counter,
                            tags: item.workflowMetadata?.tags?.split(", "),
                            name: item.workflowMetadata?.name,
                            description: item.workflowMetadata?.description,
                            cover: item.workflowMetadata?.cover,
                            workflow: JSON.parse(
                              item.workflowMetadata?.workflow
                            ),
                            setup: item?.workflowMetadata?.setup?.split(", "),
                            links: item?.workflowMetadata?.links,
                            profile: profileCache.get(item?.creator),
                          };
                        }
                        return item;
                      }
                    )
                  )) as Flujo[],
                } as any),
            ]?.filter((mensaje) => mensaje !== undefined && mensaje !== null)
          );
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setSendMessageLoading(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });

    if (mensajes) {
      const mensajesLimpiados = (mensajes || [])?.filter(
        (mensaje) => mensaje !== undefined && mensaje !== null
      );
      const ultimoMensaje = mensajesLimpiados[mensajesLimpiados.length - 1];

      if (
        mensajesLimpiados?.length > 0 &&
        mensajesLimpiados[mensajesLimpiados?.length - 1]?.usuario ==
          Usuario.Maquina &&
        ultimoMensaje &&
        lastMessageRef.current !== ultimoMensaje.contenido &&
        typedMessage == ""
      ) {
        lastMessageRef.current = ultimoMensaje.contenido;
        let i: number = 0;
        let mensajeEscribiendo = "";

        const interval = setInterval(() => {
          if (i < ultimoMensaje.contenido.length) {
            mensajeEscribiendo += ultimoMensaje.contenido[i];
            setTypedMessage(mensajeEscribiendo);
            i++;
          } else {
            setTypedMessage("");
            clearInterval(interval);
          }
        }, 30);

        return () => clearInterval(interval);
      }
    }
  }, [mensajes]);

  return {
    prompt,
    setPrompt,
    handleSendMessage,
    sendMessageLoading,
    messagesEndRef,
    typedMessage,
  };
};

export default useChat;
