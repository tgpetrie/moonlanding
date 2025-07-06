import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import GainersTable from './components/GainersTable';
import LosersTable from './components/LosersTable';
import TopBannerScroll from './components/TopBannerScroll';
import BottomBannerScroll from './components/BottomBannerScroll';
import Footer from './components/Footer';
import Logo from '/yup.png';

// Live data polling interval (ms)
const POLL_INTERVAL = 30000;

// Status Badge Component
const StatusBadge = ({ isConnected, lastUpdate }) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-full ${
      isConnected ? 'bg-blue animate-pulse' : 'bg-pink'
    }`}></div>
  </div>
);

StatusBadge.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  lastUpdate: PropTypes.instanceOf(Date).isRequired,
};

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [countdown, setCountdown] = useState(POLL_INTERVAL / 1000);

  // Poll backend connection and update countdown
  useEffect(() => {
    let intervalId;
    let countdownId;
    
    const checkConnection = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api`);
        setIsConnected(response.ok);
      } catch (error) {
        console.error('Connection check failed:', error);
        setIsConnected(false);
      }
    };
    
    checkConnection();
    
    intervalId = setInterval(() => {
      checkConnection();
      setRefreshKey((prev) => prev + 1);
      setLastUpdate(new Date());
      setCountdown(POLL_INTERVAL / 1000);
    }, POLL_INTERVAL);
    
    countdownId = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : POLL_INTERVAL / 1000));
    }, 1000);
    
    return () => {
      clearInterval(intervalId);
      clearInterval(countdownId);
    };
  }, []);

  const refreshGainersAndLosers = () => {
    setRefreshKey((prev) => prev + 1);
    setLastUpdate(new Date());
    setCountdown(POLL_INTERVAL / 1000);
  };

  return (
    <div className="min-h-screen bg-dark text-white font-body relative">
      {/* Background Purple Rabbit - Centered */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <img
          src="/purple-rabbit-bg.png"
          alt="BHABIT Background"
          className="w-96 h-96 sm:w-[32rem] sm:h-[32rem] lg:w-[40rem] lg:h-[40rem]"
          style={{ 
            opacity: 0.05
          }}
        />
      </div>
      
      {/* Main Container with padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <header className="relative flex flex-col items-center justify-center pt-8 pb-6">
          {/* Status and Timer - Top Right */}
          <div className="absolute top-8 right-0 flex items-center gap-3">
            <StatusBadge isConnected={isConnected} lastUpdate={lastUpdate} />
            <div className="flex items-center gap-1 text-xs font-mono bg-black/40 px-3 py-1 rounded-full border border-gray-700">
              <span className="font-bold">{String(countdown).padStart(2, '0')}</span>
            </div>
            {/* Small Refresh Button */}
            <button
              onClick={refreshGainersAndLosers}
              className="gradient-border-btn w-8 h-8 rounded-full bg-transparent text-purple hover:bg-gradient-to-r hover:from-purple/20 hover:to-blue/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple/40 flex items-center justify-center text-sm"
            >
              🔄
            </button>
          </div>
          
          {/* Logo and Tagline - Center */}
          <div className="mb-4">
            <img
              src={Logo}
              alt="BHABIT"
              className="h-32 sm:h-40 lg:h-48 animate-breathing hover:drop-shadow-[0_0_30px_rgb(147,51,234)] transition-all duration-500 cursor-pointer"
            />
          </div>
          <p className="text-lg sm:text-xl text-purple font-mono italic tracking-wide">
            Profits by Impulse
          </p>
        </header>

        {/* Top Banner - 1H Price */}
        <div className="mb-8 -mx-16 sm:-mx-24 lg:-mx-32 xl:-mx-40">
          <TopBannerScroll />
        </div>

        {/* Main Content - Side by Side Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Panel - Top Gainers */}
        <div className="p-6 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">📈</span>
            <h2 className="text-xl font-headline font-bold text-blue tracking-wide">
              Top Gainers (3min)
            </h2>
          </div>
          <GainersTable key={`gainers-${refreshKey}`} />
        </div>

        {/* Right Panel - Top Losers */}
        <div className="p-6 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">📉</span>
            <h2 className="text-xl font-headline font-bold text-pink tracking-wide">
              Top Losers (3min)
            </h2>
          </div>
          <LosersTable key={`losers-${refreshKey}`} />
        </div>
        </div>

        {/* Bottom Banner - 1H Volume */}
        <div className="mb-8 -mx-16 sm:-mx-24 lg:-mx-32 xl:-mx-40">
          <BottomBannerScroll />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
