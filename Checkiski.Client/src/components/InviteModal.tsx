'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface InviteModalProps {
  gameId: string;
  onClose: () => void;
}

/** Lightweight QR Code generator — no external dependency */
function generateQRDataUrl(text: string, size: number = 200): string {
  // Use a public QR API as a reliable fallback
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&bgcolor=0a0a0e&color=2ecc71&format=svg`;
}

export default function InviteModal({ gameId, onClose }: InviteModalProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const inviteUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/play?gameId=${gameId}`
    : '';
  const roomCode = gameId.slice(0, 8).toUpperCase();

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Close on backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  // Copy to clipboard with fallback
  const copyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(inviteUrl);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = inviteUrl;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // Native share API (mobile)
  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my chess game on Checkiski',
          text: `Challenge me to a chess match! Room code: ${roomCode}`,
          url: inviteUrl,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2500);
      } catch (err) {
        // User cancelled share — silently ignore
      }
    } else {
      // Fallback: just copy
      copyLink();
    }
  };

  const buttonBase: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
    padding: '14px 20px', borderRadius: '12px', cursor: 'pointer',
    fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    border: 'none', width: '100%',
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.25s ease forwards',
      }}
    >
      <div
        ref={modalRef}
        style={{
          background: 'rgba(14, 15, 19, 0.95)',
          backdropFilter: 'blur(40px) saturate(150%)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '32px',
          width: '100%', maxWidth: '420px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(46,204,113,0.08)',
          animation: 'fadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: '1.3rem', color: '#fff', margin: 0,
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-emerald)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
            Invite Friend
          </h2>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px', width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'rgba(255,255,255,0.5)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Room Code Display */}
        <div style={{
          background: 'rgba(46,204,113,0.06)',
          border: '1px solid rgba(46,204,113,0.15)',
          borderRadius: '12px', padding: '16px', marginBottom: '20px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '0.7rem', fontFamily: 'var(--font-display)',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--color-emerald-dim)', marginBottom: '6px',
          }}>Room Code</div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '1.6rem', fontWeight: 700,
            color: 'var(--color-emerald)', letterSpacing: '0.15em',
            textShadow: '0 0 20px rgba(46,204,113,0.3)',
          }}>{roomCode}</div>
        </div>

        {/* QR Code */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px', padding: '20px', marginBottom: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: '180px',
        }}>
          {inviteUrl && (
            <img
              src={generateQRDataUrl(inviteUrl, 160)}
              alt="Scan to join game"
              width={160} height={160}
              onLoad={() => setQrLoaded(true)}
              style={{
                borderRadius: '8px',
                opacity: qrLoaded ? 1 : 0.3,
                transition: 'opacity 0.4s ease',
              }}
            />
          )}
          {!qrLoaded && (
            <div style={{
              position: 'absolute', color: 'rgba(255,255,255,0.3)',
              fontSize: '0.8rem', fontFamily: 'var(--font-display)',
            }}>Loading QR...</div>
          )}
        </div>

        {/* Invite Link Field */}
        <div style={{
          display: 'flex', gap: '8px', marginBottom: '16px',
        }}>
          <div style={{
            flex: 1, padding: '12px 14px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px', overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem',
            fontFamily: 'var(--font-mono)',
          }}>
            {inviteUrl}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Copy Link */}
          <button
            onClick={copyLink}
            style={{
              ...buttonBase,
              background: copied
                ? 'linear-gradient(135deg, #22C55E, #16A34A)'
                : 'linear-gradient(135deg, var(--color-emerald), var(--color-emerald-dim))',
              color: '#fff',
              boxShadow: copied
                ? '0 4px 20px rgba(34,197,94,0.4)'
                : '0 4px 20px rgba(46,204,113,0.3)',
              transform: copied ? 'scale(0.98)' : 'scale(1)',
            }}
            onMouseEnter={e => { if (!copied) e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { if (!copied) e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {copied ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Link Copied!
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy Invite Link
              </>
            )}
          </button>

          {/* Share (visible on mobile or when Share API available) */}
          <button
            onClick={shareLink}
            style={{
              ...buttonBase,
              background: shared
                ? 'rgba(34,197,94,0.15)'
                : 'rgba(255,255,255,0.04)',
              color: shared ? '#22C55E' : 'var(--color-text)',
              border: `1px solid ${shared ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`,
            }}
            onMouseEnter={e => { if (!shared) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; } }}
            onMouseLeave={e => { if (!shared) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; } }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            {shared ? 'Shared!' : 'Share via...'}
          </button>
        </div>

        {/* Hint */}
        <p style={{
          textAlign: 'center', marginTop: '16px',
          fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)',
          fontFamily: 'var(--font-body)',
        }}>
          Share this link with your friend to start the match
        </p>
      </div>

      {/* Success Toast */}
      {copied && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 10000,
          background: 'rgba(14, 15, 19, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: '12px', padding: '14px 20px',
          display: 'flex', alignItems: 'center', gap: '10px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(34,197,94,0.15)',
          animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          color: '#22C55E',
          fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.88rem',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Invite link copied successfully
        </div>
      )}
    </div>
  );
}
