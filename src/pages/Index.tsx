import Header from '@/components/site/Header';
import Hero from '@/components/site/Hero';
import RouteMap from '@/components/site/RouteMap';
import DesignServices from '@/components/site/DesignServices';
import Automation from '@/components/site/Automation';
import Products from '@/components/site/Products';
import Calculators from '@/components/site/Calculators';
import DigitalTwin from '@/components/site/DigitalTwin';
import About from '@/components/site/About';
import Contacts from '@/components/site/Contacts';
import Footer from '@/components/site/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <RouteMap />
        <DesignServices />
        <Automation />
        <Products />
        <Calculators />
        <DigitalTwin />
        <About />
        <Contacts />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
