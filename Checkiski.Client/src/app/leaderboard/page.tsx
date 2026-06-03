'use client';

import React, { useEffect, useState } from 'react';
import { ApiService } from '../../services/api';
import { useRouter } from 'next/navigation';

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('All');
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const catQuery = category === 'All' ? '' : `?category=${category}`;
    ApiService.get<any[]>(`/api/player/leaderboard${catQuery}`)
      .then(data => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Unable to connect to the arena.');
        setLoading(false);
      });
  }, [category]);

  const getRankStyle = (index: number) => {
    if (index === 0) return { color: '#FFD700', textShadow: '0 0 10px rgba(255,215,0,0.3)' };
    if (index === 1) return { color: '#C0C0C0', textShadow: '0 0 8px rgba(192,192,192,0.2)' };
    if (index === 2) return { color: '#CD7F32', textShadow: '0 0 8px rgba(205,127,50,0.2)' };
    return { color: 'var(--color-text-dim)' };
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return '👑';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div className="page-container" style={{
      maxWidth: '800px',
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
        <p className="text-caption" style={{ color: 'var(--color-gold-dim)', marginBottom: 'var(--space-sm)' }}>
          Hall of Champions
        </p>
        <h1 className="text-hero" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
          Leaderboard
        </h1>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: 'var(--space-2xl)' }}>
        {['All', 'Bullet', 'Blitz', 'Rapid'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '20px',
              background: category === cat ? 'var(--accent-lime)' : 'var(--glass-bg)',
              color: category === cat ? 'var(--bg-deep)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: category === cat ? 800 : 600,
              fontFamily: 'var(--font-display)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.2s ease',
              border: '1px solid ' + (category === cat ? 'var(--accent-lime)' : 'var(--glass-border)')
            }}
            onMouseEnter={(e) => { if (category !== cat) e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={(e) => { if (category !== cat) e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <div className="glass-panel" style={{
        overflow: 'hidden',
        animation: 'fadeInUp 0.6s var(--ease-out) forwards',
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--color-text-dim)' }}>
            <div style={{
              width: '40px', height: '40px', border: '3px solid var(--color-muted)',
              borderTop: '3px solid var(--color-gold)', borderRadius: '50%',
              animation: 'spin 1s linear infinite', margin: '0 auto var(--space-md)',
            }} />
            Loading rankings...
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : error ? (
          <div style={{ padding: 'var(--space-4xl) var(--space-2xl)', textAlign: 'center', color: 'var(--color-danger)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)', opacity: 0.8 }}>⚠️</div>
            <h2 className="text-heading" style={{ fontSize: '1.2rem', marginBottom: 'var(--space-sm)' }}>
              Connection Lost
            </h2>
            <p className="text-body" style={{ color: 'var(--color-text-dim)' }}>{error}</p>
          </div>
        ) : players.length === 0 ? (
          <div style={{ padding: 'var(--space-3xl)', textAlign: 'center' }}>
            <p className="text-body">No players found yet.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--panel-border)' }}>
                <th style={{ padding: 'var(--space-md) var(--space-lg)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-faint)' }}>Rank</th>
                <th style={{ padding: 'var(--space-md) var(--space-lg)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-faint)' }}>Player</th>
                <th style={{ padding: 'var(--space-md) var(--space-lg)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-faint)' }}>Country</th>
                <th style={{ padding: 'var(--space-md) var(--space-lg)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-faint)', textAlign: 'right' }}>Rating</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p, index) => (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: '1px solid var(--panel-border)',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                  }}
                  onClick={() => router.push(`/profile/${p.username}`)}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(46,204,113,0.04)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: 'var(--space-md) var(--space-lg)', fontWeight: 'bold', fontSize: index < 3 ? '1.2rem' : '0.9rem', ...getRankStyle(index) }}>
                    {getRankIcon(index)}
                  </td>
                  <td style={{ padding: 'var(--space-md) var(--space-lg)', color: 'var(--color-text)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                    {p.username}
                  </td>
                  <td style={{ padding: 'var(--space-md) var(--space-lg)', color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
                    {p.country || '—'}
                  </td>
                  <td style={{ padding: 'var(--space-md) var(--space-lg)', fontFamily: 'var(--font-mono)', fontWeight: 'bold', textAlign: 'right', color: 'var(--color-emerald)', fontSize: '1rem' }}>
                    {category === 'Bullet' ? p.bulletRating : category === 'Blitz' ? p.blitzRating : category === 'Rapid' ? p.rapidRating : p.rating}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
