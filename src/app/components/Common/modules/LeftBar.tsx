"use client";

import { FunctionComponent, useContext } from "react";
import { JSX } from "react/jsx-runtime";
import { Pantalla } from "../types/common.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import useBar from "../hooks/useBar";
import { useAccount } from "wagmi";
import { ModalContext } from "@/app/providers";
import { useRouter } from "next/navigation";

const LeftBar: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const contexto = useContext(ModalContext);
  const { isConnected, address } = useAccount();
  const { abrirBar, setAbrirBar } = useBar(
    contexto?.lensConectado!,
    contexto?.clienteLens!,
    contexto?.setLensConectado!,
    isConnected,
    address
  );
  const router = useRouter();
  return (
    <div
      className={`absolute bg-black top-0 z-10 left-0 h-full flex justify-between items-center flex-col py-4 min-h-screen ${
        abrirBar ? "w-[calc(100vw-3.5rem)] sm:w-fit pl-2 pr-3" : "w-10 px-2"
      }`}
    >
      <div className="absolute top-0 left-0 w-full h-full flex">
        <Image
          draggable={false}
          layout="fill"
          objectFit="cover"
          src={`${INFURA_GATEWAY}/ipfs/QmRtdnvSVDVC8oAd9MHaHz55m1uXUEWBMVW8eFfBnqKPjW`}
        />
      </div>
      <div
        className={`absolute top-0 left-0 w-full h-full flex ${
          abrirBar ? "bg-black/70" : "bg-black/20"
        }`}
      ></div>
      <div className="relative w-fit h-fit flex items-center justify-center flex-col gap-2">
        <div
          className="relative w-fit h-fit flex items-center justify-center cursor-pointer font-arc text-lg uppercase text-center text-white"
          onClick={() => {
            router.push("/");
            contexto?.setPantalla(Pantalla.Chat);
            setAbrirBar(false);
          }}
        >
          {abrirBar ? "LUCIDITY" : ""}
        </div>
        <div
          className="relative w-fit h-fit flex items-center justify-center cursor-pointer text-2xl text-white hover:text-white font-mana"
          onClick={() => setAbrirBar(!abrirBar)}
        >
          {abrirBar ? "<" : ">"}
        </div>
      </div>
      <div
        className={`relative w-fit h-fit flex items-center justify-center flex-col gap-4 text-center whitespace-nowrap`}
      >
        {[Pantalla.Chat, Pantalla.Workflows, Pantalla.Crear].map(
          (elemento, indice) => {
            return (
              <div
                key={indice}
                className="relative w-fit h-fit flex flex-row gap-3 items-center justify-center cursor-pointer hover:opacity-70"
                onClick={() => {
                  router.push("/");
                  contexto?.setPantalla(elemento);
                  setAbrirBar(false);
                }}
                title={dict?.Home[elemento]}
              >
                {abrirBar && (
                  <div
                    className={`relative uppercase text-sm w-full h-fit flex items-center font-nerdS justify-center text-center hover:text-brillo ${
                      contexto?.pantalla == elemento
                        ? "text-brillo"
                        : "text-white"
                    }`}
                  >
                    {`<< ${dict?.Home[elemento]} >>`}
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>
      <div className="relative w-full h-fit flex flex-col items-center justify-start gap-6">
        <div className="relative w-full h-px bg-brillo"></div>
        <div className="relative w-fit h-fit flex items-center justify-center">
          <div
            className="relative w-fit hover:opacity-70 flex-row gap-3 h-fit flex items-center justify-center cursor-pointer"
            onClick={() => {
              router.push("/");
              contexto?.setPantalla(Pantalla.Cuenta);
            }}
            title={dict?.Home.Cuenta}
          >
            <div className="relative flex w-fit h-fit">
              <div className={`relative flex w-7 h-7 rounded-xl`}>
                <Image
                  draggable={false}
                  layout="fill"
                  className="rounded-xl"
                  objectFit="cover"
                  src={`${INFURA_GATEWAY}/ipfs/${
                    contexto?.lensConectado?.profile?.metadata?.picture
                      ? contexto?.lensConectado?.profile?.metadata?.picture?.split(
                          "ipfs://"
                        )?.[1]
                      : "QmX5Uk9WeqsVHoNQhUP3fzTasv3J6zuat4L5L6zmaTVzBW"
                  }`}
                />
              </div>
              <div className="absolute top-0 right-0 flex w-full h-full">
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/QmPUeqHkTaTj2SHDdrizNhFSxzFPJpTLpkEZTtTKNsQUwV`}
                />
              </div>
            </div>
            {abrirBar && (
              <div
                className={`relative text-sm font-nerdS w-fit h-fit flex items-center justify-center text-left uppercase hover:text-brillo ${
                  contexto?.pantalla == Pantalla.Cuenta
                    ? "text-brillo"
                    : "text-white"
                }`}
              >
                {contexto?.lensConectado?.sessionClient
                  ? contexto?.lensConectado?.profile?.username?.localName
                    ? Number(
                        contexto?.lensConectado?.profile?.username?.localName
                          ?.length
                      ) > 10
                      ? contexto?.lensConectado?.profile?.username?.localName?.slice(
                          0,
                          10
                        ) + "..."
                      : contexto?.lensConectado?.profile?.username?.localName
                    : contexto?.lensConectado?.profile?.address?.slice(0, 10) +
                      "..."
                  : `<< ${dict?.Home.Cuenta} >>`}
              </div>
            )}
          </div>
        </div>
        {abrirBar && (
          <div className="relative w-full h-fit flex justify-start items-start text-sm text-left">
            <div
              className="relative whitespace-nowrap w-fit h-fit flex text-noche hover:text-brillo font-nerdS cursor-pointer"
              onClick={() => {
                contexto?.setPantalla(Pantalla.Info);
                router.push("/info");
              }}
            >
              {dict?.Home[Pantalla.Info]}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftBar;
