'use client';

import React, { useEffect, useState } from 'react';
import { ApiService } from '../../services/api';
import { useRouter } from 'next/navigation';

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    ApiService.get<any[]>('/api/player/leaderboard')
      .then(data => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="text-hero" style={{ marginBottom: '2rem', textAlign: 'center' }}>Global Leaderboard</h1>
      
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--foreground)' }}>Loading top players...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '1rem', color: 'var(--accent-secondary)' }}>Rank</th>
                <th style={{ padding: '1rem', color: 'var(--accent-secondary)' }}>Player</th>
                <th style={{ padding: '1rem', color: 'var(--accent-secondary)' }}>Country</th>
                <th style={{ padding: '1rem', color: 'var(--accent-secondary)' }}>Rating</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p, index) => (
                <tr key={p.id} style={{ borderTop: '1px solid var(--board-border)', cursor: 'pointer' }} onClick={() => router.push(`/profile/${p.username}`)}>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>#{index + 1}</td>
                  <td style={{ padding: '1rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>{p.username}</td>
                  <td style={{ padding: '1rem' }}>{p.country || 'Unknown'}</td>
                  <td style={{ padding: '1rem', fontWeight: '800' }}>{p.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
