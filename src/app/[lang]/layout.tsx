import "./../globals.css";
import { Metadata } from "next";
import Providers from "../providers";
import ModalsEntry from "../components/Modals/modules/ModalsEntry";
import { tParams } from "./[...notFound]/page";
import LeftBarEntry from "../components/Common/modules/LeftBarEntry";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lucidity.agentmeme.xyz"),
  title: "Lucidity",
  description: "Agentic ComfyStream Search.",
  robots: {
    googleBot: {
      index: true,
      follow: true,
    },
  },
  twitter: {
    creator: "@emmajane1313",
    card: "summary_large_image",
    title: "Lucidity",
    description: "Agentic ComfyStream Search.",
  },
  openGraph: {
    title: "Lucidity",
    description: "Agentic ComfyStream Search.",
  },
  creator: "Emma-Jane MacKinnon-Lee",
  publisher: "Emma-Jane MacKinnon-Lee",
  keywords: [
    "Web3",
    "Web3 Fashion",
    "Moda Web3",
    "Open Source",
    "CC0",
    "Emma-Jane MacKinnon-Lee",
    "Open Source LLMs",
    "DIGITALAX",
    "F3Manifesto",
    "www.digitalax.xyz",
    "www.f3manifesto.xyz",
    "Women",
    "Life",
    "Freedom",
  ],
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
