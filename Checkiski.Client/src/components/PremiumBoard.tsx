'use client';

import React, { useState, useCallback } from 'react';
import { Chess, Square } from 'chess.js';
import { BoardTheme, BOARD_THEMES, getThemeById, getSavedThemeId, saveThemeId } from '../lib/boardThemes';

interface PremiumBoardProps {
  game: Chess;
  isFlipped?: boolean;
  selectedSquare: Square | null;
  legalMoves: string[];
  isReviewMode?: boolean;
  bestMove?: string | null;
  historyMoves?: any[];
  reviewIndex?: number;
  onSquareClick: (square: Square) => void;
  onDragStart: (e: React.DragEvent, square: Square) => void;
  onDrop: (e: React.DragEvent, square: Square) => void;
  canDrag: (piece: { color: string; type: string }) => boolean;
  showThemeSelector?: boolean;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];
const SQ_SIZE = 64;
const BOARD_PX = SQ_SIZE * 8;

const getSquare = (r: number, c: number) => (FILES[c] + RANKS[r]) as Square;

export default function PremiumBoard({
  game,
  isFlipped = false,
  selectedSquare,
  legalMoves,
  isReviewMode = false,
  bestMove = null,
  historyMoves = [],
  reviewIndex = -1,
  onSquareClick,
  onDragStart,
  onDrop,
  canDrag,
  showThemeSelector = true,
}: PremiumBoardProps) {
  const [themeId, setThemeId] = useState(getSavedThemeId());
  const [showPicker, setShowPicker] = useState(false);
  const theme = getThemeById(themeId);

  const handleThemeChange = useCallback((id: string) => {
    setThemeId(id);
    saveThemeId(id);
    setShowPicker(false);
  }, []);

  const rows = isFlipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
  const cols = isFlipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  // Determine last move squares
  let lastFrom: string | null = null;
  let lastTo: string | null = null;
  if (isReviewMode && reviewIndex > 0 && historyMoves[reviewIndex - 1]) {
    lastFrom = historyMoves[reviewIndex - 1].from;
    lastTo = historyMoves[reviewIndex - 1].to;
  } else if (!isReviewMode && historyMoves.length > 0) {
    const lm = historyMoves[historyMoves.length - 1];
    if (lm) { lastFrom = lm.from; lastTo = lm.to; }
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Board Container with premium frame */}
      <div style={{
        padding: '6px',
        background: theme.boardBg,
        borderRadius: '6px',
        boxShadow: theme.boardShadow,
        position: 'relative',
        display: 'inline-block',
      }}>
        <div style={{
          width: `${BOARD_PX}px`,
          height: `${BOARD_PX}px`,
          position: 'relative',
          borderRadius: '2px',
          overflow: 'hidden',
        }}>
          {/* Squares Layer */}
          {rows.map((r, vr) => cols.map((c, vc) => {
            const sq = getSquare(r, c);
            const isLight = (r + c) % 2 === 0;
            const piece = game.board()[r][c];
            const isSelected = selectedSquare === sq;
            const isLegal = legalMoves.includes(sq);
            const isLastMove = sq === lastFrom || sq === lastTo;

            const baseBg = isLight ? theme.lightSquare : theme.darkSquare;

            return (
              <div
                key={sq}
                onClick={() => onSquareClick(sq)}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, sq)}
                style={{
                  position: 'absolute',
                  top: vr * SQ_SIZE,
                  left: vc * SQ_SIZE,
                  width: SQ_SIZE,
                  height: SQ_SIZE,
                  backgroundColor: baseBg,
                }}
              >
                {/* Selection overlay */}
                {isSelected && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundColor: theme.selectedSquare,
                  }} />
                )}

                {/* Last move highlight overlay */}
                {isLastMove && !isSelected && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundColor: isLight ? theme.lastMoveLight : theme.lastMoveDark,
                  }} />
                )}

                {/* Coordinate labels */}
                {((!isFlipped && c === 0) || (isFlipped && c === 7)) && (
                  <span style={{
                    position: 'absolute', top: 2, left: 3,
                    fontSize: '11px', fontWeight: 700, lineHeight: 1,
                    color: isLight ? theme.coordColorLight : theme.coordColorDark,
                    fontFamily: 'var(--font-display), sans-serif',
                    pointerEvents: 'none',
                  }}>
                    {RANKS[r]}
                  </span>
                )}
                {((!isFlipped && r === 7) || (isFlipped && r === 0)) && (
                  <span style={{
                    position: 'absolute', bottom: 1, right: 3,
                    fontSize: '11px', fontWeight: 700, lineHeight: 1,
                    color: isLight ? theme.coordColorLight : theme.coordColorDark,
                    fontFamily: 'var(--font-display), sans-serif',
                    pointerEvents: 'none',
                  }}>
                    {FILES[c]}
                  </span>
                )}

                {/* Valid move indicator - dot for empty, ring for capture */}
                {isLegal && !piece && (
                  <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: SQ_SIZE * 0.3,
                    height: SQ_SIZE * 0.3,
                    borderRadius: '50%',
                    backgroundColor: theme.validMoveColor,
                    pointerEvents: 'none',
                  }} />
                )}
                {isLegal && piece && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    borderRadius: '50%',
                    background: `radial-gradient(transparent 51%, ${theme.validMoveCaptureColor} 51%)`,
                    pointerEvents: 'none',
                  }} />
                )}
              </div>
            );
          }))}

          {/* Pieces Layer */}
          {rows.map((r, vr) => cols.map((c, vc) => {
            const piece = game.board()[r][c];
            if (!piece) return null;
            const sq = getSquare(r, c);
            const draggable = canDrag(piece);

            return (
              <div
                key={`piece-${sq}-${piece.color}${piece.type}`}
                draggable={draggable}
                onDragStart={(e) => onDragStart(e, sq)}
                onDragOver={onDragOver}
                onDrop={(e) => { e.stopPropagation(); onDrop(e, sq); }}
                onClick={(e) => { e.stopPropagation(); onSquareClick(sq); }}
                style={{
                  position: 'absolute',
                  top: vr * SQ_SIZE,
                  left: vc * SQ_SIZE,
                  width: SQ_SIZE,
                  height: SQ_SIZE,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: draggable ? 'grab' : 'default',
                  userSelect: 'none',
                  zIndex: 10,
                  transition: 'top 0.15s ease-out, left 0.15s ease-out',
                }}
              >
                <img
                  src={`/pieces/${theme.pieceSet}/${piece.color}${piece.type.toUpperCase()}.svg`}
                  alt={`${piece.color}${piece.type}`}
                  draggable={false}
                  style={{
                    width: SQ_SIZE - 4,
                    height: SQ_SIZE - 4,
                    pointerEvents: 'none',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                  }}
                />
              </div>
            );
          }))}

          {/* Best move arrow (analysis mode) */}
          {isReviewMode && bestMove && bestMove.length >= 4 && (() => {
            const ff = FILES.indexOf(bestMove[0]);
            const fr = RANKS.indexOf(bestMove[1]);
            const tf = FILES.indexOf(bestMove[2]);
            const tr = RANKS.indexOf(bestMove[3]);
            if (ff === -1 || fr === -1 || tf === -1 || tr === -1) return null;

            const vff = isFlipped ? 7 - ff : ff;
            const vfr = isFlipped ? 7 - fr : fr;
            const vtf = isFlipped ? 7 - tf : tf;
            const vtr = isFlipped ? 7 - tr : tr;

            const x1 = vff * SQ_SIZE + SQ_SIZE / 2;
            const y1 = vfr * SQ_SIZE + SQ_SIZE / 2;
            const x2 = vtf * SQ_SIZE + SQ_SIZE / 2;
            const y2 = vtr * SQ_SIZE + SQ_SIZE / 2;
            const angle = Math.atan2(y2 - y1, x2 - x1);
            const ax = x2 - Math.cos(angle) * 18;
            const ay = y2 - Math.sin(angle) * 18;

            return (
              <svg style={{
                position: 'absolute', top: 0, left: 0,
                width: BOARD_PX, height: BOARD_PX,
                zIndex: 20, pointerEvents: 'none',
              }}>
                <defs>
                  <marker id="prem-arrow" markerWidth="5" markerHeight="5" refX="3" refY="2.5" orient="auto">
                    <path d="M0,0 L0,5 L5,2.5 z" fill="rgba(46,170,80,0.85)" />
                  </marker>
                  <filter id="arrow-glow">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <line
                  x1={x1} y1={y1} x2={ax} y2={ay}
                  stroke="rgba(46,170,80,0.85)" strokeWidth="10"
                  markerEnd="url(#prem-arrow)" strokeLinecap="round"
                  filter="url(#arrow-glow)"
                />
              </svg>
            );
          })()}
        </div>
      </div>

      {/* Theme Selector */}
      {showThemeSelector && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: '12px', gap: '8px', position: 'relative',
        }}>
          <button
            onClick={() => setShowPicker(!showPicker)}
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '6px 16px',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-display), sans-serif',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.12)';
              (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
              (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            {theme.name}
          </button>

          {showPicker && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              marginBottom: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(20,20,25,0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              gap: '8px',
              zIndex: 100,
              boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
            }}>
              {BOARD_THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleThemeChange(t.id)}
                  title={t.name}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    border: t.id === themeId ? '2px solid rgba(46,204,113,0.8)' : '2px solid transparent',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gridTemplateRows: '1fr 1fr',
                    padding: 0,
                    transition: 'border-color 0.2s, transform 0.2s',
                    transform: t.id === themeId ? 'scale(1.1)' : 'scale(1)',
                  }}
                  onMouseEnter={e => {
                    if (t.id !== themeId) (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={e => {
                    if (t.id !== themeId) (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                  }}
                >
                  <div style={{ backgroundColor: t.lightSquare }} />
                  <div style={{ backgroundColor: t.darkSquare }} />
                  <div style={{ backgroundColor: t.darkSquare }} />
                  <div style={{ backgroundColor: t.lightSquare }} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
