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
      const { ApiService } = await import('../../services/api');
      const data = await ApiService.post<any>('/api/player/login', { username, password });
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
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 70px)',
      padding: 'var(--space-xl)',
      position: 'relative',
    }}>
      {/* Atmospheric glow */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(46,204,113,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(60px)',
      }} />

      <div className="glass-panel" style={{
        padding: 'var(--space-2xl) var(--space-xl)',
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeInUp 0.7s var(--ease-out) forwards',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <p className="text-caption" style={{ color: 'var(--color-emerald-dim)', marginBottom: 'var(--space-sm)' }}>
            Welcome Back
          </p>
          <h1 className="text-display" style={{ fontSize: '1.8rem' }}>
            Sign In
          </h1>
        </div>
        
        {error && (
          <div style={{
            padding: 'var(--space-md)',
            background: 'rgba(231, 76, 60, 0.1)',
            border: '1px solid rgba(231, 76, 60, 0.2)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-danger)',
            marginBottom: 'var(--space-lg)',
            textAlign: 'center',
            fontSize: '0.9rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <div>
            <label className="input-label">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              required
              className="input-field"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="input-label">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              required
              className="input-field"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              marginTop: 'var(--space-sm)',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{
          marginTop: 'var(--space-2xl)',
          textAlign: 'center',
          color: 'var(--color-text-faint)',
          fontSize: '0.9rem',
        }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: 'var(--color-emerald)', fontWeight: 500 }}>
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
