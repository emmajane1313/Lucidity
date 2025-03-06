import { tParams } from "@/app/[lang]/[...notFound]/page";
import { getDictionary } from "@/app/[lang]/dictionaries";
import LeftBar from "./LeftBar";

export default async function LeftBarEntry({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <LeftBar dict={dict} />;
}
