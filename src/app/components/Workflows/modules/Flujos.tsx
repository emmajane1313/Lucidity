import { FunctionComponent, JSX } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Flujo } from "../../Modals/types/modals.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { FlujosProps } from "../types/workflows.types";

const Flujos: FunctionComponent<FlujosProps> = ({
  handleMasFlujos,
  flujos,
  hasMore,
  setFlujo,
  masFlujosCargando,
  flujosCargando,
  texto,
  otroCargando,
  color
}): JSX.Element => {

  return (
    <div className="relative w-full h-full overflow-y-scroll items-start justify-between flex">
      {!flujosCargando && flujos?.length < 1 ? (
        <div
          className={`"relative w-full h-full flex items-center justify-center text-sm text-center text font-dep ${color ? "text-black" : "text-white"}`}
        >
          {texto}
        </div>
      ) : flujosCargando || otroCargando ? (
        <div className="relative w-full h-full overflow-y-scroll items-start justify-between flex flex-wrap gap-6">
          {Array.from({ length: 20 }).map((_, indice) => {
            return (
              <div key={indice} className="relative w-full sm:w-fit h-fit flex">
                <div className="relative w-full sm:w-60 h-60 flex rounded-md border border-brillo bg-brillo animate-pulse"></div>
              </div>
            );
          })}
        </div>
      ) : (
        <InfiniteScroll
          dataLength={flujos?.length || 1}
          next={handleMasFlujos}
          hasMore={hasMore?.hasMore}
          loader={<></>}
          scrollableTarget="scroll"
          className="flex flex-wrap gap-3 h-fit pb-10 items-start justify-between w-full"
        >
          {flujos.map((flujo: Flujo, indice: number) => {
            return (
              <div
                key={indice}
                className={`w-full sm:w-fit h-fit flex relative flex-col gap-2 items-center justify-center`}
              >
                <div className="relative sm:w-fit w-full flex h-fit">
                  <div
                    className="w-full sm:w-60 h-60 rounded-md border border-brillo bg-brillo flex p-4 relative cursor-pointer"
                    onClick={() => setFlujo(flujo)}
                  >
                    <Image
                      src={`${INFURA_GATEWAY}/ipfs/${
                        flujo?.cover?.split("ipfs://")?.[1]
                      }`}
                      className="w-full h-full flex relative rounded-md"
                      layout="fill"
                      objectFit="cover"
                      draggable={false}
                      objectPosition="top"
                    />
                  </div>
                </div>
                <div className={`relative w-full h-fit flex text-xxs text-center font-dep items-center justify-center ${color ? "text-black" : "text-white"}`}>
                  {flujo?.name}
                </div>
              </div>
            );
          })}
          {masFlujosCargando &&
            Array.from({ length: 20 }).map((_, indice) => {
              return (
                <div
                  key={flujos.length + 1 + indice}
                  className="relative w-full sm:w-fit h-fit flex"
                >
                  <div className="relative w-full sm:w-60 h-60 flex rounded-md border border-brillo bg-brillo animate-pulse"></div>
                </div>
              );
            })}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Flujos;
