import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const topics = [
  { key: 'science', label: 'Science', description: 'Test your knowledge of the natural world.' },
  { key: 'arts', label: 'Arts', description: 'Challenge yourself with creative expression topics.' },
  { key: 'movies', label: 'Movies', description: 'Dive into the world of cinema and film.' },
  { key: 'history', label: 'History', description: 'Explore important events from the past.' }
];

export default function Home({ setName, setTopic }: any) {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [userName, setUserName] = useState('');

  const handleStartQuiz = () => {
    if (!userName.trim()) return;
    setName(userName);
    setTopic(selectedTopic.key);
    navigate('/quiz');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <h2 style={{ textAlign: 'center' }}>Welcome to the Quiz App</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginTop: '2rem' }}>
        {topics.map((t) => (
          <div
            key={t.key}
            onClick={() => setSelectedTopic(t)}
            style={{
              border: '3px solid #ce9f9f',
              borderRadius: '12px',
              padding: '1.5rem',
              cursor: 'pointer',
              backgroundColor: '#f9f9f9',
              boxShadow: '0 2px 6px rgba(172, 92, 92, 0.1)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '4px 4px 15px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '2px 2px 10px rgba(0,0,0,0.1)';
            }}
          >
            <h3 style={{ marginBottom: '0.5rem' }}>{t.label}</h3>
            <p style={{ margin: 0 }}>5 Questions</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#555' }}>{t.description}</p>
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {selectedTopic && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '10px',
              width: '90%',
              maxWidth: '400px',
              textAlign: 'center'
            }}
          >
            <h3>Enter user name for {selectedTopic.label} quiz</h3>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your Name"
              style={{ width: '100%', padding: '0.5rem', marginTop: '1rem', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setSelectedTopic(null)} style={{ padding: '0.5rem 1rem' }}>Cancel</button>
              <button onClick={handleStartQuiz} style={{ padding: '0.5rem 1rem' }}>Start Quiz</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}