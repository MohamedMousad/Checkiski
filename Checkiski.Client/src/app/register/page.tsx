'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { ApiService } = await import('../../services/api');
      const data = await ApiService.post<any>('/api/player/register', {
        username,
        email,
        password
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('playerId', data.playerId);
      localStorage.setItem('username', data.username || username);
      window.dispatchEvent(new Event('auth-change'));

      router.push('/profile/me');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
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
      paddingTop: '60px',
    }}>
      
      {/* Background Glow */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'radial-gradient(circle at 70% 50%, rgba(217, 248, 69, 0.05) 0%, var(--bg-deep) 60%)',
      }} />

      <div className="responsive-grid-2" style={{
        position: 'relative', zIndex: 2, maxWidth: '1400px', width: '100%',
        alignItems: 'center', perspective: '1000px',
      }}>
        
        {/* Left Image Side */}
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
            animationDelay: '-3s', // Offset from login image
          }}>
            <img 
              src="https://res.cloudinary.com/dddhzbrqy/image/upload/v1780506042/checkiski_frontend/cinematic-register.jpg" 
              alt="Cinematic Chess Queen"
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

        {/* Right Form Side */}
        <div className="glass-panel" style={{
          padding: 'var(--space-3xl) var(--space-2xl)',
          width: '100%',
          maxWidth: '500px',
          margin: '0 auto',
          position: 'relative',
          background: 'rgba(10, 10, 12, 0.6)',
        }}>
          {/* Header */}
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <p className="text-caption" style={{ color: 'var(--accent-lime-dim)', marginBottom: 'var(--space-sm)' }}>
              JOIN THE ARENA
            </p>
            <h1 className="text-display" style={{ fontSize: '2.5rem' }}>
              REGISTER
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

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
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
                placeholder="Choose a username"
              />
            </div>
            <div>
              <label className="text-caption" style={{ display: 'block', marginBottom: '8px' }}>Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: '100%', padding: '12px 16px',
                  background: 'var(--input-bg)', border: '1px solid var(--glass-border)',
                  color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
                  outline: 'none', transition: 'border-color 0.3s ease'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-lime)'}
                onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                placeholder="Enter your email"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                  placeholder="Password"
                />
              </div>
              <div>
                <label className="text-caption" style={{ display: 'block', marginBottom: '8px' }}>Confirm</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '12px 16px',
                    background: 'var(--input-bg)', border: '1px solid var(--glass-border)',
                    color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
                    outline: 'none', transition: 'border-color 0.3s ease'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-lime)'}
                  onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                  placeholder="Confirm"
                />
              </div>
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
              <span>{loading ? 'CREATING...' : 'CREATE ACCOUNT'}</span>
            </button>
          </form>

          <div style={{
            marginTop: 'var(--space-xl)',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
          }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--accent-lime)', fontWeight: 600 }}>
              Sign in
            </Link>
          </div>
        </div>

      </div>
      
      <style>{`
        @media (max-width: 1024px) {
          div[style*="gridTemplateColumns: '1fr 1fr'"] {
            grid-template-columns: 1fr !important;
            display: flex !important;
            flex-direction: column-reverse;
          }
          div[style*="justifyContent: 'center'"] > div.glass-panel {
            max-width: 350px !important;
            display: none; /* Hide image on very small screens for register */
          }
        }
      `}</style>
    </div>
  );
}
