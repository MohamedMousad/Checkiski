'use client';

import React, { useEffect, useState } from 'react';
import { ApiService } from '../../services/api';
import { useRouter } from 'next/navigation';

export default function LobbyPage() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const router = useRouter();
  const [creatingGame, setCreatingGame] = useState(false);

  const handleCreateGame = async () => {
    if (creatingGame) return;
    const username = localStorage.getItem('username');
    if (!username) {
      router.push('/login');
      return;
    }
    setCreatingGame(true);
    try {
      const data = await ApiService.post<any>('/api/game', { hostUsername: username });
      if (data && data.gameId) {
        router.push(`/play?gameId=${data.gameId}`);
      }
    } catch (err: any) {
      console.error(err);
      alert('Failed to start a new game: ' + (err.message || 'Unknown error'));
      setCreatingGame(false);
    }
  };

  const loadGames = React.useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const data = await ApiService.get<any[]>('/api/game');
      setGames(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
      setRetryCount(0);
    } catch (err: any) {
      setError(err.message || 'Unable to connect to the live arena.');
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + auto-refresh every 15s
  useEffect(() => {
    loadGames();
    const interval = setInterval(() => loadGames(false), 15000);
    return () => clearInterval(interval);
  }, [loadGames]);

  return (
    <div className="page-container" style={{
      maxWidth: '1000px',
      margin: '0 auto',
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-4xl)', position: 'relative' }}>
        <p className="text-caption" style={{ color: 'var(--accent-lime)', marginBottom: 'var(--space-sm)' }}>
          [ GLOBAL ARENA ]
        </p>
        <h1 className="text-hero" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
          Game Lobby
        </h1>
        <p className="text-body" style={{ marginTop: 'var(--space-md)', maxWidth: '500px', margin: 'var(--space-md) auto 0' }}>
          Connect instantly. Watch grandmasters clash or jump into the fray yourself.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--text-dim)' }}>
          <div style={{
            width: '50px', height: '50px', border: '2px solid rgba(255,255,255,0.05)',
            borderTop: '2px solid var(--accent-lime)', borderRadius: '50%',
            animation: 'spin 1s cubic-bezier(0.68, -0.55, 0.26, 1.55) infinite', margin: '0 auto var(--space-md)',
            boxShadow: '0 0 20px rgba(217, 248, 69, 0.2)'
          }} />
            <div className="text-caption" style={{ color: 'var(--accent-lime)', marginTop: '15px' }}>SCANNING SERVERS...</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : error ? (
        error.includes('401') ? (
          <div className="responsive-grid-2" style={{
            animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            alignItems: 'center',
            gap: '3rem',
            width: '100%',
          }}>
            <div className="glass-panel" style={{
              width: '100%', aspectRatio: '1/1', overflow: 'hidden', position: 'relative',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <img src="https://res.cloudinary.com/dddhzbrqy/image/upload/v1780506067/checkiski_frontend/lobby-arena.jpg" alt="Lobby Arena" style={{
                width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.1) brightness(0.9)',
                transition: 'transform 10s ease'
              }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-deep), transparent 50%)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
              <div>
                <h2 className="text-display" style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)' }}>
                  Enter the Arena
                </h2>
                <p className="text-body" style={{ color: 'var(--text-muted)' }}>
                  Unlock full access to the premier online chess experience. Join thousands of players worldwide.
                </p>
              </div>

              <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
                {[
                  { title: "Live Matchmaking", desc: "Instantly pair with players of similar skill." },
                  { title: "Grandmaster Spectating", desc: "Watch top players clash in real-time." },
                  { title: "Engine Analysis", desc: "Review your games with Stockfish 16." }
                ].map((feature, i) => (
                  <div key={i} className="glass-panel hover-card" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
                    <h3 className="text-heading" style={{ fontSize: '1.1rem', color: 'var(--accent-lime)' }}>{feature.title}</h3>
                    <p className="text-caption" style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{feature.desc}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
                <button onClick={() => router.push('/login')} className="btn-secondary" style={{ flex: '1 1 120px' }}>
                  SIGN IN
                </button>
                <button onClick={() => router.push('/register')} className="btn-primary" style={{ flex: '1 1 160px' }}>
                  <span>REGISTER NOW</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{
            padding: 'var(--space-4xl)',
            textAlign: 'center',
            animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            borderColor: 'rgba(231, 76, 60, 0.2)',
            background: 'rgba(231, 76, 60, 0.05)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', opacity: 0.8, color: 'var(--color-danger)' }}>⚠️</div>
            <h2 className="text-heading" style={{ fontSize: '1.3rem', marginBottom: 'var(--space-sm)' }}>
              Connection Lost
            </h2>
            <p className="text-body" style={{ marginBottom: 'var(--space-lg)' }}>
              {error}
            </p>
            <button onClick={() => loadGames()} className="btn-secondary" style={{ padding: '12px 28px' }}>
              Retry Connection {retryCount > 1 ? `(Attempt ${retryCount})` : ''}
            </button>
          </div>
        )
      ) : games.length === 0 ? (
        <div className="glass-panel" style={{
          padding: 'var(--space-3xl)',
          textAlign: 'center',
          animation: 'fadeInUp 0.6s var(--ease-out) forwards',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', opacity: 0.5 }}>🏟</div>
          <h2 className="text-heading" style={{ fontSize: '1.3rem', marginBottom: 'var(--space-sm)' }}>
            No Active Games
          </h2>
          <p className="text-body" style={{ marginBottom: 'var(--space-lg)' }}>
            The arena is quiet. Be the first to start a match.
          </p>
          <button onClick={handleCreateGame} className="btn-primary" style={{ padding: '12px 28px' }}>
            Start a Game
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 'var(--space-lg)',
        }}>
          {games.map((game, i) => (
            <div
              key={game.id}
              className="glass-panel glass-panel-interactive"
                style={{
                  padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)',
                  animation: `fadeInUp 0.6s var(--ease-out) ${i * 0.08}s forwards`, opacity: 0, cursor: 'pointer',
                  position: 'relative', overflow: 'hidden'
                }}
                onClick={() => router.push(`/play?gameId=${game.id}`)}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)'; e.currentTarget.style.borderColor = 'var(--accent-lime)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.borderColor = 'var(--glass-border)' }}
              >
                <div style={{ position: 'absolute', top: 0, left: '-100%', width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, var(--accent-lime), transparent)', animation: 'scanline 2s linear infinite' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="text-mono" style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                    #{game.id.substring(0, 8)}
                  </span>
                  <span style={{
                    fontSize: '0.7rem', fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '0.08em',
                    background: 'rgba(217, 248, 69, 0.1)', color: 'var(--accent-lime)',
                    padding: '4px 10px', borderRadius: 'var(--radius-full)', textTransform: 'uppercase',
                    boxShadow: '0 0 10px rgba(217, 248, 69, 0.2)', display: 'flex', alignItems: 'center', gap: '6px'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-lime)', animation: 'pulse 1.5s infinite' }}></span>
                    Live
                  </span>
                </div>
              <p className="text-body" style={{ margin: 0, fontSize: '0.85rem' }}>
                Status: {game.status}
              </p>
              <button className="btn-secondary" style={{
                width: '100%',
                padding: '10px',
                fontSize: '0.85rem',
              }}>
                Watch Game →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
