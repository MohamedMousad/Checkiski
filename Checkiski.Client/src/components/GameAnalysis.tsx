/* eslint-disable */
'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useStockfish } from '../hooks/useStockfish';
import { Chess } from 'chess.js';

export default function GameAnalysis({ pgn }: { pgn: string }) {
  const { evaluation, bestMove, analyzeFen, isReady } = useStockfish();
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [classifications, setClassifications] = useState({
    excellent: 0,
    good: 0,
    inaccuracy: 0,
    mistake: 0,
    blunder: 0
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Use a ref to track analysis state across renders without triggering useEffect again
  const analysisState = useRef({
    analyzing: false,
    fens: [] as string[],
    currentIndex: 0,
    evaluations: [] as number[],
    totalMoves: 0
  });

  useEffect(() => {
    if (!pgn || !isReady || analysisState.current.analyzing) return;
    
    // Start Analysis
    analysisState.current.analyzing = true;
    setIsAnalyzing(true);
    
    const game = new Chess();
    try {
      game.loadPgn(pgn);
    } catch (e) {
      console.error("Invalid PGN for analysis", e);

      setAccuracy(0);

      setIsAnalyzing(false);
      return;
    }

    const history = game.history({ verbose: true }) as any[];
    const fens = [history.length > 0 ? history[0].before : game.fen()]; // initial position

    for (const move of history) {
      fens.push(move.after);
    }

    analysisState.current.fens = fens;
    analysisState.current.totalMoves = fens.length;
    analysisState.current.currentIndex = 0;
    analysisState.current.evaluations = [];
    
    // Start analyzing first position
    analyzeFen(fens[0], 10); // using depth 10 for speed
    
  }, [pgn, isReady, analyzeFen]);

  // Effect to process the evaluation updates
  useEffect(() => {
    if (!analysisState.current.analyzing || !isReady || !bestMove) return;

    const state = analysisState.current;
    
    // Store the current evaluation
    state.evaluations.push(evaluation);
    
    state.currentIndex++;
    setProgress(Math.round((state.currentIndex / state.totalMoves) * 100));

    const processNext = () => {
      if (state.currentIndex < state.totalMoves) {
        const nextFen = state.fens[state.currentIndex];
        const tempGame = new Chess(nextFen);
        if (tempGame.isGameOver()) {
          state.evaluations.push(tempGame.isCheckmate() ? (tempGame.turn() === 'w' ? -100 : 100) : 0);
          state.currentIndex++;
          setProgress(Math.round((state.currentIndex / state.totalMoves) * 100));
          processNext();
        } else {
          analyzeFen(nextFen, 10);
        }
      } else {
        // Finished
        state.analyzing = false;
        
        let excellent = 0;
        let good = 0;
        let inaccuracy = 0;
        let mistake = 0;
        let blunder = 0;
        
        let totalLoss = 0;

        for (let i = 1; i < state.evaluations.length; i++) {
          const prevFen = state.fens[i - 1];
          const currFen = state.fens[i];
          
          const prevIsWhite = prevFen.includes(' w ');
          const currIsWhite = currFen.includes(' w ');
          
          // Stockfish score is from perspective of side to move. We convert to absolute (White's advantage).
          const prevAbs = prevIsWhite ? state.evaluations[i - 1] : -state.evaluations[i - 1];
          const currAbs = currIsWhite ? state.evaluations[i] : -state.evaluations[i];
          
          // diff > 0 means the player who moved gained an advantage. diff < 0 means they lost an advantage.
          const diff = prevIsWhite ? (currAbs - prevAbs) : (prevAbs - currAbs);
          
          if (diff > 0.5) excellent++;
          else if (diff > -0.5) good++;
          else if (diff > -1.0) inaccuracy++;
          else if (diff > -2.0) mistake++;
          else blunder++;

          if (diff < 0) totalLoss += Math.abs(diff);
        }

        const avgLoss = (state.totalMoves > 0) ? (totalLoss / state.totalMoves) : 0;
        let accuracyScore = 100 - (avgLoss * 15); // Scale loss to percentage
        accuracyScore = Math.max(0, Math.min(100, accuracyScore));
        
        setClassifications({ excellent, good, inaccuracy, mistake, blunder });
        setAccuracy(accuracyScore);
        setIsAnalyzing(false);
      }
    };

    processNext();
  }, [bestMove, isReady, analyzeFen, evaluation]);

  if (!pgn) return null;

  return (
    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderRadius: '12px' }}>
      <h2 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Post-Game Analysis</h2>
      
      {isAnalyzing ? (
        <div>
          <div style={{ color: 'var(--accent-secondary)', marginBottom: '1rem' }}>
            Stockfish is analyzing your game... {progress}%
          </div>
          <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
             <div style={{ 
               width: '100%', height: '100%', background: 'var(--accent-primary)',
               transform: `scaleX(${progress / 100})`, transformOrigin: 'left',
               transition: 'transform 0.2s ease'
             }} />
          </div>
        </div>
      ) : accuracy !== null ? (
        <div>
          <div style={{ fontSize: '4rem', fontWeight: 'bold', color: accuracy > 85 ? '#4caf50' : accuracy > 60 ? 'var(--accent-primary)' : '#ff9800' }}>
            {accuracy.toFixed(1)}%
          </div>
          <div style={{ color: '#aaa', marginTop: '0.5rem', marginBottom: '1.5rem' }}>Accuracy Score</div>
          <div style={{ display: 'flex', justifyContent: 'space-around', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.9rem' }}>
             <div style={{ color: '#4caf50' }}><strong>{classifications.excellent}</strong> Excellent</div>
             <div style={{ color: '#81c784' }}><strong>{classifications.good}</strong> Good</div>
             <div style={{ color: '#ffb74d' }}><strong>{classifications.inaccuracy}</strong> Inaccuracies</div>
             <div style={{ color: '#ff9800' }}><strong>{classifications.mistake}</strong> Mistakes</div>
             <div style={{ color: '#f44336' }}><strong>{classifications.blunder}</strong> Blunders</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
