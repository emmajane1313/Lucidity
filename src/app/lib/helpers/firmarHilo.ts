import { createHmac, timingSafeEqual } from "crypto";
import { MAX_THREAD_MESSAGES, THREAD_TTL_MS } from "../constants";

const usos = new Map<string, { count: number; reset: number }>();

const firma = (id: string, emitido: number): string | undefined => {
  const clave = process.env.OPENAI_API_KEY;
  if (!clave) return undefined;

  return createHmac("sha256", clave)
    .update(`lucidity-thread:${id}:${emitido}`)
    .digest("hex");
};

export const firmarHilo = (id: string): string | undefined => {
  if (!/^[A-Za-z0-9_-]{1,200}$/.test(id)) return undefined;

  const emitido = Date.now();
  const firmado = firma(id, emitido);

  return firmado ? `${id}.${emitido}.${firmado}` : undefined;
};

export const verificarHilo = (token: unknown): string | undefined => {
  if (typeof token !== "string" || token.length > 400) return undefined;

  const partes = token.split(".");
  if (partes.length !== 3) return undefined;

  const [id, emitidoTexto, recibida] = partes;
  if (
    !/^[A-Za-z0-9_-]{1,200}$/.test(id) ||
    !/^\d{1,16}$/.test(emitidoTexto) ||
    !/^[0-9a-f]{64}$/.test(recibida)
  ) {
    return undefined;
  }

  const emitido = Number(emitidoTexto);
  const ahora = Date.now();
  if (emitido > ahora + 60000 || ahora - emitido > THREAD_TTL_MS) {
    return undefined;
  }

  const esperada = firma(id, emitido);
  if (!esperada) return undefined;

  const a = Buffer.from(esperada, "hex");
  const b = Buffer.from(recibida, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return undefined;

  return id;
};

export const hiloAgotado = (id: string): boolean => {
  const ahora = Date.now();

  if (usos.size > 5000) {
    usos.forEach((value, key) => {
      if (value.reset <= ahora) usos.delete(key);
    });
  }

  const entrada = usos.get(id);
  if (!entrada || entrada.reset <= ahora) {
    usos.set(id, { count: 1, reset: ahora + THREAD_TTL_MS });
    return false;
  }

  entrada.count += 1;
  return entrada.count > MAX_THREAD_MESSAGES;
};
