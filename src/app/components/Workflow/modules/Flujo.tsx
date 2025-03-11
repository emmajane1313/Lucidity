"use client";

import { useContext } from "react";
import { ModalContext } from "@/app/providers";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import Image from "next/legacy/image";
import { useParams, useRouter } from "next/navigation";
import { IoMdDownload } from "react-icons/io";
import useFlujo from "../../Modals/hooks/useFlujo";
import useWorkflow from "../hooks/useWorkflow";
import Interacciones from "./Interacciones";

export default function Flujo({ dict }: { dict: any }) {
  const id = useParams();
  const router = useRouter();
  const contexto = useContext(ModalContext);
  const { copiarFlujo, copiar, descargar } = useFlujo();
  const { flujo } = useWorkflow(id?.id as string, contexto?.clienteLens!);

  return (
    <div className="relative w-full flex p-2 sm:p-4 md:p-8 bg-black overflow-none h-[calc(100vh-0.5rem)] h-[calc(100vh-1rem)] h-[calc(100vh-2rem)]">
      <div className="relative w-full h-full flex flex-row justify-between items-start pt-5 pb-3 px-1 sm:px-6 bg-oscuro/20 border border-brillo rounded-md gap-5 text-white font-dep">
        <div className="absolute flex w-full h-full top-0 right-0 rounded-md">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmdDmGpnz28h8YXS2dzVaQmxsnzHbvUU4AqVNuGe9wR15i`}
            layout="fill"
            objectFit="cover"
            draggable={false}
            className="rounded-md"
          />
        </div>
        <div className="absolute flex w-full h-full top-0 right-0 rounded-md bg-gris/70"></div>
        <div className="relative w-full h-fit flex flex-col gap-3 items-center justify-start">
          <div className="relative w-fit text-2xl h-fit flex items-center justify-center uppercase font-count">
            {flujo?.name}
          </div>
          {flujo?.profile ? (
            <div
              className="relative w-fit h-fit flex flex-row gap-2 items-center justify-center cursor-pointer"
              onClick={() => router.push(`/creator/${flujo?.creator}`)}
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
              onClick={() => router.push(`/creator/${flujo?.creator}`)}
            >
              {flujo?.creator?.slice(0, 20) + "..."}
            </div>
          )}
          {flujo?.cover && (
            <div className="relative w-fit h-fit flex items-center justify-center">
              <div className="relative border border-white rounded-md w-20 h-20 flex items-center justify-center">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/${
                    flujo?.cover?.split("ipfs://")?.[1]
                  }`}
                  objectFit="cover"
                  layout="fill"
                  draggable={false}
                  className="rounded-md"
                />
              </div>
            </div>
          )}
          <div className="relative w-fit text-xs h-fit flex text-center max-h-40 overflow-y-scroll">
            {flujo?.description}
          </div>
          <div className="relative w-full flex flex-wrap text-xs h-fit gap-3 items-center justify-center pb-3">
            {flujo?.tags?.map((etiqueta, indice) => {
              return (
                <div
                  key={indice}
                  className="relative flex bg-black items-center justify-center text-center px-2.5 py-1 border border-brillo rounded-full"
                >
                  {etiqueta}
                </div>
              );
            })}
          </div>
          {Number(flujo?.links?.length) > 0 && (
            <div className="relative w-full flex flex-wrap text-xs h-fit gap-3 items-center justify-center pb-3">
              {flujo?.links?.map((enlace, indice) => {
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
              onClick={() => copiarFlujo(flujo?.workflow!)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md items-center justify-center text-center transition-colors h-8 flex w-fit cursor-pointer"
            >
              {copiar ? dict?.Home?.copiado : dict?.Home?.copiar}
            </div>
            <IoMdDownload
              className="h-8 flex w-fit bg-green-600 hover:bg-green-700 text-white p-2 rounded-md transition-colors cursor-pointer"
              onClick={() => descargar(flujo?.workflow!, flujo?.name)}
              color="white"
            />
          </div>
          <div className="relative w-full h-fit flex items-start justify-start overflow-y-scroll overflow-x-auto bg-gris border border-ligero rounded-md p-2">
            <div className="relative w-full h-96 text-sm">
              <pre className="flex relative">
                <code className="language-json">
                  {JSON.stringify(flujo?.workflow, null, 2)}
                </code>
              </pre>
            </div>
          </div>
        </div>
        <Interacciones
          clienteLens={contexto?.clienteLens!}
          lensConectado={contexto?.lensConectado!}
          storageClient={contexto?.clienteAlmacenamiento!}
          setError={contexto?.setError!}
          setSignless={contexto?.setSignless!}
          flujo={flujo}
          router={router}
          dict={dict}
        />
      </div>
    </div>
  );
}
