import { FunctionComponent, JSX, useContext } from "react";
import { CambioElementoProps } from "../../Common/types/common.types";
import useCrear from "../hooks/useCrear";
import { RxCross1 } from "react-icons/rx";
import { ModalContext } from "@/app/providers";
import { TbChecklist } from "react-icons/tb";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { createPublicClient, http } from "viem";
import { chains } from "@lens-network/sdk/viem";

const Crear: FunctionComponent<CambioElementoProps> = ({
  dict,
}): JSX.Element => {
  const publicClient = createPublicClient({
    chain: chains.testnet,
    transport: http("https://rpc.testnet.lens.dev"),
  });
  const contexto = useContext(ModalContext);
  const {
    detalles,
    setDetalles,
    crearCargando,
    etiqueta,
    setEtiqueta,
    handleParse,
    valido,
    handleCrear,
  } = useCrear(
    dict,
    contexto?.setError!,
    contexto?.lensConectado?.address,
    contexto?.setConnect!,
    publicClient
  );
  return (
    <div
      className={`relative overflow-y-scroll w-full pb-10 h-full flex flex-col gap-10 text-sm`}
    >
      <div className="relative w-full h-fit items-center justify-center text-center text-white flex-col flex gap-2">
        <div className="relative text-3xl w-full h-fit items-center justify-center flex font-nerdC uppercase">
          {dict.Home.subir}
        </div>
        <div className="flex relative w-fit h-fit items-center justify-center font-nerdS">
          {dict.Home.cc0}
        </div>
      </div>
      <div className="relative flex-col text-white flex w-full h-fit items-start justify-between gap-4">
        <div className="relative w-full h-fit flex flex-col gap-2 items-center justify-center pb-4">
          <div className="relative w-fit h-fit flex text-lg font-nerdC uppercase">
            {dict.Home.cover}
          </div>
          <div className="relative items-center justify-center flex w-fit h-fit">
            <label
              className="relative w-40 rounded-md h-40 flex items-center justify-center border border-white cursor-pointer bg-brillo/20"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {detalles?.cover && (
                <Image
                  src={URL.createObjectURL(detalles?.cover!)}
                  objectFit="cover"
                  layout="fill"
                  draggable={false}
                  className="rounded-md"
                />
              )}
              <input
                type="file"
                accept="image/png,image/jpeg"
                hidden
                required
                id="files"
                multiple={false}
                name="pfp"
                disabled={crearCargando}
                onChange={(e) => {
                  e.stopPropagation();
                  if (!e.target.files || e.target.files.length === 0) return;
                  setDetalles({
                    ...detalles,
                    cover: e?.target?.files?.[0],
                  });
                }}
              />
            </label>
          </div>
        </div>

        <div className="relative w-full h-fit flex items-start justify-between gap-3 flex-row">
          <div className="relative w-full h-fit flex flex-col gap-3 items-start justify-start">
            <div className="relative w-fit h-fit flex text-lg font-nerdC uppercase">
              {dict.Home.name}
            </div>
            <input
              onChange={(e) =>
                setDetalles({
                  ...detalles!,
                  name: e.target.value,
                })
              }
              className="font-nerdS text-ama focus:outline-none relative w-full rounded-md bg-black placeholder:text-ama h-10"
            />
          </div>
          <div className="relative w-full h-fit flex flex-col gap-3 items-start justify-start">
            <div className="relative w-fit h-fit flex text-lg font-nerdC uppercase">
              {dict.Home.etiquetas}
            </div>
            <input
              onChange={(e) => setEtiqueta(e.target.value.trim())}
              onKeyDown={(e) => {
                if (
                  e.key == "Enter" &&
                  etiqueta?.trim() !== "" &&
                  !(detalles?.tags || []).includes(etiqueta.trim())
                ) {
                  setDetalles({
                    ...detalles!,
                    tags: [...(detalles?.tags || []), etiqueta],
                  });
                }
              }}
              className="font-nerdS text-ama focus:outline-none relative w-full rounded-md bg-black placeholder:text-ama h-10"
            />
            <div className="relative w-full h-fit flex flex-wrap gap-2 items-start justify-start">
              {detalles?.tags?.map((etiqueta, indice) => {
                return (
                  <div
                    key={indice}
                    className="relative flex items-center justify-between text-center font-nerdS px-2.5 py-1 border border-brillo rounded-full flex-row gap-2 cursor-pointer"
                    onClick={() =>
                      setDetalles({
                        ...detalles!,
                        tags: detalles.tags?.filter((tag) => tag !== etiqueta),
                      })
                    }
                  >
                    <div className="relative w-fit h-fit flex items-center justify-center">
                      {etiqueta}
                    </div>
                    <RxCross1 color="white" size={10} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-col gap-3 items-start justify-start">
          <div className="relative w-fit h-fit flex text-lg font-nerdC uppercase">
            {dict.Home.description}
          </div>
          <textarea
            onChange={(e) =>
              setDetalles({
                ...detalles!,
                description: e.target.value,
              })
            }
            className="font-nerdS text-ama focus:outline-none relative w-full rounded-md bg-black placeholder:text-ama h-40 overflow-y-scroll"
            style={{
              resize: "none",
            }}
          ></textarea>
        </div>
        <div className="relative w-full h-fit flex flex-col items-start justify-start gap-3">
          <div className="relative w-fit h-fit flex text-lg font-nerdC uppercase">
            {dict.Home.flujo}
          </div>
          <div className="relative w-full h-fit flex items-start justify-start">
            <div className="relative w-full flex flex-row gap-3 items-start justify-between h-[25rem]">
              <div className="relative flex-col text-white flex w-full h-full items-start justify-between gap-4">
                <textarea
                  className="relative w-full h-full flex items-start justify-start overflow-scroll break-all bg-gris border border-ligero rounded-md p-2"
                  style={{
                    resize: "none",
                  }}
                  value={detalles?.workflow}
                  onChange={(e) =>
                    setDetalles({
                      ...detalles!,
                      workflow: e.target.value?.replace(/\\"/g, '"'),
                    })
                  }
                ></textarea>
              </div>
              <div className="relative w-full h-full flex items-start justify-start overflow-scroll bg-gris border border-ligero rounded-md p-2">
                <div className="relative w-full h-full text-sm">
                  <pre className="flex relative h-full">
                    <code className="language-json">{detalles?.workflow}</code>
                  </pre>
                  <div className="absolute bottom-0 right-0 w-fit h-fit flex">
                    <div
                      className={`relative w-fit h-fit flex items-center justify-between px-2.5 py-1 font-nerdS flex-row gap-2 rounded-md cursor-pointer border border-white ${
                        valido ? "bg-brillo text-black" : "bg-black text-white"
                      }`}
                      onClick={() => handleParse()}
                    >
                      <div className="relative w-fit h-fit flex text-center items-center justify-center">
                        {dict.Home.valid}
                      </div>
                      <TbChecklist
                        size={10}
                        className="flex w-fit h-fit"
                        color={valido ? "black" : "white"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full h-fit items-center justify-center text-center text-white flex-col flex gap-2">
        <div
          className={`relative text-xl w-fit h-fit items-center justify-center flex font-nerdC uppercase border border-white rounded-md`}
        >
          <div
            className={`relative w-24 h-8 flex items-center justify-center ${
              !crearCargando ? "cursor-pointer" : "cursor-default"
            }`}
            onClick={() => !crearCargando && handleCrear()}
          >
            {crearCargando ? (
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
            ) : (
              dict.Home.mintear
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crear;
