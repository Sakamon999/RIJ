import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Navigation from './components/Navigation';
import WellnessCategories from './components/WellnessCategories';
import ExperienceGallery from './components/ExperienceGallery';
import Philosophy from './components/Philosophy';
import RIJMethodology from './components/RIJMethodology';
import Destinations from './components/Destinations';
import Footer from './components/Footer';
import TojiPage from './pages/TojiPage';
import ZenPage from './pages/ZenPage';
import ShinrinyokuPage from './pages/ShinrinyokuPage';
import ShokuyojoPage from './pages/ShokuyojoPage';
import MatsuriPage from './pages/MatsuriPage';
import RIJPage from './pages/RIJPage';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'toji' | 'zen' | 'shinrinyoku' | 'shokuyojo' | 'matsuri' | 'rij'>('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (currentPage === 'toji') {
    return <TojiPage onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'zen') {
    return <ZenPage onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'shinrinyoku') {
    return <ShinrinyokuPage onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'shokuyojo') {
    return <ShokuyojoPage onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'matsuri') {
    return <MatsuriPage onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'rij') {
    return <RIJPage onBack={() => setCurrentPage('home')} />;
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        scrolled={scrolled}
        onRIJClick={() => setCurrentPage('rij')}
      />
      <Hero />
      <Philosophy />
      <WellnessCategories
        onTojiClick={() => setCurrentPage('toji')}
        onZenClick={() => setCurrentPage('zen')}
        onShinrinyokuClick={() => setCurrentPage('shinrinyoku')}
        onShokuyojoClick={() => setCurrentPage('shokuyojo')}
        onMatsuriClick={() => setCurrentPage('matsuri')}
      />
      <ExperienceGallery />
      <Destinations />
      <RIJMethodology />
      <Footer />
    </div>
  );
}

export default App;
