'use client';
/* eslint-disable */
import React, { useEffect, useState } from 'react';

export default function GameClock({ timeRemaining, isActive }: { timeRemaining: number, isActive: boolean }) {
  // timeRemaining in seconds
  const [time, setTime] = useState(timeRemaining);

  useEffect(() => {
    setTime(timeRemaining);
  }, [timeRemaining]);

  useEffect(() => {
    if (!isActive || time <= 0) return;

    const interval = setInterval(() => {
      setTime(t => Math.max(0, t - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const mins = Math.floor(time / 60);
  const secs = time % 60;
  
  const formattedTime = `${mins}:${secs.toString().padStart(2, '0')}`;
  
  const isLowTime = time < 30;

  return (
    <div className="glass-panel" style={{
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      fontSize: '2.5rem',
      fontFamily: 'monospace',
      fontWeight: 'bold',
      backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.3)',
      color: isLowTime ? '#ff4444' : '#ffffff',
      display: 'inline-block',
      boxShadow: isActive ? '0 0 10px rgba(255,255,255,0.2)' : 'none',
      border: '1px solid rgba(255,255,255,0.1)',
      transition: 'all 0.3s ease',
      minWidth: '150px',
      textAlign: 'center'
    }}>
      {formattedTime}
    </div>
  );
}
