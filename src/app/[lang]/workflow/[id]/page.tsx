import Flujo from "@/app/components/Workflow/modules/Flujo";
import { getDictionary } from "../../dictionaries";

export type tParams = Promise<{ lang: string }>;

export default async function Workflow({ params }: { params: tParams }) {
  const { lang } = await params;

  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <Flujo dict={dict} />;
}
