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
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 5vw',
      paddingTop: '60px', /* Account for navbar */
    }}>
      
      {/* Background Glow */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'radial-gradient(circle at 30% 50%, rgba(217, 248, 69, 0.05) 0%, var(--bg-deep) 60%)',
      }} />

      <div className="responsive-grid-2" style={{
        position: 'relative', zIndex: 2, maxWidth: '1400px', width: '100%',
        alignItems: 'center', perspective: '1000px',
      }}>
        
        {/* Left Form Side */}
        <div className="glass-panel" style={{
          padding: 'var(--space-3xl) var(--space-2xl)',
          width: '100%',
          maxWidth: '500px',
          margin: '0 auto',
          position: 'relative',
          background: 'rgba(10, 10, 12, 0.6)',
        }}>
          {/* Header */}
          <div style={{ marginBottom: 'var(--space-2xl)' }}>
            <p className="text-caption" style={{ color: 'var(--accent-lime-dim)', marginBottom: 'var(--space-sm)' }}>
              WELCOME BACK
            </p>
            <h1 className="text-display" style={{ fontSize: '2.5rem' }}>
              SIGN IN
            </h1>
          </div>
          
          {error && (
            <div style={{
              padding: 'var(--space-md)',
              background: 'rgba(229, 62, 62, 0.1)',
              border: '1px solid rgba(229, 62, 62, 0.2)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--accent-red)',
              marginBottom: 'var(--space-lg)',
              fontSize: '0.9rem',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <div>
              <label className="text-caption" style={{ display: 'block', marginBottom: '8px' }}>Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)}
                required
                style={{
                  width: '100%', padding: '12px 16px',
                  background: 'var(--input-bg)', border: '1px solid var(--glass-border)',
                  color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
                  outline: 'none', transition: 'border-color 0.3s ease'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-lime)'}
                onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="text-caption" style={{ display: 'block', marginBottom: '8px' }}>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%', padding: '12px 16px',
                  background: 'var(--input-bg)', border: '1px solid var(--glass-border)',
                  color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
                  outline: 'none', transition: 'border-color 0.3s ease'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-lime)'}
                onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                placeholder="Enter your password"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                marginTop: 'var(--space-md)',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              <span>{loading ? 'SIGNING IN...' : 'SIGN IN'}</span>
            </button>
          </form>

          <div style={{
            marginTop: 'var(--space-2xl)',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
          }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: 'var(--accent-lime)', fontWeight: 600 }}>
              Create one
            </Link>
          </div>
        </div>

        {/* Right Image Side */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            position: 'absolute', inset: '-10%',
            background: 'radial-gradient(circle, rgba(217, 248, 69, 0.1) 0%, transparent 70%)',
            filter: 'blur(60px)', zIndex: 0
          }} />
          
          <div className="glass-panel" style={{
            position: 'relative', zIndex: 1,
            width: '100%', maxWidth: '500px', aspectRatio: '4/5',
            borderRadius: '2px', overflow: 'hidden',
            boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.1)',
            animation: 'float 6s ease-in-out infinite',
          }}>
            <img 
              src="/images/cinematic-login.png" 
              alt="Cinematic Chess Rook"
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                filter: 'contrast(1.15) brightness(0.95)'
              }}
            />
            {/* Glass reflection overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%, transparent 60%, rgba(217, 248, 69, 0.05) 100%)',
              pointerEvents: 'none'
            }} />
          </div>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 1024px) {
          div[style*="gridTemplateColumns: '1fr 1fr'"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="justifyContent: 'center'"] > div.glass-panel {
            max-width: 350px !important;
            display: none; /* Hide image on very small screens for login */
          }
        }
      `}</style>
    </div>
  );
}
