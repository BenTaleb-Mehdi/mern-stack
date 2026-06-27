import { useState } from 'react';
import axios from 'axios';

export default function LoginPage({ setToken, onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('adminToken', res.data.token);
      setToken(res.data.token);
    } catch (err) {
      alert(err.response?.data?.error || 'Something went wrong during login.');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email" placeholder="Email Address" value={email}
            onChange={e => setEmail(e.target.value)} style={styles.input}
          />
          <input
            type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)} style={styles.input}
          />
          <button type="submit" style={styles.btn}>Login</button>
        </form>
        <p style={styles.footer}>
          No account?{' '}
          <button onClick={onRegister} style={styles.link}>Register</button>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg)',
    fontFamily: 'var(--sans)',
  },
  card: {
    background: 'var(--card-bg)',
    padding: '36px 32px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    width: '400px',
    maxWidth: '90%',
    boxShadow: 'var(--shadow-lg)',
  },
  title: {
    fontSize: '22px',
    fontWeight: 700,
    color: 'var(--text)',
    textAlign: 'center',
    marginBottom: '24px',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '11px 14px',
    marginBottom: '14px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    fontSize: '14px',
    color: 'var(--text)',
    background: 'var(--bg)',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: 'var(--sans)',
  },
  btn: {
    width: '100%',
    padding: '12px',
    background: 'var(--primary)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '4px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '18px',
    fontSize: '14px',
    color: 'var(--text-secondary)',
  },
  link: {
    background: 'none',
    border: 'none',
    color: 'var(--primary)',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '14px',
    textDecoration: 'underline',
  },
};
