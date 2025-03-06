import { FunctionComponent, JSX, useContext } from "react";
import { CambioElementoProps } from "../../Common/types/common.types";
import useFlujos from "../hooks/useFlujos";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import Flujos from "./Flujos";

const Workflows: FunctionComponent<CambioElementoProps> = ({
  dict,
}): JSX.Element => {
  const contexto = useContext(ModalContext);
  const {
    flujos,
    flujosCargando,
    handleBuscar,
    buscar,
    setBuscar,
    buscarCargando,
    masFlujosCargando,
    handleMasFlujos,
    hasMore,
  } = useFlujos(contexto?.lensConectado!, contexto?.clienteLens!);
  return (
    <div
      className={`relative w-full pb-10 h-full flex flex-col gap-10 items-start justify-between`}
    >
      <div className={`relative w-full h-fit flex items-center justify-center`}>
        <div
          className={`relative flex flex-row gap-2 items-start justify-start rounded-md bg-black h-10 px-2 py-1 w-full`}
        >
          <input
            onChange={(e) => setBuscar(e.target.value)}
            className="font-nerdS text-xs uppercase text-ama focus:outline-none relative w-full h-full rounded-md bg-black placeholder:text-ama"
            value={buscar}
            placeholder={dict?.Home.buscar}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                handleBuscar();
              }
            }}
          />
          <div
            className={`relative w-fit h-full flex items-center justify-center cursor-pointer hover:opacity-70`}
            onClick={() => {
              handleBuscar();
            }}
          >
            <div className="relative w-5 h-5 flex">
              <Image
                draggable={false}
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/QmPhN6mi9CdNo4RHmcqfUgxHayZhaZwLktH6Apd8yp6n3P`}
              />
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
        texto={dict?.Home?.term}
        otroCargando={buscarCargando}
        flujosCargando={flujosCargando}
      />
    </div>
  );
};

export default Workflows;
