import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
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
import ProfilingPage from './pages/ProfilingPage';
import ProfilingSummaryPage from './pages/ProfilingSummaryPage';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'toji' | 'zen' | 'shinrinyoku' | 'shokuyojo' | 'matsuri' | 'rij' | 'rij-consent' | 'rij-profile' | 'rij-summary' | 'rij-itinerary'>('home');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [itineraryId, setItineraryId] = useState<string | null>(null);

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
    return (
      <RIJPage
        onBack={() => setCurrentPage('home')}
        onNavigateToProfile={(id) => {
          setSessionId(id);
          setCurrentPage('rij-profile');
        }}
        onNavigateToConsent={() => setCurrentPage('rij-consent')}
      />
    );
  }

  if (currentPage === 'rij-consent') {
    return (
      <RIJPage
        onBack={() => setCurrentPage('rij')}
        onNavigateToProfile={(id) => {
          setSessionId(id);
          setCurrentPage('rij-profile');
        }}
        onNavigateToConsent={() => setCurrentPage('rij-consent')}
        isConsentPage
      />
    );
  }

  if (currentPage === 'rij-profile' && sessionId) {
    return (
      <ProfilingPage
        sessionId={sessionId}
        onBack={() => setCurrentPage('home')}
        onComplete={(id) => {
          setSessionId(id);
          setCurrentPage('rij-summary');
        }}
      />
    );
  }

  if (currentPage === 'rij-summary' && sessionId) {
    return (
      <ProfilingSummaryPage
        sessionId={sessionId}
        onBack={() => setCurrentPage('rij-profile')}
        onViewItinerary={(id) => {
          setItineraryId(id);
          setCurrentPage('rij-itinerary');
        }}
      />
    );
  }

  if (currentPage === 'rij-itinerary' && itineraryId) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-light">Itinerary Generated!</h1>
          <p className="text-gray-400">Itinerary ID: {itineraryId}</p>
          <p className="text-sm text-gray-500">Itinerary display will be implemented in the next phase</p>
          <button
            onClick={() => setCurrentPage('home')}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-full text-white font-light tracking-wide transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
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
