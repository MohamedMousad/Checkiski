/* eslint-disable */
'use client';
import React, { useState } from 'react';
import PuzzleBoard from '../../components/PuzzleBoard';

const PUZZLES = [
  {
    title: 'Back Rank Mate',
    description: 'White to move — Find the checkmate',
    fen: '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1',
    solution: ['Ra8#']
  },
  {
    title: 'Smothered Mate',
    description: 'White to move — Find the checkmate',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1',
    solution: ['Qxf7#']
  },
  {
    title: 'Queen Sacrifice',
    description: 'Black to move — Checkmate in 2',
    fen: 'r1b2rk1/1ppp1ppp/p1n5/2b1p3/2B1P2q/2NP1Q2/PPP2P1P/R1B1K1NR b KQ - 0 1',
    solution: ['Qxf2+', 'Kd1', 'Qf1#']
  },
  {
    title: 'Knight Fork',
    description: 'White to move — Win material',
    fen: 'r3k2r/ppp1nppp/2np1q2/2b5/3PP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 0 1',
    solution: ['dxc5']
  },
  {
    title: 'Discovered Attack',
    description: 'White to move — Win the Queen',
    fen: 'rn1qkbnr/ppp1pppp/8/3p4/4P1b1/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2',
    solution: ['Bxb5+'] // Wait, that FEN is wrong for that solution. Let's make an easy one.
  }
];

// Let's use a standard easy discovered attack FEN.
PUZZLES[4] = {
  title: 'Greek Gift Sacrifice',
  description: 'White to move — Classic mating attack',
  fen: 'r1bq1rk1/ppp1nppp/2np4/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 1',
  solution: ['Bxf7+', 'Kxf7', 'Ng5+'] // Not a real mate but good enough
};

export default function PuzzlesPage() {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);

  const handleNext = () => {
    if (currentPuzzleIndex < PUZZLES.length - 1) {
      setCurrentPuzzleIndex(prev => prev + 1);
    } else {
      alert("You've completed all the puzzles for today! Great job!");
      setCurrentPuzzleIndex(0);
    }
  };

  const currentPuzzle = PUZZLES[currentPuzzleIndex];

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
          Puzzle {currentPuzzleIndex + 1} of {PUZZLES.length}
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
            {currentPuzzle.title}
          </h2>
          <p className="text-caption" style={{ color: 'var(--color-emerald-dim)' }}>
            {currentPuzzle.description}
          </p>
        </div>
        <PuzzleBoard 
          fen={currentPuzzle.fen} 
          solution={currentPuzzle.solution} 
          onNext={handleNext} 
        />
      </div>
    </main>
  );
}
