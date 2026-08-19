import type { Metadata, Viewport } from "next";
import { Great_Vibes, Mukta, Rozha_One } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import { AppShell } from "@/components/shell/AppShell";
import "./globals.css";

const display = Rozha_One({
  subsets: ["latin", "devanagari"],
  weight: "400",
  variable: "--font-display-face",
  display: "swap",
});

const sans = Mukta({
  subsets: ["latin", "devanagari"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans-face",
  display: "swap",
});

const deva = Mukta({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500"],
  variable: "--font-deva-face",
  display: "swap",
});

const signature = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-signature-face",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mana Vinayaka — Vinayaka Chavithi",
  description:
    "A memory book and yearly time capsule for Vinayaka Chavithi. Photos, stories, voices and the people who were there.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0b0e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${deva.variable} ${signature.variable}`}>
      <body>
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}
