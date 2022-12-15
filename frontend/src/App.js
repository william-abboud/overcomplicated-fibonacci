import './App.css';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const calculateFibonacci = async (index) => {
  const { data } = await axios.post(`http://server:5000/calculate-fibonacci`, { index });

  return data;
};

const fetchIndexes = async () => {
  const { data } = await axios.get(`http://server:5000/values`);

  return data;
};

function App() {
  const [index, setIndex] = useState(0);
  const [indexes, setIndexes] = useState([]);

  const handleSubmission = useCallback(async (event) => {
    event.preventDefault();

    try {
      await calculateFibonacci(index);
    } catch (error) {
      console.error(error);
    }
  }, [index]);

  const fetchIndexesAndSetState = useCallback(async () => {
    try {
      const indecies = await fetchIndexes();
      
      setIndexes(indecies);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchIndexesAndSetState();
  }, [fetchIndexesAndSetState]);

  return (
    <div className="App">
      <header>
        <h1>Fibonacci Calculator</h1>
      </header>
      <form onSubmit={handleSubmission}>
        <div>
          <label htmlFor="index">Index:</label>
          <input type="number" id="index" value={index} onChange={(e) => setIndex(parseInt(e.target.value))} />
          <button type="submit" disabled={index === 0}>Calculate</button>
        </div>
      </form>
      <div>
        <h2>Indexes I have seen:</h2>
        <ul>
          {
            indexes.map(({ number }) => <li key={number}>{number}</li>)
          }
        </ul>
      </div>
    </div>
  );
}

export default App;
