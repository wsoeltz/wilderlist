import React, {
  useState,
  useEffect
} from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';


const App: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const fetchData = async () => {
    const res = await axios.get('http://localhost:5000/api/test');
    setMessage(res.data.message);
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
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>{message}</p>
      </header>
    </div>
  );
}

export default App;
