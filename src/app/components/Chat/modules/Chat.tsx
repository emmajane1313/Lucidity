import { FunctionComponent, JSX, useContext } from "react";
import useChat from "../hooks/useChat";
import { Usuario } from "../types/chat.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import { CambioElementoProps } from "../../Common/types/common.types";

const Chat: FunctionComponent<CambioElementoProps> = ({
  dict,
}): JSX.Element => {
  const {
    mensajes,
    prompt,
    setPrompt,
    setMensajes,
    handleSendMessage,
    sendMessageLoading,
  } = useChat();
  const contexto = useContext(ModalContext);

  return (
    <div
      className={`relative w-full pb-10 h-full flex flex-col gap-10 ${
        mensajes?.length > 0 || sendMessageLoading
          ? "justify-between items-start"
          : "items-center justify-center"
      }`}
    >
      {(mensajes?.length > 0 || sendMessageLoading) && (
        <div className="relative w-full h-full overflow-y-scroll flex justify-end items-end">
          <div className="relative w-full h-fit items-start justify-end flex flex-col gap-3 font-nerdC text-lg">
            {mensajes?.map((valor, indice) => {
              return (
                <div
                  key={indice}
                  className={`relative text-white w-full h-fit flex ${
                    valor?.usuario == Usuario.Humano
                      ? "justify-end text-right"
                      : "justify-start text-left"
                  }`}
                >
                  {valor?.usuario !== Usuario.Flujos ? (
                    <div
                      className={`relative w-fit p-2 rounded-md h-fit flex items-center justify-center  ${
                        valor?.usuario == Usuario.Humano && "bg-black"
                      }`}
                    >
                      {valor?.contenido}
                    </div>
                  ) : (
                    <div className="relative w-fit h-fit max-w-full flex flex-wrap gap-3">
                      {valor?.flujos?.map((flujo, indice) => {
                        return (
                          <div
                            key={indice}
                            className="relative w-fit h-fit flex cursor-pointer"
                            onClick={() => contexto?.setFlujo(flujo)}
                          >
                            <div className="relative w-40 h-40 rounded-md bg-black border border-brillo rounded-md">
                              <Image
                                src={`${INFURA_GATEWAY}/ipfs/${
                                  flujo.cover?.split("ipfs://")?.[1]
                                }`}
                                draggable={false}
                                className="rounded-md"
                                objectFit="cover"
                                layout="fill"
                              />
                            </div>
                            <div
                              className={`absolute top-0 left-0 w-full h-full rounded-md text-white break-all font-nerdS bg-brillo/40 flex hover:opacity-70 items-center justify-center`}
                            >
                              <div className="relative w-fit h-fit flex text-center text-sm">
                                {flujo.name}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            {sendMessageLoading && (
              <div className="relative w-full h-fit flex items-start justify-start pt-4">
                <div className="relative w-fit h-fit flex">
                  <div className="relative w-8 h-8 animate-spin flex">
                    <Image
                      src={`${INFURA_GATEWAY}/ipfs/QmNcoHPaFjhDciiHjiMNpfTbzwnJwKEZHhNfziFeQrqTkX`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        className={`relative w-full h-fit flex ${
          mensajes?.length > 0 || sendMessageLoading
            ? "items-start justify-start"
            : "items-center justify-center"
        } `}
      >
        <div
          className={`relative flex flex-row gap-2 items-start justify-start rounded-md bg-black h-10 px-2 py-1 ${
            mensajes?.length > 0 || sendMessageLoading
              ? "w-full"
              : "w-full sm:w-3/4 lg:w-1/2"
          }`}
        >
          <input
            onChange={(e) => setPrompt(e.target.value)}
            className="font-nerdS text-xs uppercase text-ama focus:outline-none relative w-full h-full rounded-md bg-black placeholder:text-ama"
            value={prompt}
            placeholder={dict?.Home.placeholder}
            onKeyDown={(e) => {
              if (e.key == "Enter" && prompt?.trim() !== "") {
                setMensajes([
                  ...mensajes,
                  {
                    contenido: prompt,
                    usuario: Usuario.Humano,
                  },
                ]);

                handleSendMessage();
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
                setMensajes([
                  ...mensajes,
                  {
                    contenido: prompt,
                    usuario: Usuario.Humano,
                  },
                ]);
                handleSendMessage();
            
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
  );
};

export default Chat;
