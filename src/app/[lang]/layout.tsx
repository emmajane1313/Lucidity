import "./../globals.css";
import { Metadata } from "next";
import Providers from "../providers";
import ModalsEntry from "../components/Modals/modules/ModalsEntry";
import { tParams } from "./[...notFound]/page";
import LeftBarEntry from "../components/Common/modules/LeftBarEntry";

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
          <div className="relative w-full h-full flex flex-row items-start justify-center overflow-x-hidden overflow-y-hidden bg-black min-h-screen">
            <div className="relative w-fit h-full flex">
              <div className="relative w-16 h-full flex">
                <LeftBarEntry params={params} />
              </div>
            </div>
            {children}
          </div>
          <ModalsEntry params={params} />
        </Providers>
      </body>
    </html>
  );
}
