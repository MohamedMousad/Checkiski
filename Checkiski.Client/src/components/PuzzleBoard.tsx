/* eslint-disable */
'use client';
import React, { useState, useEffect } from 'react';
import { Chess, Square } from 'chess.js';
import PremiumBoard from './PremiumBoard';

export default function PuzzleBoard({ fen, solution }: { fen: string, solution: string[] }) {
  const [game, setGame] = useState(new Chess(fen));
  const [moveIndex, setMoveIndex] = useState(0);
  const [status, setStatus] = useState<'playing' | 'success' | 'failed'>('playing');
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);

  useEffect(() => {
    // Reset puzzle when fen changes
    setGame(new Chess(fen));
    setMoveIndex(0);
    setStatus('playing');
  }, [fen, solution]);

  const handleMove = (source: Square, target: Square) => {
    if (status !== 'playing') return;

    const move = {
      from: source,
      to: target,
      promotion: 'q'
    };

    try {
      const newGame = new Chess(game.fen());
      const result = newGame.move(move);

      if (result) {
        // Validate against solution
        const expectedMove = solution[moveIndex];
        // Compare standard algebraic notation (san) or LAN
        if (result.san === expectedMove || result.lan === expectedMove) {
          setGame(newGame);
          setMoveIndex(m => m + 1);

          if (moveIndex + 1 >= solution.length) {
            setStatus('success');
          } else {
            // Opponent's automatic response
            setTimeout(() => {
              const oppGame = new Chess(newGame.fen());
              oppGame.move(solution[moveIndex + 1]);
              setGame(oppGame);
              setMoveIndex(m => m + 1);
              if (moveIndex + 2 >= solution.length) {
                setStatus('success');
              }
            }, 500);
          }
        } else {
          setStatus('failed');
          // Wait 1 second and revert move so user can try again
          setGame(newGame);
          setTimeout(() => {
            const revertGame = new Chess(game.fen());
            setGame(revertGame);
            setStatus('playing');
          }, 1000);
        }
      }
    } catch (e) {
      // Invalid move
    }
  };

  const onDragStart = (e: React.DragEvent, square: Square) => {
    if (status !== 'playing') return;
    setSelectedSquare(square);
    const moves = game.moves({ square, verbose: true });
    setLegalMoves(moves.map(m => m.to));
    e.dataTransfer.setData("text/plain", square);
  };

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  const onDrop = (e: React.DragEvent, targetSquare: Square) => {
    e.preventDefault();
    const sourceSquare = e.dataTransfer.getData("text/plain") as Square;
    handleMove(sourceSquare, targetSquare);
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  const handleSquareClick = (square: Square) => {
    if (status !== 'playing') return;
    if (selectedSquare) {
      handleMove(selectedSquare, square);
      setSelectedSquare(null);
      setLegalMoves([]);
    } else {
      const moves = game.moves({ square, verbose: true });
      if (moves.length > 0) {
        setSelectedSquare(square);
        setLegalMoves(moves.map(m => m.to));
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Tactics Puzzle</h2>
        {status === 'playing' && <div style={{ color: 'var(--accent-secondary)' }}>Find the best move!</div>}
        {status === 'success' && <div style={{ color: '#4caf50', fontWeight: 'bold' }}>Puzzle Solved!</div>}
        {status === 'failed' && <div style={{ color: '#ff4444', fontWeight: 'bold' }}>Incorrect move. Try again!</div>}
      </div>

      <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '560px' }}>
        <div style={{ width: '100%' }}>
          <PremiumBoard
            game={game}
            isFlipped={false}
            selectedSquare={selectedSquare}
            legalMoves={legalMoves}
            onSquareClick={handleSquareClick}
            onDragStart={onDragStart}
            onDrop={onDrop}
            canDrag={() => status === 'playing'}
          />
        </div>
      </div>
    </div>
  );
}
