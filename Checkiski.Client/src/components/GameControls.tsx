'use client';
import React from 'react';

interface GameControlsProps {
  onResign: () => void;
  onDraw: () => void;
  onFlipBoard: () => void;
  onInvite?: () => void;
}

export default function GameControls({ onResign, onDraw, onFlipBoard, onInvite }: GameControlsProps) {
  const buttonBase: React.CSSProperties = {
    padding: '10px 14px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border)',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
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
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      flexWrap: 'wrap',
    }}>
      {onInvite && (
        <button
          style={{
            ...buttonBase,
            background: 'var(--accent-blue-mist)',
            color: 'var(--accent-blue)',
            border: '1px solid rgba(10,132,217,0.2)',
            flex: '1 1 100%',
          }}
          onClick={onInvite}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(10,132,217,0.15)'; e.currentTarget.style.borderColor = 'rgba(10,132,217,0.35)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(10,132,217,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-blue-mist)'; e.currentTarget.style.borderColor = 'rgba(10,132,217,0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
          Invite Friend
        </button>
      )}
      <button
        style={{ ...buttonBase, color: 'var(--color-danger)' }}
        onClick={onResign}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(229, 62, 62, 0.1)'; e.currentTarget.style.borderColor = 'rgba(229, 62, 62, 0.3)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
      >
        🏳️ Resign
      </button>
      <button
        style={buttonBase}
        onClick={onDraw}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
      >
        🤝 Draw
      </button>
      <button
        style={{ ...buttonBase, color: 'var(--accent-blue-dim)' }}
        onClick={onFlipBoard}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-blue-mist)'; e.currentTarget.style.color = 'var(--accent-blue)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'var(--accent-blue-dim)'; }}
      >
        🔃 Flip
      </button>
    </div>
  );
}
