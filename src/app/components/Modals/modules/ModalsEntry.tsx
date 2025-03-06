import { tParams } from "@/app/[lang]/[...notFound]/page";
import { getDictionary } from "@/app/[lang]/dictionaries";
import Modals from "./Modals";

export default async function ModalsEntry({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <Modals dict={dict} />;
}
