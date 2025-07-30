import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Result({ name, score }: any) {
  const navigate = useNavigate();

  useEffect(() => {
    axios.post('http://localhost:5000/leaderboard', { name, score });
  }, [name, score]);

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
      <h2>Quiz Completed!</h2>
      <p>Your Score: {score} / 5</p>
      <button onClick={() => navigate('/')}>Try Another Topic</button>
    </div>
  );
}