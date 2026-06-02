'use client';
/* eslint-disable */
import React, { useEffect, useState } from 'react';

export default function GameClock({ timeRemaining, isActive, onTimeout }: { timeRemaining: number, isActive: boolean, onTimeout?: () => void }) {
  const [time, setTime] = useState(timeRemaining);

  useEffect(() => {
    setTime(timeRemaining);
  }, [timeRemaining]);

  useEffect(() => {
    if (!isActive) return;
    if (time <= 0) {
      if (onTimeout) onTimeout();
      return;
    }

    const interval = setInterval(() => {
      setTime(t => Math.max(0, t - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, time, onTimeout]);

  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const isLowTime = time < 30;
  const isCritical = time < 10;

  return (
    <div style={{
      padding: '10px 20px',
      borderRadius: 'var(--radius-sm)',
      fontSize: '2rem',
      fontFamily: 'var(--font-mono)',
      fontWeight: 'bold',
      background: isActive ? 'rgba(46,204,113,0.08)' : 'rgba(255,255,255,0.02)',
      color: isCritical ? 'var(--color-danger)' : isLowTime ? '#ff9800' : 'var(--color-text)',
      display: 'inline-block',
      border: isActive
        ? '1px solid var(--color-emerald-dim)'
        : '1px solid var(--panel-border)',
      transition: 'all 0.3s ease',
      minWidth: '130px',
      textAlign: 'center',
      boxShadow: isActive ? '0 0 15px rgba(46,204,113,0.15)' : 'none',
      animation: isCritical && isActive ? 'glowPulse 1s ease-in-out infinite' : 'none',
      letterSpacing: '0.05em',
    }}>
      {formattedTime}
    </div>
  );
}
