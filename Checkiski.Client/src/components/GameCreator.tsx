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

  const timeIcons: Record<string, string> = { bullet: '⚡', blitz: '🔥', rapid: '⏱', classical: '🏛' };
  const colorIcons: Record<string, string> = { white: '♔', random: '🎲', black: '♚' };

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(5,5,7,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2000,
        animation: 'fadeIn 0.3s ease forwards',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="glass-panel" style={{
        padding: 'var(--space-2xl)',
        width: '420px',
        maxWidth: '90vw',
        animation: 'fadeInUp 0.4s var(--ease-out) forwards',
        border: '1px solid rgba(46,204,113,0.15)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <p className="text-caption" style={{ color: 'var(--color-emerald-dim)', marginBottom: 'var(--space-xs)' }}>
            New Match
          </p>
          <h2 className="text-display" style={{ fontSize: '1.5rem' }}>Create Game</h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          {/* Time Control */}
          <div>
            <label className="input-label">Time Control</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-sm)' }}>
              {(['bullet', 'blitz', 'rapid', 'classical'] as const).map(tc => (
                <button
                  type="button"
                  key={tc}
                  onClick={() => setTimeControl(tc)}
                  style={{
                    padding: '10px 4px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    background: timeControl === tc ? 'var(--color-emerald-deep)' : 'rgba(255,255,255,0.03)',
                    color: timeControl === tc ? 'var(--color-emerald)' : 'var(--color-text-dim)',
                    border: timeControl === tc ? '1px solid var(--color-emerald-dim)' : '1px solid var(--panel-border)',
                    textTransform: 'capitalize',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 500,
                    fontSize: '0.78rem',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>{timeIcons[tc]}</span>
                  {tc}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="input-label">Play As</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-sm)' }}>
              {(['white', 'random', 'black'] as const).map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    padding: '12px 8px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    background: color === c ? 'var(--color-emerald-deep)' : 'rgba(255,255,255,0.03)',
                    color: color === c ? 'var(--color-emerald)' : 'var(--color-text-dim)',
                    border: color === c ? '1px solid var(--color-emerald-dim)' : '1px solid var(--panel-border)',
                    textTransform: 'capitalize',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 500,
                    fontSize: '0.85rem',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{colorIcons[c]}</span>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Rated */}
          <label style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
            cursor: 'pointer',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-display)',
            fontSize: '0.9rem',
          }}>
            <input
              type="checkbox"
              checked={isRated}
              onChange={e => setIsRated(e.target.checked)}
              style={{ width: '1.1rem', height: '1.1rem', accentColor: 'var(--color-emerald)' }}
            />
            <span>Rated Game</span>
          </label>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, padding: '12px' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px' }}>
              Create Match
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
