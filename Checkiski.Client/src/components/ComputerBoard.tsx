/* eslint-disable */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Chess, Square } from 'chess.js';
import { useStockfish } from '../hooks/useStockfish';
import MoveHistory from './MoveHistory';
import GameAnalysis from './GameAnalysis';

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

        <div className="glass-panel" style={{ padding: '1rem', background: 'var(--board-border)' }}>
          <div style={{
            width: '480px',
            height: '480px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {renderRows.map((r, visualR) => renderCols.map((c, visualC) => {
              const piece = viewGame.board()[r][c];
              const square = getSquare(r, c);
              const isLight = (r + c) % 2 === 0;
              const isSelected = selectedSquare === square;
              const isLegalMove = legalMoves.includes(square);
              
              let bg = isLight ? 'var(--board-light)' : 'var(--board-dark)';
              if (isSelected) bg = 'var(--board-highlight)';
              // Add slight highlight to last move source/target
              if (isReviewMode && reviewIndex > 0) {
                 const lastMove = historyMoves[reviewIndex - 1];
                 if (lastMove.from === square || lastMove.to === square) {
                    bg = 'var(--board-highlight)';
                 }
              } else if (!isReviewMode && historyMoves.length > 0) {
                 const lastMove = historyMoves[historyMoves.length - 1];
                 if (lastMove.from === square || lastMove.to === square) {
                    bg = 'var(--board-highlight)';
                 }
              }

              return (
                <div
                  key={`bg-${r}-${c}`}
                  onClick={() => handleSquareClick(square)}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, square)}
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: bg,
                    position: 'absolute',
                    top: visualR * 60,
                    left: visualC * 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Coordinate Labels */}
                  {c === 0 && <span style={{ position: 'absolute', top: 2, left: 2, fontSize: '10px', fontWeight: 'bold', color: isLight ? 'var(--board-dark)' : 'var(--board-light)', zIndex: 1 }}>{ranks[r]}</span>}
                  {r === 7 && <span style={{ position: 'absolute', bottom: 2, right: 2, fontSize: '10px', fontWeight: 'bold', color: isLight ? 'var(--board-dark)' : 'var(--board-light)', zIndex: 1 }}>{files[c]}</span>}
                  
                  {isLegalMove && !piece && <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--board-valid-move)', position: 'absolute', zIndex: 2 }} />}
                  {isLegalMove && piece && <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid var(--board-valid-move)', position: 'absolute', boxSizing: 'border-box', zIndex: 2 }} />}
                </div>
              );
            }))}

            {/* Pieces Overlay */}
            {renderRows.map((r, visualR) => renderCols.map((c, visualC) => {
              const piece = viewGame.board()[r][c];
              if (!piece) return null;
              const square = getSquare(r, c);

              return (
                <div
                  key={`${square}-${piece.color}${piece.type}`}
                  draggable={piece.color === 'w' && !isReviewMode}
                  onDragStart={(e) => onDragStart(e, square)}
                  onDragOver={onDragOver}
                  onDrop={(e) => { e.stopPropagation(); onDrop(e, square); }}
                  onClick={(e) => { e.stopPropagation(); handleSquareClick(square); }}
                  style={{
                    position: 'absolute',
                    top: visualR * 60,
                    left: visualC * 60,
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '45px',
                    cursor: (piece.color === 'w' && !isReviewMode) ? 'grab' : 'default',
                    userSelect: 'none',
                    color: piece.color === 'w' ? '#ffffff' : '#000000',
                    textShadow: piece.color === 'w' ? '0px 2px 4px rgba(0,0,0,0.8)' : '0px 2px 4px rgba(255,255,255,0.4)',
                    zIndex: 10,
                  }}
                >
                  {pieceUnicode[piece.color === 'w' ? piece.type.toUpperCase() : piece.type]}
                </div>
              );
            }))}
            
            {/* Best Move SVG Arrow Overlay (Analysis Mode) */}
            {isReviewMode && bestMove && bestMove.length >= 4 && (
              <svg style={{ position: 'absolute', top: 0, left: 0, width: '480px', height: '480px', zIndex: 15, pointerEvents: 'none' }}>
                <defs>
                  <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3 z" fill="rgba(129, 182, 76, 0.9)" />
                  </marker>
                </defs>
                {(() => {
                  const fromFile = files.indexOf(bestMove[0]);
                  const fromRank = ranks.indexOf(bestMove[1]);
                  const toFile = files.indexOf(bestMove[2]);
                  const toRank = ranks.indexOf(bestMove[3]);
                  
                  if (fromFile === -1 || fromRank === -1 || toFile === -1 || toRank === -1) return null;
                  
                  const x1 = fromFile * 60 + 30;
                  const y1 = fromRank * 60 + 30;
                  const x2 = toFile * 60 + 30;
                  const y2 = toRank * 60 + 30;
                  
                  const angle = Math.atan2(y2 - y1, x2 - x1);
                  const x2adj = x2 - Math.cos(angle) * 15;
                  const y2adj = y2 - Math.sin(angle) * 15;

                  return (
                    <line 
                      x1={x1} y1={y1} x2={x2adj} y2={y2adj}
                      stroke="rgba(129, 182, 76, 0.9)" strokeWidth="12"
                      markerEnd="url(#arrowhead)" strokeLinecap="round"
                    />
                  );
                })()}
              </svg>
            )}
          </div>
        </div>

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
