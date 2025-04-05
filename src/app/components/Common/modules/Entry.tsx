"use client";

import { useContext } from "react";
import { ModalContext } from "@/app/providers";
import Cambio from "./Cambio";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { Pantalla } from "../types/common.types";

export default function Entry({ dict }: { dict: any }) {
  const contexto = useContext(ModalContext);

  return (
    <div className="relative w-full flex p-2 sm:p-4 md:p-8 h-[calc(100vh-0.5rem)]">
      <div className="relative w-full h-full flex items-start justify-center pt-5 pb-3 px-1 sm:px-6 bg-oscuro/20 border border-brillo rounded-md">
        <div className="absolute flex w-full h-full top-0 right-0 rounded-md">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${
              contexto?.pantalla == Pantalla.Chat
                ? Number(contexto?.mensajes?.length) < 1
                  ? "QmWEyu3hbEd7tLEUcegv8xrpdNH27VVwN14cJtit6QL6bV"
                  : "QmQ6YhM7gSVYgqVHNHwRzgSjY2f1yzyHDz1BKvaj1TVp97"
                : contexto?.pantalla == Pantalla.Workflows
                ? "QmWbqFv4CTwynHK2iGPxu6U9iz6aJGnR1H2k25nUcqmTe7"
                : contexto?.pantalla == Pantalla.Cuenta
                ? "QmbsktyXQvNQut1iQNbHbd7PHGyKmmvnv4EGPrf9hHaPkJ"
                : "QmbxK4gbjnxBrDbSCiX1Hoiv6GKmYgQk6EMeFZhY9bXeni"
            }`}
            layout="fill"
            objectFit="cover"
            draggable={false}
            className="rounded-md"
          />
        </div>
        <div className="absolute flex w-full h-full top-0 right-0 rounded-md bg-gris/70"></div>
        <Cambio dict={dict} pantalla={contexto?.pantalla!} />
      </div>
    </div>
  );
}
