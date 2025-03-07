"use client";

import { ModalContext } from "@/app/providers";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { Pantalla } from "../types/common.types";

export default function NotFoundEntry({ dict }: { dict: any }) {
  const router = useRouter();
  const contexto = useContext(ModalContext);
  return (
    <div className="relative w-full h-screen flex items-center justify-center text-center text-sm bg-black text-white break-words">
      <div
        className="cursor-pointer w-fit h-fit flex items-center justify-center"
        onClick={() => {
          router.push("/");
          contexto?.setPantalla?.(Pantalla.Chat);
        }}
      >
        {dict[404].nada}
      </div>
    </div>
  );
}
