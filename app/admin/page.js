'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function Admin() {
  const [entries, setEntries] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState('investors');

  function handleLogin(e) {
    e.preventDefault();
    if (password === 'joborganism') {
      setAuthed(true);
    }
  }

  useEffect(() => {
    if (!authed) return;
    async function load() {
      const [investorRes, ticketRes] = await Promise.all([
        supabase.from('deck_waitlist').select('*').order('created_at', { ascending: false }),
        supabase.from('golden_tickets').select('*').order('created_at', { ascending: false }),
      ]);
      if (investorRes.error) console.error(investorRes.error);
      if (ticketRes.error) console.error(ticketRes.error);
      setEntries(investorRes.data || []);
      setTickets(ticketRes.data || []);
      setLoading(false);
    }
    load();
  }, [authed]);

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <form onSubmit={handleLogin} style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 800 }}>JOB Admin</h1>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ padding: '0.7rem 1rem', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#e8e8e8', fontSize: '1rem', width: '260px', outline: 'none' }}
          />
          <br />
          <button type="submit" style={{ marginTop: '1rem', padding: '0.7rem 2rem', background: 'linear-gradient(135deg, #8b5cf6, #2dd4bf, #ec4899)', color: '#0a0a0a', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' }}>
            Enter
          </button>
        </form>
      </div>
    );
  }

  const tabStyle = (active) => ({
    padding: '0.5rem 1.5rem',
    background: active ? '#1a1a1a' : 'transparent',
    border: active ? '1px solid #2a2a2a' : '1px solid transparent',
    borderRadius: '6px',
    color: active ? '#e8e8e8' : '#666',
    cursor: 'pointer',
    fontWeight: active ? 700 : 400,
    fontSize: '0.9rem',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e8e8e8', padding: '3rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          <button style={tabStyle(tab === 'investors')} onClick={() => setTab('investors')}>
            Investors ({entries.length})
          </button>
          <button style={tabStyle(tab === 'tickets')} onClick={() => setTab('tickets')}>
            Golden Tickets ({tickets.length})
          </button>
        </div>

        {loading ? (
          <p style={{ color: '#999' }}>Loading...</p>
        ) : tab === 'investors' ? (
          <>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Investor Waitlist</h1>
            {entries.length === 0 ? (
              <p style={{ color: '#999' }}>No entries yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Name', 'Email', 'Phone', 'Investment Level', 'Date'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', borderBottom: '1px solid #2a2a2a', fontSize: '0.8rem', fontWeight: 700, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map(entry => (
                      <tr key={entry.id}>
                        <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #1a1a1a', fontWeight: 600 }}>{entry.name}</td>
                        <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #1a1a1a', color: '#999' }}>
                          <a href={`mailto:${entry.email}`} style={{ color: '#2dd4bf', textDecoration: 'none' }}>{entry.email}</a>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #1a1a1a', color: '#999' }}>
                          {entry.phone ? <a href={`tel:${entry.phone}`} style={{ color: '#2dd4bf', textDecoration: 'none' }}>{entry.phone}</a> : '—'}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #1a1a1a', color: entry.investment_level === '$500K+' ? '#ec4899' : entry.investment_level === '$100K-$500K' ? '#8b5cf6' : '#999', fontWeight: entry.investment_level && entry.investment_level.includes('$') ? 600 : 400 }}>
                          {entry.investment_level || '—'}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #1a1a1a', color: '#666', fontSize: '0.85rem' }}>
                          {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#c9a84c' }}>Golden Ticket Requests</h1>
            {tickets.length === 0 ? (
              <p style={{ color: '#999' }}>No requests yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Name', 'Email', 'Why', 'Date'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', borderBottom: '1px solid #2a2a2a', fontSize: '0.8rem', fontWeight: 700, color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map(ticket => (
                      <tr key={ticket.id}>
                        <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #1a1a1a', fontWeight: 600 }}>{ticket.name}</td>
                        <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #1a1a1a', color: '#999' }}>
                          <a href={`mailto:${ticket.email}`} style={{ color: '#c9a84c', textDecoration: 'none' }}>{ticket.email}</a>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #1a1a1a', color: '#999', maxWidth: '400px' }}>
                          {ticket.why || '—'}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #1a1a1a', color: '#666', fontSize: '0.85rem' }}>
                          {new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
