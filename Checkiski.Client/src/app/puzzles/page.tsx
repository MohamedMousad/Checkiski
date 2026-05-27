/* eslint-disable */
'use client';
import React from 'react';
import PuzzleBoard from '../../components/PuzzleBoard';

export default function PuzzlesPage() {
  // Mock puzzle: White to move and mate in 2
  // FEN: r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1
  // Solution: Qxf7#
  const puzzle = {
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1',
    solution: ['Qxf7#']
  };

  // Mock puzzle 2: White to move, discover attack
  // FEN: r1bq1rk1/1pp2ppp/p1np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQ1RK1 w - - 0 1
  // Let's use a simpler known puzzle:
  // "Back rank mate"
  const puzzle2 = {
    fen: '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1',
    solution: ['Ra8#']
  };

  return (
    <main style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      minHeight: '100vh', padding: '2rem' 
    }}>
      <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '2rem' }}>Puzzles</h1>
      <p style={{ color: 'var(--foreground)', opacity: 0.8, marginBottom: '3rem' }}>
        Sharpen your tactics by solving these chess puzzles.
      </p>

      <PuzzleBoard fen={puzzle2.fen} solution={puzzle2.solution} />
    </main>
  );
}
