'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GameCreator from '../components/GameCreator';

import { ApiService } from '../services/api';

export default function Home() {
  const [showCreator, setShowCreator] = useState(false);
  const router = useRouter();

  const handleCreateGame = async (config: any) => {
    setShowCreator(false);
    
    let colorChoice = 2; // Random/None
    if (config.color === 'white') colorChoice = 1;
    if (config.color === 'black') colorChoice = 0;

    let timeControlObj = { baseMinutes: 3, incrementSeconds: 0 };
    let gameCategory = 1; // Blitz
    if (config.timeControl === 'bullet') { timeControlObj = { baseMinutes: 1, incrementSeconds: 0 }; gameCategory = 0; }
    if (config.timeControl === 'rapid') { timeControlObj = { baseMinutes: 10, incrementSeconds: 0 }; gameCategory = 2; }
    if (config.timeControl === 'classical') { timeControlObj = { baseMinutes: 30, incrementSeconds: 0 }; gameCategory = 3; }

    try {
      const username = localStorage.getItem('username');
      if (!username) {
         router.push('/login');
         return;
      }
      
      const data = await ApiService.post<{gameId: string}>('/api/game/create', {
        hostUsername: username,
        colorChoice: colorChoice,
        rated: config.isRated,
        baseMinutes: timeControlObj.baseMinutes,
        incrementSeconds: timeControlObj.incrementSeconds,
        gameCategory: gameCategory
      });

      router.push(`/play?gameId=${data.gameId}`);
    } catch (err: any) {
      console.error('Failed to create game:', err);
      alert(`Failed to create game: ${err.message}`);
    }
  };

  return (
    <main style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '2rem',
      position: 'relative'
    }}>
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-stagger-1 { animation: slideUpFade 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-stagger-2 { animation: slideUpFade 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s forwards; opacity: 0; }
        .animate-stagger-3 { animation: slideUpFade 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s forwards; opacity: 0; }
        .animate-stagger-4 { animation: slideUpFade 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s forwards; opacity: 0; }
      `}</style>
      
      <div className="glass-panel animate-stagger-1" style={{ 
        padding: '4rem 3rem', 
        textAlign: 'center',
        maxWidth: '680px',
        width: '100%',
        position: 'relative',
        zIndex: 10
      }}>
        <h1 className="text-hero animate-stagger-2" style={{ 
          fontSize: 'clamp(3rem, 8vw, 4.5rem)', 
          marginBottom: '1rem',
          lineHeight: 1.1,
          marginTop: 0
        }}>
          Checkiski
        </h1>
        <p className="animate-stagger-3" style={{ 
          fontSize: '1.25rem', 
          color: 'oklch(0.85 0.01 var(--bg-h))',
          marginBottom: '3rem',
          lineHeight: 1.6,
          fontWeight: 300
        }}>
          Experience the next evolution of online chess. Real-time multiplayer, 
          powered by a modern engine, wrapped in a beautiful interface.
        </p>
        
        <div className="animate-stagger-4" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setShowCreator(true)} className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.2rem' }}>
            Play Online
          </button>
          <button onClick={() => router.push('/computer')} className="btn-secondary" style={{ padding: '16px 36px', fontSize: '1.2rem' }}>
            Play Computer
          </button>
        </div>
      </div>

      {showCreator && (
        <GameCreator 
          onCreate={handleCreateGame} 
          onClose={() => setShowCreator(false)} 
        />
      )}
    </main>
  );
}
