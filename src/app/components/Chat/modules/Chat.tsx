import { FunctionComponent, JSX, useContext } from "react";
import useChat from "../hooks/useChat";
import { Usuario } from "../types/chat.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import { CambioElementoProps } from "../../Common/types/common.types";
import useFlujo from "../../Modals/hooks/useFlujo";
import { IoMdDownload } from "react-icons/io";

const Chat: FunctionComponent<CambioElementoProps> = ({
  dict,
}): JSX.Element => {
  const contexto = useContext(ModalContext);
  const { copiar, copiarFlujo, descargar } = useFlujo();
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
      className={`relative w-full pb-3 h-full flex flex-col gap-10 ${
        Number(contexto?.mensajes?.length) > 0 || sendMessageLoading
          ? "justify-between items-start"
          : "items-center justify-center"
      }`}
    >
      {(Number(contexto?.mensajes?.length) > 0 || sendMessageLoading) && (
        <div className="relative w-full h-full overflow-y-scroll flex justify-start items-start py-3 px-1.5">
          <div className="relative w-full h-fit items-start justify-end flex flex-col gap-3 font-nerdC text-lg">
            {contexto?.mensajes?.map((valor, indice) => {
              return (
                <div
                  key={indice}
                  className={`relative text-white w-full h-fit flex ${
                    valor?.usuario == Usuario.Humano
                      ? "justify-end text-right"
                      : "justify-start text-left"
                  }`}
                  ref={
                    indice == contexto?.mensajes?.length - 1
                      ? messagesEndRef
                      : null
                  }
                >
                  {valor?.usuario !== Usuario.Flujos &&
                  valor?.usuario !== Usuario.NewFlujo ? (
                    <div className="relative w-fit flex h-fit flex-col gap-2 items-start justify-start">
                      <div
                        className={`relative w-fit p-2 rounded-md h-fit flex items-center justify-center  ${
                          valor?.usuario == Usuario.Humano &&
                          "bg-black border border-white"
                        }`}
                      >
                        {indice === contexto?.mensajes?.length - 1 &&
                        valor?.usuario == Usuario.Maquina && typedMessage.trim() !== ""
                          ? typedMessage
                          : valor?.contenido}
                      </div>
                      {valor?.action && (
                        <div className="relative text-xxs w-fit h-fit flex px-2.5 items-center justify-center rounded-full bg-ligero">
                          {valor?.action}
                        </div>
                      )}
                    </div>
                  ) : valor?.usuario == Usuario.Flujos ? (
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
                  ) : (
                    <div className="relative w-fit h-fit max-w-full flex flex-col gap-3 pb-4">
                      <div className="relative flex items-end justify-end w-full h-fit flex-row gap-2">
                        <div
                          onClick={() => copiarFlujo(valor?.flujo!)}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md items-center justify-center text-center transition-colors h-8 flex w-fit cursor-pointer"
                        >
                          {copiar ? dict?.Home?.copiado : dict?.Home?.copiar}
                        </div>
                        <IoMdDownload
                          className="h-8 flex w-fit bg-green-600 hover:bg-green-700 text-white p-2 rounded-md transition-colors cursor-pointer"
                          onClick={() => descargar(valor?.flujo!)}
                          color="white"
                        />
                      </div>
                      <div className="relative w-full h-fit flex items-start justify-start overflow-y-scroll bg-gris border border-ligero rounded-md p-2">
                        <div className="relative w-[50vw] h-96 text-sm">
                          <pre className="flex relative w-full h-full">
                            <code className="language-json flex w-full h-full">
                              {JSON.stringify(valor?.flujo, null, 2)}
                            </code>
                          </pre>
                        </div>
                      </div>
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
            className="font-nerdS text-xs uppercase text-ama focus:outline-none relative w-full h-full rounded-md bg-black placeholder:text-ama"
            value={prompt}
            placeholder={dict?.Home.placeholder}
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
  );
};

export default Chat;
