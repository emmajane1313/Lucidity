import { RefObject, SetStateAction } from "react";
import { Flujo } from "../../Modals/types/modals.types";

export enum Usuario {
  Maquina,
  Humano,
  Flujos,
  NewFlujo,
}

export type MensajesProps = {
  sendMessageLoading: boolean;
  mensajes: Mensaje[];
  messagesEndRef: RefObject<HTMLDivElement | null>;
  dict: any;
  setFlujo: (e: SetStateAction<Flujo | undefined>) => void;
  typedMessage: string;
  user?: string;
};

export interface Mensaje {
  contenido: string;
  usuario: Usuario;
  flujos?: Flujo[];
  flujo?: object;
  action?: string;
}
