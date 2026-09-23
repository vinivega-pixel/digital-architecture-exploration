import Seo from '@/components/site/Seo';
import Header from '@/components/site/Header';
import Hero from '@/components/site/Hero';
import Tools from '@/components/site/Tools';
import PathLine from '@/components/site/PathLine';
import AiBlock from '@/components/site/AiBlock';
import Audience from '@/components/site/Audience';
import Services from '@/components/site/Services';
import StagesBoard from '@/components/stage/StagesBoard';
import MobileGallery from '@/components/stage/MobileGallery';
import Premium from '@/components/site/Premium';
import About from '@/components/site/About';
import Knowledge from '@/components/site/Knowledge';
import Footer from '@/components/site/Footer';

const Index = () => (
  <div className="min-h-screen bg-background">
    <Seo />
    <Header />
    <main>
      <Hero />
      <Tools />
      <PathLine />
      <AiBlock />
      <Audience />
      <Services />
      <MobileGallery />
      <StagesBoard />
      <Premium />
      <About />
      <Knowledge />
    </main>
    <Footer />
  </div>
);

export default Index;
