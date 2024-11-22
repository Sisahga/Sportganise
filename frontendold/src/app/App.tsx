import React, { useEffect, useState } from 'react';
// import logo from './logo.svg';
// changed it to import from assest file where all our logo/pictures will be
import logo from '../src/assets/sportganise-logo.svg';
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

  return <div className="App min-h-screen flex flex-col"></div>;
}

export default App;
