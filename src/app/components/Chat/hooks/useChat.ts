import { SetStateAction, useEffect, useRef, useState } from "react";
import { Mensaje, Usuario } from "../types/chat.types";
import { Flujo } from "../../Modals/types/modals.types";
import { Account, evmAddress, PublicClient } from "@lens-protocol/client";
import OpenAI from "openai";
import { getWorkflows } from "../../../../../graphql/queries/getWorkflows";
import { TextContentBlock } from "openai/resources/beta/threads/messages.mjs";
import { ASSISTANT_ID, STORAGE_NODE } from "@/app/lib/constants";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";
import { LensConnected } from "../../Common/types/common.types";

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
  const [typed, setTyped] = useState<boolean>(true);
  const [typedMessage, setTypedMessage] = useState("");
  const profileCache = new Map<string, Account>();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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
    setPrompt("");
    setTypedMessage("");
    if (internal_prompt?.trim() == "") return;
    setSendMessageLoading(true);
    try {
      let hilo = thread;
      if (mensajes.length == 1 && !hilo) {
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

      setTyped(false);

      const run_res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          prompt: internal_prompt,
          thread: hilo,
        }),
      });

      const run_json = await run_res.json();

      if (run_json?.run) {
        setMensajes([
          ...mensajes?.filter(
            (mensaje) => mensaje !== undefined && mensaje !== null
          ),
          {
            contenido: `${
              !mensajes?.find(
                (men) =>
                  men.contenido ==
                  (
                    run_json?.run?.messages?.[1]
                      ?.content?.[0] as TextContentBlock
                  )?.text?.value
              ) &&
              (run_json?.run?.messages?.[1]?.content?.[0] as TextContentBlock)
                ?.text?.value
                ? `${
                    (
                      run_json?.run?.messages?.[1]
                        ?.content?.[0] as TextContentBlock
                    )?.text?.value
                  }\n\n`
                : ""
            }${
              (run_json?.run?.messages?.[0]?.content?.[0] as TextContentBlock)
                ?.text?.value ?? ""
            }`,
            usuario: Usuario.Maquina,
            action: run_json?.run?.output?.[0]?.name,
          },
          run_json?.run?.output?.[0]?.output &&
            ({
              usuario: Usuario.Flujos,
              flujos: (await Promise.all(
                JSON.parse(run_json?.run?.output?.[0]?.output).map(
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
                          let picture = "";
                          if (profile?.metadata?.picture) {
                            const pictureKey =
                              profile.metadata.picture.split("lens://")?.[1];
                            const cadena = await fetch(
                              `${STORAGE_NODE}/${pictureKey}`
                            );
                            const json = await cadena.json();
                            picture = json.item;
                          }

                          profileCache.set(item?.creator, {
                            ...profile,
                            metadata: {
                              ...profile?.metadata!,
                              picture,
                            },
                          });
                        }
                      }

                      return {
                        creator: item.creator,
                        counter: item.counter,
                        tags: item.workflowMetadata?.tags?.split(", "),
                        name: item.workflowMetadata?.name,
                        description: item.workflowMetadata?.description,
                        cover: item.workflowMetadata?.cover,
                        workflow: JSON.parse(item.workflowMetadata?.workflow),
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
        ]);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setSendMessageLoading(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    if (mensajes) {
      const mensajesLimpiados = (mensajes || [])?.filter(
        (mensaje) => mensaje !== undefined && mensaje !== null
      );

      if (
        mensajesLimpiados?.length > 0 &&
        mensajesLimpiados[mensajesLimpiados?.length - 1]?.usuario ==
          Usuario.Maquina &&
        mensajesLimpiados[mensajesLimpiados?.length - 1]?.contenido &&
        typedMessage.trim() == ""
      ) {
        const ultimoMensaje =
          mensajesLimpiados[mensajesLimpiados?.length - 1]?.contenido;
        let i: number = 0;
        let mensajeEscribiendo = "";

        const interval = setInterval(() => {
          if (i < ultimoMensaje.length) {
            mensajeEscribiendo += ultimoMensaje[i];
            setTypedMessage(mensajeEscribiendo);
            i++;
          } else {
            clearInterval(interval);
          }
        }, 30);

        setTypedMessage("");
        setTyped(true);
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
    typed,
  };
};

export default useChat;
