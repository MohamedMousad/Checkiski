'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    country: '',
    profilePictureUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const { ApiService } = await import('../../services/api');
        const data = await ApiService.get<any>('/api/player/profile/me');
        setFormData({
          username: data.username || '',
          bio: data.bio || '',
          country: data.country || '',
          profilePictureUrl: data.profilePictureUrl || ''
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const { ApiService } = await import('../../services/api');
      const data = await ApiService.put<any>('/api/player/profile', {
        newUsername: formData.username,
        bio: formData.bio,
        country: formData.country,
        profilePictureUrl: formData.profilePictureUrl
      });
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      if (formData.username) {
        localStorage.setItem('username', formData.username);
      }
      
      alert('Profile updated successfully!');
      router.push('/profile/me');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{
      textAlign: 'center',
      padding: 'calc(80px + var(--space-4xl)) var(--space-xl)',
      color: 'var(--text-dim)',
    }}>
      <div style={{
        width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.05)',
        borderTop: '3px solid var(--accent-lime)', borderRadius: '50%',
        animation: 'spin 1s cubic-bezier(0.68, -0.55, 0.26, 1.55) infinite', margin: '0 auto var(--space-md)',
      }} />
      <div className="text-caption" style={{ color: 'var(--accent-lime)', marginTop: '15px' }}>ACCESSING RECORDS...</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div className="page-container" style={{
      display: 'flex',
      justifyContent: 'center',
      position: 'relative',
    }}>
      {/* Atmospheric glow */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(217, 248, 69, 0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(60px)',
      }} />

      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '580px',
        padding: 'var(--space-2xl)',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}>
        <div style={{ marginBottom: 'var(--space-2xl)' }}>
          <p className="text-caption" style={{ color: 'var(--accent-lime)', marginBottom: 'var(--space-xs)' }}>
            [ IDENTITY PROFILE ]
          </p>
          <h1 className="text-display" style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>Neural Link Settings</h1>
        </div>
        
        {error && (
          <div style={{
            padding: 'var(--space-md)',
            background: 'rgba(231, 76, 60, 0.1)',
            border: '1px solid rgba(231, 76, 60, 0.2)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-danger)',
            marginBottom: 'var(--space-lg)',
            fontSize: '0.9rem',
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <div>
            <label className="input-label">Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} className="input-field" />
          </div>

          <div>
            <label className="input-label">Profile Picture</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {formData.profilePictureUrl && (
                <img 
                  src={formData.profilePictureUrl} 
                  alt="Profile" 
                  style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--panel-border)' }} 
                />
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setSaving(true);
                    setError(null);
                    try {
                      const formDataPayload = new FormData();
                      formDataPayload.append('file', file);
                      const { ApiService } = await import('../../services/api');
                      // Using fetch directly because ApiService.post might send JSON by default
                      const token = localStorage.getItem('token');
                      const response = await fetch(`${ApiService.getBaseUrl()}/api/player/upload-profile-picture`, {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${token}`
                        },
                        body: formDataPayload
                      });
                      
                      if (!response.ok) {
                        const errText = await response.text();
                        throw new Error(errText || 'Upload failed');
                      }
                      
                      const data = await response.json();
                      setFormData(prev => ({ ...prev, profilePictureUrl: data.url }));
                    } catch (err: any) {
                      console.error(err);
                      setError(err.message || 'Error uploading image');
                    } finally {
                      setSaving(false);
                    }
                  }
                }}
                className="input-field" 
                style={{ padding: '0.5rem' }}
              />
            </div>
            <input type="hidden" name="profilePictureUrl" value={formData.profilePictureUrl} />
          </div>

          <div>
            <label className="input-label">Country</label>
            <input type="text" name="country" value={formData.country} onChange={handleChange} className="input-field" placeholder="Your country" />
          </div>

          <div>
            <label className="input-label">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="input-field"
              style={{ resize: 'vertical', fontFamily: 'var(--font-body)' }}
              placeholder="Tell us about yourself..."
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={saving}
            style={{
              marginTop: 'var(--space-sm)',
              width: '100%',
              opacity: saving ? 0.7 : 1,
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
