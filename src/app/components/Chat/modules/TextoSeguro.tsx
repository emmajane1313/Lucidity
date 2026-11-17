import { FunctionComponent, JSX } from "react";
import safeExternalUrl from "@/app/lib/helpers/safeExternalUrl";
import { TextoSeguroProps } from "../types/chat.types";

const TextoSeguro: FunctionComponent<TextoSeguroProps> = ({
  texto,
}): JSX.Element => {
  const partes = String(texto ?? "").split(/(https?:\/\/[^\s<>"'`)\]]+)/g);

  return (
    <div className="relative w-full h-fit block whitespace-pre-line break-all">
      {partes.map((parte, indice) => {
        const url = indice % 2 === 1 ? safeExternalUrl(parte) : undefined;

        return url ? (
          <a
            key={indice}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {parte}
          </a>
        ) : (
          <span key={indice}>{parte}</span>
        );
      })}
    </div>
  );
};

export default TextoSeguro;
