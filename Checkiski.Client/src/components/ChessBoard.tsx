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

  const [whitePlayerId, setWhitePlayerId] = useState<string | null>(null);
  const [blackPlayerId, setBlackPlayerId] = useState<string | null>(null);
  const [whitePlayerName, setWhitePlayerName] = useState<string>('Opponent');
  const [blackPlayerName, setBlackPlayerName] = useState<string>('Opponent');
  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('playerId') : null;
  const currentUsername = typeof window !== 'undefined' ? localStorage.getItem('username') : 'You';

  const loadGameState = () => {
    ApiService.get<any>(`/api/game/${gameId}`)
    .then(data => {
      const parseTs = (ts: string) => {
        if (!ts) return 300;
        const parts = ts.split(':');
        return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseFloat(parts[2]);
      };
      setWhiteClock(parseTs(data.whiteClockRemaining));
      setBlackClock(parseTs(data.blackClockRemaining));
      setWhitePlayerId(data.whitePlayerId);
      setBlackPlayerId(data.blackPlayerId);
      if (data.whitePlayerName) setWhitePlayerName(data.whitePlayerName);
      if (data.blackPlayerName) setBlackPlayerName(data.blackPlayerName);
      if (data.blackPlayerId && data.blackPlayerId === currentUserId) {
         setIsFlipped(true);
      }
      if (data.pgn) {
        setGame(prev => {
          const newGame = new Chess();
          newGame.loadPgn(data.pgn);
          return newGame;
        });
      }
    })
    .catch(err => console.error("Failed to load initial game state", err));
  };

  // Fetch initial game state
  useEffect(() => {
    loadGameState();
  }, [gameId]);

  const handleJoinGame = async () => {
    try {
      const username = localStorage.getItem('username');
      if (!username) {
        alert("Please log in first!");
        return;
      }
      await ApiService.post('/api/game/join', { gameId, username });
      loadGameState();
    } catch (err: any) {
      alert(`Failed to join: ${err.message || 'Unknown error'}`);
    }
  };

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
        
        // Convert 'e2' to fromX=4, fromY=1
        const files = 'abcdefgh';
        const fromX = files.indexOf(result.from[0]);
        const fromY = parseInt(result.from[1]) - 1;
        const toX = files.indexOf(result.to[0]);
        const toY = parseInt(result.to[1]) - 1;
        const promotion = result.promotion || null;

        ApiService.post('/api/game/move', { 
          gameId, 
          playerId: localStorage.getItem('playerId'),
          fromX, fromY, toX, toY, promotion
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
             <span style={{ color: 'var(--foreground)', fontWeight: 'bold' }}>
               {isFlipped ? whitePlayerName : blackPlayerName}
             </span>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          {(!whitePlayerId || !blackPlayerId) && currentUserId !== whitePlayerId && currentUserId !== blackPlayerId && !gameOverMsg && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 30,
              backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '6px'
            }}>
              <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Opponent Wanted</h3>
                <button onClick={handleJoinGame} className="btn-primary" style={{ padding: '12px 24px', fontSize: '1.1rem' }}>
                  Join Match
                </button>
              </div>
            </div>
          )}
          <PremiumBoard
            game={viewGame}
            isFlipped={isFlipped}
          selectedSquare={selectedSquare}
          legalMoves={legalMoves}
          isReviewMode={isReviewMode}
          bestMove={bestMove}
          historyMoves={historyMoves}
          reviewIndex={reviewIndex}
          onSquareClick={handleSquareClick}
          onDragStart={onDragStart}
          onDrop={onDrop}
          canDrag={(piece) => !isReviewMode && piece.color === game.turn() && game.turn() === (isFlipped ? 'b' : 'w')}
        />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <GameClock timeRemaining={isFlipped ? blackClock : whiteClock} isActive={game.turn() === (isFlipped ? 'b' : 'w')} />
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
             {isReviewMode && (
                <span style={{ padding: '0.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                   Eval: {evaluation > 0 ? '+' : ''}{evaluation.toFixed(2)}
                </span>
             )}
             <span style={{ color: 'var(--foreground)', fontWeight: 'bold' }}>
               {isFlipped ? blackPlayerName : whitePlayerName} (You)
             </span>
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
