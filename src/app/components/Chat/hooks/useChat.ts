import { useState } from "react";
import { Usuario } from "../types/chat.types";
import { Flujo } from "../../Modals/types/modals.types";

const useChat = () => {
  const [mensajes, setMensajes] = useState<
    {
      contenido: string;
      usuario: Usuario;
      flujos?: Flujo[];
    }[]
  >([]);
  const [sendMessageLoading, setSendMessageLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");

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

      if (res?.data?.length > 0) {
        setMensajes((prev) => {
          let arr = [...prev];

          let cleanedArray = null;

          if (res?.data?.[1]?.text) {
            const match = res?.data?.[1]?.text.match(/\n\n(\[.*?\])$/);
            cleanedArray = JSON.parse(match[1].trim()).map(
              (item: {
                workflowMetadata: {
                  workflow: string;
                  name: string;
                  tags: string;
                  description: string;
                  cover: string;
                };
              }) => {
                if (item.workflowMetadata?.workflow) {
                  return {
                    tags: item.workflowMetadata?.tags?.split(", "),
                    name: item.workflowMetadata?.name,
                    description: item.workflowMetadata?.description,
                    cover: item.workflowMetadata?.cover,
                    workflow: JSON.parse(item.workflowMetadata?.workflow),
                  };
                }
                return item;
              }
            );
          }
          return [
            ...arr,
            {
              contenido: res.data?.[0]?.text,
              usuario: Usuario.Maquina,
            },
            res?.data?.[1]?.text && {
              contenido: res?.data?.[1]?.text.split("\n\n")[0].trim(),
              usuario: Usuario.Maquina,
            },
            res?.data?.[1]?.text &&
              cleanedArray && {
                flujos: cleanedArray,
                usuario: Usuario.Flujos,
              },
          ];
        });
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
