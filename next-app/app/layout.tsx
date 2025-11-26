import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

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
        {/* Desktop Header - hidden on mobile */}
        <div className="hidden md:block">
          <Header />
        </div>
        
        {/* Main content with proper padding for mobile bottom nav and desktop top header */}
        <div className="md:pt-[65px] pb-16 md:pb-0">
          {children}
        </div>
        
        {/* Mobile Bottom Navigation - hidden on desktop */}
        <BottomNav />
      </body>
    </html>
  );
}
