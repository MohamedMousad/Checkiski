'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

export default function Home() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLSpanElement>(null);
  const title2Ref = useRef<HTMLSpanElement>(null);
  const title3Ref = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cinematic reveal animation
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.fromTo(title1Ref.current,
      { y: 60, opacity: 0, rotateX: -30 },
      { y: 0, opacity: 1, rotateX: 0, duration: 1.2, delay: 0.2 }
    )
    .fromTo(title2Ref.current,
      { y: 60, opacity: 0, rotateX: -30 },
      { y: 0, opacity: 1, rotateX: 0, duration: 1.2 },
      "-=1.0"
    )
    .fromTo(title3Ref.current,
      { y: 60, opacity: 0, rotateX: -30 },
      { y: 0, opacity: 1, rotateX: 0, duration: 1.2 },
      "-=1.0"
    )
    .fromTo(subtitleRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      "-=0.8"
    )
    .fromTo(ctaRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      "-=0.8"
    );

    // Parallax background effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      gsap.to(heroRef.current, {
        x, y,
        duration: 1,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <section style={{
        position: 'relative', minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center',
        justifyContent: 'center', overflow: 'hidden', padding: '0 5vw',
      }}>
        {/* Deep Atmospheric Background */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: 'radial-gradient(circle at 70% 50%, rgba(217, 248, 69, 0.05) 0%, var(--bg-deep) 60%)',
        }} />
        
        {/* Subtle grid lines for that tech/creative agency vibe */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, opacity: 0.03, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />

        {/* Abstract Floating Shapes (replaces the literal chess pieces for a more modern look) */}
        <div ref={heroRef} style={{ position: 'absolute', inset: '-50px', zIndex: 0, pointerEvents: 'none' }}>
           <div style={{
             position: 'absolute', right: '10%', top: '20%',
             width: '40vw', height: '40vw', borderRadius: '50%',
             background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
             filter: 'blur(40px)',
           }} />
           <div style={{
             position: 'absolute', left: '20%', bottom: '10%',
             width: '30vw', height: '30vw', borderRadius: '50%',
             background: 'radial-gradient(circle, rgba(217, 248, 69, 0.05) 0%, transparent 70%)',
             filter: 'blur(60px)',
           }} />
        </div>

        {/* Hero Content - Grid Layout */}
        <div className="hero-layout-grid" style={{
          position: 'relative', zIndex: 2, maxWidth: '1400px', width: '100%',
          display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem', alignItems: 'center',
          perspective: '1000px', marginTop: '60px'
        }}>
          
          {/* Left Text Side */}
          <div>
            <h1 style={{
              margin: '0 0 2rem 0',
              display: 'flex', flexDirection: 'column',
            }}>
              <span ref={title1Ref} className="text-hero" style={{ 
                fontSize: 'clamp(4rem, 8vw, 8rem)', 
                color: 'var(--text-faint)',
                transformOrigin: 'left bottom'
              }}>
                Master
              </span>
              <span ref={title2Ref} className="text-script" style={{ 
                fontSize: 'clamp(3rem, 6vw, 6rem)', 
                marginTop: '-0.3em',
                marginLeft: '1em',
                color: 'var(--text-primary)',
                zIndex: 2,
                transformOrigin: 'left bottom'
              }}>
                the art of
              </span>
              <span ref={title3Ref} className="text-hero" style={{ 
                fontSize: 'clamp(4.5rem, 10vw, 10rem)', 
                marginTop: '-0.2em',
                color: 'var(--accent-lime)',
                textShadow: '0 0 80px rgba(217, 248, 69, 0.2)',
                transformOrigin: 'left bottom'
              }}>
                Chess.
              </span>
            </h1>

            <p ref={subtitleRef} className="text-body" style={{
              fontSize: 'clamp(1rem, 1.2vw, 1.15rem)',
              maxWidth: '500px',
              marginLeft: '1vw',
              marginBottom: '3rem',
              color: 'var(--text-secondary)'
            }}>
              Real-time multiplayer, engine analysis, and tactical puzzles wrapped in a cinematic experience.
            </p>

            <div className="hero-cta-group" style={{ display: 'flex', gap: '1.5rem', marginLeft: '1vw' }}>
              <button 
                onClick={() => router.push('/play')}
                className="btn-primary"
              >
                <span>Play Now</span>
              </button>
              <button 
                onClick={() => router.push('/computer')}
                className="btn-secondary"
              >
                Play Engine
              </button>
            </div>
          </div>

          {/* Right Image Side - Creative Agency Style */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            {/* Ambient background glow */}
            <div style={{
              position: 'absolute', inset: '-10%',
              background: 'radial-gradient(circle, rgba(217, 248, 69, 0.15) 0%, transparent 70%)',
              filter: 'blur(60px)', zIndex: 0
            }} />
            
            <div className="hero-card-group" style={{
              position: 'relative', width: '100%', maxWidth: '550px', aspectRatio: '1/1',
              perspective: '2000px', transformStyle: 'preserve-3d', display: 'flex', justifyContent: 'center', alignItems: 'center',
            }}>
              {/* Back Card - Rook */}
              <div className="hero-card hero-card-3 glass-panel">
                <img src="/images/hero-card-2.png" alt="Cinematic Chess Rook" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 40%, transparent 60%, rgba(217, 248, 69, 0.05) 100%)' }} />
              </div>
              
              {/* Middle Card - Queen */}
              <div className="hero-card hero-card-2 glass-panel">
                <img src="/images/hero-card-1.png" alt="Cinematic Chess Queen" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 40%, transparent 60%, rgba(217, 248, 69, 0.05) 100%)' }} />
              </div>

              {/* Front Card - Knight */}
              <div className="hero-card hero-card-1 glass-panel">
                <img src="/images/cinematic-hero.png" alt="Cinematic Chess Knight" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 40%, transparent 60%, rgba(217, 248, 69, 0.05) 100%)' }} />
              </div>
            </div>
            
            {/* Floating UI Card 1 - Player Stats */}
            <div className="hero-floating-card glass-panel" style={{
              position: 'absolute', bottom: '15%', left: '-20%', zIndex: 2,
              padding: '1rem', width: '220px', display: 'flex', gap: '1rem', alignItems: 'center',
              animation: 'float 7s ease-in-out infinite reverse',
              cursor: 'pointer'
            }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'url(/images/cinematic-multiplayer.png) center/cover', border: '1px solid var(--accent-lime)' }} />
              <div>
                <div className="text-caption" style={{ color: 'var(--text-primary)', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-lime)', boxShadow: '0 0 8px var(--accent-lime)' }}></span>
                  Magnus C.
                </div>
                <div className="text-mono" style={{ color: 'var(--accent-lime)', fontSize: '0.8rem', fontWeight: 800 }}>2882 ELO</div>
              </div>
            </div>

            {/* Floating UI Card 2 - Engine Analysis */}
            <div className="hero-floating-card glass-panel" style={{
              position: 'absolute', top: '25%', right: '-15%', zIndex: 2,
              padding: '1rem', width: '180px',
              animation: 'float 5s ease-in-out infinite 1s',
              cursor: 'pointer'
            }}>
              <div className="text-caption" style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Stockfish Eval</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                <span className="text-display" style={{ fontSize: '2rem', color: 'var(--text-primary)', lineHeight: 1 }}>+2.4</span>
                <span style={{ color: 'var(--accent-lime)', fontSize: '1.2rem', marginBottom: '4px' }}>↑</span>
              </div>
              <div style={{ width: '100%', height: '2px', background: 'var(--border)', marginTop: '10px' }}>
                <div style={{ width: '70%', height: '100%', background: 'var(--accent-lime)', boxShadow: '0 0 10px var(--accent-lime)' }} />
              </div>
            </div>

            {/* Decorative technical markers */}
            <div className="hero-floating-card" style={{ position: 'absolute', top: '10%', left: '-5%', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-lime)', opacity: 0.5 }}>[ CHS-01 ]</div>
            <div className="hero-floating-card" style={{ position: 'absolute', bottom: '10%', right: '-5%', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)', opacity: 0.5 }}>LAT 42.8N</div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div style={{
          position: 'absolute', bottom: '40px', left: '5vw', zIndex: 2,
          display: 'flex', alignItems: 'center', gap: '15px'
        }}>
          <span className="text-caption">Scroll</span>
          <div style={{ width: '60px', height: '1px', background: 'var(--border-strong)' }}>
            <div style={{ 
              width: '15px', height: '1px', background: 'var(--accent-lime)',
              animation: 'scrollLine 2s ease-in-out infinite' 
            }} />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: 'var(--space-3xl) 5vw', background: 'var(--bg-deep)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <div>
            <div className="text-hero" style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', color: 'var(--accent-lime)' }}>12M+</div>
            <div className="text-caption" style={{ color: 'var(--text-secondary)' }}>Matches Played</div>
          </div>
          <div>
            <div className="text-hero" style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', color: 'var(--text-primary)' }}>50K+</div>
            <div className="text-caption" style={{ color: 'var(--text-secondary)' }}>Active Masters</div>
          </div>
          <div>
            <div className="text-hero" style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', color: 'var(--text-primary)' }}>&lt;10ms</div>
            <div className="text-caption" style={{ color: 'var(--text-secondary)' }}>Server Latency</div>
          </div>
          <div>
            <div className="text-hero" style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', color: 'var(--text-primary)' }}>100%</div>
            <div className="text-caption" style={{ color: 'var(--text-secondary)' }}>Fair Play Protected</div>
          </div>
        </div>
      </section>

      {/* Visual Features Section */}
      <section style={{ padding: 'var(--space-4xl) 5vw', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8rem' }}>
          
          {/* Feature 1: Engine */}
          <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div className="glass-panel" style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
              <img src="/images/cinematic-engine.png" alt="Engine Analysis" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div className="text-caption" style={{ color: 'var(--accent-lime)', marginBottom: '1rem' }}>NEURAL EVALUATION</div>
              <h2 className="text-display" style={{ fontSize: 'clamp(2rem, 3vw, 3.5rem)', marginBottom: '1.5rem' }}>Stockfish 16 Engine Integration.</h2>
              <p className="text-body" style={{ fontSize: '1.1rem', maxWidth: '500px' }}>
                Analyze your games with the world's most powerful open-source chess engine right in your browser. Holographic evaluation bars and instant blunder detection elevate your learning curve.
              </p>
            </div>
          </div>

          {/* Feature 2: Multiplayer */}
          <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div style={{ order: 1 }}>
              <div className="text-caption" style={{ color: 'var(--accent-lime)', marginBottom: '1rem' }}>GLOBAL ARENA</div>
              <h2 className="text-display" style={{ fontSize: 'clamp(2rem, 3vw, 3.5rem)', marginBottom: '1.5rem' }}>Zero-Latency Matchmaking.</h2>
              <p className="text-body" style={{ fontSize: '1.1rem', maxWidth: '500px' }}>
                Connect globally instantly. Our custom WebSockets infrastructure ensures lightning-fast move broadcasting and an unbreakable connection when it matters most.
              </p>
            </div>
            <div className="glass-panel" style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', order: 2 }}>
              <img src="/images/cinematic-multiplayer.png" alt="Multiplayer Arena" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>

        </div>
      </section>

      <style>{`
        @keyframes scrollLine {
          0% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(45px); opacity: 0; }
          51% { transform: translateX(0); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }

        /* 3D Hero Cards Interaction */
        .hero-card {
          position: absolute;
          width: 55%;
          aspect-ratio: 4/5;
          transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
          box-shadow: -20px 20px 50px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.1);
          border-radius: 8px;
          overflow: hidden;
          background: var(--bg-deep);
          pointer-events: none;
        }
        .hero-card-3 {
          z-index: 1;
          transform: rotateX(50deg) rotateZ(-35deg) translateZ(-80px) translate(-15%, -15%);
          filter: brightness(0.4);
        }
        .hero-card-2 {
          z-index: 2;
          transform: rotateX(50deg) rotateZ(-35deg) translateZ(-20px) translate(-5%, -5%);
          filter: brightness(0.65);
        }
        .hero-card-1 {
          z-index: 3;
          transform: rotateX(50deg) rotateZ(-35deg) translateZ(40px) translate(5%, 5%);
          filter: brightness(0.9);
        }

        .hero-card-group:hover .hero-card-3 {
          transform: rotateX(50deg) rotateZ(-35deg) translateZ(-100px) translate(-40%, -40%);
          filter: brightness(0.7);
        }
        .hero-card-group:hover .hero-card-2 {
          transform: rotateX(50deg) rotateZ(-35deg) translateZ(-20px) translate(-15%, -15%);
          filter: brightness(0.9);
        }
        .hero-card-group:hover .hero-card-1 {
          transform: rotateX(50deg) rotateZ(-35deg) translateZ(80px) translate(10%, 10%);
          filter: brightness(1.1);
        }
        @media (max-width: 1024px) {
          .hero-floating-card { display: none !important; }
          .hero-card-group {
            transform: scale(1) !important;
            margin: 2rem auto !important;
            max-width: 320px !important;
            aspect-ratio: 4/5 !important;
          }
          .hero-layout-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
            gap: 2rem !important;
          }
          h1 span { margin-left: 0 !important; }
          p.text-body { margin: 0 auto 2rem !important; text-align: center !important; }
          .hero-cta-group {
            justify-content: center; margin-left: 0 !important;
            flex-wrap: wrap;
          }
          .feature-grid {
            grid-template-columns: 1fr !important;
            text-align: center !important;
          }
          .feature-grid > div {
            order: 0 !important;
          }
          .feature-grid p.text-body {
            margin: 0 auto !important;
          }
        }
      `}</style>
    </>
  );
}
