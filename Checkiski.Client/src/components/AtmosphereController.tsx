'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AtmosphereController({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCompetitiveMode, setIsCompetitiveMode] = useState(false);

  useEffect(() => {
    // Determine if we are in a competitive/gameplay focus mode
    const competitivePaths = ['/play', '/computer', '/puzzles'];
    const isComp = competitivePaths.some(p => pathname?.startsWith(p));
    setIsCompetitiveMode(isComp);
  }, [pathname]);

  return (
    <div className={`atmosphere-wrapper ${isCompetitiveMode ? 'focus-mode' : 'cinematic-mode vignette'}`}>
      {/* Subtle floating dust particles in cinematic mode */}
      {!isCompetitiveMode && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.01) 0%, transparent 80%)',
          animation: 'pulse 10s infinite alternate'
        }} />
      )}
      {children}
    </div>
  );
}
