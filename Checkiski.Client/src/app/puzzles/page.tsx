/* eslint-disable */
'use client';
import React from 'react';
import PuzzleBoard from '../../components/PuzzleBoard';

export default function PuzzlesPage() {
  const puzzle = {
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1',
    solution: ['Qxf7#']
  };

  const puzzle2 = {
    fen: '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1',
    solution: ['Ra8#']
  };

  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      padding: 'calc(80px + var(--space-2xl)) var(--space-xl) var(--space-2xl)',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
        <p className="text-caption" style={{ color: 'var(--color-gold-dim)', marginBottom: 'var(--space-sm)' }}>
          Train Your Vision
        </p>
        <h1 className="text-hero" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: 'var(--space-md)' }}>
          Tactical Puzzles
        </h1>
        <p className="text-body" style={{ maxWidth: '440px', margin: '0 auto' }}>
          Sharpen your pattern recognition. Find the best move.
        </p>
      </div>

      {/* Puzzle container */}
      <div className="glass-panel" style={{
        padding: 'var(--space-xl)',
        animation: 'fadeInUp 0.6s var(--ease-out) forwards',
        maxWidth: '700px',
        width: '100%',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
          <h2 className="text-heading" style={{ fontSize: '1.2rem', marginBottom: 'var(--space-xs)' }}>
            Back Rank Mate
          </h2>
          <p className="text-caption" style={{ color: 'var(--color-emerald-dim)' }}>
            White to move — Find the checkmate
          </p>
        </div>
        <PuzzleBoard fen={puzzle2.fen} solution={puzzle2.solution} />
      </div>
    </main>
  );
}
