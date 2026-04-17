'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const RANGES = {
  '$1K-$10K': [1000, 10000],
  '$10K-$50K': [10000, 50000],
  '$50K-$100K': [50000, 100000],
  '$100K-$500K': [100000, 500000],
  '$500K+': [500000, 500000],
};

function Dashboard({ entries, tickets }) {
  const withLevel = entries.filter(e => e.investment_level && e.investment_level.includes('$'));
  const watching = entries.filter(e => e.investment_level === 'Just watching');

  let minTotal = 0;
  let maxTotal = 0;
  const breakdown = {};

  withLevel.forEach(e => {
    const range = RANGES[e.investment_level];
    if (range) {
      minTotal += range[0];
      maxTotal += range[1];
      breakdown[e.investment_level] = (breakdown[e.investment_level] || 0) + 1;
    }
  });

  const fmt = (n) => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : `$${(n / 1000).toFixed(0)}K`;

  const statCard = (label, value, color = '#e8e8e8') => (
    <div style={{ flex: 1, padding: '1.25rem', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '10px', textAlign: 'center' }}>
      <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', marginBottom: '0.5rem' }}>{label}</p>
      <p style={{ fontSize: '2rem', fontWeight: 800, color }}>{value}</p>
    </div>
  );

  const barMax = Math.max(...Object.values(breakdown), 1);

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Dashboard</h1>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {statCard('Total Signups', entries.length, '#2dd4bf')}
        {statCard('Active Investors', withLevel.length, '#8b5cf6')}
        {statCard('Golden Tickets', tickets.length, '#c9a84c')}
        {statCard('Just Watching', watching.length, '#666')}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {statCard('Min Waitlisted', fmt(minTotal), '#ec4899')}
        {statCard('Max Waitlisted', fmt(maxTotal), '#ec4899')}
      </div>

      {Object.keys(breakdown).length > 0 && (
        <div style={{ padding: '1.25rem', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '10px', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', marginBottom: '1rem' }}>Investment Breakdown</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {Object.entries(RANGES).map(([level]) => {
              const count = breakdown[level] || 0;
              if (count === 0) return null;
              return (
                <div key={level} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ width: '120px', fontSize: '0.85rem', color: '#999', flexShrink: 0 }}>{level}</span>
                  <div style={{ flex: 1, height: '24px', background: '#1a1a1a', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${(count / barMax) * 100}%`, height: '100%', background: level === '$500K+' ? '#ec4899' : level === '$100K-$500K' ? '#8b5cf6' : '#2dd4bf', borderRadius: '4px', transition: 'width 0.3s' }} />
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e8e8e8', width: '30px', textAlign: 'right' }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tickets.length > 0 && (
        <div style={{ padding: '1.25rem', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '10px' }}>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', marginBottom: '0.75rem' }}>Recent Golden Ticket Requests</p>
          {tickets.slice(0, 5).map(t => (
            <div key={t.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600 }}>{t.name} <span style={{ color: '#666', fontWeight: 400 }}>{t.why ? `— "${t.why}"` : ''}</span></span>
              <span style={{ color: '#666', fontSize: '0.8rem' }}>{new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  const [entries, setEntries] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState('dashboard');

  function handleLogin(e) {
    e.preventDefault();
    if (password === 'P@cM@n123') {
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
          <button style={tabStyle(tab === 'dashboard')} onClick={() => setTab('dashboard')}>
            Dashboard
          </button>
          <button style={tabStyle(tab === 'investors')} onClick={() => setTab('investors')}>
            Investors ({entries.length})
          </button>
          <button style={tabStyle(tab === 'tickets')} onClick={() => setTab('tickets')}>
            Golden Tickets ({tickets.length})
          </button>
        </div>

        {loading ? (
          <p style={{ color: '#999' }}>Loading...</p>
        ) : tab === 'dashboard' ? (
          <Dashboard entries={entries} tickets={tickets} />
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
