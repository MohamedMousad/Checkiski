/* eslint-disable */
'use client';
import React, { useState, useEffect } from 'react';
import { Chess, Square } from 'chess.js';

const pieceUnicode: Record<string, string> = {
  'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
  'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
const getSquare = (r: number, c: number) => (files[c] + ranks[r]) as Square;

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

      <div className="glass-panel" style={{ padding: '2rem', display: 'inline-block' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 60px)',
          gridTemplateRows: 'repeat(8, 60px)',
          border: '4px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}>
          {[0,1,2,3,4,5,6,7].map(r => [0,1,2,3,4,5,6,7].map(c => {
            const piece = game.board()[r][c];
            const square = getSquare(r, c);
            const isLight = (r + c) % 2 === 0;
            const isSelected = selectedSquare === square;
            const isLegalMove = legalMoves.includes(square);
            
            let bg = isLight ? 'var(--board-light)' : 'var(--board-dark)';
            if (isSelected) bg = 'var(--board-highlight)';

            return (
              <div
                key={square}
                onClick={() => handleSquareClick(square)}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, square)}
                style={{
                  width: '60px', height: '60px', backgroundColor: bg, position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '40px', cursor: 'pointer', userSelect: 'none',
                  transition: 'background-color 0.2s'
                }}
              >
                {c === 0 && <span style={{ position: 'absolute', top: 2, left: 2, fontSize: '10px', fontWeight: 'bold', color: isLight ? 'var(--board-dark)' : 'var(--board-light)' }}>{ranks[r]}</span>}
                {r === 7 && <span style={{ position: 'absolute', bottom: 2, right: 2, fontSize: '10px', fontWeight: 'bold', color: isLight ? 'var(--board-dark)' : 'var(--board-light)' }}>{files[c]}</span>}
                
                {isLegalMove && !piece && <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'rgba(0, 200, 0, 0.6)', position: 'absolute' }} />}
                {isLegalMove && piece && <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid rgba(0, 200, 0, 0.6)', position: 'absolute', boxSizing: 'border-box' }} />}

                {piece && (
                  <div
                    draggable
                    onDragStart={(e) => onDragStart(e, square)}
                    style={{
                      color: piece.color === 'w' ? '#ffffff' : '#000000',
                      textShadow: piece.color === 'w' ? '0px 2px 4px rgba(0,0,0,0.8)' : '0px 2px 4px rgba(255,255,255,0.4)',
                      cursor: 'grab'
                    }}
                  >
                    {pieceUnicode[piece.color === 'w' ? piece.type.toUpperCase() : piece.type]}
                  </div>
                )}
              </div>
            );
          }))}
        </div>
      </div>
    </div>
  );
}
