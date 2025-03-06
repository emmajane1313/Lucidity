import Creador from "@/app/components/Creator/modules/Creador";
import { getDictionary } from "../../dictionaries";

export type tParams = Promise<{ lang: string }>;

export default async function Creator({ params }: { params: tParams }) {
  const { lang } = await params;

  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <Creador dict={dict} />;
}
