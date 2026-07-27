import type { Metadata } from "next";
import { Archivo, Newsreader, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import BackgroundWash from "@/components/BackgroundWash";
import FluidSim from "@/components/FluidSim";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import GsapProvider from "@/components/GsapProvider";
import { site } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  authors: [{ name: site.name, url: "https://github.com/pa1narendra" }],
  creator: site.name,
  openGraph: {
    title: site.title,
    description: site.description,
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${newsreader.variable} ${plexMono.variable}`}
    >
      <body>
        <a href="#content" className="skip-link mono">
          skip to content
        </a>
        <Preloader />
        <BackgroundWash />
        <FluidSim />
        <Cursor />
        <GsapProvider />
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
