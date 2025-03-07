import { getDictionary } from "./../dictionaries";
import { tParams } from "../[...notFound]/page";
import descripcionRegex from "@/app/lib/helpers/descripcionRegex";

export default async function Info({ params }: { params: tParams }) {
  const { lang } = await params;

  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return (
    <div className="relative w-full h-screen flex items-center justify-center text-center bg-black font-nerdS text-white p-3 sm:p-10">
      <div className="relative w-1/2 flex items-center justify-center">
        <div
          className="relative w-full h-fit flex break-words text-center"
          dangerouslySetInnerHTML={{
            __html: descripcionRegex(dict.Home.info ?? "", false),
          }}
        ></div>
      </div>
    </div>
  );
}
