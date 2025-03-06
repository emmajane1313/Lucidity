"use client";

import { ModalContext } from "@/app/providers";
import { useContext } from "react";
import Flujo from "./Flujo";
import Connect from "./Connect";
import CrearCuenta from "./CrearCuenta";
import Error from "./Error";

export default function Modals({ dict }: { dict: any }) {
  const contexto = useContext(ModalContext);
  return (
    <>
      {contexto?.flujo && (
        <Flujo
          dict={dict}
          flujo={contexto?.flujo}
          setFlujo={contexto?.setFlujo}
        />
      )}
      {contexto?.connect && (
        <Connect
          dict={dict}
          lensConectado={contexto?.lensConectado!}
          setConnect={contexto?.setConnect}
          setError={contexto?.setError}
          setCrearCuenta={contexto?.setCrearCuenta!}
          setLensConectado={contexto?.setLensConectado!}
          clienteLens={contexto?.clienteLens!}
        />
      )}
      {contexto?.crearCuenta && (
        <CrearCuenta
          dict={dict}
          setCreateAccount={contexto?.setCrearCuenta!}
          setLensConnected={contexto?.setLensConectado!}
          lensConnected={contexto?.lensConectado}
          storageClient={contexto?.storageClient}
          setNotification={contexto?.setError}
        />
      )}
      {contexto?.error && (
        <Error error={contexto?.error} setError={contexto?.setError} />
      )}
    </>
  );
}
