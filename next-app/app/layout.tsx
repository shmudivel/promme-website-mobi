import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PROMME - Портал вакансий промышленного сектора",
  description: "Найдите работу в промышленном секторе Московской области. Вакансии, компании, индустриальные парки.",
  keywords: "вакансии, работа, промышленность, Московская область, PROMME",
  authors: [{ name: "PROMME Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#FF6B35",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "PROMME - Портал вакансий промышленного сектора",
    description: "Найдите работу в промышленном секторе Московской области",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
