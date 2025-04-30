import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [quote, setQuote] = useState({ text: 'Loading...', author: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/quote');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setQuote(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch quote. Please try again.');
      console.error('Error fetching quote:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Daily Quote-rameez</h1>
        <div className="quote-container">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <>
              <blockquote>
                <p>"{quote.text}"</p>
                <footer>— {quote.author}</footer>
              </blockquote>
              <button onClick={fetchQuote} className="new-quote-btn">
                New Quote
              </button>
            </>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
