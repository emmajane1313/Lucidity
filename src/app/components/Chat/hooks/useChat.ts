import { useState } from "react";
import { Usuario } from "../types/chat.types";

const useChat = () => {
  const [mensajes, setMensajes] = useState<
    { contenido: string; usuario: Usuario }[]
  >([]);
  const [sendMessageLoading, setSendMessageLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");

  const handleSendMessage = async () => {
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
            cleanedArray = JSON.parse(
              res.data?.[1]?.text?.split("$$WORKFLOWS$$")[1]
            ).map(
              (item: {
                workflowMetadata: {
                  workflow: string;
                };
              }) => {
                if (item.workflowMetadata?.workflow) {
                  return {
                    ...item,
                    workflowMetadata: {
                      ...item.workflowMetadata,
                      workflow: JSON.parse(item.workflowMetadata.workflow),
                    },
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
              contenido: res.data?.[1]?.text?.split("$$WORKFLOWS$$")[0],
              usuario: Usuario.Maquina,
            },
            res?.data?.[1]?.text &&
              cleanedArray && {
                contenido: cleanedArray,
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
