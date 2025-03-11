import { FunctionComponent, JSX, useContext } from "react";
import useChat from "../hooks/useChat";
import { Usuario } from "../types/chat.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import { CambioElementoProps } from "../../Common/types/common.types";
import Mensajes from "./Mensajes";

const Chat: FunctionComponent<CambioElementoProps> = ({
  dict,
}): JSX.Element => {
  const contexto = useContext(ModalContext);
  const {
    prompt,
    setPrompt,
    handleSendMessage,
    sendMessageLoading,
    messagesEndRef,
    typedMessage,
  } = useChat(
    contexto?.lensConectado!,
    contexto?.clienteLens!,
    contexto?.setMensajes!,
    contexto?.mensajes!,
    contexto?.setAgente!,
    contexto?.agente!
  );

  return (
    <div
      className={`relative w-full pb-3 h-full flex flex-col ${
        Number(contexto?.mensajes?.length) > 0 || sendMessageLoading
          ? "justify-between items-start"
          : "items-center justify-center"
      }`}
    >
      {(Number(contexto?.mensajes?.length) > 0 || sendMessageLoading) && (
        <Mensajes
          mensajes={contexto?.mensajes!}
          sendMessageLoading={sendMessageLoading}
          messagesEndRef={messagesEndRef}
          dict={dict}
          setFlujo={contexto?.setFlujo!}
          typedMessage={typedMessage}
          user={
            contexto?.lensConectado?.profile?.username
              ? contexto?.lensConectado?.profile?.username?.localName?.length >
                10
                ? contexto?.lensConectado?.profile?.username?.localName?.slice(
                    0,
                    6
                  ) + "..."
                : contexto?.lensConectado?.profile?.username?.localName
              : contexto?.lensConectado?.address
              ? contexto?.lensConectado?.address?.slice(0, 6) + "..."
              : undefined
          }
        />
      )}
      <div
        className={`relative w-full h-fit p-6 flex ${
          (Number(contexto?.mensajes?.length) > 0 || sendMessageLoading) &&
          "bg-white rounded-b-sm"
        }`}
      >
        <div
          className={`relative w-full h-fit flex ${
            Number(contexto?.mensajes?.length) > 0 || sendMessageLoading
              ? "items-start justify-start"
              : "items-center justify-center"
          } `}
        >
          <div
            className={`relative flex flex-row gap-2 items-start justify-start rounded-md bg-black h-10 px-2 py-1 ${
              Number(contexto?.mensajes?.length) > 0 || sendMessageLoading
                ? "w-full"
                : "w-full sm:w-3/4 lg:w-1/2"
            }`}
          >
            <input
              onChange={(e) => setPrompt(e.target.value)}
              className="font-dep text-xs uppercase text-ama focus:outline-none relative w-full h-full rounded-md bg-black placeholder:text-ama"
              value={prompt}
              placeholder={
                Number(contexto?.mensajes?.length) < 1
                  ? dict?.Home.placeholder
                  : ""
              }
              onKeyDown={(e) => {
                if (e.key == "Enter" && prompt?.trim() !== "") {
                  contexto?.setMensajes([
                    ...(contexto?.mensajes || [])?.filter(
                      (mensaje) => mensaje !== undefined && mensaje !== null
                    ),
                    {
                      contenido: prompt,
                      usuario: Usuario.Humano,
                    },
                  ]);

                  handleSendMessage([
                    ...(contexto?.mensajes || [])?.filter(
                      (mensaje) => mensaje !== undefined && mensaje !== null
                    ),
                    {
                      contenido: prompt,
                      usuario: Usuario.Humano,
                    },
                  ]);
                }
              }}
            />
            <div
              className={`relative w-fit h-full flex items-center justify-center ${
                prompt?.trim() !== ""
                  ? "cursor-pointer hover:opacity-70"
                  : "opacity-50"
              }`}
              onClick={() => {
                contexto?.setMensajes([
                  ...(contexto?.mensajes || [])?.filter(
                    (mensaje) => mensaje !== undefined && mensaje !== null
                  ),
                  {
                    contenido: prompt,
                    usuario: Usuario.Humano,
                  },
                ]);
                handleSendMessage([
                  ...(contexto?.mensajes || [])?.filter(
                    (mensaje) => mensaje !== undefined && mensaje !== null
                  ),
                  {
                    contenido: prompt,
                    usuario: Usuario.Humano,
                  },
                ]);
              }}
            >
              <div className="relative w-5 h-5 flex">
                <Image
                  draggable={false}
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/QmPhN6mi9CdNo4RHmcqfUgxHayZhaZwLktH6Apd8yp6n3P`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
