import Seo from '@/components/site/Seo';
import Header from '@/components/site/Header';
import StageNav from '@/components/site/StageNav';
import Hero from '@/components/site/Hero';
import DesktopHint from '@/components/site/DesktopHint';
import StageSection from '@/components/stage/StageSection';
import Premium from '@/components/site/Premium';
import About from '@/components/site/About';
import Footer from '@/components/site/Footer';
import { stages } from '@/data/stages';

const Index = () => (
  <div className="min-h-screen bg-background">
    <Seo />
    <Header />
    <StageNav />
    <main>
      <Hero />
      <DesktopHint />
      {stages.map((s) => (
        <StageSection key={s.id} stage={s} />
      ))}
      <Premium />
      <About />
    </main>
    <Footer />
  </div>
);

export default Index;
