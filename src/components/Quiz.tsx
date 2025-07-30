import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Dispatch, SetStateAction } from 'react';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface QuizProps {
  name: string;
  topic: string;
  score: number;
  setScore: Dispatch<SetStateAction<number>>;
}

export default function Quiz({ topic, name, score, setScore }: QuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [finished, setFinished] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/questions/${topic}`)
      .then(res => res.json())
      .then(data => setQuestions(data));
  }, [topic]);

  useEffect(() => {
    setSelected(null);
    setShowAnswer(false);
  }, [current]);

  function handleSelect(option: string) {
    if (selected) return;
    setSelected(option);
    setShowAnswer(true);

    if (option === questions[current].answer) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(prev => prev + 1);
      } else {
        // Quiz is finished
        setFinished(true);

        // Send score to leaderboard
        fetch('http://localhost:5000/leaderboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, topic, score }),
        });
      }
    }, 2000);
  }

  if (questions.length === 0) return <div>Loading...</div>;

  if (finished) {
    return (
      <div style={styles.container}>
        <h2>{topic.charAt(0).toUpperCase() + topic.slice(1)} Quiz</h2>
        <p style={styles.finalScore}>Well done, {name}!</p>
        <p style={styles.finalScore}>Your Score: {score} / {questions.length}</p>
        <button onClick={() => navigate('/leaderboard')} style={styles.button}>
          Go to Leaderboard
        </button>
      </div>
    );
  }

  const question = questions[current];

  return (
    <div style={styles.container}>
      <h2 style={styles.topicTitle}>{topic.charAt(0).toUpperCase() + topic.slice(1)} Quiz</h2>
      <p style={styles.questionCount}>Question {current + 1} of {questions.length}</p>
      <h3 style={styles.question}>{question.question}</h3>
      <p style={styles.instruction}>Select the best answer</p>

      <div style={styles.optionsContainer}>
        {question.options.map((opt, idx) => {
          const isCorrect = opt === question.answer;
          const isSelected = selected === opt;
          let bg = '#fff';
          let border = '#ccc';

          if (showAnswer) {
            if (isCorrect) {
              bg = '#d4edda';
              border = '#28a745';
            } else if (isSelected) {
              bg = '#f8d7da';
              border = '#dc3545';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(opt)}
              style={{
                ...styles.option,
                backgroundColor: bg,
                borderColor: border,
                fontWeight: isSelected ? 'bold' : 'normal',
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    maxHeight: '600px',
    margin: '3rem auto',
    padding: '2rem',
    backgroundColor: '#fefefe',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    textAlign: 'center' as const,
  },
  topicTitle: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  questionCount: {
    fontSize: '1rem',
    color: '#555',
    marginBottom: '1.5rem',
  },
  question: {
    fontSize: '1.5rem',
    marginBottom: '1.2rem',
  },
  instruction: {
    fontSize: '1rem',
    marginBottom: '1rem',
    color: '#333',
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    alignItems: 'center',
  },
  option: {
    width: '100%',
    maxWidth: '500px',
    padding: '1rem',
    fontSize: '1rem',
    cursor: 'pointer',
    borderRadius: '8px',
    border: '2px solid #ccc',
    backgroundColor: '#fff',
    color: '#000',
    transition: 'all 0.2s ease',
  },
  finalScore: {
    fontSize: '1.5rem',
    margin: '1rem 0',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    marginTop: '1.5rem',
  },
};
