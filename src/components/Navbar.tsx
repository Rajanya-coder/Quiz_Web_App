import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ padding: '2rem', background: '#ce9f9f' }}>
      <Link to="/">Topics</Link> | <Link to="/leaderboard">Leaderboard</Link>
    </nav>
  );
}