// API configuration for BHABIT CB4
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// API endpoints matching your backend
export const API_ENDPOINTS = {
  topBanner: `${API_BASE_URL}/api/component/top-banner-scroll`,
  bottomBanner: `${API_BASE_URL}/api/component/bottom-banner-scroll`,
  gainersTable: `${API_BASE_URL}/api/component/gainers-table`,
  losersTable: `${API_BASE_URL}/api/component/losers-table`,
  topMoversBar: `${API_BASE_URL}/api/component/top-movers-bar`,
  crypto: `${API_BASE_URL}/api/crypto`,
  health: `${API_BASE_URL}/api/health`,
  marketOverview: `${API_BASE_URL}/api/market-overview`
};

// Add fallback data for when API is unavailable
const FALLBACK_DATA = {
  topBanner: [
    { symbol: 'BTC-USD', current_price: 45230.12, price_change_1h: 2.34 },
    { symbol: 'ETH-USD', current_price: 2890.45, price_change_1h: 1.87 },
    { symbol: 'SOL-USD', current_price: 102.34, price_change_1h: 4.21 },
    { symbol: 'ADA-USD', current_price: 0.456, price_change_1h: -1.23 },
    { symbol: 'DOT-USD', current_price: 6.78, price_change_1h: 0.89 }
  ],
  gainersTable: [
    { symbol: 'SUKU-USD', current_price: 0.0295, price_change_percentage_3min: 8.51, rank: 1 },
    { symbol: 'HNT-USD', current_price: 2.30, price_change_percentage_3min: 6.97, rank: 2 },
    { symbol: 'OCEAN-USD', current_price: 0.3162, price_change_percentage_3min: 5.60, rank: 3 },
    { symbol: 'PENGU-USD', current_price: 0.01605, price_change_percentage_3min: 4.56, rank: 4 },
    { symbol: 'MUSE-USD', current_price: 7.586, price_change_percentage_3min: 3.53, rank: 5 }
  ],
  losersTable: [
    { symbol: 'LUNA-USD', current_price: 0.456, price_change_percentage_3min: -8.23, rank: 1 },
    { symbol: 'ATOM-USD', current_price: 7.89, price_change_percentage_3min: -6.45, rank: 2 },
    { symbol: 'ALGO-USD', current_price: 0.234, price_change_percentage_3min: -5.67, rank: 3 },
    { symbol: 'XLM-USD', current_price: 0.123, price_change_percentage_3min: -4.89, rank: 4 },
    { symbol: 'VET-USD', current_price: 0.034, price_change_percentage_3min: -3.21, rank: 5 }
  ],
  bottomBanner: [
    { symbol: 'BTC-USD', volume_24h: 1234567890, volume_change_estimate: 12.5 },
    { symbol: 'ETH-USD', volume_24h: 987654321, volume_change_estimate: 8.3 },
    { symbol: 'SOL-USD', volume_24h: 456789123, volume_change_estimate: 15.7 },
    { symbol: 'ADA-USD', volume_24h: 234567891, volume_change_estimate: 5.2 },
    { symbol: 'DOT-USD', volume_24h: 123456789, volume_change_estimate: 3.1 }
  ]
};

// Fetch data from API
export const fetchData = async (endpoint) => {
  try {
    console.log(`Fetching data from: ${endpoint}`);
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched data from ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.warn(`API call failed for ${endpoint}, using fallback data:`, error.message);
    
    // Return fallback data based on endpoint
    if (endpoint === API_ENDPOINTS.topBanner) {
      return { data: FALLBACK_DATA.topBanner };
    } else if (endpoint === API_ENDPOINTS.gainersTable) {
      return { data: FALLBACK_DATA.gainersTable };
    } else if (endpoint === API_ENDPOINTS.losersTable) {
      return { data: FALLBACK_DATA.losersTable };
    } else if (endpoint === API_ENDPOINTS.bottomBanner) {
      return { data: FALLBACK_DATA.bottomBanner };
    }
    
    return { data: [] };
  }
};
