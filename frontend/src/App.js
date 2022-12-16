import './App.css';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const calculateFibonacci = async (index) => {
  const { data } = await axios.post(`/api/calculate-fibonacci`, { num: index });

  return data;
};

const fetchIndexes = async () => {
  const { data } = await axios.get(`/api/values`);

  return data;
};

const fetchResults = async () => {
  const { data } = await axios.get(`/api/values/current`);

  return data;
};

function App() {
  const [index, setIndex] = useState(0);
  const [indexes, setIndexes] = useState([]);
  const [results, setResults] = useState({});

  const handleSubmission = useCallback(async (event) => {
    event.preventDefault();

    try {
      await calculateFibonacci(index);
      await fetchIndexesAndSetState();
      await fetchResultsAndSetState();
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

  const fetchResultsAndSetState = useCallback(async () => {
    try {
      const res = await fetchResults();

      setResults(res);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchIndexesAndSetState();
  }, [fetchIndexesAndSetState]);

  useEffect(() => {
    fetchResultsAndSetState();
  }, [fetchResultsAndSetState]);

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
        <ul className="indecies">
          {
            indexes.map(({ number }, i) => <li key={`${number}${i}`}>{number}</li>)
          }
        </ul>
      </div>
      <div>
        <h2>Calculated Values:</h2>
        <ul>
          {
            Object.keys(results).map((key, i) => <li key={`${key}${i}`}>{results[key]}</li>)
          }
        </ul>
      </div>
    </div>
  );
}

export default App;
