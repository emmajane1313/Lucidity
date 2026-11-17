import safeExternalUrl from "./safeExternalUrl";

const abrirEnlace = (enlace: string | undefined | null): void => {
  const url = safeExternalUrl(enlace, true);
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
};

export default abrirEnlace;
