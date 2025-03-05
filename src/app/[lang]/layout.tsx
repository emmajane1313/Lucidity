import "./../globals.css";
import { Metadata } from "next";
import Providers from "../providers";
import ModalEntry from "../components/Modals/modules/ModalEntry";
import { tParams } from "./[...notFound]/page";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lucidity.agentmeme.xyz"),
  title: "Lucidity",
  robots: {
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: tParams;
}) {
  return (
    <html>
      <body>
        <Providers>
          <div className="relative w-full h-full flex flex-col items-start justify-start overflow-x-hidden">
            {children}
          </div>
          <ModalEntry params={params} />
        </Providers>
      </body>
    </html>
  );
}
