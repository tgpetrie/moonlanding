import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS, fetchData } from '../api';

const LosersTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDotStyle = (badge) => {
    if (badge === 'STRONG HIGH') {
      return 'bg-red-400 shadow-lg shadow-red-400/50';
    } else if (badge === 'STRONG') {
      return 'bg-purple-400 shadow-lg shadow-purple-400/50';
    } else {
      return 'bg-yellow-400 shadow-lg shadow-yellow-400/50';
    }
  };

  const getBadgeText = (change) => {
    const absChange = Math.abs(change);
    if (absChange >= 5) return 'STRONG HIGH';
    if (absChange >= 2) return 'STRONG';
    return 'MODERATE';
  };

  useEffect(() => {
    let isMounted = true;
    const fetchLosersData = async () => {
      try {
        const response = await fetchData(API_ENDPOINTS.losersTable);
        if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
          const losersWithRanks = response.data.map((item, index) => ({
            rank: item.rank || (index + 1),
            symbol: item.symbol?.replace('-USD', '') || 'N/A',
            price: item.current_price || 0,
            change: item.price_change_percentage_3min || 0,
            badge: getBadgeText(Math.abs(item.price_change_percentage_3min || 0))
          }));
          if (isMounted) setData(losersWithRanks.slice(0, 7));
        } else if (isMounted && data.length === 0) {
          // Fallback data showing some crypto with negative/low gains
          setData([
            { rank: 1, symbol: 'PEPE', price: 0.00000996, change: -2.45, badge: 'MODERATE' },
            { rank: 2, symbol: 'SHIB', price: 0.00002156, change: -1.82, badge: 'MODERATE' },
            { rank: 3, symbol: 'FLOKI', price: 0.000234, change: -0.95, badge: 'MODERATE' },
            { rank: 4, symbol: 'BONK', price: 0.00001717, change: -0.67, badge: 'MODERATE' },
            { rank: 5, symbol: 'WIF', price: 2.543, change: -0.23, badge: 'MODERATE' }
          ]);
        }
        if (isMounted) setLoading(false);
      } catch (err) {
        console.error('Error fetching losers data:', err);
        if (isMounted) {
          setLoading(false);
          setError(err.message);
          
          // Fallback mock data when backend is offline
          const fallbackData = [
            { rank: 1, symbol: 'SEI-USD', current_price: 0.2244, price_change_percentage_3m: -12.89 },
            { rank: 2, symbol: 'AVAX-USD', current_price: 24.56, price_change_percentage_3m: -8.45 },
            { rank: 3, symbol: 'DOT-USD', current_price: 4.78, price_change_percentage_3m: -6.23 },
            { rank: 4, symbol: 'ATOM-USD', current_price: 7.89, price_change_percentage_3m: -9.34 },
            { rank: 5, symbol: 'NEAR-USD', current_price: 3.45, price_change_percentage_3m: -5.67 }
          ].map(item => ({
            ...item,
            price: item.current_price,
            change: item.price_change_percentage_3m,
            badge: getBadgeText(Math.abs(item.price_change_percentage_3m))
          }));
          setData(fallbackData);
        }
      }
    };
    fetchLosersData();
    const interval = setInterval(fetchLosersData, 30000);
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  if (loading && data.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse text-pink font-mono">Loading losers...</div>
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted font-mono">Backend offline - using demo data</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted font-mono">No losers data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {data.map((item, index) => (
        <div key={item.symbol}>
          <div
            className="group flex items-center justify-between p-4 rounded-2xl hover:bg-gradient-to-r hover:from-pink/10 hover:to-pink/20 transition-all duration-300 hover:shadow-lg hover:shadow-pink/20"
          >
            <div className="flex items-center gap-4">
              {/* Rank Badge */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink/20 text-pink font-bold text-sm">
                {item.rank}
              </div>
              
              {/* Symbol and Price */}
              <div className="flex items-center gap-3">
                <a 
                  href={`https://www.coinbase.com/advanced-trade/spot/${item.symbol}-USD`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-headline font-bold text-white text-lg tracking-wide hover:text-pink transition-colors duration-300 cursor-pointer"
                >
                  {item.symbol}
                </a>
                <span className="font-mono text-xl text-[#00C0A5] font-bold px-3 py-1 rounded-lg">
                  {(() => {
                    if (typeof item.price === 'number' && Number.isFinite(item.price)) {
                      if (item.price < 1 && item.price > 0) {
                        return `$${item.price.toFixed(4)}`;
                      } else {
                        return `$${item.price.toFixed(2)}`;
                      }
                    } else {
                      return 'N/A';
                    }
                  })()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Change Percentage */}
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-pink font-mono font-bold text-lg">
                  <span>{typeof item.change === 'number' ? item.change.toFixed(2) : 'N/A'}%</span>
                </div>
                <span className="text-sm text-pink/70 font-mono">
                  3min change
                </span>
              </div>
              
              {/* Badge - Colored Dot */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getDotStyle(item.badge)}`}></div>
              </div>
            </div>
          </div>
          {/* Divider line - only show if not the last item */}
          {index < data.length - 1 && (
            <div className="border-b border-pink/20 mx-4"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LosersTable;
