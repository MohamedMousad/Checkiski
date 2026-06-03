/* eslint-disable */
'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function Profile() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (id === 'me' && !token) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const { ApiService } = await import('../../../services/api');
        const endpoint = id === 'me' ? '/api/player/profile/me' : `/api/player/profile/${id}`;
        const data = await ApiService.get<any>(endpoint);
        setProfile(data);
        
        if (data && data.id) {
          const historyData = await ApiService.get<any[]>(`/api/player/profile/${data.id}/history`);
          setHistory(historyData || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, router]);

  if (loading) return (
    <div style={{
      textAlign: 'center',
      padding: 'calc(80px + var(--space-4xl)) var(--space-xl)',
      color: 'var(--text-dim)',
    }}>
      <div style={{
        width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.05)',
        borderTop: '3px solid var(--accent-lime)', borderRadius: '50%',
        animation: 'spin 1s cubic-bezier(0.68, -0.55, 0.26, 1.55) infinite', margin: '0 auto var(--space-md)',
      }} />
      <div className="text-caption" style={{ color: 'var(--accent-lime)', marginTop: '15px' }}>ACCESSING RECORDS...</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const ratingCards = [
    { type: 'Overall', rating: profile?.rating, icon: '♔' },
    { type: 'Bullet', rating: profile?.bulletRating, icon: '⚡' },
    { type: 'Blitz', rating: profile?.blitzRating, icon: '🔥' },
    { type: 'Rapid', rating: profile?.rapidRating, icon: '⏱' },
    { type: 'Classical', rating: profile?.classicalRating, icon: '🏛' },
  ];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      padding: 'calc(80px + var(--space-2xl)) var(--space-xl) var(--space-2xl)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '800px',
        animation: 'fadeInUp 0.6s var(--ease-out) forwards',
      }}>
        {/* Profile Header Card */}
        <div className="glass-panel" style={{
          padding: 'var(--space-2xl)',
          marginBottom: 'var(--space-xl)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Glow accent */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(217, 248, 69, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xl)', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            {/* Avatar */}
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(217, 248, 69, 0.1), rgba(217, 248, 69, 0.02))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.2rem',
              fontWeight: 'bold',
              color: 'var(--accent-lime)',
              overflow: 'hidden',
              border: '2px solid var(--accent-lime-glow)',
              boxShadow: '0 0 25px rgba(217, 248, 69, 0.2)',
              flexShrink: 0,
            }}>
              {profile?.profilePictureUrl ? (
                <img src={profile.profilePictureUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                profile?.username?.charAt(0).toUpperCase()
              )}
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <h1 className="text-display" style={{ fontSize: '1.8rem', marginBottom: 'var(--space-xs)', color: 'var(--text-primary)' }}>
                {profile?.username}
              </h1>
              {profile?.country && (
                <p className="text-caption" style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>
                  {profile.country}
                </p>
              )}
              <p className="text-body" style={{ fontSize: '0.9rem', margin: 0 }}>
                {profile?.bio || 'No bio provided.'}
              </p>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                marginTop: 'var(--space-sm)',
                fontFamily: 'var(--font-display)',
              }}>
                Member since {profile?.createdAt ? new Date(profile.createdAt).getFullYear() : '2026'}
              </p>
            </div>

            {id === 'me' && (
              <button className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.85rem' }} onClick={() => router.push('/settings')}>
                ✏ Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Ratings Section */}
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <p className="text-caption" style={{ color: 'var(--accent-lime)', marginBottom: 'var(--space-lg)' }}>
            [ ELO RATINGS ]
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 'var(--space-md)',
        }}>
          {ratingCards.map(({ type, rating, icon }, i) => (
            <div
              key={type}
              className="glass-panel"
              style={{
                padding: 'var(--space-xl) var(--space-md)',
                textAlign: 'center',
                animation: `fadeInUp 0.5s var(--ease-out) ${0.1 + i * 0.08}s forwards`,
                opacity: 0,
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>{icon}</div>
              <div className="text-caption" style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>
                {type}
              </div>
              <div className="text-mono" style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: type === 'Overall' ? 'var(--accent-lime)' : 'var(--text-primary)',
              }}>
                {rating || 1200}
              </div>
            </div>
          ))}
        </div>

        {/* Game History Section */}
        <div style={{ marginTop: 'var(--space-2xl)', marginBottom: 'var(--space-md)' }}>
          <p className="text-caption" style={{ color: 'var(--accent-lime)', marginBottom: 'var(--space-lg)' }}>
            [ RECENT GAMES ]
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {history.length === 0 ? (
            <div className="glass-panel" style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
              No recent games played.
            </div>
          ) : (
            history.map((g, i) => (
              <div 
                key={g.gameId} 
                className="glass-panel hover-card" 
                style={{ 
                  padding: 'var(--space-md) var(--space-xl)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  animation: `fadeInUp 0.5s var(--ease-out) ${0.3 + i * 0.05}s forwards`,
                  opacity: 0,
                  borderLeft: `4px solid ${g.outcome === 'Win' ? 'var(--accent-lime)' : g.outcome === 'Loss' ? '#ef4444' : '#f59e0b'}`,
                  cursor: 'pointer'
                }}
                onClick={() => router.push(`/play?gameId=${g.gameId}`)}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <span style={{ 
                      display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%',
                      backgroundColor: g.color === 'White' ? '#fff' : '#222',
                      border: '1px solid #555'
                    }} title={`Played as ${g.color}`} />
                    <span className="text-body" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>vs {g.opponentName}</span>
                  </div>
                  <span className="text-caption" style={{ color: 'var(--text-muted)' }}>
                    {new Date(g.playedAt).toLocaleDateString()} • {g.gameCategory}
                  </span>
                </div>
                <div style={{ 
                  fontWeight: 'bold', 
                  fontSize: '1.1rem',
                  color: g.outcome === 'Win' ? 'var(--accent-lime)' : g.outcome === 'Loss' ? '#ef4444' : '#f59e0b'
                }}>
                  {g.outcome}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
