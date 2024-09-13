import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import axios from 'axios';
import './App.css';

function App() {
  const [cryptoData, setCryptoData] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fuse = new Fuse(cryptoData, {
    keys: ['name', 'symbol'],
    threshold: 0.4,
  });

  useEffect(() => {
    fetchCryptoData();
  }, []);

  const fetchCryptoData = async () => {
    try {
      const response = await axios.get('https://api.coinlore.net/api/tickers/');
      setCryptoData(response.data.data);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  const toggleFavorite = (index) => {
    const updatedFavorites = [...favorites];
    const crypto = filteredCryptoData[index];

    if (updatedFavorites.includes(crypto)) {
      updatedFavorites.splice(updatedFavorites.indexOf(crypto), 1);
    } else {
      updatedFavorites.push(crypto);
    }

    setFavorites(updatedFavorites);
  };

  const toggleShowFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const formatMarketCap = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(value);
  };

  const filteredCryptoData = showFavorites
    ? favorites
    : searchQuery
    ? fuse.search(searchQuery).map((result) => result.item)
    : cryptoData;

  return (
    <div className="App">
      <h1>Crypto Tracker</h1>
      <button onClick={toggleShowFavorites}>
        {showFavorites ? 'Show All' : 'Show Favorites'}
      </button>
      <input
        type="text"
        placeholder="Search cryptocurrencies..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <table>
        <thead>
          <tr>
            <th>Star</th>
            <th>Coin</th>
            <th>Symbol</th>
            <th>Price (USD)</th>
            <th>Market Cap (USD)</th>
            <th>Change (24h)</th>
          </tr>
        </thead>
        <tbody>
          {filteredCryptoData.map((crypto, index) => (
            <tr key={crypto.id}>
              <td>
                <button onClick={() => toggleFavorite(index)}>
                  {favorites.includes(crypto) ? '★' : '☆'}
                </button>
              </td>
              <td>{crypto.name}</td>
              <td>{crypto.symbol}</td>
              <td>{formatPrice(parseFloat(crypto.price_usd))}</td>
              <td>{formatMarketCap(parseFloat(crypto.market_cap_usd))}</td>
              <td className={parseFloat(crypto.percent_change_24h) >= 0 ? 'positive' : 'negative'}>
                {parseFloat(crypto.percent_change_24h).toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
