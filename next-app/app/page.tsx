import SocialFeed from '@/components/SocialFeed';
import VacanciesSection from '@/components/VacanciesSection';
import Footer from '@/components/Footer';
import AIChat from '@/components/AIChat';

export default function Home() {
  return (
    <>
      <main>
        <SocialFeed />
        <VacanciesSection />
      </main>
      <Footer />
      <AIChat />
    </>
  );
}
