import { useEffect, useState } from 'react';

type Entry = {
  name: string;
  topic: string;
  score: number;
  date: string;
  score_percent?: string;
  date_str?: string;
};

const topics = ['all', 'science', 'history', 'arts', 'movies'];

export default function Leaderboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [activeTopic, setActiveTopic] = useState('all');

  useEffect(() => {
    fetch('http://localhost:5000/leaderboard')
      .then((res) => res.json())
      .then((data) => {
        const enriched = data.map((entry: Entry) => {
          const score_percent = entry.score ? `${(entry.score / 5) * 100}%` : '0%';

          let date_str = 'N/A';
          try {
            if (entry.date) {
              const d = new Date(entry.date);
              if (!isNaN(d.getTime())) {
                date_str = d.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
              }
            }
          } catch {
            date_str = 'Invalid Date';
          }

          return {
            ...entry,
            score_percent,
            date_str,
          };
        });

        setEntries(enriched);
      });
  }, []);

  const filteredEntries = activeTopic === 'all'
  ? entries
  : entries.filter((e) =>
      (e.topic || '').trim().toLowerCase() === activeTopic.toLowerCase()
    );


  const sortedEntries = [...filteredEntries].sort((a, b) => b.score - a.score);

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '1rem' }}>Leaderboard</h2>
      <p style={{ textAlign: 'center', marginBottom: '1rem' }}>Overall Top Scores</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTopic(t)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTopic === t ? '#333' : '#ccc',
              color: activeTopic === t ? 'white' : 'black',
            }}
          >
            {t === 'all' ? 'All Topics' : t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
            <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>Rank</th>
            <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>Username</th>
            <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>Topic</th>
            <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>Score</th>
            <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {sortedEntries.map((entry, idx) => (
            <tr key={idx}>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{idx + 1}</td>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{entry.name}</td>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{entry.topic}</td>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{entry.score_percent}</td>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{entry.date_str}</td>
            </tr>
          ))}
          {sortedEntries.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: '1rem', textAlign: 'center' }}>No entries yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}