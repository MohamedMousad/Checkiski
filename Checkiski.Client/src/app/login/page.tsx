'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/player/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('playerId', data.playerId);
      localStorage.setItem('username', data.username || username);
      window.dispatchEvent(new Event('auth-change'));
      
      router.push('/profile/me');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)' }}>
      <div className="glass-panel" style={{ padding: '3rem', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Login to Checkiski</h1>
        
        {error && <div style={{ color: '#ff6b6b', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-secondary)' }}>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              required
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '4px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff', outline: 'none'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-secondary)' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '4px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff', outline: 'none'
              }}
            />
          </div>
          
          <button type="submit" disabled={loading} style={{
            padding: '0.75rem', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer',
            background: 'var(--accent-primary)', border: 'none', color: '#fff', fontWeight: 'bold',
            marginTop: '1rem', opacity: loading ? 0.7 : 1
          }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', color: '#aaa' }}>
          Don&apos;t have an account?{' '}<Link href="/register" style={{ color: 'var(--accent-primary)' }}>Register</Link>
        </div>
      </div>
    </div>
  );
}
