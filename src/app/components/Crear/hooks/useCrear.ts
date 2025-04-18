import { chains } from "@lens-chain/sdk/viem";
import { SetStateAction, useState } from "react";
import LucidityWorkflowsAbi from "@abis/LucidityWorkflows.json";
import { LUCIDITY_WORKFLOWS_CONTRACT } from "@/app/lib/constants";
import { createWalletClient, custom, PublicClient } from "viem";

const useCrear = (
  dict: any,
  setError: (e: SetStateAction<string | undefined>) => void,
  address: `0x${string}` | undefined,
  setConnect: (e: SetStateAction<boolean>) => void,
  publicClient: PublicClient
) => {
  const [crearCargando, setCrearCargando] = useState<boolean>(false);
  const [setupAbierto, setSetupAbierto] = useState<boolean>(false);
  const [detalles, setDetalles] = useState<{
    workflow?: string;
    cover?: File;
    description?: string;
    name?: string;
    tags?: string[];
    setup?: string[];
    links?: string[];
  }>({
    links: [
      "https://civitai.com/models/125907?modelVersionId=686204",
      "https://huggingface.co/Kijai/sam2-safetensors/tree/main",
    ],
  });
  const [etiqueta, setEtiqueta] = useState<string>("");
  const [valido, setValido] = useState<boolean>(false);

  const handleParse = (): boolean => {
    try {
      const contenidoLimpiado = detalles?.workflow?.replace(/\\"/g, '"');

      if (contenidoLimpiado) {
        JSON.parse(contenidoLimpiado);
        setValido(true);

        return true;
      } else {
        setError(dict?.Home?.json);
      }
    } catch (err: any) {
      setError(dict?.Home?.json);
    }

    return false;
  };

  const handleCrear = async () => {
    if (!address) {
      setConnect(true);
      return;
    }
    if (!handleParse()) return;
    if (detalles?.name?.trim() == "" || !detalles?.name) {
      setError(dict?.Home?.validName);
      return;
    } else if (detalles?.description?.trim() == "" || !detalles?.description) {
      setError(dict?.Home?.validDescription);
      return;
    } else if (!detalles?.cover) {
      setError(dict?.Home?.validCover);
      return;
    } else if (
      Number(detalles?.tags?.filter((tag) => tag.trim() !== "").length) < 1 ||
      !detalles?.tags
    ) {
      setError(dict?.Home?.validTags);
      return;
    } else if (
      Number(
        detalles?.links?.filter((link) => !link.includes("https://"))?.length
      ) > 0
    ) {
      setError(dict?.Home?.validEnlaces);
      return;
    }

    setCrearCargando(true);

    try {
      const imagen = await fetch(`/api/ipfs`, {
        method: "POST",
        body: detalles?.cover,
      });
      const cover = await imagen.json();

      const responseDetalles = await fetch("/api/ipfs", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          ...detalles,
          cover: "ipfs://" + cover?.cid,
          tags: detalles?.tags?.join(","),
          setup: detalles?.setup
            ?.filter((set) => set?.trim() !== "")
            ?.join(","),
          links: detalles?.links?.filter(
            (link) => link !== undefined && link !== null && link?.trim() !== ""
          ),
        }),
      });
      const metadata = await responseDetalles.json();

      const clientWallet = createWalletClient({
        chain: chains.mainnet,
        transport: custom((window as any).ethereum),
      });

      const { request } = await publicClient.simulateContract({
        address: LUCIDITY_WORKFLOWS_CONTRACT,
        abi: LucidityWorkflowsAbi,
        functionName: "createWorkflow",
        chain: chains.mainnet,
        args: ["ipfs://" + metadata?.cid],
        account: address,
      });

      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash: res,
      });

      setError(dict?.Home?.created);
      setEtiqueta("");
      setDetalles({
        links: [
          "https://civitai.com/models/125907?modelVersionId=686204",
          "https://huggingface.co/Kijai/sam2-safetensors/tree/main",
        ],
      });
      setValido(false);
    } catch (err: any) {
      console.error(err.message);
    }
    setCrearCargando(false);
  };

  return {
    crearCargando,
    detalles,
    setDetalles,
    etiqueta,
    setEtiqueta,
    handleCrear,
    handleParse,
    valido,
    setupAbierto,
    setSetupAbierto,
    setValido,
  };
};

export default useCrear;
