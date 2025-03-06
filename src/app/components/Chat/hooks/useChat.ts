import { useState } from "react";
import { Usuario } from "../types/chat.types";
import { Flujo } from "../../Modals/types/modals.types";
import { Account, evmAddress, PublicClient } from "@lens-protocol/client";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";
import { LensConnected } from "../../Common/types/common.types";
import { STORAGE_NODE } from "@/app/lib/constants";

const useChat = (lensConnected: LensConnected, lensClient: PublicClient) => {
  const [mensajes, setMensajes] = useState<
    {
      contenido: string;
      usuario: Usuario;
      flujos?: Flujo[];
      flujo?: object;
      action?: string;
    }[]
  >([]);
  const [sendMessageLoading, setSendMessageLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const profileCache = new Map<string, Account>();

  const handleSendMessage = async () => {
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

      const res = await chat.json();

      console.log({ res });

      if (res?.data?.length > 0) {
        let arr = [...mensajes];

        let cleanedArray = null;

        if (res?.data?.[0]?.action && res?.data?.[0]?.text) {
          if (res?.data?.[0]?.action == "GET_WORKFLOW") {
            const match = res?.data?.[1]?.text.match(/\n\n(\[.*?\])$/);
            cleanedArray = await Promise.all(
              JSON.parse(match[1].trim()).map(
                async (item: {
                  creator: string;
                  workflowMetadata: {
                    workflow: string;
                    name: string;
                    tags: string;
                    description: string;
                    cover: string;
                    setup: string;
                  };
                }) => {
                  if (item.workflowMetadata?.workflow) {
                    if (!profileCache.get(item?.creator)) {
                      const result = await fetchAccountsAvailable(
                        lensConnected?.sessionClient ?? lensClient,
                        {
                          managedBy: evmAddress(item?.creator),
                          includeOwned: true,
                        }
                      );

                      if (result.isErr()) {
                        setSendMessageLoading(false);
                        return;
                      }

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

                    return {
                      creator: item.creator,
                      tags: item.workflowMetadata?.tags?.split(", "),
                      name: item.workflowMetadata?.name,
                      description: item.workflowMetadata?.description,
                      cover: item.workflowMetadata?.cover,
                      workflow: JSON.parse(item.workflowMetadata?.workflow),
                      setup: item?.workflowMetadata?.setup?.split(", "),
                      profile: profileCache.get(item?.creator),
                    };
                  }
                  return item;
                }
              )
            );
          } else if (res?.data?.[0]?.action == "CREATE_WORKFLOW") {
            const match = res?.data?.[1]?.text.match(
              /Workflow JSON:\s*(\{[\s\S]*\}|\[[\s\S]*\])$/
            );
            const workflow = JSON.parse(match[1].trim());

            cleanedArray = Object.entries(workflow).map(([key, node]: any) => ({
              id: key,
              title: node._meta?.title || "Unknown Node",
              type: node.class_type || "Unknown Type",
              inputs: node.inputs || {},
            }));
          }
        }

        console.log(cleanedArray)

        setMensajes([
          ...arr,
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
        ]);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setSendMessageLoading(false);
  };

  return {
    mensajes,
    prompt,
    setPrompt,
    setMensajes,
    handleSendMessage,
    sendMessageLoading,
  };
};

export default useChat;
