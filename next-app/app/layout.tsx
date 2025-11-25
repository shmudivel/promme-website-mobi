import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

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
      <body className="antialiased overflow-x-hidden">
        <Header />
        <div className="pt-[65px]">{children}</div>
      </body>
    </html>
  );
}
