import type { Metadata } from "next";
import { Geist_Mono, Inter, Public_Sans, Nunito, Merriweather, Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Agent Persona — CustomGPT.ai",
  description: "Redesigned persona setup with structured controls",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} ${publicSans.variable} ${nunito.variable} ${merriweather.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden bg-[#F5F5F5]">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
