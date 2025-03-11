import { FunctionComponent, JSX, useContext } from "react";
import { CambioElementoProps } from "../../Common/types/common.types";
import { ModalContext } from "@/app/providers";
import Flujos from "../../Workflows/modules/Flujos";
import useCuenta from "../hooks/useCuenta";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";

const Cuenta: FunctionComponent<CambioElementoProps> = ({
  dict,
}): JSX.Element => {
  const contexto = useContext(ModalContext);
  const {
    flujos,
    flujosCargando,
    hasMore,
    masFlujosCargando,
    handleMasFlujos,
  } = useCuenta(contexto?.lensConectado!);
  return (
    <div
      className={`relative w-full pb-10 h-full bg-white px-2 pt-2 rounded-sm flex flex-col gap-10 font-dep text-white`}
    >
      <div className={`relative w-full h-fit flex items-center justify-center`}>
        <div className="relative w-full h-40 flex items-start justify-between bg-black rounded-md border border-brillo p-2 flex-col gap-3">
          {contexto?.lensConectado?.address && (
            <div className="relative w-full items-center justify-center h-fit text-center flex break-all font-goth">
              <div className="relative w-fit h-fit flex">
                {contexto?.lensConectado?.address?.slice(0, 20) + "..."}
              </div>
            </div>
          )}
          {contexto?.lensConectado?.profile && (
            <div className="relative w-full h-full flex flex-col items-center justify-center gap-4">
              <div className="relative flex w-fit h-fit">
                <div className={`relative flex w-16 h-16 rounded-full`}>
                  <Image
                    draggable={false}
                    layout="fill"
                    className="rounded-full"
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
              </div>
              <div className="relative w-full items-center justify-center h-fit text-center flex break-all">
                <div className="relative w-fit h-fit flex font-count uppercase">
                  {Number(
                    contexto?.lensConectado?.profile?.username?.localName
                      ?.length
                  ) > 20
                    ? contexto?.lensConectado?.profile?.username?.localName?.slice(
                        0,
                        20
                      ) + "..."
                    : contexto?.lensConectado?.profile?.username?.localName}
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
              {dict?.Home?.connect}
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
        flujosCargando={flujosCargando}
        color={true}
      />
    </div>
  );
};

export default Cuenta;
