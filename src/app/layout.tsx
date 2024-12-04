import Script from "next/script";
import newrelic from "newrelic";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Sandbox",
  description: "AI powered quiz app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const browserTimingHeader = newrelic.getBrowserTimingHeader({
    hasToRemoveScriptWrapper: true,
  });

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bowlby+One+SC&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={poppins.className}>
        <Providers>
          <main className="flex flex-col h-screen w-full">{children}</main>
        </Providers>
        <Script
          id="nr-browser-agent"
          dangerouslySetInnerHTML={{ __html: browserTimingHeader }}
        />
      </body>
    </html>
  );
}
