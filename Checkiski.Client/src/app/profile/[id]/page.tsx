/* eslint-disable */
'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function Profile() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        let url = '';
        if (id === 'me') {
          url = `${apiUrl}/api/player/profile/me`;
        } else {
          url = `${apiUrl}/api/player/profile/${id}`;
        }
        
        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, router]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading profile...</div>;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 1rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '3rem', borderRadius: '12px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{
            width: '100px', height: '100px', borderRadius: '50%',
            background: 'var(--accent-primary)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold',
            overflow: 'hidden'
          }}>
            {profile?.profilePictureUrl ? (
              <img src={profile.profilePictureUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              profile?.username?.charAt(0).toUpperCase()
            )}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: '2.5rem' }}>{profile?.username}</h1>
            {profile?.country && <div style={{ color: 'var(--accent-secondary)', marginTop: '0.25rem' }}>{profile.country}</div>}
            <div style={{ color: 'var(--foreground)', marginTop: '0.5rem', opacity: 0.8 }}>{profile?.bio || 'No bio provided.'}</div>
            <div style={{ color: 'var(--accent-secondary)', marginTop: '0.5rem' }}>Member since {profile?.createdAt ? new Date(profile.createdAt).getFullYear() : '2026'}</div>
          </div>
          {id === 'me' && (
            <button className="btn-secondary" style={{ marginLeft: 'auto' }} onClick={() => router.push('/settings')}>
              Edit Profile
            </button>
          )}
        </div>

        <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
          Ratings
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
          
          {[
            { type: 'Overall', rating: profile?.rating },
            { type: 'Bullet', rating: profile?.bulletRating },
            { type: 'Blitz', rating: profile?.blitzRating },
            { type: 'Rapid', rating: profile?.rapidRating },
            { type: 'Classical', rating: profile?.classicalRating },
          ].map(({ type, rating }) => (
            <div key={type} style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', padding: '1.5rem', textAlign: 'center'
            }}>
              <div style={{ textTransform: 'capitalize', color: 'var(--accent-secondary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                {type}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{rating || 1200}</div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
