'use client';
import React, { useEffect, useRef } from 'react';

interface MoveHistoryProps {
  moves: string[];
  selectedIndex?: number;
  onSelect?: (index: number) => void;
  onNav?: (dir: 'start' | 'prev' | 'next' | 'end') => void;
  interactive?: boolean;
}

export default function MoveHistory({ moves, selectedIndex = -1, onSelect, onNav, interactive = false }: MoveHistoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom if following live game
  useEffect(() => {
    if (scrollRef.current && (!interactive || selectedIndex === moves.length - 1 || selectedIndex === -1)) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moves, selectedIndex, interactive]);

  const groupedMoves: { index: number, white: string, black: string | null, whiteIdx: number, blackIdx: number }[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    groupedMoves.push({
      index: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1] || null,
      whiteIdx: i,
      blackIdx: i + 1
    });
  }

  const activeIdx = selectedIndex === -1 ? moves.length - 1 : selectedIndex;

  const navBtnStyle: React.CSSProperties = {
    flex: 1,
    padding: '10px',
    background: 'transparent',
    border: 'none',
    borderRight: '1px solid var(--panel-border)',
    color: 'var(--color-text-dim)',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    fontWeight: 500,
    fontSize: '0.8rem',
    transition: 'all 0.2s ease',
    letterSpacing: '0.02em',
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: 'var(--panel-bg)',
      border: '1px solid var(--panel-border)',
      borderRadius: 'var(--radius-md)',
    }}>
      <div style={{
        padding: '12px',
        borderBottom: '1px solid var(--panel-border)',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: '0.85rem',
        textAlign: 'center',
        color: 'var(--color-text)',
        letterSpacing: '0.02em',
      }}>
        Move History
      </div>
      
      <div ref={scrollRef} style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {groupedMoves.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-2xl)',
            color: 'var(--color-text-faint)',
            fontStyle: 'italic',
            fontSize: '0.85rem',
          }}>
            No moves yet
          </div>
        )}
        {groupedMoves.map((turn, idx) => (
          <div key={turn.index} style={{ 
            display: 'flex', 
            background: idx % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
          }}>
            <div style={{ 
              width: '36px', 
              padding: '4px 8px', 
              color: 'var(--color-text-faint)',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {turn.index}.
            </div>
            
            <div 
              onClick={() => interactive && onSelect?.(turn.whiteIdx)}
              style={{ 
                flex: 1, 
                padding: '4px 10px',
                cursor: interactive ? 'pointer' : 'default',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                background: activeIdx === turn.whiteIdx ? 'var(--color-emerald-deep)' : 'transparent',
                color: activeIdx === turn.whiteIdx ? 'var(--color-emerald)' : 'var(--color-text)',
                borderRadius: activeIdx === turn.whiteIdx ? '3px' : '0',
                transition: 'background 0.15s ease',
              }}
            >
              {turn.white}
            </div>
            
            <div 
              onClick={() => interactive && turn.black && onSelect?.(turn.blackIdx)}
              style={{ 
                flex: 1, 
                padding: '4px 10px',
                cursor: (interactive && turn.black) ? 'pointer' : 'default',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                background: activeIdx === turn.blackIdx ? 'var(--color-emerald-deep)' : 'transparent',
                color: activeIdx === turn.blackIdx ? 'var(--color-emerald)' : 'var(--color-text)',
                borderRadius: activeIdx === turn.blackIdx ? '3px' : '0',
                transition: 'background 0.15s ease',
              }}
            >
              {turn.black || ''}
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Controls */}
      {interactive && (
        <div style={{ 
          display: 'flex', 
          borderTop: '1px solid var(--panel-border)',
        }}>
          <button type="button" onClick={() => onNav?.('start')}
            style={navBtnStyle}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-dim)'}
          >⏮</button>
          <button type="button" onClick={() => onNav?.('prev')}
            style={navBtnStyle}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-dim)'}
          >◀</button>
          <button type="button" onClick={() => onNav?.('next')}
            style={navBtnStyle}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-dim)'}
          >▶</button>
          <button type="button" onClick={() => onNav?.('end')}
            style={{ ...navBtnStyle, borderRight: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-dim)'}
          >⏭</button>
        </div>
      )}
    </div>
  );
}
