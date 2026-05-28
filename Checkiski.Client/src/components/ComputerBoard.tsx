/* eslint-disable */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Chess, Square } from 'chess.js';
import { useStockfish } from '../hooks/useStockfish';
import MoveHistory from './MoveHistory';
import GameAnalysis from './GameAnalysis';
import PremiumBoard from './PremiumBoard';

const pieceUnicode: Record<string, string> = {
  'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
  'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
const getSquare = (r: number, c: number) => (files[c] + ranks[r]) as Square;

const playSound = (type: 'move' | 'capture') => {
  try {
    const audio = new Audio(`/${type}.mp3`);
    audio.play().catch(() => {});
  } catch (e) {}
};

export default function ComputerBoard() {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const { evaluation, bestMove, analyzeFen, isReady } = useStockfish();
  
  // Review Mode State
  const [reviewIndex, setReviewIndex] = useState<number>(-1); // -1 means live

  // Trigger Stockfish for computer move
  useEffect(() => {
    if (game.turn() === 'b' && !game.isGameOver() && reviewIndex === -1) {
      analyzeFen(game.fen(), 10);
    }
  }, [game, analyzeFen, reviewIndex]);

  // Apply Stockfish's best move
  useEffect(() => {
    if (game.turn() === 'b' && bestMove && !game.isGameOver() && reviewIndex === -1) {
      const from = bestMove.slice(0, 2) as Square;
      const to = bestMove.slice(2, 4) as Square;
      const promotion = bestMove[4] || 'q';

      try {
        const newGame = new Chess();
        newGame.loadPgn(game.pgn());
        const result = newGame.move({ from, to, promotion });
        if (result) {
          setGame(newGame);
          playSound(result.captured ? 'capture' : 'move');
        }
      } catch (e) {}
    }
  }, [bestMove, game, reviewIndex]);
  
  // Trigger Stockfish for Review Mode analysis
  useEffect(() => {
    if (reviewIndex !== -1) {
      const historyMoves = game.history({ verbose: true }) as any[];
      const fen = reviewIndex === 0 ? new Chess().fen() : historyMoves[reviewIndex - 1].after;
      // Start deep analysis of the historical position
      analyzeFen(fen, 15);
    }
  }, [reviewIndex, game, analyzeFen]);

  const handleMove = (source: Square, target: Square) => {
    if (game.turn() !== 'w' || reviewIndex !== -1) return;

    try {
      const newGame = new Chess();
      newGame.loadPgn(game.pgn());
      const result = newGame.move({ from: source, to: target, promotion: 'q' });
      if (result) {
        setGame(newGame);
        playSound(result.captured ? 'capture' : 'move');
      }
    } catch (e) {}
  };

  const onDragStart = (e: React.DragEvent, square: Square) => {
    if (game.turn() !== 'w' || reviewIndex !== -1) return;
    setSelectedSquare(square);
    const moves = game.moves({ square, verbose: true });
    setLegalMoves(moves.map(m => m.to));
    e.dataTransfer.setData("text/plain", square);
  };

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  const onDrop = (e: React.DragEvent, targetSquare: Square) => {
    e.preventDefault();
    if (reviewIndex !== -1) return;
    const sourceSquare = e.dataTransfer.getData("text/plain") as Square;
    handleMove(sourceSquare, targetSquare);
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  const handleSquareClick = (square: Square) => {
    if (game.turn() !== 'w' || reviewIndex !== -1) return;
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

  const historyMoves = game.history({ verbose: true }) as any[];
  const isReviewMode = reviewIndex !== -1;
  const currentFen = useMemo(() => {
    if (!isReviewMode) return game.fen();
    if (reviewIndex === 0) return new Chess().fen();
    if (historyMoves[reviewIndex - 1]?.after) return historyMoves[reviewIndex - 1].after;
    
    const temp = new Chess();
    for (let i = 0; i < reviewIndex; i++) {
      temp.move(historyMoves[i]);
    }
    return temp.fen();
  }, [isReviewMode, reviewIndex, game, historyMoves]);
    
  const viewGame = useMemo(() => new Chess(currentFen), [currentFen]);

  const handleNav = (dir: 'start'|'prev'|'next'|'end') => {
    const total = historyMoves.length;
    let newIdx = reviewIndex === -1 ? total : reviewIndex;
    
    if (dir === 'start') newIdx = 0;
    if (dir === 'prev') newIdx = Math.max(0, newIdx - 1);
    if (dir === 'next') newIdx = Math.min(total, newIdx + 1);
    if (dir === 'end') newIdx = total;
    
    setReviewIndex(newIdx === total ? -1 : newIdx);
  };

  const renderRows = [0,1,2,3,4,5,6,7];
  const renderCols = [0,1,2,3,4,5,6,7];

  return (
    <div className="chess-layout">
      {/* Center Column: Board */}
      <div className="chess-board-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ color: 'var(--foreground)', fontWeight: 'bold' }}>
            Stockfish {isReady ? '' : '(Loading...)'} 
          </span>
          {isReviewMode && (
            <span style={{ background: 'var(--accent-primary)', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
              ANALYSIS MODE
            </span>
          )}
        </div>

        <PremiumBoard
          game={viewGame}
          isFlipped={false}
          selectedSquare={selectedSquare}
          legalMoves={legalMoves}
          isReviewMode={isReviewMode}
          bestMove={bestMove}
          historyMoves={historyMoves}
          reviewIndex={reviewIndex}
          onSquareClick={handleSquareClick}
          onDragStart={onDragStart}
          onDrop={onDrop}
          canDrag={(piece) => piece.color === 'w' && !isReviewMode && game.turn() === 'w'}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <span style={{ color: 'var(--foreground)', fontWeight: 'bold' }}>You</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
             {isReviewMode && (
                <span style={{ padding: '0.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                   Eval: {evaluation > 0 ? '+' : ''}{evaluation.toFixed(2)}
                </span>
             )}
             <button 
               onClick={() => { setGame(new Chess()); setSelectedSquare(null); setLegalMoves([]); setReviewIndex(-1); }}
               className="btn-secondary"
             >
               Restart
             </button>
          </div>
        </div>
      </div>

      {/* Right Column: History */}
      <div className="chess-sidebar">
        <MoveHistory 
          moves={game.history()} 
          interactive={game.isGameOver()} 
          selectedIndex={reviewIndex === -1 ? historyMoves.length - 1 : reviewIndex - 1} 
          onSelect={(idx) => setReviewIndex(idx + 1)}
          onNav={handleNav}
        />
        {game.isGameOver() && (
           <div style={{ marginTop: '1rem' }}>
             <GameAnalysis pgn={game.pgn()} />
           </div>
        )}
      </div>

    </div>
  );
}
