'use client';
import React from 'react';

interface GameControlsProps {
  onResign: () => void;
  onDraw: () => void;
  onAbort: () => void;
  onFlipBoard: () => void;
}

export default function GameControls({ onResign, onDraw, onAbort, onFlipBoard }: GameControlsProps) {
  const buttonStyle = {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    fontWeight: 'bold',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    flex: '1 1 auto',
    minWidth: '100px'
  };

  return (
    <div className="glass-panel" style={{
      display: 'flex', gap: '1rem', padding: '1rem', borderRadius: '8px', flexWrap: 'wrap',
      background: 'rgba(20,20,25,0.8)',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      <button 
        style={{ ...buttonStyle, color: '#ff6b6b' }} 
        onClick={onResign}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 107, 107, 0.1)'}
        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
      >
        🏳️ Resign
      </button>
      <button 
        style={{ ...buttonStyle }} 
        onClick={onDraw}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
      >
        🤝 Draw
      </button>
      <button 
        style={{ ...buttonStyle }} 
        onClick={onAbort}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
      >
        ❌ Abort
      </button>
      <button 
        style={{ ...buttonStyle, color: 'var(--accent-secondary, #4caf50)' }} 
        onClick={onFlipBoard}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
      >
        🔃 Flip
      </button>
    </div>
  );
}
