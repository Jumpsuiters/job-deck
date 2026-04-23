'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// ============================================================
// JOB REPORT — INTERACTIVE DEMO COMPONENT
// ============================================================

const SEEDED_ENTRIES = [
  {
    id: 'seed-diane',
    who: 'Diane',
    description: 'Introduced Nicole to a CHRO at a Fortune 500 who\'s interested in piloting a 2,000-person transition.',
    category: 'Network',
    bucket: 'C',
    points_min: 2500,
    points_max: 4000,
    explanation: 'A single introduction that opened a potential six-figure enterprise contract. No invoice, no billable hours — just a relationship offered freely. This is the kind of value the old economy has no way to track.',
    open_loop_reason: 'The pilot is still in negotiation. If it lands, this one introduction could become the highest-ROI contribution in the organism\'s history. The ledger keeps it alive until it compounds.',
  },
  {
    id: 'seed-jumpsuit',
    who: 'Jumpsuit',
    description: 'Built a new Business 3.0 IP framework.',
    category: 'Build',
    bucket: 'C',
    points_min: 3000,
    points_max: 5000,
    explanation: 'A company contributing proprietary IP directly into the organism. This isn\'t a vendor contract — it\'s a member building infrastructure that the whole ecosystem will run on.',
    open_loop_reason: 'B3.0 hasn\'t launched paid cohorts yet. When it does, this contribution becomes the revenue engine for an entire SPV. The organism tracks it now so the value is honored later.',
  },
  {
    id: 'seed-levi',
    who: 'Levi',
    description: 'Gifted 30 Golden Tickets to Magic Shows.',
    category: 'Network',
    bucket: 'B',
    points_min: 1500,
    points_max: 3000,
    explanation: 'Thirty personal invitations sent into the world — each one a door into the organism. No ad spend, no funnel. Just a human saying "you need to experience this." That\'s distribution you can\'t buy.',
    open_loop_reason: 'Each ticket is a potential new member. The organism tracks how many convert and what those humans go on to contribute — turning one act of generosity into a compounding network effect.',
  },
];

const BUCKET_LABEL = { A: 'Operating', B: 'Validated', C: 'Open Loop' };
const BUCKET_COLOR = { A: 'var(--teal)', B: 'var(--purple)', C: '#f5b544' };

