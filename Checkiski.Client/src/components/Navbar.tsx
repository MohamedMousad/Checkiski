'use client';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkToken();
    window.addEventListener('storage', checkToken);
    window.addEventListener('auth-change', checkToken);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('storage', checkToken);
      window.removeEventListener('auth-change', checkToken);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? '0.6rem 2rem' : '1rem 2rem',
        background: scrolled
          ? 'rgba(5, 5, 7, 0.85)'
          : 'rgba(5, 5, 7, 0.4)',
        backdropFilter: 'blur(20px) saturate(150%)',
        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
        borderBottom: scrolled
          ? '1px solid rgba(255,255,255,0.06)'
          : '1px solid transparent',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {/* Logo */}
      <Link href="/" style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.3rem',
        fontWeight: 800,
        letterSpacing: '-0.02em',
        color: 'var(--color-text)',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'color 0.3s ease',
      }}>
        <span style={{
          width: '28px',
          height: '28px',
          background: 'linear-gradient(135deg, var(--color-emerald), var(--color-emerald-dim))',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.85rem',
          boxShadow: '0 0 15px rgba(46,204,113,0.3)',
        }}>♔</span>
        Checkiski
      </Link>

      {/* Desktop Nav */}
      <div style={{
        display: 'flex',
        gap: '0.25rem',
        alignItems: 'center',
      }}
      className="nav-desktop"
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              position: 'relative',
              padding: '8px 16px',
              color: isActive(link.href) ? 'var(--color-emerald)' : 'var(--color-text-dim)',
              textDecoration: 'none',
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: '0.88rem',
              letterSpacing: '0.01em',
              transition: 'color 0.2s ease',
              borderRadius: 'var(--radius-sm)',
            }}
            onMouseEnter={(e) => {
              if (!isActive(link.href)) {
                e.currentTarget.style.color = 'var(--color-text)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(link.href)) {
                e.currentTarget.style.color = 'var(--color-text-dim)';
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {link.label}
            {isActive(link.href) && (
              <span style={{
                position: 'absolute',
                bottom: '2px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '4px',
                height: '4px',
                background: 'var(--color-emerald)',
                borderRadius: '50%',
                boxShadow: '0 0 8px var(--color-emerald-glow)',
              }} />
            )}
          </Link>
        ))}

        {/* Divider */}
        <div style={{
          width: '1px',
          height: '20px',
          background: 'rgba(255,255,255,0.08)',
          margin: '0 0.5rem',
        }} />

        {/* Auth */}
        {isLoggedIn ? (
          <>
            <Link href="/profile/me" style={{
              padding: '8px 14px',
              color: 'var(--color-text-dim)',
              textDecoration: 'none',
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: '0.88rem',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-dim)'}
            >
              Profile
            </Link>
            <button onClick={handleLogout} className="btn-danger" style={{
              padding: '6px 14px',
              fontSize: '0.82rem',
            }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{
              padding: '8px 14px',
              color: 'var(--color-text-dim)',
              textDecoration: 'none',
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: '0.88rem',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-dim)'}
            >
              Login
            </Link>
            <Link href="/register" className="btn-primary" style={{
              padding: '8px 20px',
              fontSize: '0.82rem',
              textDecoration: 'none',
            }}>
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button
        className="nav-mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          flexDirection: 'column',
          gap: '5px',
        }}
      >
        <span style={{
          display: 'block',
          width: '22px',
          height: '2px',
          background: 'var(--color-text)',
          transition: 'all 0.3s ease',
          transform: mobileOpen ? 'rotate(45deg) translate(3px, 3px)' : 'none',
        }} />
        <span style={{
          display: 'block',
          width: '22px',
          height: '2px',
          background: 'var(--color-text)',
          transition: 'all 0.3s ease',
          opacity: mobileOpen ? 0 : 1,
        }} />
        <span style={{
          display: 'block',
          width: '22px',
          height: '2px',
          background: 'var(--color-text)',
          transition: 'all 0.3s ease',
          transform: mobileOpen ? 'rotate(-45deg) translate(3px, -3px)' : 'none',
        }} />
      </button>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="nav-mobile-menu" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'rgba(5, 5, 7, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: 'var(--space-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-sm)',
          animation: 'fadeIn 0.3s ease forwards',
        }}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} style={{
              padding: '12px 16px',
              color: isActive(link.href) ? 'var(--color-emerald)' : 'var(--color-text-dim)',
              textDecoration: 'none',
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: '1rem',
              borderRadius: 'var(--radius-sm)',
              background: isActive(link.href) ? 'var(--color-emerald-mist)' : 'transparent',
            }}>
              {link.label}
            </Link>
          ))}
          <div style={{ height: '1px', background: 'var(--panel-border)', margin: '8px 0' }} />
          {isLoggedIn ? (
            <>
              <Link href="/profile/me" style={{ padding: '12px 16px', color: 'var(--color-text-dim)', textDecoration: 'none', fontFamily: 'var(--font-display)' }}>Profile</Link>
              <button onClick={handleLogout} className="btn-danger" style={{ width: '100%', justifyContent: 'center' }}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ padding: '12px 16px', color: 'var(--color-text-dim)', textDecoration: 'none', fontFamily: 'var(--font-display)' }}>Login</Link>
              <Link href="/register" className="btn-primary" style={{ textDecoration: 'none', justifyContent: 'center', width: '100%' }}>Register</Link>
            </>
          )}
        </div>
      )}

      {/* Responsive CSS for mobile toggle */}
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
