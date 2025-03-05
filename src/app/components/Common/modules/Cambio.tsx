import { FunctionComponent, JSX } from "react";
import { CambioProps, Pantalla } from "../types/common.types";
import Chat from "../../Chat/modules/Chat";
import Crear from "../../Crear/modules/Crear";
import Cuenta from "../../Cuenta/modules/Cuenta";
import Workflows from "../../Workflows/modules/Workflows";

const Cambio: FunctionComponent<CambioProps> = ({
  pantalla,
  dict,
}): JSX.Element => {
  switch (pantalla) {
    case Pantalla.Crear:
      return <Crear dict={dict} />;

    case Pantalla.Workflows:
      return <Workflows dict={dict} />;

    case Pantalla.Cuenta:
      return <Cuenta dict={dict} />;

    default:
      return <Chat dict={dict} />;
  }
};

export default Cambio;
