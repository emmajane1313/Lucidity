import { Usuario } from "@/app/components/Chat/types/chat.types";

export const procesarMensaje = (texto: string) => {
  const regexJson = /```json([\s\S]*?)```/;
  const match = texto.match(regexJson);

  if (match) {
    const textoAntesDelJson = texto.replace(match[0], "").trim();
    let jsonContenido = null;

    try {
      jsonContenido = JSON.parse(match[1]);
    } catch (error) {
      console.error("Error al parsear JSON:", error);
    }

    return [
      {
        usuario: Usuario.Maquina,
        contenido: textoAntesDelJson,
      },
      {
        usuario: Usuario.NewFlujo,
        flujo: jsonContenido,
      },
    ];
  }

  return [{ usuario: Usuario.Maquina, contenido: texto }];
};
