'use client';
import React, { Suspense } from 'react';
import ComputerBoard from '../../components/ComputerBoard';

function ComputerContent() {
  return (
    <div style={{
      width: '100%',
      padding: 'calc(70px + var(--space-lg)) var(--space-md) var(--space-xl)',
    }}>
      {/* Atmospheric header */}
      <div style={{
        textAlign: 'center',
        marginBottom: 'var(--space-xl)',
        position: 'relative',
      }}>
        <p className="text-caption" style={{ color: 'var(--color-emerald-dim)', marginBottom: 'var(--space-xs)' }}>
          Man vs Machine
        </p>
        <h1 className="text-display" style={{ fontSize: '1.6rem' }}>
          Play Computer
        </h1>
      </div>
      <ComputerBoard />
    </div>
  );
}

export default function ComputerPage() {
  return (
    <Suspense fallback={
      <div style={{
        textAlign: 'center',
        padding: 'calc(80px + var(--space-4xl)) var(--space-xl)',
        color: 'var(--color-text-dim)',
      }}>
        <div style={{
          width: '40px', height: '40px', border: '3px solid var(--color-muted)',
          borderTop: '3px solid var(--color-emerald)', borderRadius: '50%',
          animation: 'spin 1s linear infinite', margin: '0 auto var(--space-md)',
        }} />
        Initializing Stockfish engine...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <ComputerContent />
    </Suspense>
  );
}
