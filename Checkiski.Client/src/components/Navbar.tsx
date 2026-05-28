'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    
    checkToken();
    window.addEventListener('storage', checkToken);
    window.addEventListener('auth-change', checkToken);
    
    return () => {
      window.removeEventListener('storage', checkToken);
      window.removeEventListener('auth-change', checkToken);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('playerId');
    localStorage.removeItem('username');
    window.dispatchEvent(new Event('auth-change'));
    router.push('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      background: 'var(--panel-bg)',
      borderBottom: '1px solid var(--panel-border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }}>
      <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', textDecoration: 'none' }}>
        <span className="text-hero">Checkiski</span>
      </Link>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Play</Link>
        <Link href="/lobby" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Lobby</Link>
        <Link href="/leaderboard" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Leaderboard</Link>
        
        {isLoggedIn ? (
          <>
            <Link href="/profile/me" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Profile</Link>
            <button onClick={handleLogout} style={{
              background: 'transparent', border: '1px solid #ff6b6b', color: '#ff6b6b',
              padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
            }}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
            <Link href="/register" style={{
              background: 'var(--accent-primary, #4caf50)', border: 'none', color: '#fff',
              padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'none'
            }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
