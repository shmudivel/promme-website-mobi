import Hero from '@/components/Hero';
import MissionSection from '@/components/MissionSection';
import AboutPortalSection from '@/components/AboutPortalSection';
import VacanciesSection from '@/components/VacanciesSection';
import Footer from '@/components/Footer';
import AIChat from '@/components/AIChat';

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <MissionSection />
        <AboutPortalSection />
        <VacanciesSection />
      </main>
      <Footer />
      <AIChat />
    </>
  );
}
