'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export default function PortalEntry() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'loading' | 'reveal' | 'done'>('loading');
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  interface Particle {
    x: number; y: number; vx: number; vy: number;
    size: number; opacity: number; life: number; maxLife: number;
    color: string;
  }

  const createParticle = useCallback((w: number, h: number, near?: boolean): Particle => {
    const centerX = w / 2;
    const centerY = h / 2;
    const angle = Math.random() * Math.PI * 2;
    const dist = near ? Math.random() * 150 + 50 : Math.random() * Math.max(w, h) * 0.4 + 100;
    return {
      x: centerX + Math.cos(angle) * dist,
      y: centerY + Math.sin(angle) * dist,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3 - 0.15,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.6 + 0.1,
      life: 0,
      maxLife: Math.random() * 400 + 200,
      color: Math.random() > 0.7 ? '#c9a84c' : '#2ecc71',
    };
  }, []);

  useEffect(() => {
    // Skip portal if already seen this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('portalSeen') === 'true') {
      setPhase('done');
      return;
    }

    // Respect reduced motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sessionStorage.setItem('portalSeen', 'true');
      setPhase('done');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    for (let i = 0; i < 80; i++) {
      particlesRef.current.push(createParticle(canvas.width, canvas.height));
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let startTime = Date.now();
    let portalOpenness = 0;
    let glowIntensity = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const elapsed = Date.now() - startTime;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = '#050507';
      ctx.fillRect(0, 0, w, h);

      // --- Portal glow (behind the door) ---
      glowIntensity = Math.min(1, elapsed / 2500);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mouseGlow = 0.15 + Math.abs(mx - 0.5) * 0.1 + Math.abs(my - 0.5) * 0.1;

      const portalGlowRadius = 200 + glowIntensity * 120 + Math.sin(elapsed * 0.001) * 20;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, portalGlowRadius);
      grad.addColorStop(0, `rgba(46, 204, 113, ${(0.25 + mouseGlow) * glowIntensity})`);
      grad.addColorStop(0.4, `rgba(46, 204, 113, ${0.08 * glowIntensity})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // --- Door shape (bishop silhouette / pointed arch) ---
      const doorW = Math.min(w * 0.18, 180);
      const doorH = Math.min(h * 0.65, 450);
      const doorTop = cy - doorH / 2;
      const doorBottom = cy + doorH / 2;

      // Draw the door opening
      ctx.save();
      ctx.beginPath();
      // Pointed arch shape
      ctx.moveTo(cx - doorW / 2, doorBottom);
      ctx.lineTo(cx - doorW / 2, doorTop + doorH * 0.2);
      ctx.quadraticCurveTo(cx - doorW / 2, doorTop, cx, doorTop - doorH * 0.08);
      ctx.quadraticCurveTo(cx + doorW / 2, doorTop, cx + doorW / 2, doorTop + doorH * 0.2);
      ctx.lineTo(cx + doorW / 2, doorBottom);
      ctx.closePath();

      // Inside the door: bright light
      const innerGlow = ctx.createLinearGradient(cx, doorTop - doorH * 0.08, cx, doorBottom);
      innerGlow.addColorStop(0, `rgba(46, 204, 113, ${0.6 * glowIntensity})`);
      innerGlow.addColorStop(0.5, `rgba(200, 230, 210, ${0.4 * glowIntensity})`);
      innerGlow.addColorStop(1, `rgba(46, 204, 113, ${0.3 * glowIntensity})`);
      ctx.fillStyle = innerGlow;
      ctx.fill();

      // Door frame
      ctx.strokeStyle = `rgba(46, 204, 113, ${0.5 * glowIntensity})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Outer door frame glow
      ctx.shadowColor = '#2ecc71';
      ctx.shadowBlur = 30 * glowIntensity;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();

      // --- Door panels (slide apart on reveal) ---
      if (elapsed > 2500) {
        portalOpenness = Math.min(1, (elapsed - 2500) / 1200);
      }

      if (portalOpenness < 1) {
        const panelOffset = portalOpenness * doorW * 0.6;

        // Left door panel
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx - doorW / 2 - panelOffset, doorBottom);
        ctx.lineTo(cx - doorW / 2 - panelOffset, doorTop + doorH * 0.2);
        ctx.quadraticCurveTo(cx - doorW / 2 - panelOffset, doorTop, cx - panelOffset, doorTop - doorH * 0.08);
        ctx.lineTo(cx, doorTop - doorH * 0.08);
        ctx.lineTo(cx, doorBottom);
        ctx.closePath();
        ctx.fillStyle = `rgba(8, 9, 12, ${1 - portalOpenness * 0.8})`;
        ctx.fill();
        ctx.restore();

        // Right door panel
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx + doorW / 2 + panelOffset, doorBottom);
        ctx.lineTo(cx + doorW / 2 + panelOffset, doorTop + doorH * 0.2);
        ctx.quadraticCurveTo(cx + doorW / 2 + panelOffset, doorTop, cx + panelOffset, doorTop - doorH * 0.08);
        ctx.lineTo(cx, doorTop - doorH * 0.08);
        ctx.lineTo(cx, doorBottom);
        ctx.closePath();
        ctx.fillStyle = `rgba(8, 9, 12, ${1 - portalOpenness * 0.8})`;
        ctx.fill();
        ctx.restore();
      }

      // --- Particles ---
      particlesRef.current.forEach((p, i) => {
        p.x += p.vx + (mx - 0.5) * 0.5;
        p.y += p.vy + (my - 0.5) * 0.3;
        p.life++;

        if (p.life > p.maxLife || p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
          particlesRef.current[i] = createParticle(w, h, Math.random() > 0.5);
          return;
        }

        const lifeRatio = p.life / p.maxLife;
        const fadeIn = Math.min(1, lifeRatio * 5);
        const fadeOut = Math.max(0, 1 - (lifeRatio - 0.7) / 0.3);
        const alpha = p.opacity * fadeIn * (lifeRatio > 0.7 ? fadeOut : 1);

        // During reveal, particles rush toward center
        if (portalOpenness > 0 && portalOpenness < 1) {
          const dx = cx - p.x;
          const dy = cy - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 10) {
            p.vx += (dx / dist) * portalOpenness * 0.8;
            p.vy += (dy / dist) * portalOpenness * 0.8;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color === '#c9a84c'
          ? `rgba(201, 168, 76, ${alpha})`
          : `rgba(46, 204, 113, ${alpha})`;
        ctx.fill();
      });

      // --- Light flood on open ---
      if (portalOpenness > 0.3) {
        const floodAlpha = (portalOpenness - 0.3) / 0.7;
        const floodGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h));
        floodGrad.addColorStop(0, `rgba(230, 245, 235, ${floodAlpha * 0.8})`);
        floodGrad.addColorStop(0.3, `rgba(46, 204, 113, ${floodAlpha * 0.3})`);
        floodGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = floodGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // --- Transition complete ---
      if (portalOpenness >= 1) {
        const fadeOutAlpha = Math.min(1, (elapsed - 3700) / 600);
        if (fadeOutAlpha >= 1) {
          sessionStorage.setItem('portalSeen', 'true');
          setPhase('done');
          cancelAnimationFrame(animFrameRef.current);
          return;
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    // Auto-trigger after 3s, or click to skip
    const handleClick = () => {
      startTime = Date.now() - 2500; // Jump to reveal
    };
    window.addEventListener('click', handleClick, { once: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [createParticle]);

  if (phase === 'done') return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        pointerEvents: 'all',
        transition: 'opacity 0.6s ease-out',
        opacity: 1,
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />

      {/* Entry text */}
      <div style={{
        position: 'absolute',
        bottom: '12%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        opacity: phase === 'loading' ? 1 : 0,
        transition: 'opacity 0.5s ease',
        pointerEvents: 'none',
      }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(46, 204, 113, 0.5)',
          animation: 'textGlowPulse 3s ease-in-out infinite',
        }}>
          Click to Enter
        </p>
      </div>
    </div>
  );
}
