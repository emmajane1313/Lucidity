import { FunctionComponent, JSX } from "react";
import useSignless from "../hooks/useSignless";
import { SignlessProps } from "../types/modals.types";

const Signless: FunctionComponent<SignlessProps> = ({
  lensConnected,
  setSignless,
  dict
}): JSX.Element => {
  const { signlessLoading, handleSignless } = useSignless(
    lensConnected,
    setSignless
  );
  return (
    <div
      className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto cursor-pointer items-center justify-center"
      onClick={() => setSignless(false)}
    >
      <div
        className="w-96 h-fit text-sm text-white bg-black border border-brillo rounded-md font-dep flex items-center justify-start p-3 cursor-default flex-col gap-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-fit pb-3 h-fit flex items-center justify-center font-dep uppercase text-center">
          {dict.Home.signless}
        </div>
        <div
          className={`relative px-3 py-1 flex items-center justify-center rounded-md bg-black border border-brillo w-28 h-8 ${
            !signlessLoading && "cursor-pointer active:scale-95"
          }`}
          onClick={() => !signlessLoading && handleSignless()}
        >
          {signlessLoading ? (
            <svg
              fill="none"
              className="size-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M13 2h-2v6h2V2zm0 14h-2v6h2v-6zm9-5v2h-6v-2h6zM8 13v-2H2v2h6zm7-6h2v2h-2V7zm4-2h-2v2h2V5zM9 7H7v2h2V7zM5 5h2v2H5V5zm10 12h2v2h2v-2h-2v-2h-2v2zm-8 0v-2h2v2H7v2H5v-2h2z"
                fill="currentColor"
              />{" "}
            </svg>
          ) : (
             dict.Home.enable
          )}
        </div>
      </div>
    </div>
  );
};

export default Signless;
