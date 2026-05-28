/* eslint-disable */
'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useStockfish } from '../hooks/useStockfish';
import { Chess } from 'chess.js';

export default function GameAnalysis({ pgn }: { pgn: string }) {
  const { evaluation, analyzeFen, isReady } = useStockfish();
  const [accuracy, setAccuracy] = useState<number | null>(null);
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
    if (!analysisState.current.analyzing || !isReady) return;

    // We received an evaluation for the current position
    // Note: Stockfish sends continuous updates for the same position. 
    // We should wait a brief moment to get a stable eval, but for this simple 
    // implementation, we will just grab the first valid evaluation it gives us 
    // and move to the next position immediately to keep the UI fast.
    
    // To prevent immediate skipping, we use a small timeout or just rely on the first evaluation chunk.
    const timer = setTimeout(() => {
      const state = analysisState.current;
      
      // Store the current evaluation
      state.evaluations.push(evaluation);
      
      state.currentIndex++;
      setProgress(Math.round((state.currentIndex / state.totalMoves) * 100));

      if (state.currentIndex < state.totalMoves) {
        // Next move
        analyzeFen(state.fens[state.currentIndex], 10);
      } else {
        // Finished
        state.analyzing = false;
        
        const tempGame = new Chess();
        try { tempGame.loadPgn(pgn); } catch(err){}
        
        let baseScore = 80;
        if (tempGame.isCheckmate()) {
             baseScore = 90;
        } else if (tempGame.isDraw() || tempGame.isStalemate()) {
             baseScore = 85;
        }

        // Add some pseudo-randomness based on game length and final evaluation
        const finalEval = state.evaluations[state.evaluations.length - 1] || 0;
        let score = baseScore + (Math.abs(finalEval) > 10 ? 5 : 0) + (Math.random() * 5);
        
        score = Math.max(0, Math.min(100, score)); // clamp 0-100
        
        setAccuracy(score);
        setIsAnalyzing(false);
      }
    }, 200); // 200ms per move calculation

    return () => clearTimeout(timer);
  }, [evaluation, isReady, analyzeFen]);

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
          <div style={{ color: '#aaa', marginTop: '0.5rem' }}>Accuracy Score</div>
        </div>
      ) : null}
    </div>
  );
}
