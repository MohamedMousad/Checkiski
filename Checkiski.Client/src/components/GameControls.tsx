'use client';
import React from 'react';

interface GameControlsProps {
  onResign: () => void;
  onDraw: () => void;
  onFlipBoard: () => void;
}

export default function GameControls({ onResign, onDraw, onFlipBoard }: GameControlsProps) {
  const buttonBase: React.CSSProperties = {
    padding: '10px 14px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--panel-border)',
    color: 'var(--color-text-dim)',
    fontFamily: 'var(--font-display)',
    fontWeight: 500,
    fontSize: '0.82rem',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    flex: '1 1 auto',
  };

  return (
    <div style={{
      display: 'flex',
      gap: 'var(--space-sm)',
      padding: 'var(--space-md)',
      background: 'var(--panel-bg)',
      border: '1px solid var(--panel-border)',
      borderRadius: 'var(--radius-md)',
      flexWrap: 'wrap',
    }}>
      <button
        style={{ ...buttonBase, color: 'var(--color-danger)' }}
        onClick={onResign}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(231, 76, 60, 0.1)'; e.currentTarget.style.borderColor = 'rgba(231, 76, 60, 0.3)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'var(--panel-border)'; }}
      >
        🏳️ Resign
      </button>
      <button
        style={buttonBase}
        onClick={onDraw}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--color-text)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'var(--color-text-dim)'; }}
      >
        🤝 Draw
      </button>
      <button
        style={{ ...buttonBase, color: 'var(--color-emerald-dim)' }}
        onClick={onFlipBoard}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-emerald-mist)'; e.currentTarget.style.color = 'var(--color-emerald)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'var(--color-emerald-dim)'; }}
      >
        🔃 Flip
      </button>
    </div>
  );
}
