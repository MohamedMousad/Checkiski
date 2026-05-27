'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GameCreator from '../components/GameCreator';

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
      const token = localStorage.getItem('token');
      if (!username || !token) {
         router.push('/login');
         return;
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/game/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          hostUsername: username,
          colorChoice: colorChoice,
          rated: config.isRated,
          baseMinutes: timeControlObj.baseMinutes,
          incrementSeconds: timeControlObj.incrementSeconds,
          gameCategory: gameCategory
        })
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/play?gameId=${data.gameId}`);
      } else {
        const errorText = await res.text();
        console.error('Failed to create game:', res.status, errorText);
        alert(`Failed to create game: ${errorText}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error creating game');
    }
  };

  return (
    <main style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <div className="glass-panel" style={{ 
        padding: '3rem', 
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h1 className="text-gradient" style={{ 
          fontSize: '3.5rem', 
          marginBottom: '1rem',
          lineHeight: 1.2
        }}>
          Checkiski
        </h1>
        <p style={{ 
          fontSize: '1.125rem', 
          color: 'var(--foreground)',
          opacity: 0.8,
          marginBottom: '2.5rem',
          lineHeight: 1.6
        }}>
          Experience the next evolution of online chess. Real-time multiplayer, 
          powered by a modern engine, wrapped in a beautiful interface.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={() => setShowCreator(true)} className="btn-primary" style={{ fontSize: '1.125rem' }}>
            Play Online
          </button>
          <button onClick={() => router.push('/computer')} className="btn-primary" style={{ 
            fontSize: '1.125rem',
            background: 'var(--accent-secondary)'
          }}>
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
