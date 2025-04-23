import { FunctionComponent, JSX } from "react";
import { ImageMetadata } from "@lens-protocol/client";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import descripcionRegex from "@/app/lib/helpers/descripcionRegex";
import { MetadataProps } from "../types/workflow.types";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";

const Metadata: FunctionComponent<MetadataProps> = ({
  metadata,
  data,
}): JSX.Element => {
  console.log({ data });
  switch (metadata) {
    case "ImageMetadata":
      return (
        <div
          className={`relative w-full flex flex-col gap-2 items-center justify-center h-full`}
        >
          <div
            className={`relative w-fit flex items-center justify-center h-fit`}
          >
            <div
              className={`relative flex items-start justify-start w-full sm:w-60 h-60`}
            >
              <Image
                layout="fill"
                className="rounded-sm"
                src={handleProfilePicture((data as ImageMetadata)?.image?.item)}
                objectFit="cover"
                draggable={false}
              />
            </div>
          </div>
          <div
            className={`relative w-full overflow-y-scroll p-1 items-start justify-start text-xs bg-brillo rounded-md break-all h-full`}
          >
            <div
              className="relative w-full h-full flex p-3 items-start justify-start break-all rounded-md bg-black font-dep text-white min-h-20"
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
          className={`relative w-full overflow-y-scroll items-start justify-start text-xs bg-pink rounded-md break-all h-full max-h-32`}
        >
          <div
            className="relative w-full h-full flex p-3 items-start justify-start break-all rounded-md bg-black font-dep text-white min-h-20"
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
