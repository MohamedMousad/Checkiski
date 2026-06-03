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
    <div style={{
      padding: 'calc(80px + var(--space-2xl)) var(--space-xl) var(--space-2xl)',
      maxWidth: '1000px',
      margin: '0 auto',
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
        <p className="text-caption" style={{ color: 'var(--color-emerald-dim)', marginBottom: 'var(--space-sm)' }}>
          Live Arena
        </p>
        <h1 className="text-hero" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
          Game Lobby
        </h1>
        <p className="text-body" style={{ marginTop: 'var(--space-md)', maxWidth: '500px', margin: 'var(--space-md) auto 0' }}>
          Watch live games or jump into the action
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--color-text-dim)' }}>
          <div style={{
            width: '40px', height: '40px', border: '3px solid var(--color-muted)',
            borderTop: '3px solid var(--color-emerald)', borderRadius: '50%',
            animation: 'spin 1s linear infinite', margin: '0 auto var(--space-md)',
          }} />
            Loading games...
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : error ? (
        <div className="glass-panel" style={{
          padding: 'var(--space-4xl)',
          textAlign: 'center',
          animation: 'fadeInUp 0.6s var(--ease-out) forwards',
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
          <button onClick={() => router.push('/')} className="btn-primary" style={{ padding: '12px 28px' }}>
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
                padding: 'var(--space-xl)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-md)',
                animation: `fadeInUp 0.6s var(--ease-out) ${i * 0.08}s forwards`,
                opacity: 0,
                cursor: 'pointer',
              }}
              onClick={() => router.push(`/play?gameId=${game.id}`)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-mono" style={{ fontWeight: 'bold', color: 'var(--color-text)', fontSize: '0.9rem' }}>
                  #{game.id.substring(0, 8)}
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  background: 'var(--color-emerald-deep)',
                  color: 'var(--color-emerald)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  textTransform: 'uppercase',
                  boxShadow: '0 0 10px rgba(46,204,113,0.2)',
                }}>
                  ● Live
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
