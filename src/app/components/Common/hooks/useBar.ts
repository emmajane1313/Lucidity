import { useEffect, useState } from "react";
import { Pantalla } from "../types/common.types";

const useBar = () => {
  const [pantalla, setPantalla] = useState<Pantalla>(Pantalla.Chat);
  const [abrirBarIzquierdo, setAbrirBarIzquierdo] = useState<boolean>(false);

  return {
    abrirBarIzquierdo,
    setAbrirBarIzquierdo,
    pantalla,
    setPantalla,
  };
};

export default useBar;
