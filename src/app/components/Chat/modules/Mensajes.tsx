import { INFURA_GATEWAY } from "@/app/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent, JSX } from "react";
import { MensajesProps, Usuario } from "../types/chat.types";
import { IoMdDownload } from "react-icons/io";
import useFlujo from "../../Modals/hooks/useFlujo";

const Mensajes: FunctionComponent<MensajesProps> = ({
  mensajes,
  sendMessageLoading,
  messagesEndRef,
  dict,
  setFlujo,
  typedMessage,
  user,
}): JSX.Element => {
  const { copiar, copiarFlujo, descargar } = useFlujo();

  return (
    <div className="relative w-full h-full flex flex-row justify-between items-start p-3 bg-black gap-4 overflow-y-scroll rounded-sm">
      <div className="relative w-full h-full overflow-y-scroll flex items-start justify-start flex-col gap-3">
        <div className="relative w-full text-2xl font-count text-white uppercase flex h-fit">
          {dict.Home.agent}
        </div>
        <div className="relative w-full h-fit items-start justify-start flex flex-col gap-3 font-dep text-base">
          {mensajes
            ?.filter((me) => me?.usuario !== Usuario.Humano)
            ?.map((valor, indice) => {
              return (
                <div
                  key={indice}
                  className={`relative text-[#A0AA0C] w-full h-fit flex justify-start text-left`}
                  ref={
                    indice ==
                      mensajes?.filter((me) => me?.usuario !== Usuario.Humano)
                        ?.length -
                        1 ||
                    (indice ==
                      mensajes?.filter((me) => me?.usuario !== Usuario.Humano)
                        ?.length -
                        2 &&
                      mensajes?.[
                        mensajes?.filter((me) => me?.usuario !== Usuario.Humano)
                          ?.length - 1
                      ]?.usuario == Usuario.Flujos)
                      ? messagesEndRef
                      : null
                  }
                >
                  {valor?.usuario !== Usuario.Flujos &&
                  valor?.usuario !== Usuario.NewFlujo ? (
                    <div className="relative w-fit flex h-fit flex-col gap-2 items-start justify-start">
                      <div
                        className={`relative w-fit p-2 rounded-md h-fit flex items-center justify-center whitespace-pre-line`}
                        dangerouslySetInnerHTML={{
                          __html:
                            indice ===
                              mensajes?.filter(
                                (me) => me?.usuario !== Usuario.Humano
                              )?.length -
                                1 && typedMessage.trim() !== ""
                              ? typedMessage
                              : valor?.contenido,
                        }}
                      ></div>
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
                            onClick={() => setFlujo(flujo)}
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
                              className={`absolute top-0 left-0 w-full h-full rounded-md text-white break-all font-dep bg-brillo/10 flex hover:opacity-70 items-center justify-center`}
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
                            <code className="language-json flex w-full h-full text-white">
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
      <div className="relative w-fit h-full flex flex-col gap-2 items-start justify-start overflow-y-clip">
        {Array.from({ length: 50 }).map((_, i) => {
          return (
            <div
              key={i}
              className="relative w-fit h-fit flex rounded-full bg-brillo"
            >
              <div className="relative w-4 h-4 flex"></div>
            </div>
          );
        })}
      </div>
      <div className="relative w-full h-full overflow-y-scroll flex items-start justify-start flex-col gap-3">
        <div className="relative w-full text-2xl font-count text-white uppercase justify-end flex h-fit">
          {dict.Home.user}
          {user && `: ${user}`}
        </div>
        <div className="relative w-full h-fit items-start justify-end flex flex-col gap-3 font-dep text-base">
          {mensajes
            ?.filter((mes) => mes?.usuario == Usuario.Humano)
            ?.map((valor, indice) => {
              return (
                <div
                  key={indice}
                  className={`relative text-white w-full h-fit flex justify-end text-right`}
                >
                  <div className="relative w-fit flex h-fit flex-col gap-2 items-start justify-start">
                    <div
                      className={`relative w-fit p-2 rounded-md h-fit flex items-center justify-center`}
                    >
                      {valor?.contenido}
                    </div>
                    {valor?.action && (
                      <div className="relative text-xxs w-fit h-fit flex px-2.5 items-center justify-center rounded-full bg-ligero">
                        {valor?.action}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Mensajes;
