import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS, fetchData } from '../api';

const GainersTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDotStyle = (badge) => {
    if (badge === 'STRONG HIGH') {
      return 'bg-green-400 shadow-lg shadow-green-400/50';
    } else if (badge === 'STRONG') {
      return 'bg-blue-400 shadow-lg shadow-blue-400/50';
    } else {
      return 'bg-yellow-400 shadow-lg shadow-yellow-400/50';
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchGainersData = async () => {
      try {
        const response = await fetchData(API_ENDPOINTS.gainersTable);
        if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
          const gainersWithRanks = response.data.map((item, index) => ({
            rank: item.rank || (index + 1),
            symbol: item.symbol?.replace('-USD', '') || 'N/A',
            price: item.current_price || 0,
            change: item.price_change_percentage_3min || 0,
            badge: getBadgeText(Math.abs(item.price_change_percentage_3min || 0))
          }));
          if (isMounted) setData(gainersWithRanks.slice(0, 7));
        } else if (isMounted && data.length === 0) {
          // Only use fallback if we have no data at all
          setData([
            { rank: 1, symbol: 'SUKU', price: 0.0295, change: 3.51, badge: 'STRONG' },
            { rank: 2, symbol: 'HNT', price: 2.30, change: 0.97, badge: 'MODERATE' },
            { rank: 3, symbol: 'OCEAN', price: 0.3162, change: 0.60, badge: 'MODERATE' },
            { rank: 4, symbol: 'PENGU', price: 0.01605, change: 0.56, badge: 'MODERATE' },
            { rank: 5, symbol: 'MUSE', price: 7.586, change: 0.53, badge: 'MODERATE' }
          ]);
        }
        if (isMounted) setLoading(false);
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
          // Only use fallback if we have no existing data
          if (data.length === 0) {
            setData([
              { rank: 1, symbol: 'SUKU', price: 0.0295, change: 3.51, badge: 'STRONG' },
              { rank: 2, symbol: 'HNT', price: 2.30, change: 0.97, badge: 'MODERATE' },
              { rank: 3, symbol: 'OCEAN', price: 0.3162, change: 0.60, badge: 'MODERATE' },
              { rank: 4, symbol: 'PENGU', price: 0.01605, change: 0.56, badge: 'MODERATE' },
              { rank: 5, symbol: 'MUSE', price: 7.586, change: 0.53, badge: 'MODERATE' }
            ]);
          }
        }
      }
    };
    fetchGainersData();
    const interval = setInterval(fetchGainersData, 30000);
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  const getBadgeText = (change) => {
    const absChange = Math.abs(change);
    if (absChange >= 5) return 'STRONG HIGH';
    if (absChange >= 2) return 'STRONG';
    return 'MODERATE';
  };

  if (loading && data.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse text-blue font-mono">Loading gainers...</div>
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
        <div className="text-muted font-mono">No gainers data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {data.map((item, index) => (
        <div key={item.symbol}>
          <div
            className="group flex items-center justify-between p-4 rounded-2xl hover:bg-gradient-to-r hover:from-blue/10 hover:to-blue/20 transition-all duration-300 hover:shadow-lg hover:shadow-blue/20"
          >
            <div className="flex items-center gap-4">
              {/* Rank Badge */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue/20 text-blue font-bold text-sm">
                {item.rank}
              </div>
              
              {/* Symbol and Price */}
              <div className="flex items-center gap-3">
                <a 
                  href={`https://www.coinbase.com/advanced-trade/spot/${item.symbol}-USD`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-headline font-bold text-white text-lg tracking-wide hover:text-blue transition-colors duration-300 cursor-pointer"
                >
                  {item.symbol}
                </a>
                <span className="font-mono text-xl text-[#00C0A5] font-bold px-3 py-1 rounded-lg">
                  ${item.price < 1 ? item.price.toFixed(4) : item.price.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Change Percentage */}
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-blue font-mono font-bold text-lg">
                  <span>+{item.change.toFixed(2)}%</span>
                </div>
                <span className="text-sm text-blue/70 font-mono">
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
            <div className="border-b border-blue/20 mx-4"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GainersTable;
