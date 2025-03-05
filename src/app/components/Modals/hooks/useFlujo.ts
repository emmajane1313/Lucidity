import { useState } from "react";

const useFlujo = () => {
  const [copiar, setCopiar] = useState<boolean>(false);

  const descargar = (data: object) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = "data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const copiarFlujo = (data: object) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiar(true);
    setTimeout(() => setCopiar(false), 2000);
  };

  return {
    copiar,
    copiarFlujo,
    descargar,
  };
};

export default useFlujo;
