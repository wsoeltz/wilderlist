import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';


const App: React.FC = () => {
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    await setData(axios.get('http://localhost:5000/test'))
    console.log(data);
  }

  useEffect(() => {
    // Update the document title using the browser API
    fetchData();
  },[]);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
