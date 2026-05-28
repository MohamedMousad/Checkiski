'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GameCreator from '../components/GameCreator';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [showCreator, setShowCreator] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const router = useRouter();
  const heroRef = useRef<HTMLElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const featRef = useRef<HTMLElement>(null);
  const ctaSectionRef = useRef<HTMLElement>(null);

  const heroSlides = [
    { src: '/images/hero-king.png', pos: 'center 30%' },
    { src: '/images/chess-duel.png', pos: 'center 40%' },
    { src: '/images/board-overhead.png', pos: 'center center' },
  ];

  // Auto-cycle hero backgrounds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    gsap.set(heroTextRef.current, { opacity: 0 });
    tl.fromTo(heroTextRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, 0.5);

    if (statsRef.current) {
      gsap.fromTo(statsRef.current.children, { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.12, duration: 0.8,
          scrollTrigger: { trigger: statsRef.current, start: 'top 80%' } });
    }
    if (featRef.current) {
      gsap.fromTo(featRef.current.querySelectorAll('.feat-card'), { y: 60, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.9,
          scrollTrigger: { trigger: featRef.current, start: 'top 75%' } });
    }
    if (ctaSectionRef.current) {
      gsap.fromTo(ctaSectionRef.current, { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1,
          scrollTrigger: { trigger: ctaSectionRef.current, start: 'top 85%' } });
    }
    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  const handleCreateGame = async (config: any) => {
    setShowCreator(false);
    let colorChoice = 2;
    if (config.color === 'white') colorChoice = 1;
    if (config.color === 'black') colorChoice = 0;
    let tc = { baseMinutes: 3, incrementSeconds: 0 }, gc = 1;
    if (config.timeControl === 'bullet') { tc = { baseMinutes: 1, incrementSeconds: 0 }; gc = 0; }
    if (config.timeControl === 'rapid') { tc = { baseMinutes: 10, incrementSeconds: 0 }; gc = 2; }
    if (config.timeControl === 'classical') { tc = { baseMinutes: 30, incrementSeconds: 0 }; gc = 3; }
    try {
      const username = localStorage.getItem('username');
      if (!username) { router.push('/login'); return; }
      const { ApiService } = await import('../services/api');
      const data = await ApiService.post<{ gameId: string }>('/api/game/create', {
        hostUsername: username, colorChoice, rated: config.isRated,
        baseMinutes: tc.baseMinutes, incrementSeconds: tc.incrementSeconds, gameCategory: gc
      });
      router.push(`/play?gameId=${data.gameId}`);
    } catch (err: any) { alert(`Failed: ${err.message}`); }
  };

  return (
    <>
      {/* Ken Burns slideshow keyframes */}
      <style>{`
        @keyframes kenBurns0 { 0% { transform: scale(1.05) translate(0,0); } 100% { transform: scale(1.15) translate(-2%,-1%); } }
        @keyframes kenBurns1 { 0% { transform: scale(1.1) translate(-1%,0); } 100% { transform: scale(1.05) translate(1%,-2%); } }
        @keyframes kenBurns2 { 0% { transform: scale(1.08) translate(1%,1%); } 100% { transform: scale(1.18) translate(-1%,0); } }
      `}</style>

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} style={{
        position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center',
        overflow: 'hidden', padding: '0',
      }}>
        {/* Slideshow layers */}
        {heroSlides.map((slide, i) => (
          <div key={i} style={{
            position: 'absolute', inset: '-20px', zIndex: 0,
            backgroundImage: `url(${slide.src})`,
            backgroundSize: 'cover', backgroundPosition: slide.pos,
            opacity: activeSlide === i ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
            animation: `kenBurns${i} 12s ease-in-out infinite alternate`,
            willChange: 'transform, opacity',
          }} />
        ))}

        {/* Overlays */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to right, rgba(8,10,15,0.93) 0%, rgba(8,10,15,0.75) 45%, rgba(8,10,15,0.35) 100%)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', zIndex: 1,
          background: 'linear-gradient(to top, var(--color-void) 0%, transparent 100%)',
        }} />

        {/* Slide indicators */}
        <div style={{
          position: 'absolute', bottom: '32px', right: '40px', zIndex: 3,
          display: 'flex', gap: '8px',
        }}>
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setActiveSlide(i)} style={{
              width: activeSlide === i ? '32px' : '8px', height: '8px',
              borderRadius: '4px', border: 'none', cursor: 'pointer',
              background: activeSlide === i ? 'var(--color-emerald)' : 'rgba(255,255,255,0.25)',
              transition: 'all 0.4s ease',
            }} />
          ))}
        </div>

        {/* Hero content */}
        <div ref={heroTextRef} style={{
          position: 'relative', zIndex: 2, maxWidth: '700px',
          padding: '0 var(--space-3xl)', paddingTop: '120px',
        }}>

          <h1 style={{
            fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontFamily: 'var(--font-display)',
            fontWeight: 800, lineHeight: 1.05, margin: '0 0 24px',
            letterSpacing: '-0.03em',
          }}>
            <span style={{ color: '#fff' }}>Master the</span><br />
            <span style={{
              background: 'linear-gradient(135deg, var(--color-emerald), #a8edba)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Art of Chess</span>
          </h1>

          <p style={{
            fontSize: '1.15rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7,
            maxWidth: '520px', margin: '0 0 40px', fontWeight: 300,
          }}>
            Real-time multiplayer battles, AI-powered analysis, and tactical puzzles.
            Experience chess like never before — cinematic, immersive, and competitive.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={() => setShowCreator(true)} style={{
              padding: '16px 40px', fontSize: '1rem', fontWeight: 600,
              fontFamily: 'var(--font-display)', letterSpacing: '0.05em',
              background: 'var(--color-emerald)', color: '#000', border: 'none',
              borderRadius: '8px', cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(46,204,113,0.4), 0 0 60px rgba(46,204,113,0.15)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 30px rgba(46,204,113,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(46,204,113,0.4)'; }}
            >PLAY NOW</button>

            <button onClick={() => router.push('/computer')} style={{
              padding: '16px 40px', fontSize: '1rem', fontWeight: 600,
              fontFamily: 'var(--font-display)', letterSpacing: '0.05em',
              background: 'transparent', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.background = 'transparent'; }}
            >VS COMPUTER</button>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR — Glassmorphism ═══ */}
      <section ref={statsRef} style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px', padding: '60px var(--space-xl)',
        maxWidth: '1100px', margin: '-40px auto 0', position: 'relative', zIndex: 5,
      }}>
        {[
          { val: '847', label: 'Matches Played', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
          { val: '312', label: 'Registered Players', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
          { val: '5', label: 'Game Modes', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
          { val: '< 80ms', label: 'Avg Response', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
        ].map((s, i) => (
          <div key={i} style={{
            padding: '28px 24px', textAlign: 'center',
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
            transition: 'transform 0.3s, border-color 0.3s',
            cursor: 'default',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(46,204,113,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
          >
            <div style={{ color: 'var(--color-emerald-dim)', marginBottom: '12px', opacity: 0.7 }}>{s.icon}</div>
            <div style={{
              fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-display)',
              color: '#fff', marginBottom: '4px',
              textShadow: '0 0 20px rgba(46,204,113,0.15)',
            }}>{s.val}</div>
            <div style={{
              fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)',
              fontFamily: 'var(--font-display)', letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* ═══ FEATURES ═══ */}
      <section ref={featRef} style={{
        padding: '120px var(--space-xl) 100px',
        maxWidth: '1200px', margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <span style={{
            fontSize: '0.75rem', fontFamily: 'var(--font-display)', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--color-emerald-dim)',
          }}>WHY CHECKISKI</span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700,
            fontFamily: 'var(--font-display)', margin: '16px 0 0',
            color: '#fff',
          }}>Built for Serious Players</h2>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
        }}>
          {[
            {
              img: '/images/chess-duel.png',
              title: 'Real-Time Multiplayer',
              desc: 'Challenge players worldwide with WebSocket-powered live games. Sub-50ms latency for competitive play.',
            },
            {
              img: '/images/board-overhead.png',
              title: 'Engine Analysis',
              desc: 'Stockfish running in your browser. Analyze any position, review your games move-by-move, find your mistakes.',
            },
            {
              img: '/images/hero-king.png',
              title: 'Tactical Training',
              desc: 'Curated puzzles that sharpen your pattern recognition. Train like a grandmaster, think deeper.',
            },
          ].map((f, i) => (
            <div key={i} className="feat-card" style={{
              borderRadius: '16px', overflow: 'hidden',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              transition: 'transform 0.3s, border-color 0.3s',
              cursor: 'default',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(46,204,113,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
            >
              <div style={{
                height: '200px', overflow: 'hidden', position: 'relative',
              }}>
                <img src={f.img} alt={f.title} style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  transition: 'transform 0.5s',
                }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(8,10,15,1) 0%, transparent 60%)',
                }} />
              </div>
              <div style={{ padding: '24px 28px 32px' }}>
                <h3 style={{
                  fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-display)',
                  color: '#fff', margin: '0 0 10px',
                }}>{f.title}</h3>
                <p style={{
                  fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.6, margin: 0,
                }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ VISUAL CTA SECTION ═══ */}
      <section ref={ctaSectionRef} style={{
        position: 'relative', padding: '120px var(--space-xl)',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'url(/images/board-overhead.png)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'blur(3px)',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(8,10,15,0.85)',
          }} />
        </div>

        <div style={{
          position: 'relative', zIndex: 2, textAlign: 'center',
          maxWidth: '600px', margin: '0 auto',
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800,
            fontFamily: 'var(--font-display)', color: '#fff',
            lineHeight: 1.1, margin: '0 0 20px',
          }}>Ready to Play?</h2>
          <p style={{
            fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.6, margin: '0 0 40px',
          }}>
            Join the arena. Challenge real players or test your skill against the engine.
          </p>

          <div style={{
            display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap',
          }}>
            {[
              { label: 'Play Online', path: null, primary: true },
              { label: 'Lobby', path: '/lobby', primary: false },
              { label: 'Puzzles', path: '/puzzles', primary: false },
              { label: 'Leaderboard', path: '/leaderboard', primary: false },
            ].map((btn, i) => (
              <button key={i} onClick={() => btn.path ? router.push(btn.path) : setShowCreator(true)} style={{
                padding: '14px 28px', fontSize: '0.9rem', fontWeight: 600,
                fontFamily: 'var(--font-display)', letterSpacing: '0.04em',
                background: btn.primary ? 'var(--color-emerald)' : 'rgba(255,255,255,0.08)',
                color: btn.primary ? '#000' : '#fff',
                border: btn.primary ? 'none' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!btn.primary) e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; }}
              onMouseLeave={e => { if (!btn.primary) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              >{btn.label}</button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{
        padding: '40px var(--space-xl)', textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <p style={{
          fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)',
          fontFamily: 'var(--font-display)', letterSpacing: '0.15em',
          textTransform: 'uppercase', margin: 0,
        }}>© 2026 Checkiski — The Art of Strategy</p>
      </footer>

      {showCreator && (
        <GameCreator onCreate={handleCreateGame} onClose={() => setShowCreator(false)} />
      )}
    </>
  );
}
