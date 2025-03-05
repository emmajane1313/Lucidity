"use client";
import { ModalContext } from "@/app/providers";
import { FunctionComponent, JSX, useContext } from "react";
import Flujo from "./Flujo";
import Error from "./Error";

const Modals: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <>
      {context?.flujo && (
        <Flujo
          dict={dict}
          flujo={context?.flujo}
          setFlujo={context?.setFlujo}
        />
      )}
      {context?.error && (
        <Error error={context?.error} setError={context?.setError} />
      )}
    </>
  );
};

export default Modals;
