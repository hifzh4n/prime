import type { Metadata } from "next";
import { Poppins, Orbitron } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const orbitron = Orbitron({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "Prime - Premium GTA V Mod Menu",
  description: "Experience the most powerful and undetected GTA V mod menu since 2026. Get god-like control with Prime.",
  keywords: ["GTA V", "Mod Menu", "Cheat", "Prime", "Undetected", "Recovery", "Protections"],
  authors: [{ name: "Prime Team" }],
  openGraph: {
    title: "Prime - Premium GTA V Mod Menu",
    description: "Experience the most powerful and undetected GTA V mod menu since 2026.",
    url: "https://prime.gg",
    siteName: "Prime Cheats",
    images: [
      {
        url: "https://prime.gg/og-image.png", // Placeholder for actual OG image
        width: 1200,
        height: 630,
        alt: "Prime Mod Menu",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prime - Premium GTA V Mod Menu",
    description: "The most powerful and cheapest cheat since 2026.",
    images: ["https://prime.gg/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body className={`${poppins.variable} ${orbitron.variable} font-sans bg-black text-white antialiased selection:bg-cyan-500/30`}>
        {children}
      </body>
    </html>
  );
}
