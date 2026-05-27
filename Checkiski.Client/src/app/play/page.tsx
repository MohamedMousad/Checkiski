/* eslint-disable */
'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ChessBoard from '../../components/ChessBoard';

function PlayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameId = searchParams.get('gameId');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else if (!gameId) {
      router.push('/');
    } else {
      setIsAuthenticated(true);
    }
  }, [router, gameId]);

  if (!isAuthenticated || !gameId) return null; // or loading spinner

  return (
    <div style={{ width: '100%' }}>
      <ChessBoard gameId={gameId} />
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '5rem', color: '#fff' }}>Loading match...</div>}>
      <PlayContent />
    </Suspense>
  );
}
