import React, { useEffect, useState } from 'react';
// import logo from './logo.svg';
import logo from './sportganise-logo.svg';
import './App.css';

function getApiUrl(): string {
  return process.env.REACT_APP_API_URL || 'http://localhost:8080';
}

function App() {
  const [homeText, setHomeText] = useState('');
  const apiUrl = getApiUrl();

  useEffect(() => {
    fetch(`${apiUrl}/`)
      .then((result) => result.text())
      .then((text) => setHomeText(text));
  }, [apiUrl]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{homeText}</p>
      </header>
    </div>
  );
}

export default App;
