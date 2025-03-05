import { FunctionComponent, JSX, useContext, useState } from "react";
import { CambioElementoProps } from "../../Common/types/common.types";
import { ModalContext } from "@/app/providers";
import Flujos from "../../Workflows/modules/Flujos";
import useCuenta from "../hooks/useCuenta";

const Cuenta: FunctionComponent<CambioElementoProps> = ({
  dict,
}): JSX.Element => {
  const contexto = useContext(ModalContext);
  const {
    cuentaCargando,
    flujos,
    flujosCargando,
    hasMore,
    masFlujosCargando,
    handleMasFlujos,
  } = useCuenta();
  return (
    <div className={`relative w-full pb-10 h-full flex flex-col gap-10`}>
      <div
        className={`relative w-full h-fit flex items-center justify-center`}
      ></div>
      <Flujos
        handleMasFlujos={handleMasFlujos}
        masFlujosCargando={masFlujosCargando}
        hasMore={hasMore}
        flujos={flujos}
        setFlujo={contexto?.setFlujo!}
        texto={dict.Home.noFlujos}
        flujosCargando={flujosCargando}
      />
    </div>
  );
};

export default Cuenta;
