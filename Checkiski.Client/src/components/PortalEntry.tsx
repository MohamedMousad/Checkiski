'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export default function PortalEntry() {
  const [phase, setPhase] = useState<'loading' | 'ready' | 'exit' | 'done'>('loading');
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('portalSeen') === 'true' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done');
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => setPhase('ready')
    });

    // Dramatic cinematic reveal
    tl.to(overlayRef.current, { opacity: 0, duration: 1, ease: 'power2.inOut', delay: 0.2 })
      .fromTo(titleRef.current,
        { scale: 1.1, opacity: 0, filter: 'blur(20px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 2, ease: 'power3.out' },
        "-=0.5"
      )
      .fromTo(subtitleRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' },
        "-=1.2"
      );

  }, []);

  const enterSite = () => {
    if (phase !== 'ready') return;
    setPhase('exit');

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('portalSeen', 'true');
        setPhase('done');
      }
    });

    // Intense exit animation (Awwwards style zoom/shatter)
    tl.to(subtitleRef.current, { opacity: 0, duration: 0.3 })
      .to(titleRef.current, { 
        scale: 4, 
        opacity: 0, 
        filter: 'blur(30px)',
        duration: 1.2, 
        ease: 'power4.in' 
      }, "-=0.1")
      .to(containerRef.current, { 
        opacity: 0, 
        duration: 0.8, 
        ease: 'power2.inOut',
        pointerEvents: 'none'
      }, "-=0.5");
  };

  if (phase === 'done') return null;

  return (
    <div
      ref={containerRef}
      onClick={enterSite}
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: '#030305',
        overflow: 'hidden',
        cursor: phase === 'ready' ? 'pointer' : 'wait',
      }}
    >
      {/* Film grain layer */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        opacity: 0.06,
      }} />

      {/* Deep Lime Glow behind text */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '50vw', height: '50vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(217, 248, 69, 0.08) 0%, transparent 60%)',
        filter: 'blur(60px)', zIndex: 0,
      }} />

      {/* Pitch black initial overlay */}
      <div ref={overlayRef} style={{
        position: 'absolute', inset: 0, background: '#000', zIndex: 10,
      }} />

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <h1 ref={titleRef} className="text-hero" style={{
          fontSize: 'clamp(3rem, 15vw, 12rem)',
          color: '#F4F4F5',
          margin: 0,
          opacity: 0,
          textShadow: '0 20px 60px rgba(0,0,0,0.8)'
        }}>
          CHECKISKI
        </h1>
        
        <p ref={subtitleRef} className="text-script" style={{
          fontSize: 'clamp(1.5rem, 4vw, 3rem)',
          color: 'var(--accent-lime)',
          marginTop: '-0.5em',
          opacity: 0,
        }}>
          Enter the Arena
        </p>
      </div>

      <div style={{
        position: 'absolute', bottom: '40px', left: '0', right: '0',
        textAlign: 'center', zIndex: 2, opacity: phase === 'ready' ? 1 : 0,
        transition: 'opacity 1s ease',
      }}>
        <span className="text-caption" style={{ animation: 'pulse 2s infinite', color: 'var(--accent-lime)' }}>
          Click anywhere to begin
        </span>
      </div>

    </div>
  );
}
