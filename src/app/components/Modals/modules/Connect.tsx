import { FunctionComponent, JSX, useContext } from "react";
import { ConnectProps } from "../types/modals.types";
import { useModal } from "connectkit";
import { useAccount } from "wagmi";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import useConnect from "../hooks/useConnect";

const Connect: FunctionComponent<ConnectProps> = ({
  setConnect,
  dict,
  lensConectado,
  setError,
  setCrearCuenta,
  setLensConectado,
  clienteLens,
}): JSX.Element => {
  const { openProfile, openSwitchNetworks, openOnboarding } = useModal();
  const { isConnected, address, chainId } = useAccount();
  const { lensCargando, salir, handleConectarse } = useConnect(
    lensConectado,
    address,
    clienteLens,
    setError!,
    setLensConectado!,
    setCrearCuenta!,
    setConnect!,
    dict
  );
  return (
    <div
      className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto cursor-pointer items-center justify-center"
      onClick={() => setConnect(false)}
    >
      <div
        className="bg-black rounded-md text-white border border-white w-96 h-fit text-sm flex items-center justify-start p-3 cursor-default flex-col gap-6 font-dep"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-fit pb-3 h-fit flex items-center justify-center">
          {lensConectado?.profile ? dict.Home.disconnect : dict.Home.connect}
        </div>
        {lensConectado?.profile?.username?.localName ? (
          <div className="relative w-full h-fit flex items-center justify-center text-left">
            {lensConectado?.profile?.username?.localName?.slice(0, 20) + " ..."}
          </div>
        ) : (
          address && (
            <div className="relative w-full h-fit flex items-center justify-center text-left">
              {address?.slice(0, 20) + "..."}
            </div>
          )
        )}
        <div className="relative w-full h-fit flex flex-col gap-2 font-jack">
          <div
            className="relative flex w-full h-10 rounded-md bg-black active:scale-95 items-center justify-center text-center text-sm text-white hover:opacity-80 cursor-pointer border border-brillo"
            onClick={() =>
              isConnected
                ? openProfile?.()
                : chainId !== 232
                ? openSwitchNetworks?.()
                : openOnboarding?.()
            }
          >
            {isConnected ? dict.Home.disconnect : dict.Home.connect}
          </div>
          <div
            className={`relative flex w-full h-10  border border-brillo rounded-md items-center justify-center text-center text-sm hover:opacity-80 ${
              !isConnected ? "opacity-60" : "active:scale-95 cursor-pointer"
            }`}
            onClick={() => {
              if (!lensConectado?.profile && address) {
                handleConectarse();
              } else {
                salir();
              }
            }}
          >
            {lensCargando ? (
              <div className="relative w-fit h-fit flex">
                <div className="relative w-5 h-5 animate-spin flex">
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/QmNcoHPaFjhDciiHjiMNpfTbzwnJwKEZHhNfziFeQrqTkX`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                    draggable={false}
                  />
                </div>
              </div>
            ) : lensConectado?.profile && address ? (
              dict.Home.lensOut
            ) : (
              dict.Home.lensSign
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connect;
