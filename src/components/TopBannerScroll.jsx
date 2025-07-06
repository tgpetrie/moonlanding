import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS, fetchData } from '../api';

const TopBannerScroll = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log('TopBannerScroll initial data:', data);
    let isMounted = true;
    const fetchTopBannerData = async () => {
      try {
        const response = await fetchData(API_ENDPOINTS.topBanner);
        if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
          console.log('TopBannerScroll fetched data:', response.data);
          const dataWithRanks = response.data.map((item, index) => ({
            rank: index + 1,
            symbol: item.symbol?.replace('-USD', '') || 'N/A',
            price: item.current_price || 0,
            change: item.price_change_1h || 0,
            badge: getBadgeStyle(Math.abs(item.price_change_1h || 0))
          }));
          if (isMounted) {
            setData(dataWithRanks.slice(0, 10));
            console.log('TopBannerScroll updated data:', dataWithRanks.slice(0, 10));
          }
        } else {
          console.error('TopBannerScroll: No valid data received');
          if (isMounted && data.length === 0) {
            const fallbackData = [
              { rank: 1, symbol: 'SUKU', price: 0.0295, change: 3.51, badge: 'STRONG' },
              { rank: 2, symbol: 'HNT', price: 2.30, change: 0.97, badge: 'MODERATE' },
              { rank: 3, symbol: 'OCEAN', price: 0.3162, change: 0.60, badge: 'MODERATE' },
              { rank: 4, symbol: 'PENGU', price: 0.01605, change: 0.56, badge: 'MODERATE' },
              { rank: 5, symbol: 'MUSE', price: 7.586, change: 0.53, badge: 'MODERATE' }
            ];
            setData(fallbackData);
          }
        }
      } catch (err) {
        console.error('Error fetching top banner data:', err);
        if (isMounted && data.length === 0) {
          const fallbackData = [
            { rank: 1, symbol: 'SUKU', price: 0.0295, change: 3.51, badge: 'STRONG' },
            { rank: 2, symbol: 'HNT', price: 2.30, change: 0.97, badge: 'MODERATE' },
            { rank: 3, symbol: 'OCEAN', price: 0.3162, change: 0.60, badge: 'MODERATE' },
            { rank: 4, symbol: 'PENGU', price: 0.01605, change: 0.56, badge: 'MODERATE' },
            { rank: 5, symbol: 'MUSE', price: 7.586, change: 0.53, badge: 'MODERATE' }
          ];
          setData(fallbackData);
        }
      }
    };
    
    fetchTopBannerData();
    const interval = setInterval(fetchTopBannerData, 120000); // 2 minutes for banners
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  const getBadgeStyle = (change) => {
    const absChange = Math.abs(change);
    if (absChange >= 5) return 'bg-blue-500 text-white';
    if (absChange >= 2) return 'bg-orange-500 text-white';
    return 'bg-gray-700 text-white';
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-dark/80 via-mid-dark/60 to-dark/80 rounded-3xl shadow-2xl">
      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-headline font-bold tracking-wide uppercase text-blue">
            1H Price Change • Live Market Feed
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
            {/* Scrolling coins */}
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
                      <span>{coin.change >= 0 ? '+' : ''}{coin.change.toFixed(2)}%</span>
                    </div>
                    <div className={`px-3 py-2 rounded-full text-sm font-bold tracking-wide ${getBadgeStyle(coin.change)}`}>
                      {coin.change >= 5 ? 'STRONG' : coin.change >= 2 ? 'MODERATE' : 'WEAK'}
                    </div>
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

export default TopBannerScroll;
