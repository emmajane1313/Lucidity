import { Config } from "wagmi";
import { getAccount, getWalletClient, switchChain } from "wagmi/actions";
import { LENS_CHAIN_ID } from "../constants";

const obtenerCartera = async (config: Config, cambiarCadena: boolean) => {
  if (!cambiarCadena) {
    return await getWalletClient(config);
  }

  if (getAccount(config).chainId !== LENS_CHAIN_ID) {
    await switchChain(config, { chainId: LENS_CHAIN_ID });
  }

  return await getWalletClient(config, { chainId: LENS_CHAIN_ID });
};

export default obtenerCartera;
