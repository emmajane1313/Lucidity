"use client";

import { useContext } from "react";
import { ModalContext } from "@/app/providers";
import useCreator from "@/app/components/Creator/hooks/useCreator";
import Flujos from "@/app/components/Workflows/modules/Flujos";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import Image from "next/legacy/image";
import { useParams } from "next/navigation";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";

export default function Creador({ dict }: { dict: any }) {
  const id = useParams();
  const contexto = useContext(ModalContext);
  const {
    creadorCargando,
    hasMore,
    flujos,
    flujosCargando,
    handleMasFlujos,
    masFlujosCargando,
    creador,
  } = useCreator(id?.id as string, contexto?.clienteLens!);

  if (!creador || creadorCargando) {
    return (
      <div className="relative w-full flex p-2 sm:p-4 md:p-8 bg-black overflow-none h-[calc(100vh-0.5rem)] animate-pulse">
        <div className="relative w-full h-full flex items-start justify-center pt-5 pb-3 px-1 sm:px-6 bg-oscuro/20 border border-brillo rounded-md">
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
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full flex p-2 sm:p-4 md:p-8 bg-black overflow-none h-[calc(100vh-0.5rem)]">
      <div className="relative w-full h-full flex items-start justify-center pt-5 pb-3 px-1 sm:px-6 bg-oscuro/20 border border-brillo rounded-md">
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
        <div
          className={`relative w-full pb-10 h-full flex flex-col gap-10 font-dep text-white`}
        >
          <div
            className={`relative w-full h-fit flex items-center justify-center`}
          >
            <div
              className={`relative w-full h-40 flex items-start justify-between bg-brillo/20 rounded-md border border-brillo p-2 flex-col gap-3 ${
                creadorCargando && "animate-pulse"
              }`}
            >
              {creador?.creador && (
                <div className="relative w-full items-center justify-center h-fit text-center flex break-all">
                  <div className="relative w-fit h-fit flex">
                    {creador?.creador?.slice(0, 20) + "..."}
                  </div>
                </div>
              )}
              {creador && (
                <div className="relative w-full h-full flex flex-col items-center justify-center gap-4">
                  <div className="relative flex w-fit h-fit">
                    <div className={`relative flex w-16 h-16 rounded-full`}>
                      <Image
                        draggable={false}
                        layout="fill"
                        className="rounded-full"
                        objectFit="cover"
                        src={handleProfilePicture(creador?.metadata?.picture)}
                      />
                    </div>
                  </div>
                  <div className="relative w-full items-center justify-center h-fit text-center flex break-all">
                    <div className="relative w-fit h-fit flex font-dep uppercase">
                      {Number(creador?.username?.localName?.length) > 20
                        ? creador?.username?.localName?.slice(0, 20) + "..."
                        : creador?.username?.localName}
                    </div>
                  </div>
                </div>
              )}
              <div
                className={`absolute bottom-2 right-2 text-sm bg-black w-fit h-fit items-center justify-center flex font-dep uppercase border border-white rounded-md`}
              >
                <div
                  className={`relative w-24 h-8 flex items-center justify-center cursor-pointer`}
                  onClick={() => contexto?.setConnect(true)}
                >
                  {contexto?.lensConectado?.profile
                    ? dict.Home.disconnect
                    : dict.Home.connect}
                </div>
              </div>
            </div>
          </div>
          <Flujos
            handleMasFlujos={handleMasFlujos}
            masFlujosCargando={masFlujosCargando}
            hasMore={hasMore}
            flujos={flujos}
            setFlujo={contexto?.setFlujo!}
            texto={dict?.Home?.noFlujos}
            flujosCargando={flujosCargando || creadorCargando}
          />
        </div>
      </div>
    </div>
  );
}
