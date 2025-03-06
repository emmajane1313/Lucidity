"use client";

import { useContext } from "react";
import { ModalContext } from "@/app/providers";
import Cambio from "./Cambio";

export default function Entry({ dict }: { dict: any }) {
  const contexto = useContext(ModalContext);

  return (
    <div className="relative w-full flex p-2 sm:p-4 md:p-8 h-[calc(100vh-0.5rem)] h-[calc(100vh-1rem)] h-[calc(100vh-2rem)]">
      <div className="relative w-full h-full flex items-start justify-center pt-5 pb-3 px-1 sm:px-6 bg-oscuro/20 border border-brillo rounded-md">
        <video
          className="absolute w-full h-full flex top-0 left-0"
          loop
          autoPlay
          muted
          playsInline
        >
          <source src="/videos/moshed.mp4" />
        </video>
        <Cambio dict={dict} pantalla={contexto?.pantalla!} />
      </div>
    </div>
  );
}
