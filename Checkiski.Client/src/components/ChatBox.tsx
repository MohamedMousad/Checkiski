'use client';
import React, { useState, useEffect, useRef } from 'react';
import type { HubConnection } from '@microsoft/signalr';

export default function ChatBox({ gameId, connection }: { gameId: string, connection: HubConnection | null }) {
  const [messages, setMessages] = useState<{sender: string, text: string}[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (connection) {
      const handleReceiveMsg = (sender: string, text: string) => {
        setMessages(prev => [...prev, { sender, text }]);
      };
      
      connection.on("ReceiveMessage", handleReceiveMsg);

      return () => {
        connection.off("ReceiveMessage", handleReceiveMsg);
      };
    }
  }, [connection]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !connection) return;

    const username = localStorage.getItem('username') || 'You';
    connection.invoke("SendMessage", gameId, username, input.trim()).catch(err => console.error(err));
    setInput('');
  };

  return (
    <div className="glass-panel" style={{
      width: '100%', height: '250px', display: 'flex', flexDirection: 'column',
      overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)',
      background: 'rgba(20,20,25,0.8)'
    }}>
      <div style={{
        padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)',
        fontWeight: 'bold', background: 'rgba(255,255,255,0.05)', textAlign: 'center'
      }}>
        Live Chat
      </div>
      
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {messages.length === 0 && <div style={{ color: '#aaa', textAlign: 'center', fontStyle: 'italic', marginTop: '1rem' }}>No messages yet</div>}
        {messages.map((m, i) => (
          <div key={i} style={{ fontSize: '0.9rem' }}>
            <span style={{ fontWeight: 'bold', color: m.sender === 'You' ? 'var(--accent-primary)' : 'var(--accent-secondary)' }}>
              {m.sender}: 
            </span>
            <span style={{ marginLeft: '0.5rem', color: '#e0e6ed' }}>{m.text}</span>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1, padding: '0.75rem', background: 'transparent', border: 'none',
            color: '#fff', outline: 'none'
          }}
        />
        <button type="submit" style={{
          padding: '0 1rem', background: 'var(--accent-primary)', border: 'none',
          color: '#fff', fontWeight: 'bold', cursor: 'pointer'
        }}>
          Send
        </button>
      </form>
    </div>
  );
}
