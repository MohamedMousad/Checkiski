/* eslint-disable */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { HubConnection } from '@microsoft/signalr';
import { Chess, Square } from 'chess.js';
import { useStockfish } from '../hooks/useStockfish';
import { ApiService } from '../services/api';

import MoveHistory from './MoveHistory';
import GameClock from './GameClock';
import GameControls from './GameControls';
import ChatBox from './ChatBox';
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

export default function ChessBoard({ gameId }: { gameId: string }) {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [gameOverMsg, setGameOverMsg] = useState<string | null>(null);

  const { evaluation, bestMove, analyzeFen, isReady } = useStockfish();
  const [reviewIndex, setReviewIndex] = useState<number>(-1);
  const [whiteClock, setWhiteClock] = useState<number>(300);
  const [blackClock, setBlackClock] = useState<number>(300);

  // Fetch initial game state
  useEffect(() => {
    ApiService.get<any>(`/api/game/${gameId}`)
    .then(data => {
      const parseTs = (ts: string) => {
        if (!ts) return 300;
        const parts = ts.split(':');
        return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseFloat(parts[2]);
      };
      setWhiteClock(parseTs(data.whiteClockRemaining));
      setBlackClock(parseTs(data.blackClockRemaining));
      if (data.pgn) {
        setGame(prev => {
          const newGame = new Chess();
          newGame.loadPgn(data.pgn);
          return newGame;
        });
      }
    })
    .catch(err => console.error("Failed to load initial game state", err));
  }, [gameId]);

  useEffect(() => {
    // @ts-ignore
    const signalR = window.signalR;
    if (!signalR) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${apiUrl}/gamehub`, { accessTokenFactory: () => localStorage.getItem('token') || '' })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    return () => { newConnection.stop().catch(console.error); };
  }, []);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          connection.invoke("JoinGameGroup", gameId);
          connection.on("ReceiveMove", (data) => {
            setWhiteClock(data.whiteClock || data.WhiteClock);
            setBlackClock(data.blackClock || data.BlackClock);
            setGame(prevGame => {
              try {
                const newGame = new Chess();
                newGame.loadPgn(data.pgn || data.Pgn);
                playSound('move'); // Assume move, tracking capture precisely from PGN is harder here
                return newGame;
              } catch (e) { return prevGame; }
            });
          });
          connection.on("GameEnded", (data) => {
            setGameOverMsg(`Game Over: ${data.status}`);
          });
          connection.on("DrawOffered", () => alert("Opponent offered a draw."));
        }).catch(e => console.log("Connection failed: ", e));
    }
    return () => {
      if (connection) {
        connection.off("ReceiveMove");
        connection.off("GameEnded");
        connection.off("DrawOffered");
      }
    };
  }, [connection, gameId]);
  
  // Trigger Stockfish for Review Mode analysis
  useEffect(() => {
    if (reviewIndex !== -1) {
      const historyMoves = game.history({ verbose: true }) as any[];
      const fen = reviewIndex === 0 ? new Chess().fen() : historyMoves[reviewIndex - 1].after;
      analyzeFen(fen, 15);
    }
  }, [reviewIndex, game, analyzeFen]);

  const handleMove = (source: Square, target: Square) => {
    if (reviewIndex !== -1 || gameOverMsg) return;
    try {
      const newGame = new Chess();
      newGame.loadPgn(game.pgn());
      const result = newGame.move({ from: source, to: target, promotion: 'q' });

      if (result) {
        setGame(newGame);
        playSound(result.captured ? 'capture' : 'move');
        
        const moveString = result.lan || (result.from + result.to + (result.promotion || ''));
        ApiService.post('/api/game/move', { 
          gameId, moveString, playerId: localStorage.getItem('playerId') 
        }).catch(err => console.error(err));
      }
    } catch (e) {}
  };

  const onDragStart = (e: React.DragEvent, square: Square) => {
    if (reviewIndex !== -1 || gameOverMsg) return;
    setSelectedSquare(square);
    const moves = game.moves({ square, verbose: true });
    setLegalMoves(moves.map(m => m.to));
    e.dataTransfer.setData("text/plain", square);
  };

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  const onDrop = (e: React.DragEvent, targetSquare: Square) => {
    e.preventDefault();
    if (reviewIndex !== -1 || gameOverMsg) return;
    const sourceSquare = e.dataTransfer.getData("text/plain") as Square;
    handleMove(sourceSquare, targetSquare);
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  const handleSquareClick = (square: Square) => {
    if (reviewIndex !== -1 || gameOverMsg) return;
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

  const renderRows = isFlipped ? [7,6,5,4,3,2,1,0] : [0,1,2,3,4,5,6,7];
  const renderCols = isFlipped ? [7,6,5,4,3,2,1,0] : [0,1,2,3,4,5,6,7];

  return (
    <div className="chess-layout">
      {gameOverMsg && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 1rem 0' }}>Game Over</h2>
            <p style={{ margin: 0 }}>{gameOverMsg}</p>
            <button onClick={() => setGameOverMsg(null)} className="btn-primary" style={{ marginTop: '1rem' }}>Close</button>
          </div>
        </div>
      )}

      {/* Center Column: Clocks & Board */}
      <div className="chess-board-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <GameClock timeRemaining={isFlipped ? whiteClock : blackClock} isActive={game.turn() === (isFlipped ? 'w' : 'b')} />
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
             {isReviewMode && (
                <span style={{ background: 'var(--accent-primary)', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  ANALYSIS MODE
                </span>
             )}
             <span style={{ color: 'var(--foreground)', fontWeight: 'bold' }}>Opponent</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1rem', background: 'var(--board-border)' }}>
          <div style={{ width: '480px', height: '480px', position: 'relative', overflow: 'hidden' }}>
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
                    width: '60px', height: '60px', backgroundColor: bg, position: 'absolute',
                    top: visualR * 60, left: visualC * 60, display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  {((!isFlipped && c === 0) || (isFlipped && c === 7)) && <span style={{ position: 'absolute', top: 2, left: 2, fontSize: '10px', fontWeight: 'bold', color: isLight ? 'var(--board-dark)' : 'var(--board-light)', zIndex: 1 }}>{ranks[r]}</span>}
                  {((!isFlipped && r === 7) || (isFlipped && r === 0)) && <span style={{ position: 'absolute', bottom: 2, right: 2, fontSize: '10px', fontWeight: 'bold', color: isLight ? 'var(--board-dark)' : 'var(--board-light)', zIndex: 1 }}>{files[c]}</span>}
                  
                  {isLegalMove && !piece && <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--board-valid-move)', position: 'absolute', zIndex: 2 }} />}
                  {isLegalMove && piece && <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid var(--board-valid-move)', position: 'absolute', boxSizing: 'border-box', zIndex: 2 }} />}
                </div>
              );
            }))}

            {renderRows.map((r, visualR) => renderCols.map((c, visualC) => {
              const piece = viewGame.board()[r][c];
              if (!piece) return null;
              const square = getSquare(r, c);

              return (
                <div
                  key={`${square}-${piece.color}${piece.type}`}
                  draggable={!isReviewMode}
                  onDragStart={(e) => onDragStart(e, square)}
                  onDragOver={onDragOver}
                  onDrop={(e) => { e.stopPropagation(); onDrop(e, square); }}
                  onClick={(e) => { e.stopPropagation(); handleSquareClick(square); }}
                  style={{
                    position: 'absolute', top: visualR * 60, left: visualC * 60, width: '60px', height: '60px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '45px',
                    cursor: (!isReviewMode) ? 'grab' : 'default', userSelect: 'none',
                    color: piece.color === 'w' ? '#ffffff' : '#000000',
                    textShadow: piece.color === 'w' ? '0px 2px 4px rgba(0,0,0,0.8)' : '0px 2px 4px rgba(255,255,255,0.4)',
                    zIndex: 10
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
                  
                  const visualFromFile = isFlipped ? 7 - fromFile : fromFile;
                  const visualFromRank = isFlipped ? 7 - fromRank : fromRank;
                  const visualToFile = isFlipped ? 7 - toFile : toFile;
                  const visualToRank = isFlipped ? 7 - toRank : toRank;

                  const x1 = visualFromFile * 60 + 30;
                  const y1 = visualFromRank * 60 + 30;
                  const x2 = visualToFile * 60 + 30;
                  const y2 = visualToRank * 60 + 30;
                  
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
          <GameClock timeRemaining={isFlipped ? blackClock : whiteClock} isActive={game.turn() === (isFlipped ? 'b' : 'w')} />
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
             {isReviewMode && (
                <span style={{ padding: '0.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                   Eval: {evaluation > 0 ? '+' : ''}{evaluation.toFixed(2)}
                </span>
             )}
             <span style={{ color: 'var(--foreground)', fontWeight: 'bold' }}>You</span>
          </div>
        </div>
      </div>

      {/* Right Column: History & Controls */}
      <div className="chess-sidebar">
        <MoveHistory 
          moves={game.history()} 
          interactive={game.isGameOver() || !!gameOverMsg} 
          selectedIndex={reviewIndex === -1 ? historyMoves.length - 1 : reviewIndex - 1} 
          onSelect={(idx) => setReviewIndex(idx + 1)}
          onNav={handleNav}
        />
        
        {/* Controls and Chat Tabs Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', flex: 1 }}>
          <ChatBox gameId={gameId} connection={connection} />
          
          <GameControls 
            onResign={() => {
              ApiService.post('/api/game/resign', { gameId, playerId: localStorage.getItem('playerId') })
                .catch(console.error);
            }}
            onDraw={() => {
              ApiService.post('/api/game/draw', { gameId, playerId: localStorage.getItem('playerId') })
                .catch(console.error);
            }}
            onAbort={() => {
              ApiService.post('/api/game/abort', { gameId, playerId: localStorage.getItem('playerId') })
                .catch(console.error);
            }}
            onFlipBoard={() => setIsFlipped(f => !f)}
          />

          {(game.isGameOver() || gameOverMsg) && (
             <div style={{ marginTop: 'auto' }}>
               <GameAnalysis pgn={game.pgn()} />
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
