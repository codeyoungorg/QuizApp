import Script from "next/script";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const { NEXT_ENABLE_NEWRELIC } = process.env;

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Sandbox",
  description: "AI powered quiz app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {NEXT_ENABLE_NEWRELIC === "1" && (
          <Script
            src="/newrelic-browser-agent.js"
            strategy="beforeInteractive"
          />
        )}
        <link
          href="https://fonts.googleapis.com/css2?family=Bowlby+One+SC&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={poppins.className}>
        <Providers>
          <main className="flex flex-col h-screen w-full">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
