/* eslint-disable */
'use client';
import React, { useState } from 'react';

export default function GameCreator({ onCreate, onClose }: { onCreate: (config: any) => void, onClose: () => void }) {
  const [color, setColor] = useState<'white' | 'black' | 'random'>('random');
  const [timeControl, setTimeControl] = useState<'bullet' | 'blitz' | 'rapid' | 'classical'>('blitz');
  const [isRated, setIsRated] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({ color, timeControl, isRated });
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="glass-panel" style={{
        padding: '2rem', borderRadius: '12px', width: '400px', maxWidth: '90vw',
        background: 'rgba(30,30,40,0.95)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#fff' }}>Create Game</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--accent-secondary, #aaa)' }}>Time Control</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['bullet', 'blitz', 'rapid', 'classical'].map(tc => (
                <button 
                  type="button" 
                  key={tc}
                  onClick={() => setTimeControl(tc as any)}
                  style={{
                    flex: 1, padding: '0.5rem', borderRadius: '4px', cursor: 'pointer',
                    background: timeControl === tc ? 'var(--accent-primary, #4caf50)' : 'rgba(255,255,255,0.1)',
                    color: '#fff', border: 'none', textTransform: 'capitalize'
                  }}
                >
                  {tc}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--accent-secondary, #aaa)' }}>Color</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['white', 'random', 'black'].map(c => (
                <button 
                  type="button" 
                  key={c}
                  onClick={() => setColor(c as any)}
                  style={{
                    flex: 1, padding: '0.5rem', borderRadius: '4px', cursor: 'pointer',
                    background: color === c ? 'var(--accent-primary, #4caf50)' : 'rgba(255,255,255,0.1)',
                    color: '#fff', border: 'none', textTransform: 'capitalize'
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#fff' }}>
            <input 
              type="checkbox" 
              checked={isRated} 
              onChange={e => setIsRated(e.target.checked)} 
              style={{ width: '1.2rem', height: '1.2rem' }}
            />
            <span>Rated Game</span>
          </label>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '0.75rem', borderRadius: '4px', cursor: 'pointer',
              background: 'transparent', border: '1px solid var(--accent-secondary, #aaa)', color: '#fff'
            }}>Cancel</button>
            <button type="submit" style={{
              flex: 1, padding: '0.75rem', borderRadius: '4px', cursor: 'pointer',
              background: 'var(--accent-primary, #4caf50)', border: 'none', color: '#fff', fontWeight: 'bold'
            }}>Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
