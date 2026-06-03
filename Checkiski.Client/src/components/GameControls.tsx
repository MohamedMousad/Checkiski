'use client';
import React from 'react';

interface GameControlsProps {
  onResign: () => void;
  onDraw: () => void;
  onAbort: () => void;
  onFlipBoard: () => void;
  onInvite?: () => void;
}

export default function GameControls({ onResign, onDraw, onAbort, onFlipBoard, onInvite }: GameControlsProps) {
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
      {onInvite && (
        <button
          style={{
            ...buttonBase,
            background: 'rgba(46,204,113,0.08)',
            color: 'var(--color-emerald)',
            border: '1px solid rgba(46,204,113,0.2)',
            flex: '1 1 100%',
          }}
          onClick={onInvite}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(46,204,113,0.15)'; e.currentTarget.style.borderColor = 'rgba(46,204,113,0.35)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(46,204,113,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(46,204,113,0.08)'; e.currentTarget.style.borderColor = 'rgba(46,204,113,0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
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
        style={buttonBase}
        onClick={onAbort}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--color-text)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'var(--color-text-dim)'; }}
      >
        ❌ Abort
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

