/* eslint-disable */
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);

    try {
      const { ApiService } = await import('../../services/api');
      await ApiService.post('/api/player/register', { username, email, password });

      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
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
            Join the Arena
          </p>
          <h1 className="text-display" style={{ fontSize: '1.8rem' }}>
            Create Account
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

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <div>
            <label className="input-label">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              required
              className="input-field"
              placeholder="Choose a username"
            />
          </div>
          <div>
            <label className="input-label">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              required
              className="input-field"
              placeholder="your@email.com"
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
              placeholder="Min. 6 characters"
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div style={{
          marginTop: 'var(--space-2xl)',
          textAlign: 'center',
          color: 'var(--color-text-faint)',
          fontSize: '0.9rem',
        }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--color-emerald)', fontWeight: 500 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
