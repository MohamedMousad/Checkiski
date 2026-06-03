/* eslint-disable */
'use client';

import React from 'react';
import ComputerBoard from '../../components/ComputerBoard';

export default function ComputerPage() {
  return (
    <div style={{
      width: '100%',
      paddingTop: 'calc(64px + var(--space-lg))',
      paddingBottom: 'var(--space-2xl)',
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: 'var(--space-xl)',
        animation: 'fadeInUp 0.6s var(--ease-out) forwards',
      }}>
        <div className="text-caption" style={{
          color: 'var(--accent-lime)',
          marginBottom: 'var(--space-sm)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          letterSpacing: '0.1em'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-lime)', animation: 'pulse 2s infinite' }}></span>
          NEURAL ENGINE ACTIVE
        </div>
        <h1 className="text-hero" style={{
          fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
          color: 'var(--text-primary)',
        }}>Stockfish 16</h1>
      </div>

      <ComputerBoard />
    </div>
  );
}
