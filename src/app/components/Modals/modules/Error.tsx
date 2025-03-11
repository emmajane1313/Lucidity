import { FunctionComponent, JSX } from "react";
import { ErrorProps } from "../types/modals.types";

const Error: FunctionComponent<ErrorProps> = ({
  setError,
  error,
}): JSX.Element => {
  return (
    <div
      className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto cursor-pointer items-center justify-center text-white font-dep"
      onClick={() => setError(undefined)}
    >
      <div
        className="relative w-full sm:w-96 border border-brillo flex rounded-md bg-black p-3 cursor-default h-fit flex-col gap-6 items-center justify-start"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative text-center w-fit h-fit flex items-center justify-center py-6">
          {error}
        </div>
      </div>
    </div>
  );
};

export default Error;
