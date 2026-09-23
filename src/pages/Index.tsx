import Seo from '@/components/site/Seo';
import Header from '@/components/site/Header';
import Hero from '@/components/site/Hero';
import StagesBoard from '@/components/stage/StagesBoard';
import MobileGallery from '@/components/stage/MobileGallery';
import Audience from '@/components/site/Audience';
import Premium from '@/components/site/Premium';
import About from '@/components/site/About';
import Knowledge from '@/components/site/Knowledge';
import Footer from '@/components/site/Footer';
import Workspace from '@/components/site/Workspace';

const Index = () => (
  <div className="min-h-screen bg-background">
    <Seo />
    <Header />
    <main>
      <Hero />
      <MobileGallery />
      <StagesBoard />
      <Audience />
      <Premium />
      <About />
      <Knowledge />
      <Footer />
      <Workspace />
    </main>
  </div>
);

export default Index;
