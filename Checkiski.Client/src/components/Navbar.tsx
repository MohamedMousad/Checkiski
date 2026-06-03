'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkToken = () => setIsLoggedIn(!!localStorage.getItem('token'));
    checkToken();
    window.addEventListener('storage', checkToken);
    window.addEventListener('auth-change', checkToken);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('storage', checkToken);
      window.removeEventListener('auth-change', checkToken);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  useEffect(() => setMobileOpen(false), [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('playerId');
    localStorage.removeItem('username');
    window.dispatchEvent(new Event('auth-change'));
    router.push('/login');
  };

  const navLinks = [
    { href: '/', label: 'Play' },
    { href: '/lobby', label: 'Lobby' },
    { href: '/leaderboard', label: 'Rankings' },
    { href: '/puzzles', label: 'Puzzles' },
    { href: '/computer', label: 'Engine' },
  ];

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: '0 3rem',
      height: scrolled ? '64px' : '72px',
      background: scrolled ? 'rgba(3, 3, 5, 0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(24px) saturate(150%)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(150%)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid transparent',
      transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      {/* Logo */}
      <Link href="/" style={{
        fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600,
        letterSpacing: '0.05em', color: 'var(--text-primary)', textDecoration: 'none',
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        transition: 'color 0.3s ease', fontVariant: 'small-caps',
      }}>
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="url(#navLogo)"/>
          <path d="M16 6L18.5 11H13.5L16 6ZM12 13H20V15H18V18H20V20H22V24H10V20H12V18H14V15H12V13Z" fill="#030305" opacity="0.95"/>
          <defs><linearGradient id="navLogo" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#D9F845"/><stop offset="1" stopColor="#A3C02B"/></linearGradient></defs>
        </svg>
        Checkiski
      </Link>

      {/* Desktop Nav */}
      <div className="nav-desktop" style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} style={{
            position: 'relative', padding: '8px 16px',
            color: isActive(link.href) ? 'var(--accent-blue)' : 'var(--text-muted)',
            textDecoration: 'none', fontFamily: 'var(--font-body)',
            fontWeight: isActive(link.href) ? 700 : 500, fontSize: '0.85rem',
            letterSpacing: '0.02em', transition: 'all 0.2s ease',
            borderRadius: 'var(--radius-sm)',
          }}
          onMouseEnter={(e) => { if (!isActive(link.href)) { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--input-bg)'; } }}
          onMouseLeave={(e) => { if (!isActive(link.href)) { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; } }}
          >
            {link.label}
            {isActive(link.href) && (
              <span style={{
                position: 'absolute', bottom: '0px', left: '16px', right: '16px',
                height: '2px', background: 'var(--accent-blue)',
                borderRadius: '1px', boxShadow: '0 0 8px var(--accent-blue-glow)',
              }} />
            )}
          </Link>
        ))}

        <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 1rem' }} />

        {isLoggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Link href="/profile/me" style={{
              padding: '8px 14px', color: 'var(--text-muted)', textDecoration: 'none',
              fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.85rem',
              transition: 'color 0.2s ease', borderRadius: 'var(--radius-sm)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >Profile</Link>
            <button onClick={handleLogout} className="btn-danger" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>Logout</button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Link href="/login" className="nav-link" style={{ fontSize: '0.85rem' }}>
              <span>Sign In</span>
            </Link>
            <Link href="/register" className="btn-primary" style={{
              padding: '8px 22px', fontSize: '0.8rem', textDecoration: 'none',
            }}>
              <span>Register</span>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div style={{ display: 'none' }} className="nav-mobile-controls">
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '8px', display: 'flex', flexDirection: 'column', gap: '5px',
        }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block', width: '22px', height: '2px',
              background: 'var(--text-primary)', transition: 'all 0.3s ease',
              transform: mobileOpen ? (i === 0 ? 'rotate(45deg) translate(3px,3px)' : i === 2 ? 'rotate(-45deg) translate(3px,-3px)' : 'none') : 'none',
              opacity: mobileOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'var(--nav-bg-scroll)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)', padding: 'var(--space-lg)',
          display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)',
          animation: 'fadeIn 0.2s ease forwards',
        }}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} style={{
              padding: '12px 16px',
              color: isActive(link.href) ? 'var(--accent-blue)' : 'var(--text-muted)',
              textDecoration: 'none', fontFamily: 'var(--font-body)',
              fontWeight: 500, fontSize: '1rem', borderRadius: 'var(--radius-sm)',
              background: isActive(link.href) ? 'var(--accent-blue-mist)' : 'transparent',
            }}>{link.label}</Link>
          ))}
          <div style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }} />
          {isLoggedIn ? (
            <>
              <Link href="/profile/me" style={{ padding: '12px 16px', color: 'var(--text-muted)', textDecoration: 'none' }}>Profile</Link>
              <button onClick={handleLogout} className="btn-danger" style={{ width: '100%', justifyContent: 'center' }}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ padding: '12px 16px', color: 'var(--text-muted)', textDecoration: 'none' }}>Login</Link>
              <Link href="/register" className="btn-primary" style={{ textDecoration: 'none', justifyContent: 'center', width: '100%' }}>Register</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-controls { display: flex !important; gap: 8px; align-items: center; }
        }
      `}</style>
    </nav>
  );
}
