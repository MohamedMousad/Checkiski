'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Disable in competitive mode
    const competitivePaths = ['/play', '/computer', '/puzzles'];
    if (competitivePaths.some(p => pathname?.startsWith(p))) {
      if (glowRef.current) glowRef.current.style.display = 'none';
      return;
    } else {
      if (glowRef.current) glowRef.current.style.display = 'block';
    }

    const glow = glowRef.current;
    if (!glow) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Smooth follow with lerp
    let animId: number;
    const animate = () => {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;
      glow.style.left = `${currentX}px`;
      glow.style.top = `${currentY}px`;
      animId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <div ref={glowRef} className="cursor-glow" />;
}
