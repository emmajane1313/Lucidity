import { FunctionComponent, JSX } from "react";
import { ImageMetadata } from "@lens-protocol/client";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import descripcionRegex from "@/app/lib/helpers/descripcionRegex";
import { MetadataProps } from "../types/workflow.types";

const Metadata: FunctionComponent<MetadataProps> = ({
  metadata,
  data,
}): JSX.Element => {
  switch (metadata) {
    case "ImageMetadata":
      return (
        <div
          className={`relative w-full flex flex-col gap-2 items-start justify-start h-full`}
        >
          <div
            className={`relative w-full flex items-center justify-center h-full`}
          >
            <div
              className={`relative flex items-start justify-start w-full h-60`}
            
            >
              <Image
                layout="fill"
                className="rounded-sm"
                src={`${INFURA_GATEWAY}/ipfs/${
                  ((data as ImageMetadata)?.image?.item as string)?.split(
                    "ipfs://"
                  )?.[1]
                }`}
                objectFit="cover"
                draggable={false}
              />
            </div>
          </div>

          <div
            className={`relative w-full overflow-y-scroll p-1 items-start justify-start text-xs bg-brillo rounded-md break-all h-full`}
          >
            <div
              className="relative w-full h-full flex p-1 items-start justify-start break-all rounded-md bg-black font-nerdS text-white min-h-20"
              dangerouslySetInnerHTML={{
                __html: descripcionRegex(
                  (data as ImageMetadata)?.content as string,
                  false
                ),
              }}
            ></div>
          </div>
        </div>
      );

    case "TextOnlyMetadata":
      return (
        <div
          className={`relative w-full overflow-y-scroll p-1 items-start justify-start text-xs bg-pink rounded-md break-all h-full max-h-32`}
        >
          <div
            className="relative w-full h-full flex p-1 items-start justify-start break-all rounded-md bg-black font-nerdS text-white min-h-20"
            dangerouslySetInnerHTML={{
              __html: descripcionRegex(
                (data as ImageMetadata)?.content as string,
                false
              ),
            }}
          ></div>
        </div>
      );

    default:
      return <div></div>;
  }
};

export default Metadata;