function JobReportSlide() {
  const [entries, setEntries] = useState(SEEDED_ENTRIES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [latest, setLatest] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/job-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: input }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        const entry = {
          id: `live-${Date.now()}`,
          who: 'You',
          description: input,
          ...data.receipt,
        };
        setEntries(prev => [entry, ...prev]);
        setLatest(entry);
        setInput('');
      }
    } catch {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="slide job-report-slide">
      <h3>15 · The JOB Report</h3>
      <h1>Your contribution has always mattered. Now it has a <span className="gold">receipt.</span></h1>
      <p style={{ marginBottom: '0.75rem' }}>
        <strong>Try it below. Give yourself a job only you can do for the organism.</strong>
      </p>

      <div className="jr-grid">
        <div className="jr-left">
          <form onSubmit={handleSubmit}>
            <textarea
              className="jr-input"
              placeholder="e.g. 'Started a JOB Transition Center in my city. Like AA but for people who lost their jobs.'"
              value={input}
              onChange={e => setInput(e.target.value)}
              rows={4}
              disabled={loading}
            />
            <button type="submit" className="jr-submit" disabled={loading || !input.trim()}>
              {loading ? 'Reading…' : 'Submit your JOB Report'}
            </button>
            {error && <p className="jr-error">{error}</p>}
          </form>

          {latest && (
            <div className="jr-receipt" style={{ borderColor: BUCKET_COLOR[latest.bucket] }}>
              <div className="jr-receipt-header">
                <span className="jr-chip" style={{ background: BUCKET_COLOR[latest.bucket] }}>
                  Bucket {latest.bucket} &middot; {BUCKET_LABEL[latest.bucket]}
                </span>
                <span className="jr-chip jr-chip-outline">{latest.category}</span>
                <span className="jr-points">{latest.points_min}&ndash;{latest.points_max} pts</span>
              </div>
              <p className="jr-explanation">{latest.explanation}</p>
              {latest.open_loop_reason && (
                <p className="jr-open-loop">◌ Open loop: {latest.open_loop_reason}</p>
              )}
            </div>
          )}

          <p className="jr-disclaimer">
            JOB Points are a record of contribution &mdash; not a security, equity, or guarantee of payment.
          </p>
        </div>

        <div className="jr-right">
          <div className="jr-ledger-header">Ledger</div>
          <div className="jr-ledger">
            {entries.slice(0, 5).map(entry => (
              <div key={entry.id} className="jr-entry" style={{ borderLeftColor: BUCKET_COLOR[entry.bucket] }}>
                <div className="jr-entry-top">
                  <strong>{entry.who}</strong>
                  <span className="jr-entry-meta">
                    {entry.category} &middot; {entry.bucket} &middot; {entry.points_min}&ndash;{entry.points_max}
                  </span>
                </div>
                <p className="jr-entry-desc">{entry.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// REVENUE CHART SLIDE (kept from existing, +Transition Centers)
// ============================================================

function RevenueChartSlide() {
  const [openIndex, setOpenIndex] = useState(null);
  const experiments = [
    { name: 'JOB Training', label: 'Per-seat enterprise + Magic Show add-on', revenue: '$200M+', max: 200, breakdown: 'One enterprise deal at 30K seats × $2,500 = $75M. 10 deals/yr at varied scale = $200M+. Magic Show add-on adds 10–30% per cohort.' },
    { name: 'JOB Shift', label: 'Founder cohorts + certification', revenue: '$50M', max: 50, breakdown: '2,000 founders × $25K entry = $50M. Plus platform fees from certified implementers and ongoing cohorts.' },
    { name: 'Magic Shows', label: 'Immersions + host certification', revenue: '$40M', max: 40, breakdown: 'Two streams: (1) attendees pay to be transformed (~3,500/yr blended across formats). (2) Members pay to be trained as certified Magic Show hosts — spaceholding, sacrament training, facilitation craft.' },
    { name: 'JOB Sites', label: 'Physical cohorts + residencies', revenue: '$30M', max: 30, breakdown: '10 sites × ~$3M each (cohorts, retreats, residencies). Each site is its own experience — MagicShowLand is the flagship. Real estate arbitrage on the collapse of the old economy.' },
    { name: 'J.O.B. Board', label: 'Marketplace fees', revenue: '$20M', max: 20, breakdown: '20% platform fee on $100M GMV. Sovereign humans selling what AI can\u2019t do — coaching, mediation, hands-on craft, presence work.' },
    { name: 'JOB Fair', label: 'Tickets + vendor fees + city licensing', revenue: '$25M', max: 25, breakdown: 'Traveling expo model — ticket sales, booth fees from practitioners, corporate sponsorships, city licensing for local fairs. 50 fairs/yr × $500K avg = $25M.' },
    { name: 'The Church', label: 'Tracks + community', revenue: '$5M', max: 5, breakdown: 'Paid tracks ($500–$2K), community membership tiers, doctrine licensing to HoldCo experiments.' },
  ];
  const maxValue = 200;
  return (
    <div className="slide">
      <h3>17 · Revenue at scale</h3>
      <h1>Where the money gets made.</h1>
      <p style={{ fontSize: '1.05rem', marginTop: '0.25rem' }}><strong>Seven revenue lines. One organism.</strong> JOB Training is the wedge &mdash; biggest, fastest, already selling. The rest compound behind it as the network grows. Click any experiment for the math.</p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Numbers are early-stage models, not promises.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
        {experiments.map((exp, i) => (
          <button
            key={i}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            style={{
              background: openIndex === i ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              textAlign: 'left',
              color: 'var(--text)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div>
                <strong style={{ fontSize: '1.05rem' }}>{exp.name}</strong>
                <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem', fontSize: '0.85rem' }}>&middot; {exp.label}</span>
              </div>
              <span style={{ fontWeight: 600, fontSize: '1.1rem', whiteSpace: 'nowrap' }} className="gold">{exp.revenue}/yr</span>
            </div>
            <div style={{ marginTop: '0.6rem', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${(exp.max / maxValue) * 100}%`, height: '100%', background: 'var(--iridescent)' }} />
            </div>
            {openIndex === i && (
              <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{exp.breakdown}</p>
            )}
          </button>
        ))}
      </div>
      <p style={{ marginTop: '1rem', textAlign: 'center', maxWidth: '100%', fontSize: '1.05rem' }}>
        <strong>Combined run-rate at scale: <span className="gold">$345M+/yr.</span></strong> Resources flow to whichever experiments compound fastest. The rest compost.
      </p>
    </div>
  );
}

// ============================================================
// ASK THE ORGANISM — LIVE CHAT SLIDE
// ============================================================

function DeckLeadForm() {
  const [form, setForm] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email) return;
    setStatus('sending');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_PULSE_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email }),
      });
      if (res.ok) setStatus('sent');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return <div style={{ marginTop: '0.5rem', padding: '0.45rem 0.65rem', background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.25)', borderRadius: '8px', fontSize: '0.8rem', color: '#2dd4bf' }}>You&apos;re on the radar. Nicole or Pam will be in touch.</div>;
  }

  const inputStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '0.45rem 0.65rem', color: 'var(--text)', fontSize: '0.8rem', fontFamily: 'inherit', outline: 'none', width: '100%' };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(45,212,191,0.15)' }}>
      <input type="text" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
      <input type="email" placeholder="Email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />
      <button type="submit" disabled={status === 'sending'} style={{ background: 'var(--iridescent)', border: 'none', borderRadius: '8px', padding: '0.45rem', color: 'white', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: status === 'sending' ? 0.5 : 1 }}>
        {status === 'sending' ? 'Sending...' : status === 'error' ? 'Try again' : 'Connect me'}
      </button>
    </form>
  );
}

function OrganismChatSlide() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const msgsRef = useCallback(node => {
    if (node) node.scrollTop = node.scrollHeight;
  }, []);

  async function send(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_PULSE_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer || 'The organism is quiet right now.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'The organism is resting. Try again in a moment.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="slide">
      <h3>19 · The organism</h3>
      <h1>Don&apos;t take our word for it. <span className="gold">Ask it yourself.</span></h1>
      <p style={{ fontSize: '1.05rem', marginTop: '0.5rem', lineHeight: 1.6, textAlign: 'center', maxWidth: '580px', marginLeft: 'auto', marginRight: 'auto' }}>
        This is a living organism. It knows what it is, what it&apos;s building, and why. Go ahead &mdash; ask it anything.
      </p>

      <div className="organism-slide-chat">
        {messages.length > 0 && (
          <div className="organism-slide-messages" ref={msgsRef}>
            {messages.map((m, i) => {
              const hasLead = m.role === 'assistant' && m.content.includes('[LEAD_CAPTURE]');
              const text = m.content.replace('[LEAD_CAPTURE]', '').trim();
              return (
                <div key={i} className={`organism-slide-msg ${m.role}`}>
                  {text}
                  {hasLead && <DeckLeadForm />}
                </div>
              );
            })}
            {loading && <div className="organism-slide-msg assistant" style={{ opacity: 0.5 }}>...</div>}
          </div>
        )}
        <form onSubmit={send} className="organism-slide-form">
          <input
            className="organism-slide-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask the organism anything..."
            disabled={loading || messages.length >= 20}
            maxLength={500}
          />
          <button type="submit" className="organism-slide-send" disabled={loading || !input.trim()}>
            &#8593;
          </button>
        </form>
        {messages.length === 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem', justifyContent: 'center' }}>
            {['What is JOB?', 'How does the RCO work?', 'What\'s the revenue model?', 'Why should I invest?', 'Why AA, Indeed, and Meow Wolf?'].map((q, i) => (
              <button
                key={i}
                onClick={() => { setInput(q); }}
                style={{
                  background: 'rgba(139,92,246,0.1)',
                  border: '1px solid rgba(139,92,246,0.25)',
                  borderRadius: '20px',
                  padding: '0.35rem 0.75rem',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// SLIDES ARRAY
// ============================================================

const slides = [
  // 0 — COVER
  () => {
    const words = ['JOB Inc.', 'The Joy of Being'];
    const [wordIndex, setWordIndex] = useState(0);

    return (
      <div className="slide cover">
        <h1>J.O.B.</h1>
        <p className="subtitle">
          <span
            onClick={() => setWordIndex((i) => (i + 1) % words.length)}
            style={{
              cursor: 'pointer',
              background: 'var(--iridescent)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {words[wordIndex]}
          </span>
          <span style={{ animation: 'blink 1s step-end infinite', marginLeft: '2px', color: 'var(--purple)', WebkitTextFillColor: 'var(--purple)' }}>|</span>
        </p>
        <p style={{ fontSize: '0.9rem', letterSpacing: '0.15em', color: '#888', marginTop: '1.5rem' }}>In service of all humans being.</p>
      </div>
    );
  },

  // 1 — THE MANIFESTO
  () => (
    <div className="slide">
      <div style={{ maxWidth: '680px', marginLeft: 'auto', marginRight: 'auto', fontSize: '1.15rem', lineHeight: 1.8 }}>
        <p>The church used to fund Michelangelo. Let that sink in. The most powerful institution on earth looked at a human being and said &ldquo;we&apos;re going to resource everything inside of you.&rdquo; And it worked. We got the Renaissance.</p>
        <p style={{ marginTop: '1rem' }}>Then somewhere along the way we stopped investing in humans and started mining them. We invented Human Resources &mdash; literally named it that &mdash; and turned people into line items. Hire them. Optimize them. Terminate them. Next.</p>
        <p style={{ marginTop: '1rem' }}>And now? The job that told you who you were is being automated. The degree you went into debt for is worthless. The church is closing 15,000 doors a year.</p>
        <p style={{ marginTop: '1rem' }}>And the best we can offer is a therapist you can&apos;t afford and a r&eacute;sum&eacute; workshop to send you back into the system that just spit you out?</p>
        <p style={{ marginTop: '1rem' }}>$2.6 trillion a year. That&apos;s what we spend. Not on humans &mdash; on the fragments of humans.</p>
        <p style={{ marginTop: '1rem' }}>Who&apos;s gonna pay for it? <span className="gold" style={{ fontWeight: 700 }}>You are. We all are.</span></p>
        <p style={{ marginTop: '1rem' }}>And we&apos;re going to build the infrastructure that should have never stopped existing.</p>
        <p style={{ marginTop: '1rem' }}>And we&apos;re going to do our damndest to build it in a way that won&apos;t corrupt.</p>
      </div>
    </div>
  ),

  // 2 — THE FLIP (opening reframe)
  () => (
    <div className="slide">
      <h3>03 · The trick</h3>
      <h1>What if the systems collapse is actually the largest <span className="gold">involuntary liberation</span> in human history?</h1>
      <div className="three-col" style={{ marginTop: '1.5rem' }}>
        <div className="card">
          <p style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }} className="gold">Work</p>
          <p style={{ fontSize: '2rem', fontWeight: 700 }} className="gold">300M jobs gone.</p>
          <p>full-time job equivalents affected by AI globally (Goldman Sachs)</p>
        </div>
        <div className="card">
          <p style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }} className="gold">Religion</p>
          <p style={{ fontSize: '2rem', fontWeight: 700 }} className="gold">15,000 doors closed.</p>
          <p>churches closed last year. Where do people go when the place that held meaning disappears?</p>
        </div>
        <div className="card">
          <p style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }} className="gold">Education</p>
          <p style={{ fontSize: '2rem', fontWeight: 700 }} className="gold">63% say it&apos;s broken.</p>
          <p>say college isn&apos;t worth it &mdash; including 54% who already have the degree. The path we were promised is broken.</p>
        </div>
      </div>
      <p style={{ marginTop: '1rem', textAlign: 'center', maxWidth: '100%', fontStyle: 'italic', fontSize: '1.15rem' }}>The three institutions who told us who to be are dissolving simultaneously. What are we going to build in their place?</p>
    </div>
  ),

  // 2 — BUCKY FULLER
  () => (
    <div className="slide" style={{ justifyContent: 'center', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.4rem', lineHeight: 1.3, maxWidth: '720px', margin: '0 auto' }}>&ldquo;You never change things by fighting the existing reality. To change something, build a <span className="gold">new model</span> that makes the existing model obsolete.&rdquo;</h1>
      <p style={{ marginTop: '1.5rem', fontSize: '1rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>&mdash; Buckminster Fuller</p>
    </div>
  ),

  // 3 — THE GAP
  () => (
    <div className="slide">
      <h3>05 · The gap</h3>
      <h1>In order to build something new, we must first <span className="gold">become it.</span></h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.5rem' }}>
        <div className="card" style={{ padding: '1rem' }}>
          <p style={{ fontWeight: 700, marginBottom: '0.3rem' }} className="gold">The individual</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>From employee to sovereign.</p>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>Most people have never been asked who they are outside a role. The future belongs to humans who know.</p>
        </div>
        <div className="card" style={{ padding: '1rem' }}>
          <p style={{ fontWeight: 700, marginBottom: '0.3rem' }} className="gold">The company</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>From machine to organism.</p>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>The companies that survive won&apos;t be the most efficient &mdash; they&apos;ll be the most alive.</p>
        </div>
        <div className="card" style={{ padding: '1rem' }}>
          <p style={{ fontWeight: 700, marginBottom: '0.3rem' }} className="gold">The economy</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>From extraction to regeneration.</p>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>We built an economy that uses people up. The next one needs to grow them.</p>
        </div>
        <div className="card" style={{ padding: '1rem' }}>
          <p style={{ fontWeight: 700, marginBottom: '0.3rem' }} className="gold">The world</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>From institutions to ecosystems.</p>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>Work, church, school &mdash; they&apos;re not coming back. What replaces them has to hold everything they held, without the ceilings.</p>
        </div>
      </div>
      <p style={{ marginTop: '1.25rem', textAlign: 'center', fontStyle: 'italic', fontSize: '1.15rem' }}>The opportunity isn&apos;t to fix what&apos;s broken. It&apos;s to build what&apos;s next.</p>
    </div>
  ),

  // 4 — THE OPPORTUNITY
  () => (
    <div className="slide">
      <h3>06 · The insight</h3>
      <h1>No one&apos;s building the infrastructure for <span className="gold">humans being.</span></h1>
      <p style={{ fontSize: '1.3rem', marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>UBI gives people money. It doesn&apos;t give them meaning. We&apos;re building the infrastructure for the part that no one seems to have an answer for.</p>
    </div>
  ),

  // 5 — JOY OF BEING (name reveal)
  () => (
    <div className="slide">
      <h3>07 · The solution</h3>
      <h1>Being human <span className="gold">IS the job.</span></h1>
      <p style={{ fontSize: '1.3rem', marginTop: '1.25rem', lineHeight: 1.5, fontWeight: 700 }} className="gold">Imagine if AA, Meow Wolf, and Indeed teamed up and accidentally on purpose created the New Human Economy.</p>
      <p style={{ fontSize: '1.1rem', marginTop: '1.25rem', lineHeight: 1.7 }}>J.O.B. is the first economy built on being human. We resource people through this existential transition &mdash; helping them grieve, self-regulate, remember who they are, and build the world that comes next.</p>
    </div>
  ),

  // 6 — BUT WHO'S GONNA PAY FOR IT?
  () => {
    const [showRant, setShowRant] = useState(false);
    const [displayText, setDisplayText] = useState('');
    const rant = "Oh my god. This question. This is the question that makes me want to flip a table. You\u2019re ALREADY paying for it! You\u2019re paying for it in burnout and bad therapy and $200K degrees that don\u2019t mean anything and Sunday mornings with nowhere to go. The money is there. It has ALWAYS been there. Humans just keep asking this question like it\u2019s a real question and I\u2019m like \u2014 babe. It\u2019s the funniest cosmic joke on the planet. The only question is whether we keep spending it on band-aids or we finally build something real.";

    useEffect(() => {
      if (!showRant) return;
      setDisplayText('');
      let i = 0;
      const timer = setInterval(() => {
        i++;
        setDisplayText(rant.slice(0, i));
        if (i >= rant.length) clearInterval(timer);
      }, 25);
      return () => clearInterval(timer);
    }, [showRant]);

    return (
      <div className="slide">
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
          <h1 onClick={() => setShowRant(true)} style={{ fontSize: '2.8rem', textAlign: 'center', cursor: 'pointer' }} className="gold">But who&apos;s gonna pay for it?</h1>
          {showRant && (
            <div style={{ maxWidth: '600px', textAlign: 'center' }}>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, fontStyle: 'italic', color: 'var(--text-muted)' }}>&ldquo;{displayText}<span style={{ animation: 'blink 1s step-end infinite', color: 'var(--gold)' }}>|</span>&rdquo;</p>
              {displayText.length >= rant.length && (
                <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 600, opacity: 0, animation: 'fadeIn 0.5s ease forwards' }}>&mdash; Pam Kosanke, who invented the McDonald&apos;s breakfast dollar menu and knows exactly where the money is</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },

  // 7 — EVERYBODY
  () => (
    <div className="slide">
      <h3>09 · The answer</h3>
      <h1><span className="gold">Everybody.</span> We&apos;re already paying for it.</h1>
      <p style={{ fontSize: '1.05rem', marginTop: '0.75rem', lineHeight: 1.6, textAlign: 'center' }}>The money is already being spent &mdash; it&apos;s just scattered across industries that each hold a piece of the person. We&apos;re the first place it converges.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.25rem', maxWidth: '620px', marginLeft: 'auto', marginRight: 'auto' }}>
        {[
          ['Companies', 'Because they\u2019re already spending billions on the problem, so here\u2019s a better option that lets them sleep at night'],
          ['People', 'Because they\u2019re already paying for therapy, coaching, wellness, and spiritual communities \u2014 separately'],
          ['Investors', 'Because this is a new asset class \u2014 an organism that compounds, not a startup that exits'],
          ['Philanthropists', 'Because this is the mission they\u2019ve been looking for \u2014 structural change, not another band-aid'],
          ['Members', 'Because they\u2019re going to pay with more than money: they\u2019ll contribute time, skills, presence, and connection as legitimate value'],
        ].map(([who, why], i) => (
          <div key={i} style={{ padding: '0.65rem 0.85rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
            <span className="gold" style={{ fontWeight: 700 }}>{who}.</span>{' '}
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{why}</span>
          </div>
        ))}
      </div>
      <p style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: 700 }}>Everyone wants to fund the future. Nobody knows how to build it <span className="gold">without repeating the past.</span></p>
    </div>
  ),

  // 7 — THE STRUCTURE (four layers)
  () => {
    const [openIds, setOpenIds] = useState(new Set());
    const toggle = (id) => setOpenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    const isOpen = (id) => openIds.has(id);

    const layerBox = (color, bg) => ({
      width: '100%', padding: '0.55rem 0.75rem', border: `1px solid ${color}`, borderRadius: '8px',
      background: bg, cursor: 'pointer', marginBottom: '0.15rem', transition: 'background 0.15s',
    });
    const layerLabel = { fontWeight: 700, fontSize: '0.95rem' };
    const layerRole = (color) => ({ fontSize: '0.65rem', color, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.1rem' });
    const layerDesc = { fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem', lineHeight: 1.45, opacity: 0, animation: 'fadeIn 0.3s ease forwards' };
    const connector = (color) => ({ width: '2px', height: '14px', background: color, opacity: 0.5, margin: '0 auto' });
    const childBox = (color) => ({
      padding: '0.35rem 0.55rem', border: `1px solid ${color}`, borderRadius: '6px',
      background: 'rgba(255,255,255,0.02)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
    });

    const holdcoItems = [
      { id: 'pool', label: 'Investment Pool', desc: 'Community-owned capital via Wefunder / Reg CF equity crowdfunding. The people who believe in J.O.B. own a piece of it. Capital flows into experiments, and successful ones become their own investable entities.' },
      { id: 'ops', label: 'Operations + Incubator', desc: 'The nervous system of the organism. Runs day-to-day operations and incubates new experiments. When something works, it graduates into its own SPV. When it doesn\u2019t, it gets composted \u2014 learnings and relationships recycled back into the system.' },
      { id: 'spvs', label: 'SPV Subsidiaries', desc: 'Each successful experiment becomes its own investable entity. SPVs can raise independently while staying connected to the organism. This is how the HoldCo scales without centralizing.', children: [
        { id: 'nhr', label: 'JOB Training', desc: 'B2B transition-as-benefit. The revenue wedge. Companies pay to train their people through J.O.B. instead of handing them a severance check and a LinkedIn link. The budget already exists \u2014 we\u2019re the first honest use of it.' },
        { id: 'b30', label: 'JOB Shift', desc: 'Organizational transformation consulting. Helps companies shift from machine to organism. Founder cohorts, certified Guides, and a framework built on nature\u2019s intelligence \u2014 not another management theory.' },
        { id: 'msl', label: 'JOB Sites', desc: 'Physical immersive spaces in abandoned churches, castles, and colleges \u2014 where humans go to remember what they are. Each site is its own experience. MagicShowLand is the flagship.' },
        { id: 'ms', label: 'Magic Shows', desc: 'Experiential events that crack people open. Corporate retreats, public gatherings, initiatory experiences. Psychedelic-adjacent journeys where human magic gets rediscovered in days, not years.' },
        { id: 'board', label: 'J.O.B. Board', desc: 'A marketplace for things AI can\u2019t do. Humans post uniquely human offers \u2014 presence, care, craft, mentorship. Other humans pay for them. 20% platform fee. The Trojan Horse: it looks like a gig platform, but it\u2019s a doorway into the organism.' },
        { id: 'fair', label: 'JOB Fair', desc: 'A traveling expo of the new human economy. Death doulas, trip sitters, nervous system regulators, craft workers \u2014 every job AI can\u2019t do, showcased in one place. Part trade show, part awakening.' },
      ]},
      { id: 'ext', label: 'External Investments', desc: 'The organism can invest in member projects and aligned ventures, expanding the mycelial network. Not acquisitions \u2014 resonance-based partnerships where the whole gets stronger.', children: [
        { id: 'spirit', label: 'SpiritTech', desc: 'Technology that serves the human spirit, not the other way around. Investments in tools and platforms that honor human sovereignty.' },
        { id: 'immersive', label: 'Immersive Centers', desc: 'Spaces designed for transformation beyond JOB Sites \u2014 experiential environments where the work of becoming human has a physical home.' },
      ]},
      { id: 'profits', label: 'Returns to Investors', desc: 'The organism rewards the humans who fund it. Profits flow back to community investors \u2014 the people who believed before it was obvious. Not charity, not extraction \u2014 regenerative returns.' },
    ];
    const rcoItems = [
      { id: 'members', label: 'Members', desc: 'People join the organism and contribute non-monetary investment \u2014 time, skills, network, ideas, care. This is how the RCO grows: not through hiring, but through attraction. Financial investment flows through the For-Profit side.' },
      { id: 'matching', label: 'Matching', desc: 'The organism routes humans to needs, projects, and each other \u2014 based on energy, fit, and what\u2019s alive right now. This is the internal intelligence that powers the J.O.B. Board and every other surface where humans meet work.' },
      { id: 'contribution', label: 'Contribution', desc: 'Every human in the organism gives something \u2014 time, skills, presence, connection. Contribution tracking makes the invisible visible: who gave what, where it flowed, what grew from it. This is how the organism knows what\u2019s alive and what\u2019s ready to compost.' },
      { id: 'intelligence', label: 'Collective Intelligence', desc: 'The brain of the organism. A living dashboard where the entire network can see itself \u2014 every human, every connection, every journey across every door. When the organism can see itself, it self-regulates. Elders fill gaps. Members send energy where it\u2019s needed. No one at the center has to decide.' },
    ];
    const churchItems = [
      { id: 'doctrine', label: 'Doctrine + Sacrament', desc: 'The sacred container. Sunday Night Live, elder-guided tracks, the initiatory journey. Living doctrine that evolves with the community, not dogma handed down. The deprogramming is the root \u2014 everything else is a surface for that transformation to show up.' },
      { id: 'mutual', label: 'Mutual Aid', desc: 'The organism takes care of its own. Community support, resource sharing, mutual aid networks. When a member is in crisis, the Church responds \u2014 not with a form, but with presence. Humans helping humans, the original technology.' },
      { id: 'grants', label: 'Grants + MicroGrants', desc: 'Small bets on sovereign humans. Funding for members who are building something from the inside out. The organism invests in the people it creates \u2014 before the market would.' },
      { id: 'ip', label: 'Church IP (licensed to HoldCo)', desc: 'The transformation methodology, curriculum, and practices \u2014 owned by the nonprofit, licensed to the HoldCo. This is the bridge: mission-side IP fuels commercial-side revenue without the mission losing control. The RCO agreement ensures it stays that way.' },
      { id: 'land', label: 'Holds Land', desc: 'Physical spaces owned by the nonprofit \u2014 sanctuaries, gathering spaces, future JOB Sites. Land held in trust for the community, not for profit. These are the rooms the organism builds in.' },
      { id: 'research', label: 'Research + Publication', desc: 'Studying what happens when humans deprogram. Publishing findings. Building the evidence base for a new way of being. The organism documents its own evolution so others can learn from it.' },
    ];

    const ChildRow = ({ item, color }) => (
      <div>
        <div onClick={(e) => { e.stopPropagation(); toggle(item.id); }} style={childBox(color)}>
          {item.label} {item.children ? '+' : ''}
        </div>
        {isOpen(item.id) && (
          <div style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4, opacity: 0, animation: 'fadeIn 0.3s ease forwards' }}>
            {item.desc}
            {item.children && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.3rem' }}>
                {item.children.map(c => (
                  <div key={c.id}>
                    <div onClick={(e) => { e.stopPropagation(); toggle(c.id); }} style={childBox(color)}>{c.label}</div>
                    {isOpen(c.id) &&<div style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4, opacity: 0, animation: 'fadeIn 0.3s ease forwards' }}>{c.desc}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );

    return (
      <div className="slide">
        <h3>10 · The structure</h3>
        <h1><span className="gold">Incorruptible</span> by design.</h1>
        <p style={{ fontSize: '1rem', marginTop: '0.5rem', marginBottom: '0.5rem', lineHeight: 1.6, textAlign: 'center', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>A game this big needs a structure the old world can&apos;t swallow. Can&apos;t acquire it. Can&apos;t extract from it. Can&apos;t shut it down. So we didn&apos;t build a company. We grew an organism. JOB is a Business 3.0 entity and the first RCO in the United States.</p>
        <p style={{ fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.6, textAlign: 'center', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto', color: 'var(--text-muted)' }}>Every organism has a lifecycle. JOB is no different. It&apos;s born. It grows. It fruits. And when the question is answered &mdash; or no longer needs asking &mdash; it composts itself entirely. On purpose. The RCO agreement guarantees the full arc. When the cycle completes, IP becomes commons, capital returns to members, and the infrastructure becomes soil for whatever grows next. <span style={{ color: 'var(--gold)' }}>The organism knows its JOB.</span></p>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.5rem', opacity: 0.6 }}>&#9758; Click any layer to explore</p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

          {/* J.O.B. */}
          <div style={{ background: 'var(--iridescent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: '1.4rem', fontWeight: 800 }}>J.O.B.</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, fontStyle: 'italic', color: 'var(--gold)', marginBottom: '0.3rem' }}>&ldquo;What happens when being human is the job?&rdquo;</div>

          {/* LAYER 1: RCO Agreement */}
          <div style={connector('#c9a84c')} />
          <div onClick={() => toggle('ppt')} style={layerBox('#c9a84c', 'rgba(201,168,76,0.08)')}>
            <div style={layerLabel}>RCO Agreement</div>
            <div style={layerRole('#c9a84c')}>Protects the Purpose</div>
            {isOpen('ppt') && (
              <p style={layerDesc}>Binds the nonprofit and for-profit together. The agreement&apos;s legal obligation is to the guiding question &mdash; not to founders, not to shareholders. The mission can never be sold, acquired, or diluted. And when the question is no longer alive or relevant, the agreement guides the organism to compost itself on purpose.</p>
            )}
          </div>

          {/* LAYER 2: RCO */}
          <div style={connector('var(--pink)')} />
          <div onClick={() => toggle('rco')} style={layerBox('var(--pink)', 'rgba(236,72,153,0.08)')}>
            <div style={layerLabel}>RCO &mdash; Regenerative Community Organism</div>
            <div style={layerRole('var(--pink)')}>Produces the Value</div>
            {isOpen('rco') && (
              <p style={layerDesc}>Members contribute more than money &mdash; time, skills, presence, connection. The organism tracks what they give, and they redeem that value over time. The mycelial network makes it all visible &mdash; so the organism always knows where to grow itself next.</p>
            )}
          </div>
          {isOpen('rco') && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.15rem', opacity: 0, animation: 'fadeIn 0.3s ease forwards' }}>
              {rcoItems.map(item => <ChildRow key={item.id} item={item} color="rgba(236,72,153,0.25)" />)}
            </div>
          )}

          {/* LAYER 3: HOLDCO + CHURCH side by side */}
          <div style={{ display: 'flex', gap: '0.5rem', width: '100%', alignItems: 'flex-start' }}>
            {/* HoldCo column */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={connector('var(--purple)')} />
              <div onClick={() => toggle('holdco')} style={layerBox('var(--purple)', 'rgba(139,92,246,0.08)')}>
                <div style={layerLabel}>For-Profit HoldCo</div>
                <div style={layerRole('var(--purple)')}>Drives the Business</div>
                {isOpen('holdco') && (
                  <p style={layerDesc}>The financial engine. Raises capital, funds experiments, graduates winners into SPVs, and returns profits to investors.</p>
                )}
              </div>
              {isOpen('holdco') && (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.15rem', opacity: 0, animation: 'fadeIn 0.3s ease forwards' }}>
                  {holdcoItems.map(item => <ChildRow key={item.id} item={item} color="rgba(139,92,246,0.25)" />)}
                </div>
              )}
            </div>

            {/* Church column */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={connector('var(--teal)')} />
              <div onClick={() => toggle('church')} style={layerBox('var(--teal)', 'rgba(45,212,191,0.08)')}>
                <div style={layerLabel}>The Church</div>
                <div style={layerRole('var(--teal)')}>Sustains the Soul</div>
                {isOpen('church') && (
                  <p style={layerDesc}>The meaning layer. Develops people, holds the values, and ensures the system stays human and aligned. Owns the transformation IP and licenses it to the HoldCo.</p>
                )}
              </div>
              {isOpen('church') && (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.15rem', opacity: 0, animation: 'fadeIn 0.3s ease forwards' }}>
                  {churchItems.map(item => <ChildRow key={item.id} item={item} color="rgba(45,212,191,0.25)" />)}
                </div>
              )}
            </div>
          </div>

          {/* Summary line */}
          <p style={{ marginTop: '0.6rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
            The <span style={{ color: '#c9a84c' }}>Agreement</span> protects the purpose. The <span style={{ color: 'var(--pink)' }}>RCO</span> produces the value. The <span style={{ color: 'var(--purple)' }}>HoldCo</span> drives the business. The <span style={{ color: 'var(--teal)' }}>Church</span> sustains the soul.
          </p>
        </div>
      </div>
    );
  },

  // 8 — PROOF OF LIFE
  () => (
    <div className="slide">
      <h3>11 · Proof of life</h3>
      <h1>This organism is <span className="gold">already growing.</span></h1>
      <p style={{ fontSize: '1.05rem', marginTop: '0.75rem', lineHeight: 1.6, textAlign: 'center' }}>Before a single dollar of outside investment, the network started building itself.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.25rem', maxWidth: '580px', marginLeft: 'auto', marginRight: 'auto' }}>
        {[
          ['The entity structure is forming', 'Legal body taking shape — RCO Agreement, HoldCo, Church'],
          ['The RCO has members', 'People aren\u2019t buying a service \u2014 they\u2019re joining an organism'],
          ['The HoldCo has products', 'Six experiments designed, built, or in motion — before a single dollar of outside capital'],
          ['The Church has members', 'People showing up weekly for something with no obvious ROI'],
          ['People keep hiring themselves', 'No one asked them to. The thesis is already proving itself.'],
        ].map(([title, desc], i) => (
          <div key={i} style={{ padding: '0.65rem 0.85rem', border: '1px solid var(--border)', borderRadius: '8px', background: i === 4 ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.03)', borderColor: i === 4 ? 'var(--gold)' : 'var(--border)' }}>
            <div className={i === 4 ? 'gold' : ''} style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{title}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>{desc}</div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: 700 }}>This isn&apos;t a pitch for something we want to build. <span className="gold">It&apos;s already breathing.</span></p>
    </div>
  ),

  // 9 — THE EXPERIMENTS
  () => (
    <div className="slide">
      <h3>12 · The portfolio</h3>
      <h1>Successful experiments become SPVs. <span className="gold">The rest get composted.</span></h1>
      <p style={{ fontSize: '1.05rem', marginTop: '0.5rem', lineHeight: 1.6, textAlign: 'center', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto', color: 'var(--text-muted)' }}>Venture studios take bets. Incubators run cohorts. We do both &mdash; but ours are in service of the question. What works graduates into an SPV. What doesn&apos;t gets composted back into the organism &mdash; not as a failed experiment, but as nutrient-rich soil that the rest of the organism can feed from.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginTop: '1.25rem', maxWidth: '720px', marginLeft: 'auto', marginRight: 'auto' }}>
        {[
          ['JOB Training', null, 'HR & Enterprise', 'Outplacement for their layoff', 'People who come out more alive than they went in', 'We create the New Human Resources.'],
          ['JOB Shift', 'Business 3.0', 'Consulting', 'Organizational transformation', 'A company that runs on aliveness instead of extraction', 'We create the new model.'],
          ['JOB Board', null, 'Marketplace', 'A gig platform', 'A place where presence, not productivity, is the product', 'We create a marketplace from supply, not demand.'],
          ['JOB Sites', null, 'Real Estate', 'An immersive experience', 'Where the most abandoned spaces become the most alive', 'We create 4th spaces and real estate arbitrage.'],
          ['JOB Fair', null, 'Events & Expo', 'A job fair', 'Every job AI can\u2019t touch, in one place', 'We create the new human economy.'],
          ['Magic Shows', null, 'Entertainment', 'Tickets to the show', 'The fastest way back to themselves', 'We trick people into remembering that they\u2019re the magic.'],
        ].map(([abbr, name, tag, buying, getting, trick], i) => (
          <div key={i} style={{ padding: '0.65rem 0.85rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}><div><span className="gold" style={{ fontWeight: 700, fontSize: '0.95rem' }}>{abbr}</span>{name ? <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.8rem' }}> — {name}</span> : null}</div><span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: '4px', padding: '0.15rem 0.4rem' }}>{tag}</span></div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.45 }}><strong>They buy:</strong> {buying}</div>
            <div style={{ fontSize: '0.8rem', lineHeight: 1.45, marginTop: '0.15rem' }}><strong>They get:</strong> {getting}</div>
            <div style={{ fontSize: '0.75rem', lineHeight: 1.4, marginTop: '0.2rem', fontStyle: 'italic' }} className="gold"><strong>The trick:</strong> {trick}</div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: 700 }}>Every door leads to the same place. <span className="gold">Your new J.O.B.</span></p>
      <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>This is just what we&apos;re building today. But the real strategy <span className="gold" style={{ fontWeight: 700 }}>runs deeper.</span></p>
    </div>
  ),

  // THE TROJAN HORSE (the reveal, after they've seen the experiments)
  () => (
    <div className="slide">
      <h3>13 · The strategy</h3>
      <h1>Everything is a <span className="gold">Trojan Horse.</span></h1>
      <p style={{ fontSize: '1.2rem', marginTop: '2rem', lineHeight: 1.7, textAlign: 'center' }}>The future doesn&apos;t announce itself. It shows up dressed as something familiar &mdash; and changes you from the inside.</p>
      <p style={{ fontSize: '1.15rem', marginTop: '2rem', lineHeight: 1.7, textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>A marketplace. A church. A show. A company. A membership. A fund.</p>
      <p style={{ fontSize: '1.05rem', marginTop: '1.25rem', lineHeight: 1.7, textAlign: 'center' }}>Things that used to extract. That now, all of a sudden, regenerate.</p>
      <p style={{ fontSize: '1.3rem', marginTop: '2rem', textAlign: 'center', fontWeight: 700 }}>The best way to end the old game is to build a better one alongside it. Until one day, nobody&apos;s playing the old one at all &mdash; <span className="gold">including us.</span></p>
    </div>
  ),

  // 15 — THE MOAT (two moats: memory + language)
  () => (
    <div className="slide">
      <h3>14 · The moat</h3>
      <h1>Our moat isn&apos;t technology. It&apos;s <span className="gold">language.</span> And <span className="gold">memory.</span></h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.25rem', maxWidth: '720px', marginLeft: 'auto', marginRight: 'auto' }}>
        <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--border)', borderRadius: '10px', background: 'rgba(255,255,255,0.03)' }}>
          <p className="gold" style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Language</p>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>We&apos;re reclaiming the entire vocabulary of work. Every familiar &ldquo;job&rdquo; word gets inverted &mdash; familiar on the outside, transformative on the inside.</p>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginTop: '0.5rem' }}>JOB Description. JOB Offer. JOB Interview. JOB Shift. JOB Training. JOB Fair. JOB Search. Every word people thought they understood about work means something different in our world.</p>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginTop: '0.5rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>It&apos;s a language system no one can copy &mdash; because it&apos;s not a brand. It&apos;s a worldview.</p>
        </div>
        <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--border)', borderRadius: '10px', background: 'rgba(255,255,255,0.03)' }}>
          <p className="gold" style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Memory</p>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>Members contribute more than money &mdash; introductions, ideas, presence, care. Thanks to AI, we can finally track the impact of human contribution over time.</p>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginTop: '0.5rem' }}>An intro you make today could turn into a free Magic Show. A JOB Shift cohort. A year-long residency in Costa Rica.</p>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginTop: '0.5rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>The organism remembers. And it doesn&apos;t just track contribution. It learns where to grow next.</p>
        </div>
      </div>
      <p style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '1.1rem', fontWeight: 700, background: 'var(--iridescent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>One moat no one can outbuild. Another no one can copy. Together, they make the organism uncatchable.</p>
    </div>
  ),

  // 15 — THE JOB REPORT (interactive demo)
  JobReportSlide,

  // 16 — TEAM
  () => (
    <div className="slide">
      <h3>16 · The team</h3>
      <h1>Who&apos;s audacious enough to <span className="gold">pull this off?</span></h1>
      <div className="two-col" style={{ marginTop: '0.75rem' }}>
        <div className="card">
          <h3 style={{ color: 'var(--text)', textTransform: 'none', letterSpacing: '-0.01em', fontSize: '1.3rem', WebkitTextFillColor: 'var(--text)', marginBottom: '0.15rem' }}>Nicole Ayres</h3>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', fontWeight: 700, marginBottom: '0.5rem' }}>Co-Founder / Future of Work + AI Expert</p>
          <ul>
            <li>Built a $4M agency that runs itself &mdash; zero funding, zero paid ads, and zero employees. <em>She already proved the model.</em></li>
            <li>Future of Work AI platform acquired 2024. <em>She sees what&apos;s coming before it arrives.</em></li>
            <li>Building J.O.B. in real time with AI. <em>She doesn&apos;t pitch the future. She builds it.</em></li>
          </ul>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--text)', textTransform: 'none', letterSpacing: '-0.01em', fontSize: '1.3rem', WebkitTextFillColor: 'var(--text)', marginBottom: '0.15rem' }}>Pam Kosanke</h3>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', fontWeight: 700, marginBottom: '0.5rem' }}>Co-Founder / Category Creator + Global Scale Expert</p>
          <ul>
            <li>Former CRO, EOS Worldwide &mdash; $145M revenue, 800+ implementers. <em>She already knows how to scale an organism.</em></li>
            <li>Invented McDonald&apos;s breakfast dollar menu. <em>She sees money where nobody&apos;s looking.</em></li>
            <li>6× world champion, Team USA. <em>She doesn&apos;t stop.</em></li>
          </ul>
        </div>
      </div>
      <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.85rem', border: '1px solid var(--gold)', borderRadius: '8px', background: 'rgba(201,168,76,0.05)' }}>
        <p className="gold" style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem' }}>The organism is already building itself.</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>A decentralized network of humans &mdash; builders, healers, economists, facilitators, technologists, dogs &mdash; self-organizing around the guiding question. Nobody assigned roles. Nobody drew an org chart. They felt the pull and started building.</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontStyle: 'italic' }}>This is what an organism does. It grows toward aliveness.</p>
      </div>
      <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}><span className="gold" style={{ fontWeight: 700 }}>Hundreds</span> are already members of the church and hundreds more are waiting to join the RCO. We&apos;re not driving growth. The network is building itself.</p>
    </div>
  ),

  // 17 — THE MARKET
  () => (
    <div className="slide">
      <h3>18 · The market</h3>
      <h1>We&apos;re not entering a market. We&apos;re the first place it <span className="gold">converges.</span></h1>
      <p style={{ fontSize: '1.05rem', marginTop: '0.75rem', lineHeight: 1.6, textAlign: 'center', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>Every one of these industries exists because humans are fragmented &mdash; each one holds a piece of the person, none of them hold the whole. $2.6 trillion a year flows into solving parts of the same problem.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.5rem', marginTop: '1.25rem', maxWidth: '780px', marginLeft: 'auto', marginRight: 'auto' }}>
        {[
          ['$739B', 'HR & recruiting', 'Holds your role', 'JOB Training'],
          ['$680B', 'Entertainment & events', 'Holds your escape', 'Magic Shows'],
          ['$461B', 'Mental health & therapy', 'Holds your pain', 'JOB Church'],
          ['$382B', 'Higher education', 'Holds your credentials', 'JOB Shift'],
          ['$222B', 'Wellness & retreats', 'Holds your body', 'JOB Sites'],
          ['$124B', 'Religion & spiritual orgs', 'Holds your spirit', 'JOB Church'],
          ['$5.3B', 'Coaching', 'Holds your goals', 'JOB Board'],
          ['$2.5B', 'Outplacement', 'Holds your resume', 'JOB Training'],
        ].map(([amount, industry, fragment, experiment], i) => (
          <div key={i} style={{ padding: '0.65rem 0.75rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
            <div className="gold" style={{ fontWeight: 700, fontSize: '1.3rem' }}>{amount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{industry}</div>
            <div style={{ fontSize: '0.75rem', fontStyle: 'italic', marginTop: '0.15rem' }}>{fragment}</div>
            <div style={{ fontSize: '0.7rem', marginTop: '0.3rem', fontWeight: 700, color: 'var(--gold)' }}>&rarr; {experiment}</div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-muted)', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>This is what a $2.6 trillion market looks like before someone names it. Here&apos;s our working title:</p>
      <p style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '1.6rem', fontWeight: 800 }}>
        <span className="gold">The New Human Resources that create the New Human Economy.</span><span style={{ animation: 'blink 1s step-end infinite', marginLeft: '2px', color: 'var(--gold)', WebkitTextFillColor: 'var(--gold)' }}>|</span>
      </p>
      <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '1.1rem', fontWeight: 700 }}>And we&apos;re going to do it with <span className="gold">joy, love, and play.</span></p>
    </div>
  ),

  // 18 — ASK THE ORGANISM (live chat)
  OrganismChatSlide,

  // 19 — THE ASK + CLOSE (handled separately)
  null,
];

// ============================================================
// CLOSE SLIDE + WAITLIST
// ============================================================

function CloseSlide({ onJoin, onTicket }) {
  return (
    <div className="slide close-slide">
      <h3>20 · The ask</h3>
      <h1>As much as <span className="gold">humanly possible.</span></h1>
      <p style={{ fontSize: '1.3rem', marginTop: '0.5rem', fontWeight: 700 }}>Put your money where your species is.</p>
      <div className="cta-row" style={{ marginTop: '2rem', flexDirection: 'column', gap: '0.75rem' }}>
        <button className="waitlist-trigger" onClick={onJoin}>Investor Waitlist</button>
        <button className="waitlist-trigger gold-btn" onClick={onTicket}>Request a Golden Ticket</button>
      </div>
      <p style={{ marginTop: '2.5rem', fontSize: '0.7rem', color: '#666', textAlign: 'center', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>J.O.B. is currently in the process of legally forming its entities and preparing its community investment round. This is not a solicitation of investment. Joining the waitlist does not constitute a commitment, offer, or guarantee of future investment opportunity.</p>
    </div>
  );
}

function WaitlistModal({ onClose, initialMode }) {
  const [mode, setMode] = useState(initialMode || null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', investment_level: '', why: '' });
  const [status, setStatus] = useState('idle');

  async function handleInvestSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    const { error } = await supabase.from('deck_waitlist').insert([{
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      investment_level: form.investment_level || null,
    }]);
    if (error) { console.error(error); setStatus('error'); }
    else { setStatus('success'); }
  }

  async function handleTicketSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    const { error } = await supabase.from('golden_tickets').insert([{
      name: form.name,
      email: form.email,
      why: form.why || null,
    }]);
    if (error) { console.error(error); setStatus('error'); }
    else { setStatus('ticket-success'); }
  }

  if (status === 'success') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>&times;</button>
          <div className="form-success">
            <h2>You&apos;re in.</h2>
            <p>We&apos;ll be in touch when the organism is ready for you.</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'ticket-success') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>&times;</button>
          <div className="form-success">
            <h2>We see you.</h2>
            <p>If it&apos;s meant to be, you&apos;ll hear from us.</p>
          </div>
        </div>
      </div>
    );
  }

  // Choose mode
  if (!mode) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>&times;</button>
          <h2>There&apos;s a fork in the road.</h2>
          <p style={{ marginBottom: '1.5rem' }}>Which path are you going to take?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="waitlist-btn" onClick={() => setMode('invest')}>
              Invest in Our Species
            </button>
            <button className="waitlist-btn gold-btn" onClick={() => setMode('ticket')}>
              Request a Golden Ticket to the Magic Show
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Golden Ticket form
  if (mode === 'ticket') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>&times;</button>
          <h2 style={{ color: 'var(--gold)' }}>Some things can&apos;t be explained in a deck.</h2>
          <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>They must be experienced at a Magic Show.</p>
          <form onSubmit={handleTicketSubmit}>
            <div className="form-field">
              <label>Name *</label>
              <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-field">
              <label>Email *</label>
              <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="form-field">
              <label>Phone *</label>
              <input type="tel" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="form-field">
              <label>Why do you want to go to a Magic Show?</label>
              <textarea rows={3} value={form.why} onChange={e => setForm(f => ({ ...f, why: e.target.value }))} style={{ resize: 'vertical' }} />
            </div>
            <button type="submit" className="waitlist-btn gold-btn" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Requesting...' : status === 'error' ? 'Try again' : 'Request a Golden Ticket'}
            </button>
          </form>
          <button onClick={() => { setMode(null); setStatus('idle'); }} style={{ marginTop: '0.75rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>&larr; Back</button>
        </div>
      </div>
    );
  }

  // Invest form
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2 style={{ color: 'var(--gold)' }}>Fund the organism.</h2>
        <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>And everything it creates.</p>
        <form onSubmit={handleInvestSubmit}>
          <div className="form-field">
            <label>Name *</label>
            <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="form-field">
            <label>Email *</label>
            <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="form-field">
            <label>Phone *</label>
            <input type="tel" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>
          <div className="form-field">
            <label>Investment Interest</label>
            <select value={form.investment_level} onChange={e => setForm(f => ({ ...f, investment_level: e.target.value }))}>
              <option value="">Select a range</option>
              <option value="$1K-$10K">$1K – $10K</option>
              <option value="$10K-$50K">$10K – $50K</option>
              <option value="$50K-$100K">$50K – $100K</option>
              <option value="$100K-$500K">$100K – $500K</option>
              <option value="$500K+">$500K+</option>
              <option value="Just watching">Just watching for now</option>
            </select>
          </div>
          <button type="submit" className="waitlist-btn" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Submitting...' : status === 'error' ? 'Try again' : 'Express interest and intent'}
          </button>
        </form>
        <button onClick={() => { setMode(null); setStatus('idle'); }} style={{ marginTop: '0.75rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>&larr; Back</button>
      </div>
    </div>
  );
}

export default function Deck() {
  const [current, setCurrent] = useState(0);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const total = slides.length;

  const next = useCallback(() => setCurrent(c => Math.min(c + 1, total - 1)), [total]);
  const prev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), []);

  useEffect(() => {
    function handleKey(e) {
      if (showWaitlist) return;
      // Don't hijack arrows when typing in input/textarea
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        next();
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prev();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [next, prev, showWaitlist]);

  const lastIndex = slides.length - 1;

  return (
    <div className="deck">
      {slides.map((SlideContent, i) => (
        <div key={i} className={`slide-wrapper ${i === current ? 'active' : ''}`}>
          {i === lastIndex ? (
            <CloseSlide onJoin={() => { setModalMode('invest'); setShowWaitlist(true); }} onTicket={() => { setModalMode('ticket'); setShowWaitlist(true); }} />
          ) : (
            <SlideContent />
          )}
        </div>
      ))}

      <div className="nav-bar">
        <div className="nav-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`nav-dot ${i === current ? 'active' : ''}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
        <div className="nav-controls">
          <button className="nav-btn" onClick={prev} disabled={current === 0}>&larr;</button>
          <span className="slide-count">{current + 1}/{total}</span>
          <button className="nav-btn" onClick={next} disabled={current === total - 1}>&rarr;</button>
        </div>
      </div>

      {showWaitlist && <WaitlistModal onClose={() => { setShowWaitlist(false); setModalMode(null); }} initialMode={modalMode} />}
    </div>
  );
}
