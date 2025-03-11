import { getDictionary } from "./../dictionaries";
import { tParams } from "../[...notFound]/page";
import descripcionRegex from "@/app/lib/helpers/descripcionRegex";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";

export default async function Info({ params }: { params: tParams }) {
  const { lang } = await params;

  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return (
    <div className="relative w-full h-screen flex items-center justify-center text-center bg-brillo font-dep text-black p-3 sm:p-10">
      <div className="relative w-full flex h-full items-center justify-between gap-28 flex-row">
        <div className="relative w-full h-full flex items-center justify-center gap-12 flex-col">
          <div
            className="relative text-sm w-full h-fit flex break-words text-left font-gothic"
            dangerouslySetInnerHTML={{
              __html: descripcionRegex(dict.Home.info1 ?? "", false),
            }}
          ></div>
          <div className="relative w-full h-fit flex break-words text-left uppercase font-count text-5xl">
            {dict.Home.discovery}
          </div>
          <div
            className="relative w-full text-sm h-fit flex break-words text-left"
            dangerouslySetInnerHTML={{
              __html: descripcionRegex(dict.Home.info2 ?? "", false),
            }}
          ></div>
        </div>
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative w-full h-full flex">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmSo2g6GWqqzsLLHUNdghZmchd9rZMBigN2psXSpE7akpT`}
              layout="fill"
              objectFit="contain"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
