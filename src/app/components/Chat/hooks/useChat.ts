import { SetStateAction, useEffect, useRef, useState } from "react";
import { Mensaje, Usuario } from "../types/chat.types";
import { Flujo } from "../../Modals/types/modals.types";
import { Account, evmAddress, PublicClient } from "@lens-protocol/client";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";
import { LensConnected } from "../../Common/types/common.types";
import { STORAGE_NODE } from "@/app/lib/constants";

const useChat = (
  lensConnected: LensConnected,
  lensClient: PublicClient,
  setMensajes: (e: SetStateAction<Mensaje[]>) => void,
  mensajes: Mensaje[],
  setAgente: (e: SetStateAction<string | undefined>) => void,
  agente: string | undefined
) => {
  const [sendMessageLoading, setSendMessageLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
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
    if (prompt?.trim() == "") return;
    setSendMessageLoading(true);
    try {
      const formData = new FormData();
      formData.append("text", prompt);
      formData.append("user", "user");
      setPrompt("");
      const chat = await fetch(`/api/chat`, {
        method: "POST",
        body: formData,
      });
      // const chat = await fetch(`/api/chat?sessionId=${agente}`, {
      //   method: "POST",
      //   body: formData,
      // });
      setTypedMessage("");
      const res = await chat.json();

      if (res?.data?.length > 0) {
        let cleanedArray = null;

        if (res?.data?.[0]?.action && res?.data?.[1]?.text) {
          if (res?.data?.[0]?.action == "GET_WORKFLOW") {
            const match = res?.data?.[1]?.text.match(/\n\n(\[.*?\])$/);
            if (
              !match?.[1]
                .trim()
                ?.includes("I couldn't find any matching workflows") &&
              match?.[1].trim()
            ) {
              cleanedArray = await Promise.all(
                JSON.parse(match?.[1].trim()).map(
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
                      // if (
                      //   !profileCache.get(item?.creator) &&
                      //   (lensClient || lensConnected?.sessionClient)
                      // ) {
                      //   const result = await fetchAccountsAvailable(
                      //     lensConnected?.sessionClient ?? lensClient,
                      //     {
                      //       managedBy: evmAddress(item?.creator),
                      //       includeOwned: true,
                      //     }
                      //   );

                      //   if (result.isOk()) {
                      //     const profile = result?.value.items[0]
                      //       ?.account as Account;
                      //     let picture = "";
                      //     if (profile?.metadata?.picture) {
                      //       const pictureKey =
                      //         profile.metadata.picture.split("lens://")?.[1];
                      //       const cadena = await fetch(
                      //         `${STORAGE_NODE}/${pictureKey}`
                      //       );
                      //       const json = await cadena.json();
                      //       picture = json.item;
                      //     }

                      //     profileCache.set(item?.creator, {
                      //       ...profile,
                      //       metadata: {
                      //         ...profile?.metadata!,
                      //         picture,
                      //       },
                      //     });
                      //   }
                      // }

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
              );
            }
          } else if (res?.data?.[0]?.action == "CREATE_WORKFLOW") {
            const match = res?.data?.[1]?.text.match(
              /Workflow JSON:\s*(\{[\s\S]*\}|\[[\s\S]*\])$/
            );

            if (match?.[1].trim()) {
              const workflow = JSON.parse(match[1].trim());

              cleanedArray = Object.entries(workflow).map(
                ([key, node]: any) => ({
                  id: key,
                  title: node._meta?.title || "Unknown Node",
                  type: node.class_type || "Unknown Type",
                  inputs: node.inputs || {},
                })
              );
            }
          }
        }

        setMensajes(
          [
            ...mensajes?.filter(
              (mensaje) => mensaje !== undefined && mensaje !== null
            ),
            {
              contenido: res.data?.[0]?.text,
              usuario: Usuario.Maquina,
              action: res.data?.[0]?.action,
            },
            res?.data?.[1]?.text && {
              contenido: res?.data?.[1]?.text?.split("\n\n")?.[0]?.trim(),
              usuario: Usuario.Maquina,
            },
            cleanedArray &&
              (res?.data?.[0]?.action == "GET_WORKFLOW"
                ? {
                    flujos: cleanedArray,
                    usuario: Usuario.Flujos,
                  }
                : {
                    flujo: cleanedArray,
                    usuario: Usuario.NewFlujo,
                  }),
          ]?.filter((mensaje) => mensaje !== undefined && mensaje !== null)
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setSendMessageLoading(false);
  };

  // const conectarAgente = async () => {
  //   try {
  //     const connect = await fetch(`/api/connect`, {
  //       method: "POST",
  //     });

  //     const res = await connect.json();

  //     setAgente(res?.data?.sessionId);
  //   } catch (err: any) {
  //     console.error(err.message);
  //   }
  // };

  // const disconnectAgent = async () => {
  //   if (!agente) return;
  //   console.log("🚪 Intentando desconectar agente:", agente);

  //   try {
  //     await fetch("/api/disconnect", {
  //       method: "POST",
  //       body: JSON.stringify({ sessionId: agente }),
  //       headers: { "Content-Type": "application/json" },
  //       keepalive: true,
  //     });
  //   } catch (err: any) {
  //     console.error(err.message);
  //   }
  // };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    const mensajesLimpiados = mensajes?.filter(
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
      return () => clearInterval(interval);
    }
  }, [mensajes]);

  // useEffect(() => {
  //   if (!agente) {
  //     conectarAgente();

  // window.addEventListener("beforeunload", disconnectAgent);
  // document.addEventListener("visibilitychange", () => {
  //   if (document.hidden) disconnectAgent();
  // });

  // return () => {
  //   window.removeEventListener("beforeunload", disconnectAgent);
  //   document.removeEventListener("visibilitychange", disconnectAgent);
  // };
  // }
  // }, [agente]);

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
