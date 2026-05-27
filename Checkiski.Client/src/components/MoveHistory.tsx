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

  return (
    <div className="glass-panel" style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '0.75rem',
        borderBottom: '1px solid var(--panel-border)',
        fontWeight: 'bold',
        textAlign: 'center',
        background: 'rgba(0,0,0,0.2)',
        fontSize: '1.1rem'
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
          <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
            No moves yet
          </div>
        )}
        {groupedMoves.map((turn, idx) => (
          <div key={turn.index} style={{ 
            display: 'flex', 
            background: idx % 2 === 0 ? 'rgba(0,0,0,0.1)' : 'transparent',
          }}>
            <div style={{ 
              width: '40px', 
              padding: '0.25rem 0.5rem', 
              color: '#888',
              background: 'rgba(0,0,0,0.2)',
              textAlign: 'center'
            }}>
              {turn.index}.
            </div>
            
            <div 
              onClick={() => interactive && onSelect?.(turn.whiteIdx)}
              style={{ 
                flex: 1, 
                padding: '0.25rem 0.75rem',
                cursor: interactive ? 'pointer' : 'default',
                fontWeight: 'bold',
                background: activeIdx === turn.whiteIdx ? 'var(--board-highlight)' : 'transparent',
                color: activeIdx === turn.whiteIdx ? '#000' : 'var(--foreground)'
              }}
            >
              {turn.white}
            </div>
            
            <div 
              onClick={() => interactive && turn.black && onSelect?.(turn.blackIdx)}
              style={{ 
                flex: 1, 
                padding: '0.25rem 0.75rem',
                cursor: (interactive && turn.black) ? 'pointer' : 'default',
                fontWeight: 'bold',
                background: activeIdx === turn.blackIdx ? 'var(--board-highlight)' : 'transparent',
                color: activeIdx === turn.blackIdx ? '#000' : 'var(--foreground)'
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
          background: 'rgba(0,0,0,0.2)'
        }}>
          <button 
            type="button"
            onClick={() => onNav?.('start')}
            style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: 'none', borderRight: '1px solid var(--panel-border)', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
            Start
          </button>
          <button 
            type="button"
            onClick={() => onNav?.('prev')}
            style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: 'none', borderRight: '1px solid var(--panel-border)', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
            Prev
          </button>
          <button 
            type="button"
            onClick={() => onNav?.('next')}
            style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: 'none', borderRight: '1px solid var(--panel-border)', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
            Next
          </button>
          <button 
            type="button"
            onClick={() => onNav?.('end')}
            style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
            End
          </button>
        </div>
      )}
    </div>
  );
}
