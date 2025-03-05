import "./../globals.css";
import { Metadata } from "next";
import Providers from "../providers";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
