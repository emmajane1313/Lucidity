import { FunctionComponent, JSX, useContext } from "react";
import { CambioElementoProps } from "../../Common/types/common.types";
import useCrear from "../hooks/useCrear";
import { RxCross1 } from "react-icons/rx";
import { ModalContext } from "@/app/providers";
import { TbChecklist } from "react-icons/tb";
import Image from "next/legacy/image";
import { INFURA_GATEWAY, SET_UP, SUGGESTED_TAGS } from "@/app/lib/constants";
import { createPublicClient, http } from "viem";
import { FaChevronDown } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { chains } from "@lens-chain/sdk/viem";

const Crear: FunctionComponent<CambioElementoProps> = ({
  dict,
}): JSX.Element => {
  const publicClient = createPublicClient({
    chain: chains.mainnet,
    transport: http("https://rpc.lens.xyz"),
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
    setupAbierto,
    setSetupAbierto,
    setValido,
  } = useCrear(
    dict,
    contexto?.setError!,
    contexto?.lensConectado?.address,
    contexto?.setConnect!,
    publicClient
  );
  return (
    <div
      className={`relative overflow-y-scroll w-full pb-10 h-full flex flex-col gap-10 text-sm font-dep text-black bg-white p-2 rounded-sm`}
    >
      <div className="relative w-full h-fit items-center justify-center text-center flex-col flex gap-2">
        <div className="relative text-xl sm:text-5xl w-full h-fit items-center justify-center flex font-count uppercase">
          {dict?.Home?.subir}
        </div>
        <div className="flex relative w-fit h-fit items-center justify-center">
          {dict?.Home?.cc0}
        </div>
      </div>
      <div className="relative flex-col flex w-full h-fit items-start justify-between gap-4">
        <div className="relative w-full h-fit flex flex-col gap-2 items-center justify-center pb-4">
          <div className="relative w-fit h-fit flex text-sm font-dep uppercase">
            {dict?.Home?.cover}
          </div>
          <div className="relative items-center justify-center flex sm:w-fit w-full h-fit">
            <label
              className="relative w-full sm:w-40 rounded-md h-40 flex items-center justify-center cursor-pointer bg-black"
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
                    ...detalles!,
                    cover: e?.target?.files?.[0],
                  });
                }}
              />
            </label>
          </div>
        </div>
        <div className="relative w-full h-fit flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap flex-row">
          <div className="relative w-full h-fit flex flex-col gap-3 items-start justify-start">
            <div className="relative w-fit h-fit flex text-sm font-dep uppercase">
              {dict?.Home?.name}
            </div>
            <input
              onChange={(e) =>
                setDetalles({
                  ...detalles!,
                  name: e.target.value,
                })
              }
              value={detalles?.name}
              className="text-ama focus:outline-none relative w-full rounded-md bg-black placeholder:text-ama h-10 px-2 py-1"
            />
          </div>
          <div className="relative w-full h-fit flex flex-col gap-3 items-start justify-start">
            <div className="relative w-fit h-fit flex text-sm font-dep uppercase">
              {dict?.Home?.etiquetas}
            </div>
            <input
              onChange={(e) => setEtiqueta(e.target.value.trim())}
              onKeyDown={(e) => {
                if (
                  e.key == "Enter" &&
                  etiqueta?.trim() !== "" &&
                  !(detalles?.tags || []).includes(etiqueta.trim())
                ) {
                  setEtiqueta("");
                  setDetalles({
                    ...detalles!,
                    tags: [...(detalles?.tags || []), etiqueta],
                  });
                }
              }}
              value={etiqueta}
              className="text-ama focus:outline-none relative w-full rounded-md bg-black placeholder:text-ama h-10 px-2 py-1"
            />
            {etiqueta?.trim() !== "" &&
              SUGGESTED_TAGS.filter((tag) =>
                tag.toLowerCase().includes(etiqueta)
              )?.length > 0 && (
                <div className="absolute z-10 left-0 top-20 text-ama w-full rounded-md bg-black text-xs h-fit max-h-28 items-start flex-col gap-2 justify-start overflow-y-scroll">
                  {SUGGESTED_TAGS.filter((tag) =>
                    tag.toLowerCase().includes(etiqueta)
                  )?.map((et, indice) => {
                    return (
                      <div
                        className="relative px-2 py-1 items-center justify-center w-full h-fit flex hover:opacity-70 cursor-pointer"
                        onClick={() => {
                          if (!(detalles?.tags || []).includes(et.trim())) {
                            setEtiqueta("");
                            setDetalles({
                              ...detalles!,
                              tags: [...(detalles?.tags || []), et],
                            });
                          }
                        }}
                        key={indice}
                      >
                        {et}
                      </div>
                    );
                  })}
                </div>
              )}
            <div className="relative w-full h-fit flex flex-wrap gap-2 items-start justify-start">
              {detalles?.tags?.map((etiqueta, indice) => {
                return (
                  <div
                    key={indice}
                    className="relative flex items-center justify-between text-center px-2.5 py-1 border border-brillo rounded-full flex-row gap-2 cursor-pointer"
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
                    <RxCross1 color="black" size={10} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-col gap-3 items-start justify-start">
          <div className="relative w-fit h-fit flex text-sm font-dep uppercase">
            {dict?.Home?.setup}
          </div>
          <div className="relative w-full h-fit flex flex-row gap-2 items-center justify-between min-h-10 bg-black rounded-md px-2 py-1">
            <div className="relative w-full h-fit flex flex-wrap gap-1.5 items-center justify-start text-white">
              {detalles?.setup?.map((ajustes, indice) => {
                return (
                  <div
                    key={indice}
                    className="relative flex items-center justify-between text-center px-2.5 py-1 border border-brillo text-ama text-xs rounded-full flex-row gap-2 cursor-pointer"
                    onClick={() => {
                      setSetupAbierto(false);
                      setDetalles({
                        ...detalles!,
                        setup: detalles.setup?.filter((tag) => tag !== ajustes),
                      });
                    }}
                  >
                    <div className="relative w-fit h-fit flex items-center justify-center">
                      {ajustes}
                    </div>
                    <RxCross1 color="white" size={10} />
                  </div>
                );
              })}
            </div>
            <FaChevronDown
              color="white"
              size={15}
              className="cursor-pointer"
              onClick={() => setSetupAbierto(!setupAbierto)}
            />
          </div>
          {setupAbierto && (
            <div className="absolute bg-black w-fit right-0 -bottom-64 flex items-center justify-start flex flex-col gap-2 border border-brillo rounded-md z-20 p-2 text-white">
              {SET_UP.map((set, indice) => {
                return (
                  <div
                    className="relative flex cursor-pointer hover:opacity-70 items-center justify-center w-fit h-fit"
                    key={indice}
                    onClick={() =>
                      setDetalles({
                        ...detalles!,
                        setup: !(detalles?.setup || [])?.includes(set)
                          ? [...(detalles?.setup || []), set]
                          : detalles?.setup || [],
                      })
                    }
                  >
                    {set}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="relative w-full h-fit flex flex-col gap-3 items-start justify-start">
          <div className="relative w-fit h-fit flex text-sm font-dep uppercase">
            {dict?.Home?.description}
          </div>
          <textarea
            onChange={(e) =>
              setDetalles({
                ...detalles!,
                description: e.target.value,
              })
            }
            className="text-ama focus:outline-none relative w-full rounded-md bg-black placeholder:text-ama h-40 overflow-y-scroll px-2 py-1"
            value={detalles?.description}
            style={{
              resize: "none",
            }}
          ></textarea>
        </div>
        <div className="relative w-full h-fit flex flex-col items-start justify-start gap-3">
          <div className="relative w-fit h-fit flex text-sm font-dep uppercase">
            {dict?.Home?.flujo}
          </div>
          <div className="relative w-full h-fit flex items-start justify-start text-white">
            <div className="relative w-full flex flex-col sm:flex-row gap-3 items-start justify-between h-fit sm:h-[25rem]">
              <div className="relative flex-col flex w-full h-[25rem] sm:h-full items-start justify-between gap-4">
                <textarea
                  className="relative w-full h-full flex items-start justify-start overflow-auto break-all bg-gris border border-ligero rounded-md p-2 focus:outline-none"
                  style={{
                    resize: "none",
                    whiteSpace: "pre",
                  }}
                  value={detalles?.workflow}
                  onChange={(e) => {
                    setValido(false);
                    setDetalles({
                      ...detalles!,
                      workflow: e.target.value?.replace(/\\"/g, '"'),
                    });
                  }}
                ></textarea>
              </div>
              <div className="relative sm:w-full w-[calc(100vw-6rem)] h-[25rem] sm:h-full flex items-start justify-start overflow-y-scroll bg-gris border border-ligero rounded-md p-2">
                <div className="relative h-full text-sm w-full overflow-hidden">
                  <pre className="flex relative h-full overflow-scroll">
                    <code className="language-json whitespace-pre-wrap flex flex-wrap">
                      {valido &&
                        JSON.stringify(
                          JSON.parse(detalles?.workflow || "{}"),
                          null,
                          2
                        )}
                    </code>
                  </pre>
                  <div className="absolute bottom-0 right-0 w-fit h-fit flex">
                    <div
                      className={`relative w-fit h-fit flex items-center justify-between px-2.5 py-1 flex-row gap-2 rounded-md cursor-pointer border border-white ${
                        valido ? "bg-brillo text-black" : "bg-black text-white"
                      }`}
                      onClick={() => handleParse()}
                    >
                      <div className="relative w-fit h-fit flex text-center items-center justify-center">
                        {dict?.Home?.valid}
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
        <div className="relative w-full h-fit flex flex-col items-start justify-start gap-3">
          <div className="relative w-fit h-fit flex flex-row gap-2 items-center justify-center">
            <div className="relative w-fit h-fit flex text-sm font-dep uppercase">
              {dict?.Home?.enlaces}
            </div>
            <IoIosAddCircleOutline
              color="black"
              size={15}
              className="cursor-pointer"
              onClick={() =>
                setDetalles({
                  ...detalles,
                  links: [...(detalles?.links || []), ""],
                })
              }
            />
          </div>
          {detalles?.links?.map((link, indice) => {
            return (
              <div
                className="relative w-full h-fit flex flex-row gap-3 items-center justify-between"
                key={indice}
              >
                <div className="relative flex w-full h-fit">
                  <input
                    className="text-ama focus:outline-none relative w-full rounded-md bg-black placeholder:text-ama h-10 px-2 py-1"
                    value={link}
                    onChange={(e) =>
                      setDetalles((prev) => {
                        const det = { ...prev };
                        let links = [...(det?.links || [])];
                        links[indice] = e.target.value;

                        det.links = links;

                        return det;
                      })
                    }
                  />
                </div>
                <RxCross1
                  color="black"
                  size={10}
                  className="cursor-pointer"
                  onClick={() =>
                    setDetalles((prev) => {
                      const det = { ...prev };
                      let links = [...(det?.links || [])];

                      det.links = links.filter((_, ind) => ind !== indice);

                      return det;
                    })
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="relative w-full h-fit items-center justify-center text-center contextoflex-col flex gap-2">
        <div
          className={`relative text-xl w-fit h-fit items-center justify-center flex font-dep uppercase border border-black rounded-md`}
        >
          <div
            className={`relative w-32 min-w-fit h-8 flex items-center justify-center ${
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
              dict?.Home?.mintear
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crear;
