import Image from "next/legacy/image";
import { FunctionComponent, JSX } from "react";
import { FlujoProps } from "../types/modals.types";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import useFlujo from "../hooks/useFlujo";
import { IoMdDownload } from "react-icons/io";
import { useRouter } from "next/navigation";
import { PiArrowsOutSimpleDuotone } from "react-icons/pi";

const Flujo: FunctionComponent<FlujoProps> = ({
  setFlujo,
  flujo,
  dict,
}): JSX.Element => {
  const router = useRouter();
  const { copiar, copiarFlujo, descargar } = useFlujo();
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto items-center justify-center text-white font-dep">
      <div
        className="w-full h-screen text-sm flex items-center justify-center cursor-pointer"
        onClick={() => setFlujo(undefined)}
      >
        <div
          className="relative w-3/5 border border-brillo flex rounded-md bg-black p-3 cursor-default h-fit max-h-96 overflow-y-scroll flex-col gap-6 items-center justify-start"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full h-fit items-end justify-end flex">
            <PiArrowsOutSimpleDuotone
              onClick={() => {
                setFlujo(undefined);
                router.push(`/workflow/${flujo.counter}`);
              }}
              className="relative flex w-fit h-fit cursor-pointer"
              color="white"
              size={20}
            />
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center">
            {flujo.name}
          </div>
          {flujo?.profile ? (
            <div
              className="relative w-fit h-fit flex flex-row gap-2 items-center justify-center cursor-pointer"
              onClick={() => {
                setFlujo(undefined);
                router.push(`/creator/${flujo?.creator}`);
              }}
            >
              {flujo?.profile?.metadata?.picture && (
                <div className="relative flex w-fit h-fit">
                  <div className={`relative flex w-8 h-8 rounded-full`}>
                    <Image
                      draggable={false}
                      layout="fill"
                      className="rounded-full"
                      objectFit="cover"
                      src={`${INFURA_GATEWAY}/ipfs/${
                        flujo?.profile?.metadata?.picture?.split("ipfs://")?.[1]
                      }`}
                    />
                  </div>
                </div>
              )}
              <div className="relative flex w-fit h-fit text-xs">
                {flujo?.profile?.username?.localName}
              </div>
            </div>
          ) : (
            <div
              className="relative flex w-fit h-fit text-xs cursor-pointer"
              onClick={() => {
                setFlujo(undefined);
                router.push(`/creator/${flujo?.creator}`);
              }}
            >
              {flujo?.creator?.slice(0, 20) + "..."}
            </div>
          )}
          {flujo.cover && (
            <div className="relative w-fit h-fit flex items-center justify-center">
              <div className="relative border border-white rounded-md w-20 h-20 flex items-center justify-center">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/${
                    flujo.cover?.split("ipfs://")?.[1]
                  }`}
                  objectFit="cover"
                  layout="fill"
                  draggable={false}
                  className="rounded-md"
                />
              </div>
            </div>
          )}
          <div className="relative w-full h-fit flex justify-center">
            <div className="relative w-3/5 h-fit flex justify-center">
              <div className="relative w-fit text-xs h-fit flex text-center max-h-40 overflow-y-scroll">
                {flujo.description}
              </div>
            </div>
          </div>
          <div className="relative w-full flex flex-wrap text-xs h-fit gap-3 items-center justify-center pb-3">
            {flujo.tags?.map((etiqueta, indice) => {
              return (
                <div
                  key={indice}
                  className="relative flex items-center justify-center text-center px-2.5 py-1 border border-brillo rounded-full"
                >
                  {etiqueta}
                </div>
              );
            })}
          </div>
          {flujo.links?.length > 0 && (
            <div className="relative w-full flex flex-wrap text-xs h-fit gap-3 items-center justify-center pb-3">
              {flujo.links?.map((enlace, indice) => {
                return (
                  <div
                    key={indice}
                    className="relative flex items-center break-all justify-center text-center cursor-pointer text-[#0000FF] w-fit h-fit"
                    onClick={() => window.open(enlace)}
                  >
                    {enlace.length > 20 ? enlace.slice(0, 20) + "..." : enlace}
                  </div>
                );
              })}
            </div>
          )}
          <div className="relative flex items-end justify-end w-full h-fit flex-row gap-2">
            <div
              onClick={() => copiarFlujo(flujo.workflow)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md items-center justify-center text-center transition-colors h-8 flex w-fit cursor-pointer"
            >
              {copiar ? dict?.Home?.copiado : dict?.Home?.copiar}
            </div>
            <IoMdDownload
              className="h-8 flex w-fit bg-green-600 hover:bg-green-700 text-white p-2 rounded-md transition-colors cursor-pointer"
              onClick={() => descargar(flujo.workflow, flujo.name)}
              color="white"
            />
          </div>
          <div className="relative w-full h-fit flex items-start justify-start bg-gris border border-ligero rounded-md p-2">
            <div className="relative w-full h-96 text-sm flex overflow-y-scroll">
              <pre className="flex relative w-full h-full">
                <code className="language-json w-20 h-full">
                  {JSON.stringify(flujo.workflow, null, 2)}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flujo;
