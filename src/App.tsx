import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Quiz from './components/Quiz';
import Result from './components/Result';
import Leaderboard from './components/Leaderboard';
import Navbar from './components/Navbar';
import { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [score, setScore] = useState(0);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home setName={setName} setTopic={setTopic} />} />
        <Route path="/quiz" element={<Quiz name={name} topic={topic} score={score} setScore={setScore} />} />
        <Route path="/result" element={<Result name={name} score={score} />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;