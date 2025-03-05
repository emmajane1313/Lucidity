import { FunctionComponent, JSX } from "react";
import { CambioElementoProps } from "../../Common/types/common.types";


const Crear: FunctionComponent<CambioElementoProps> = ({
  dict,
}): JSX.Element => {
  return (
    <div className={`relative w-full pb-10 h-full flex flex-col gap-10`}></div>
  );
};

export default Crear;
