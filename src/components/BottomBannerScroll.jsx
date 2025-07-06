import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS, fetchData } from '../api';

const BottomBannerScroll = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log('BottomBannerScroll initial data:', data);
    let isMounted = true;
    const fetchBottomBannerData = async () => {
      try {
        const response = await fetchData(API_ENDPOINTS.bottomBanner);
        if (response?.data?.length > 0) {
          console.log('BottomBannerScroll fetched data:', response.data);
          const dataWithRanks = response.data.map((item, index) => ({
            rank: index + 1,
            symbol: item.symbol?.replace('-USD', '') || 'N/A',
            price: item.current_price || 0,
            // 1hr volume % change (estimate from backend, or 0 if not present)
            volumeChange: item.volume_change_estimate ?? 0,
            volume: item.volume_24h || 0
          }));
          if (isMounted) {
            setData(dataWithRanks.slice(0, 10));
            console.log('BottomBannerScroll updated data:', dataWithRanks.slice(0, 10));
          }
        } else {
          console.error('BottomBannerScroll: No valid data received');
        }
      } catch (err) {
        console.error('Error fetching bottom banner data:', err);
      }
    };
    
    // Fetch data immediately
    fetchBottomBannerData();
    const interval = setInterval(fetchBottomBannerData, 120000); // 2 minutes for banners
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  // Style matches top banner, but for volume change
  const getBadgeStyle = (change) => {
    const absChange = Math.abs(change);
    if (absChange >= 5) return 'bg-blue-500 text-white';
    if (absChange >= 2) return 'bg-orange-500 text-white';
    return 'bg-gray-700 text-white';
  };

  // Never show loading or empty states - always render the banner
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-dark/80 via-mid-dark/60 to-dark/80 rounded-3xl shadow-2xl">
      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-headline font-bold tracking-wide uppercase text-blue">
            1H Volume % Change • Live Market Feed
          </h3>
        </div>
      </div>
      
      {/* Scrolling Content */}
      <div className="relative h-16 overflow-hidden">
        {/* Left fade overlay */}
        <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-dark via-dark/80 to-transparent z-10 pointer-events-none"></div>
        
        {/* Right fade overlay */}
        <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-dark via-dark/80 to-transparent z-10 pointer-events-none"></div>
        
        <div className="absolute inset-0 flex items-center animate-scroll">
          <div className="flex whitespace-nowrap">
            {/* First set of data */}
            {data.map((coin) => (
              <div key={`first-${coin.symbol}`} className="flex-shrink-0 mx-8 hover:scale-105 transition-transform duration-300">
                <a 
                  href={`https://www.coinbase.com/advanced-trade/spot/${coin.symbol}-USD`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-300 hover:from-orange-400 hover:to-orange-200 transition-all duration-300">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-headline font-bold tracking-wide text-light">
                        {coin.symbol}
                      </span>
                      <span className="font-mono text-lg font-bold text-[#00C0A5] bg-transparent px-3 py-2 rounded">
                        ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-lg font-bold text-blue">
                      <span>{coin.volumeChange >= 0 ? '+' : ''}{coin.volumeChange.toFixed(2)}%</span>
                    </div>
                    {(() => {
                      let label = 'WEAK';
                      if (coin.volumeChange >= 5) label = 'STRONG';
                      else if (coin.volumeChange >= 2) label = 'MODERATE';
                      return (
                        <div className={`px-3 py-2 rounded-full text-sm font-bold tracking-wide ${getBadgeStyle(coin.volumeChange)}`}>
                          {label}
                        </div>
                      );
                    })()}
                  </div>
                </a>
              </div>
            ))}
            {/* Duplicate set for seamless scrolling (use volumeChange and badge logic) */}
            {data.map((coin) => (
              <div key={`second-${coin.symbol}`} className="flex-shrink-0 mx-8 hover:scale-105 transition-transform duration-300">
                <a 
                  href={`https://www.coinbase.com/advanced-trade/spot/${coin.symbol}-USD`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-300 hover:from-orange-400 hover:to-orange-200 transition-all duration-300">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-headline font-bold tracking-wide text-light">
                        {coin.symbol}
                      </span>
                      <span className="font-mono text-lg font-bold text-[#00C0A5] bg-transparent px-3 py-2 rounded">
                        ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-lg font-bold text-blue">
                      <span>{coin.volumeChange >= 0 ? '+' : ''}{coin.volumeChange.toFixed(2)}%</span>
                    </div>
                    {(() => {
                      let label = 'WEAK';
                      if (coin.volumeChange >= 5) label = 'STRONG';
                      else if (coin.volumeChange >= 2) label = 'MODERATE';
                      return (
                        <div className={`px-3 py-2 rounded-full text-sm font-bold tracking-wide ${getBadgeStyle(coin.volumeChange)}`}>
                          {label}
                        </div>
                      );
                    })()}
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomBannerScroll;
