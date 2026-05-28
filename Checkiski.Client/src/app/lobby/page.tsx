'use client';

import React, { useEffect, useState } from 'react';
import { ApiService } from '../../services/api';
import { useRouter } from 'next/navigation';

export default function LobbyPage() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    ApiService.get<any[]>('/api/game')
      .then(data => {
        setGames(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 className="text-hero" style={{ marginBottom: '2rem', textAlign: 'center' }}>Live Games Lobby</h1>
      <p className="text-gray-400 mt-2 mb-8">Let&apos;s see the top players</p>
      
      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--foreground)' }}>Loading active games...</p>
      ) : games.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <h2>No Active Games</h2>
          <p style={{ color: 'var(--accent-secondary)' }}>It&apos;s quiet right now. Why not start one?</p>
          <button onClick={() => router.push('/')} className="btn-primary" style={{ marginTop: '1rem', padding: '0.75rem 2rem' }}>Play Now</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {games.map(game => (
            <div key={game.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--foreground)' }}>Game #{game.id.substring(0,6)}</span>
                <span style={{ fontSize: '0.875rem', background: 'var(--accent-primary)', padding: '0.25rem 0.5rem', borderRadius: '4px', color: '#fff' }}>LIVE</span>
              </div>
              <p style={{ margin: 0, color: 'var(--accent-secondary)' }}>Status: {game.status}</p>
              <button onClick={() => router.push(`/play?gameId=${game.id}`)} className="btn-secondary" style={{ width: '100%' }}>Watch Game</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
