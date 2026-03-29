import {
  Playfair_Display,
  Source_Serif_4,
  JetBrains_Mono,
} from "next/font/google";
import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/app/lib/siteConfig";
import SkipNav from "./components/SkipNav/SkipNav";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import "./globals.css";
import ConsoleGame from "@/app/components/ConsoleGame/ConsoleGame";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-body",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const viewport: Viewport = {
  themeColor: "#0f0e0d",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "frontend engineer",
    "design systems",
    "accessibility",
    "React",
    "TypeScript",
    "web accessibility",
    "WCAG",
    "Jo Wolff",
    "Joseph Wolff",
  ],
  authors: [{ name: "Jo Wolff", url: siteConfig.url }],
  creator: "Jo Wolff",
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/og"],
    creator: "@thewolff_FEE",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: siteConfig.name,
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <SkipNav />
        <Header />
        {children}
        <Footer />
        <ConsoleGame />
      </body>
    </html>
  );
}
