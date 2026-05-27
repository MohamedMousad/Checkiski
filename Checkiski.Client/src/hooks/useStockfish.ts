import { useState, useEffect, useRef, useCallback } from 'react';

export function useStockfish() {
  const workerRef = useRef<Worker | null>(null);
  const [evaluation, setEvaluation] = useState<number>(0);
  const [bestMove, setBestMove] = useState<string>('');
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    // Initialize Web Worker
    if (typeof window !== 'undefined') {
      workerRef.current = new Worker('/stockfish.js');
      
      workerRef.current.onmessage = (event) => {
        const msg = event.data;
        if (msg === 'uciok') {
          setIsReady(true);
        } else if (msg.startsWith('info depth')) {
          // Parse evaluation
          const scoreMatch = msg.match(/score cp (-?\d+)/);
          if (scoreMatch) {
            const cp = parseInt(scoreMatch[1], 10);
            setEvaluation(cp / 100.0); // Convert centipawns to pawns
          }
          const mateMatch = msg.match(/score mate (-?\d+)/);
          if (mateMatch) {
            const movesToMate = parseInt(mateMatch[1], 10);
            // High number represents mate. 100 pawns = mate.
            setEvaluation(movesToMate > 0 ? 100 : -100); 
          }
        } else if (msg.startsWith('bestmove')) {
          const parts = msg.split(' ');
          if (parts.length > 1) {
            setBestMove(parts[1]);
          }
        }
      };

      workerRef.current.postMessage('uci');
    }

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const analyzeFen = useCallback((fen: string, depth: number = 15) => {
    if (workerRef.current && isReady) {
      setBestMove(''); // Clear old best move
      workerRef.current.postMessage('stop');
      workerRef.current.postMessage(`position fen ${fen}`);
      workerRef.current.postMessage(`go depth ${depth}`);
    }
  }, [isReady]);

  return { evaluation, bestMove, analyzeFen, isReady };
}
