import { INFURA_GATEWAY, GROVE_GATEWAY } from "../constants";

export const handleProfilePicture = (pic: string): string => {
  const valor = typeof pic === "string" ? pic.trim() : "";

  if (valor.startsWith("https://")) {
    return valor;
  } else if (valor.startsWith("ipfs://")) {
    return `${INFURA_GATEWAY}/ipfs/${encodeURI(valor.slice(7))}`;
  } else if (valor.startsWith("lens://")) {
    return `${GROVE_GATEWAY}${encodeURI(valor.slice(7))}`;
  }

  return `${INFURA_GATEWAY}/ipfs/QmX5Uk9WeqsVHoNQhUP3fzTasv3J6zuat4L5L6zmaTVzBW`;
};
