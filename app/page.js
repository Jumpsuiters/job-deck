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
    description: 'Introduced Nicole to a CHRO at a Fortune 500 who\'s now piloting NHR for a 2,000-person transition.',
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
    description: 'Building the entire Business 3.0 IP framework — methodology, certification model, and consulting playbook — inside the organism.',
    category: 'Build',
    bucket: 'C',
    points_min: 3000,
    points_max: 5000,
    explanation: 'A company contributing proprietary IP directly into the organism. This isn\'t a vendor contract — it\'s a member building infrastructure that the whole ecosystem will run on.',
    open_loop_reason: 'B3.0 hasn\'t launched paid cohorts yet. When it does, this contribution becomes the revenue engine for an entire SPV. The organism tracks it now so the value is honored later.',
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
      <h3>13 · The moat</h3>
      <h1>Our moat isn&apos;t technology. It&apos;s <span className="gold">memory.</span></h1>
      <p style={{ marginBottom: '0.6rem' }}>
        Individuals and companies join the RCO as members. Every introduction, every idea, every line of code built at 2am, every transition center opened &mdash; the JOB Report tracks it all.
      </p>
      <p style={{ marginBottom: '0.6rem' }}>
        An introduction today becomes redeemable credit across the organism down the road &mdash; a free spot at a Magic Show, a seat in the B3.0 cohort, a month residency at a Costa Rica immersive center.
      </p>
      <p style={{ marginBottom: '0.75rem' }}>
        We&apos;ve never had the ability to track, attribute, and measure the range of human value until AI. Go figure. <strong>Try it below. Give yourself a job only you can do.</strong>
      </p>

      <div className="jr-grid">
        <div className="jr-left">
          <form onSubmit={handleSubmit}>
            <textarea
              className="jr-input"
              placeholder="Describe a contribution in plain language. e.g. 'Introduced Nicole to a CHRO at a Fortune 500 who wants to pilot NHR for their 2000-person layoff.'"
              value={input}
              onChange={e => setInput(e.target.value)}
              rows={4}
              disabled={loading}
            />
            <button type="submit" className="jr-submit" disabled={loading || !input.trim()}>
              {loading ? 'Reading…' : 'Submit to JOB Report'}
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
    { name: 'New Human Resources', label: 'Per-seat enterprise + Magic Show add-on', revenue: '$200M+', max: 200, breakdown: 'One enterprise deal at 30K seats × $2,500 = $75M. 10 deals/yr at varied scale = $200M+. Magic Show add-on adds 10–30% per cohort.' },
    { name: 'Business 3.0', label: 'Founder cohorts + certification', revenue: '$50M', max: 50, breakdown: '2,000 founders × $25K entry = $50M. Plus platform fees from certified implementers and ongoing cohorts.' },
    { name: 'Magic Shows', label: 'Immersions + host certification', revenue: '$40M', max: 40, breakdown: 'Two streams: (1) attendees pay to be transformed (~3,500/yr blended across formats). (2) Members pay to be trained as certified Magic Show hosts — spaceholding, sacrament training, facilitation craft.' },
    { name: 'Transition Centers', label: 'Physical cohorts + residencies', revenue: '$30M', max: 30, breakdown: '10 centers × ~$3M each (cohorts, retreats, residencies). Real estate arbitrage on the collapse of the old economy.' },
    { name: 'J.O.B. Board', label: 'Marketplace fees', revenue: '$20M', max: 20, breakdown: '20% platform fee on $100M GMV. Sovereign humans selling what AI can\u2019t do — coaching, mediation, hands-on craft, presence work.' },
    { name: 'The Church', label: 'Tracks + community', revenue: '$5M', max: 5, breakdown: 'Paid tracks ($500–$2K), community membership tiers, doctrine licensing to HoldCo experiments.' },
  ];
  const maxValue = 200;
  return (
    <div className="slide">
      <h3>14 · Revenue at scale</h3>
      <h1>Where the money gets made.</h1>
      <p style={{ fontSize: '1.05rem', marginTop: '0.25rem' }}><strong>Six revenue lines. One organism.</strong> NHR is the wedge &mdash; biggest, fastest, already selling. The rest compound behind it as the network grows. Click any experiment for the math.</p>
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
// SLIDES ARRAY
// ============================================================

const slides = [
  // 0 — COVER
  () => {
    const words = ['Company', 'Church', 'School', 'Human'];
    const [wordIndex, setWordIndex] = useState(0);

    return (
      <div className="slide cover">
        <h1>J.O.B.</h1>
        <p className="subtitle">
          The Joy of Being{' '}
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
      </div>
    );
  },

  // 1 — THE MANIFESTO
  () => (
    <div className="slide">
      <div style={{ maxWidth: '680px', marginLeft: 'auto', marginRight: 'auto', fontSize: '1.15rem', lineHeight: 1.8 }}>
        <p>J.O.B. is the world&apos;s first infrastructure for being human.</p>
        <p style={{ marginTop: '1rem' }}>The three systems that told us who to be &mdash; work, church, and school &mdash; are all collapsing. They disconnected us. Disembodied us. And no one knows who they are.</p>
        <p style={{ marginTop: '1rem' }}>So when AI takes every job that isn&apos;t human &mdash; and it will &mdash; what&apos;s left is the most important work there is. Because on the other side of this is a New Human Economy. One led by the most integrated, healed, alive versions of us.</p>
        <p style={{ marginTop: '1rem' }}>But in order to build something new, we must first become it.</p>
        <p style={{ marginTop: '1rem' }}>We&apos;re raising as much as humanly possible. We&apos;re not betting on capitalism. <span className="gold" style={{ fontWeight: 700 }}>We&apos;re betting on a species.</span></p>
        <p style={{ marginTop: '1rem' }}>Being human is the job now. We&apos;re the first ones paying people to do it.</p>
      </div>
    </div>
  ),

  // 2 — THE FLIP (opening reframe)
  () => (
    <div className="slide">
      <h3>02 · The trick</h3>
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

  // 3 — THE OPPORTUNITY (was Hypothesis)
  () => (
    <div className="slide">
      <h3>03 · The opportunity</h3>
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
      <p style={{ marginTop: '1.25rem', textAlign: 'center', fontStyle: 'italic', fontSize: '1.15rem' }}>We&apos;re building the new model that makes the existing model obsolete.</p>
    </div>
  ),

  // 4 — THE GAP
  () => (
    <div className="slide">
      <h3>04 · The gap</h3>
      <h1>Nobody&apos;s building the <span className="gold">infrastructure for being human.</span></h1>
      <p style={{ fontSize: '1.15rem', marginTop: '1rem', lineHeight: 1.6, textAlign: 'center' }}>AI is automating what people <em>do</em> &mdash; and now we have no idea who we <em>are</em>. Let alone how to integrate that into the world we live in.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '0', marginTop: '1.5rem', maxWidth: '680px', marginLeft: 'auto', marginRight: 'auto', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
        {[
          ['Therapy', 'Holds your pain. Ignores your purpose.'],
          ['Coaching', 'Holds your goals. Ignores your soul.'],
          ['Outplacement', 'Holds your resume. Ignores your identity.'],
          ['Religion', 'Holds your spirit. Ignores your Monday.'],
        ].map(([label, desc], i) => (
          <div key={i} style={{ display: 'contents' }}>
            <div style={{ padding: '0.75rem 1rem', borderBottom: i < 3 ? '1px solid var(--border)' : 'none', color: 'var(--text-muted)', fontWeight: 600, background: 'rgba(255,255,255,0.02)' }}>{label}</div>
            <div style={{ padding: '0.75rem 1rem', borderBottom: i < 3 ? '1px solid var(--border)' : 'none', borderLeft: '1px solid var(--border)' }}>{desc}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', maxWidth: '680px', marginLeft: 'auto', marginRight: 'auto', marginTop: '0.5rem', border: '2px solid var(--gold)', borderRadius: '10px', overflow: 'hidden', background: 'rgba(201,168,76,0.08)' }}>
        <div style={{ padding: '0.75rem 1rem', fontWeight: 700, gridColumn: '1 / -1' }} className="gold">Who is finally going to hold the whole human?</div>
      </div>
      <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '1.3rem', fontWeight: 700 }}>A fragmented human problem demands a <span className="gold">whole new kind of infrastructure.</span></p>
    </div>
  ),

  // 5 — JOY OF BEING (name reveal)
  () => (
    <div className="slide">
      <h3>05 · The solution</h3>
      <h1>Being human <span className="gold">IS the job.</span></h1>
      <p style={{ fontSize: '1.1rem', marginTop: '1.25rem', lineHeight: 1.6 }}>That&apos;s why J.O.B. stands for the <strong>Joy of Being.</strong></p>
      <p style={{ fontSize: '1.2rem', marginTop: '1rem', lineHeight: 1.6 }}>J.O.B. is the world&apos;s first infrastructure for <em>being</em> human. We&apos;re the New Human Resources. We hold people through this transition, help them discover who they really are, and then pay each other to be that.</p>
      <p style={{ fontSize: '1.3rem', marginTop: '1.25rem', lineHeight: 1.5, fontWeight: 700 }} className="gold">It&apos;s like if AA, Meow Wolf, and Indeed teamed up to create the future Human Economy.</p>
    </div>
  ),

  // 6 — THE TROJAN HORSE
  () => (
    <div className="slide">
      <h3>06 · The strategy</h3>
      <h1>Everything is a <span className="gold">Trojan Horse.</span></h1>
      <p style={{ fontSize: '1.15rem', marginTop: '1rem', lineHeight: 1.6, textAlign: 'center' }}>JOB speaks the language of the old world to smuggle people into the new one.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.6rem 1rem', marginTop: '1.5rem', maxWidth: '680px', marginLeft: 'auto', marginRight: 'auto', alignItems: 'center' }}>
        {[
          ['The name', 'sounds like doing work', 'it\u2019s about being human'],
          ['The company', 'looks like a startup', 'it\u2019s an organism that can\u2019t be extracted from'],
          ['The products', 'look like familiar categories', 'they\u2019re transformation disguised as commerce'],
          ['The membership', 'looks like a subscription', 'it\u2019s citizenship in a new economy'],
          ['The fundraise', 'looks like a seed round', 'it\u2019s an invitation to co-own the transition'],
        ].map(([label, outside, inside], i) => (
          <div key={i} style={{ display: 'contents' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontWeight: 700 }}>{label}</span>{' '}
              <span style={{ color: 'var(--text-muted)' }}>{outside}</span>
            </div>
            <span className="gold" style={{ fontWeight: 700 }}>→</span>
            <div><span className="gold" style={{ fontWeight: 600 }}>{inside}</span></div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: 700 }}>If you want to change the game, <span className="gold">learn to speak its language first.</span></p>
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
        { id: 'nhr', label: 'New Human Resources', desc: 'B2B offboarding-as-benefit. The revenue wedge. Companies pay to transition their people through J.O.B. instead of handing them a severance check and a LinkedIn link. The budget already exists \u2014 we\u2019re the first honest use of it.' },
        { id: 'b30', label: 'Business 3.0', desc: 'Consulting IP and organizational transformation. Helps companies become organisms, not machines. Founder cohorts, certified Guides, and a framework built on nature\u2019s intelligence \u2014 not another management theory.' },
        { id: 'msl', label: 'MagicShowLand', desc: 'Physical immersive spaces in abandoned churches, castles, and colleges \u2014 where humans go to remember what they are. The real-world training grounds for the organism.' },
        { id: 'ms', label: 'Magic Shows', desc: 'Experiential events that crack people open. Corporate retreats, public gatherings, initiatory experiences. Psychedelic-adjacent journeys where human magic gets rediscovered in days, not years.' },
        { id: 'board', label: 'J.O.B. Board', desc: 'A marketplace for things AI can\u2019t do. Humans post uniquely human offers \u2014 presence, care, craft, mentorship. Other humans pay for them. 20% platform fee. The Trojan Horse: it looks like a gig platform, but it\u2019s a doorway into the organism.' },
        { id: 'report', label: 'J.O.B. Report', desc: 'The commercial product built on the RCO\u2019s contribution tracking technology. AI-powered value attribution that works beyond money \u2014 licensable to other RCOs and organizations.' },
      ]},
      { id: 'ext', label: 'External Investments', desc: 'The organism can invest in member projects and aligned ventures, expanding the mycelial network. Not acquisitions \u2014 resonance-based partnerships where the whole gets stronger.', children: [
        { id: 'spirit', label: 'SpiritTech', desc: 'Technology that serves the human spirit, not the other way around. Investments in tools and platforms that honor human sovereignty.' },
        { id: 'immersive', label: 'Immersive Centers', desc: 'Spaces designed for transformation beyond MagicShowLand \u2014 experiential environments where the work of becoming human has a physical home.' },
      ]},
      { id: 'profits', label: 'Returns to Investors', desc: 'The organism rewards the humans who fund it. Profits flow back to community investors \u2014 the people who believed before it was obvious. Not charity, not extraction \u2014 regenerative returns.' },
    ];
    const rcoItems = [
      { id: 'members', label: 'Members', desc: 'People join the organism and contribute non-monetary investment \u2014 time, skills, network, ideas, care. This is how the RCO grows: not through hiring, but through attraction. Financial investment flows through the For-Profit side.' },
      { id: 'matching', label: 'Matching', desc: 'The organism routes humans to needs, projects, and each other \u2014 based on energy, fit, and what\u2019s alive right now. This is the internal intelligence that powers the J.O.B. Board and every other surface where humans meet work.' },
      { id: 'jobreport', label: 'J.O.B. Report', desc: 'The technology layer that makes the RCO self-regulating. Tracks, attributes, and redeems value anywhere in the organism over time. Informs the HoldCo and Church where to invest next \u2014 grow or compost.' },
      { id: 'field', label: 'The Field', desc: 'People \u00d7 energy \u00d7 technology. The RCO is the living field where flow happens \u2014 contributions move, value compounds, and the organism senses where to go next. Everything above feeds it. Everything below draws from it.' },
    ];
    const churchItems = [
      { id: 'doctrine', label: 'Doctrine + Sacrament', desc: 'The sacred container. Sunday Night Live, elder-guided tracks, the initiatory journey. Living doctrine that evolves with the community, not dogma handed down. The deprogramming is the root \u2014 everything else is a surface for that transformation to show up.' },
      { id: 'mutual', label: 'Mutual Aid', desc: 'The organism takes care of its own. Community support, resource sharing, mutual aid networks. When a member is in crisis, the Church responds \u2014 not with a form, but with presence. Humans helping humans, the original technology.' },
      { id: 'grants', label: 'Grants + MicroGrants', desc: 'Small bets on sovereign humans. Funding for members who are building something from the inside out. The organism invests in the people it creates \u2014 before the market would.' },
      { id: 'ip', label: 'Church IP (licensed to HoldCo)', desc: 'The transformation methodology, curriculum, and practices \u2014 owned by the nonprofit, licensed to the HoldCo. This is the bridge: mission-side IP fuels commercial-side revenue without the mission losing control. The Perpetual Purpose Trust ensures it stays that way.' },
      { id: 'land', label: 'Holds Land', desc: 'Physical spaces owned by the nonprofit \u2014 sanctuaries, gathering spaces, future MagicShowLand locations. Land held in trust for the community, not for profit. These are the rooms the organism builds in.' },
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
        <h3>07 · The structure</h3>
        <h1><span className="gold">Incorruptible</span> by design.</h1>
        <p style={{ fontSize: '1rem', marginTop: '0.5rem', marginBottom: '1rem', lineHeight: 1.6, textAlign: 'center', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>To pull off a Trojan Horse at this scale, you need a structure the old world can&apos;t buy, break, or co-opt. So we built one that works like nature.</p>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.5rem', opacity: 0.6 }}>&#9758; Click any layer to explore</p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

          {/* J.O.B. */}
          <div style={{ background: 'var(--iridescent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: '1.4rem', fontWeight: 800 }}>J.O.B.</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, fontStyle: 'italic', color: 'var(--gold)', marginBottom: '0.3rem' }}>&ldquo;What happens when being human is the job?&rdquo;</div>

          {/* LAYER 1: PPT */}
          <div style={connector('#c9a84c')} />
          <div onClick={() => toggle('ppt')} style={layerBox('#c9a84c', 'rgba(201,168,76,0.08)')}>
            <div style={layerLabel}>Perpetual Purpose Trust</div>
            <div style={layerRole('#c9a84c')}>Protects the Purpose</div>
            {isOpen('ppt') && (
              <p style={layerDesc}>Owns the HoldCo. The trustee&apos;s legal obligation is to the guiding question &mdash; not to founders, not to shareholders. The mission can never be sold, acquired, or diluted. This is why investors can trust that their capital serves something permanent.</p>
            )}
          </div>

          {/* LAYER 2: RCO */}
          <div style={connector('var(--pink)')} />
          <div onClick={() => toggle('rco')} style={layerBox('var(--pink)', 'rgba(236,72,153,0.08)')}>
            <div style={layerLabel}>RCO &mdash; Regenerative Community Organism</div>
            <div style={layerRole('var(--pink)')}>Produces the Value</div>
            {isOpen('rco') && (
              <p style={layerDesc}>The coordination layer where people actually participate. Contributors bring money, time, skills, network, ideas, or care &mdash; the RCO routes them into real work and turns participation into revenue-generating output. It feeds both the business engine and the meaning layer.</p>
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
            The <span style={{ color: '#c9a84c' }}>Trust</span> protects the purpose. The <span style={{ color: 'var(--pink)' }}>RCO</span> produces the value. The <span style={{ color: 'var(--purple)' }}>HoldCo</span> drives the business. The <span style={{ color: 'var(--teal)' }}>Church</span> sustains the soul.
          </p>
        </div>
      </div>
    );
  },

  // 8 — PROOF OF LIFE
  () => (
    <div className="slide">
      <h3>08 · Proof of life</h3>
      <h1>This organism is <span className="gold">already growing.</span></h1>
      <p style={{ fontSize: '1.05rem', marginTop: '0.75rem', lineHeight: 1.6, textAlign: 'center' }}>Before a single dollar of outside investment, the network started building itself.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.25rem', maxWidth: '580px', marginLeft: 'auto', marginRight: 'auto' }}>
        {[
          ['The entity structure is forming', 'Legal body taking shape — PPT, RCO, HoldCo, Church'],
          ['The RCO has members', 'People aren\u2019t buying a service \u2014 they\u2019re joining an organism'],
          ['The HoldCo has products', 'Four products designed, built, or in motion — before the entity even exists'],
          ['The Church has members', 'People showing up weekly for something with no obvious ROI'],
          ['People keep hiring themselves', 'No one asked them to. The thesis is already proving itself.'],
        ].map(([title, desc], i) => (
          <div key={i} style={{ padding: '0.65rem 0.85rem', border: '1px solid var(--border)', borderRadius: '8px', background: i === 4 ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.03)', borderColor: i === 4 ? 'var(--gold)' : 'var(--border)' }}>
            <div className={i === 4 ? 'gold' : ''} style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{title}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>{desc}</div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: 700 }}>Nobody planted this. <span className="gold">It sprouted.</span></p>
    </div>
  ),

  // 9 — THE EXPERIMENTS
  () => (
    <div className="slide">
      <h3>09 · The experiments</h3>
      <h1>Six Trojan Horses. <span className="gold">Six real businesses.</span></h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginTop: '1.25rem', maxWidth: '720px', marginLeft: 'auto', marginRight: 'auto' }}>
        {[
          ['New Human Resources', null, 'Companies buy outplacement \u2014 a P&L line item', 'Their people get the grief, deprogramming, and reinvention their employer accidentally funded', 'The budget already exists \u2014 billions in severance, redirected'],
          ['B3.0', 'Business 3.0', 'Leaders buy a program', 'They get an initiation into a new way of operating \u2014 and a map for doing it without burning out', 'Premium consulting rates for what\u2019s actually an initiation'],
          ['Magic Shows', null, 'Companies buy an offsite', 'Their teams get the fastest route back to themselves without ten years of therapy', '$25K\u2013$50K events that cost less than a hotel conference room'],
          ['JOB Board', null, 'People buy a gig marketplace', 'They discover that what makes them irreplaceable is what AI can\u2019t touch', '20% fee on a category we\u2019re creating and owning'],
          ['JOB Church', null, 'People join a spiritual community', 'The professional self finally stops running the show', 'Tax-exempt 508(c)(1)(a) \u2014 the spiritual container is also a legal one'],
          ['MagicShowLand', null, 'People walk into a venue', 'They walk into a body of people holding them while they figure out who they are', 'Real estate arbitrage \u2014 abandoned churches, colleges, castles reborn'],
        ].map(([abbr, name, buying, getting, trick], i) => (
          <div key={i} style={{ padding: '0.65rem 0.85rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}><span className="gold">{abbr}</span>{name ? <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.8rem' }}> — {name}</span> : null}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>{buying}</div>
            <div style={{ fontSize: '0.8rem', lineHeight: 1.45, marginTop: '0.15rem' }}>{getting}</div>
            <div style={{ fontSize: '0.75rem', lineHeight: 1.4, marginTop: '0.2rem', fontStyle: 'italic' }} className="gold">{trick}</div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: 700 }}>Every experiment is a door <span className="gold">back to you.</span></p>
    </div>
  ),

  // 10 — THE MARKET
  () => (
    <div className="slide">
      <h3>10 · The market</h3>
      <h1>Remember those <span className="gold">fragments?</span></h1>
      <p style={{ fontSize: '1.05rem', marginTop: '0.75rem', lineHeight: 1.6, textAlign: 'center' }}>Each one is already a massive industry. They just don&apos;t know they&apos;re pieces of the same puzzle.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem', marginTop: '1.25rem', maxWidth: '680px', marginLeft: 'auto', marginRight: 'auto' }}>
        {[
          ['$461B', 'Mental health & therapy', 'Holds your pain'],
          ['$5.3B', 'Coaching', 'Holds your goals'],
          ['$2.5B', 'Outplacement', 'Holds your resume'],
          ['$739B', 'HR & recruiting', 'Holds your role'],
          ['$222B', 'Wellness & retreats', 'Holds your body'],
          ['$124B', 'Religion & spiritual orgs', 'Holds your spirit'],
        ].map(([amount, industry, fragment], i) => (
          <div key={i} style={{ padding: '0.65rem 0.75rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
            <div className="gold" style={{ fontWeight: 700, fontSize: '1.3rem' }}>{amount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{industry}</div>
            <div style={{ fontSize: '0.75rem', fontStyle: 'italic', marginTop: '0.15rem' }}>{fragment}</div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: 700 }}>Total: <span className="gold">$1.5 trillion</span> spent treating symptoms. Zero spent <span className="gold">holding the whole human.</span></p>
    </div>
  ),

  // 11 — BUT WHO'S GONNA PAY FOR IT?
  () => (
    <div className="slide">
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ fontSize: '2.8rem', textAlign: 'center' }} className="gold">But who&apos;s gonna pay for it?</h1>
      </div>
    </div>
  ),

  // 12 — EVERYBODY
  () => (
    <div className="slide">
      <h3>12 · The answer</h3>
      <h1><span className="gold">Everybody.</span> We&apos;re already paying for it.</h1>
      <p style={{ fontSize: '1.05rem', marginTop: '0.75rem', lineHeight: 1.6, textAlign: 'center' }}>The question isn&apos;t who pays. It&apos;s who doesn&apos;t. $1.5 trillion flows into fragments every year. The money isn&apos;t missing &mdash; it&apos;s misallocated. When the infrastructure finally exists to hold the whole human, the funding comes from everywhere at once.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.25rem', maxWidth: '620px', marginLeft: 'auto', marginRight: 'auto' }}>
        {[
          ['Companies', 'Because they\u2019re already spending billions on the problem \u2014 they just need somewhere real to send their people'],
          ['People', 'Because they\u2019re desperate for something that actually holds them through the transition'],
          ['Investors', 'Because this is a new asset class \u2014 an organism that compounds, not a startup that exits'],
          ['Philanthropists', 'Because this is the mission they\u2019ve been looking for \u2014 structural change, not another band-aid'],
          ['Members', 'Because they contribute time, ideas, presence, and relationships \u2014 not just money'],
        ].map(([who, why], i) => (
          <div key={i} style={{ padding: '0.65rem 0.85rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
            <span className="gold" style={{ fontWeight: 700 }}>{who}.</span>{' '}
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{why}</span>
          </div>
        ))}
      </div>
      <p style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: 700 }}>But how do you track what <span className="gold">money can&apos;t measure?</span></p>
    </div>
  ),

  // 13 — THE MOAT / JOB REPORT
  JobReportSlide,

  // 15 — THE ASK
  () => (
    <div className="slide">
      <h3>15 · The ask</h3>
      <h1><span className="gold">$3&ndash;5M seed.</span> Not a bet on a company. A bet on a species.</h1>
      <p style={{ fontSize: '1.05rem', marginTop: '0.5rem', lineHeight: 1.6, textAlign: 'center' }}>Everything above was built before a single dollar of outside investment. Here&apos;s what capital unlocks.</p>
      <div className="two-col" style={{ marginTop: '0.75rem' }}>
        <div className="card">
          <h3 className="gold">Founding Circle &middot; $2.5&ndash;3M</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Angel + philanthropic capital that makes the organism real.</p>
          <ul style={{ fontSize: '0.8rem' }}>
            <li><strong>New Human Resources build</strong> &mdash; initiatory process, guides (AI &amp; human), platform to support layoffs</li>
            <li><strong>JOB Report ledger</strong> &mdash; production OS for tracking and redeeming contribution</li>
            <li><strong>All six experiments</strong> &mdash; working versions live and generating revenue</li>
            <li><strong>Entity formation + founder runway</strong> &mdash; 18&ndash;24 months full-time</li>
          </ul>
        </div>
        <div className="card">
          <h3 className="gold">Community Round &middot; $500K&ndash;1M</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Wefunder. The people who believe in this own a piece of it.</p>
          <ul style={{ fontSize: '0.8rem' }}>
            <li><strong>Community ownership</strong> &mdash; members become investors, investors become members</li>
            <li><strong>Working capital</strong> &mdash; fuel for the experiments as they come alive</li>
            <li><strong>Signal</strong> &mdash; hundreds of people saying &ldquo;this matters&rdquo; with their wallets</li>
          </ul>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem', maxWidth: '680px', marginLeft: 'auto', marginRight: 'auto', justifyContent: 'center' }}>
        {[
          ['Q3 2026', 'Entities formed'],
          ['Q3 2026', 'NHR first enterprise pilot'],
          ['Q3 2026', 'Wefunder live'],
          ['Q4 2026', 'Magic Show at scale'],
          ['Q4 2026', 'B3.0 first paid cohort'],
          ['Q1 2027', 'JOB Board launch'],
          ['Q2 2027', 'MagicShowLand scouted'],
        ].map(([when, what], i) => (
          <div key={i} style={{ padding: '0.35rem 0.65rem', border: '1px solid var(--border)', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', fontSize: '0.75rem' }}>
            <span className="gold" style={{ fontWeight: 700 }}>{when}</span>{' '}<span>{what}</span>
          </div>
        ))}
      </div>
      <p style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '1rem', fontStyle: 'italic' }}>You&apos;re not getting equity in one experiment. You&apos;re getting equity in the system that holds all of them. The ones we have now and the ones the organism builds in the future.</p>
    </div>
  ),

  // 16 — TEAM
  () => (
    <div className="slide">
      <h3>16 · Team</h3>
      <h1>Two Visionaries and <span className="gold">Humanity beside them</span></h1>
      <div className="two-col" style={{ marginTop: '0.75rem' }}>
        <div className="card">
          <h3 style={{ color: 'var(--text)', textTransform: 'none', letterSpacing: '-0.01em', fontSize: '1.3rem', WebkitTextFillColor: 'var(--text)', marginBottom: '0.15rem' }}>Nicole Ayres</h3>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', fontWeight: 700, marginBottom: '0.5rem' }}>Founder / The Question</p>
          <ul>
            <li>Built a $4M agency that runs itself &mdash; zero funding, zero employees. <em>She already proved the model.</em></li>
            <li>Future of Work AI platform acquired 2024. <em>She sees what&apos;s coming before it arrives.</em></li>
            <li>Building J.O.B. in real time with AI. <em>She doesn&apos;t pitch the future. She builds it.</em></li>
          </ul>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--text)', textTransform: 'none', letterSpacing: '-0.01em', fontSize: '1.3rem', WebkitTextFillColor: 'var(--text)', marginBottom: '0.15rem' }}>Pam Kosanke</h3>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', fontWeight: 700, marginBottom: '0.5rem' }}>Founder / The Scale</p>
          <ul>
            <li>Former CRO, EOS Worldwide &mdash; $145M revenue, 800+ implementers. <em>She already knows how to scale an organism.</em></li>
            <li>Invented McDonald&apos;s breakfast dollar menu. <em>She sees money where nobody&apos;s looking.</em></li>
            <li>6× world champion, Team USA. <em>She doesn&apos;t stop.</em></li>
          </ul>
        </div>
      </div>
      <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.85rem', border: '1px solid var(--gold)', borderRadius: '8px', background: 'rgba(201,168,76,0.05)' }}>
        <p className="gold" style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem' }}>The organism is already building itself.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {[
            ['Amit Paul', 'leading European enterprise company through B3.0'],
            ['John Noonan', 'VC supporting fundraise'],
            ['Bennet Zelner', 'regenerative economist'],
            ['Diane Wilde Olcott', 'designing NHR offering'],
            ['Leigh Siegfried', 'implementing B3.0'],
            ['Jumpsuit', 'building MVPs'],
            ['Nils von Heijne', 'visionary of the RCO'],
            ['Denise Hontiveros', 'holding space at Magic Shows'],
            ['Nicole BZ', 'church treasurer'],
            ['Sara B. Stern', 'writing church docs'],
            ['Tracy Call', 'implementing B3.0'],
            ['Max Rigano', 'practicing being'],
            ['Laura Gill', 'planning B3.0 UnConference'],
            ['Dogcultr', 'dogs helping humans be human'],
          ].map(([name, role], i) => (
            <span key={i} style={{ padding: '0.25rem 0.5rem', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '0.7rem', background: 'rgba(255,255,255,0.03)' }}>
              <strong>{name}</strong> <span style={{ color: 'var(--text-muted)' }}>{role}</span>
            </span>
          ))}
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontStyle: 'italic' }}>Nobody asked them to. They just showed up.</p>
      </div>
      <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.85rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}><span className="gold" style={{ fontWeight: 700 }}>Hundreds more</span> already on the RCO waitlist:</p>
        <p style={{ fontSize: '0.65rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>
          Larissa &middot; Joseph &middot; Lucy &middot; Emily &middot; Louise &middot; Jess &middot; Jason &middot; Bart &middot; Chelsea &middot; Kamber &middot; Emma &middot; Steve &middot; Jenifer &middot; Danny &middot; Johann &middot; Chuck &middot; Kait &middot; Ryan &middot; Kristiana &middot; Vicki &middot; Paula &middot; Gertie &middot; Geoff &middot; Christoffer &middot; Noah &middot; Tracie &middot; Olivia &middot; Tyler &middot; Laurie &middot; Kristin &middot; Marcos &middot; Meqa &middot; Djuka &middot; Narriman &middot; Carisa &middot; Tanya &middot; David &middot; Dennis &middot; Marian &middot; Sameer &middot; Thomas &middot; Adrienne &middot; Sharan &middot; Charlotte &middot; Khuyen &middot; Marianne &middot; Alexandra &middot; Nicole &middot; Sam &middot; Gia &middot; Azure &middot; Kyle &middot; Crystal &middot; Katie &middot; Maria &middot; Megan &middot; Carrie &middot; Chris &middot; Nicolai &middot; Aimee &middot; Lauren &middot; Sarah &middot; Alexa &middot; Jessica &middot; Colleen &middot; Charl &middot; Paul &middot; Esa&uacute; &middot; Lirie &middot; Dave &middot; Melissa &middot; Tanya &middot; Denise &middot; David &middot; Alfonso &middot; Stephen &middot; Rosy &middot; Kaitlyn &middot; Angela &middot; LaToya &middot; Ellen &middot; Unyong &middot; Kate &middot; Megan &middot; Sara &middot; Nathan &middot; Alicia &middot; Rachael &middot; Jasmine &middot; Ien &middot; Becca &middot; Maria &middot; Melanie &middot; Jillian &middot; Christine &middot; Harry &middot; Taylor &middot; Mathias &middot; Kerry &middot; Jill &middot; Matthew &middot; Tim &middot; Kim &middot; Annie &middot; Jocelyn &middot; Avolyn &middot; Celia &middot; Brandon &middot; Adele &middot; Romain &middot; Jonathan &middot; Laura &middot; Levi &middot; Ashley
        </p>
      </div>
    </div>
  ),

  // 17 — CLOSE (handled separately)
  null,
];

// ============================================================
// CLOSE SLIDE + WAITLIST
// ============================================================

function CloseSlide({ onJoin, onTicket }) {
  return (
    <div className="slide close-slide">
      <h1 style={{ fontSize: '1.8rem', lineHeight: 1.5 }}>Some things can&apos;t be explained in a deck.</h1>
      <h1 style={{ fontSize: '1.8rem', lineHeight: 1.5, marginTop: '0.25rem' }}><span className="gold">They must be experienced.</span></h1>
      <div className="cta-row" style={{ marginTop: '2rem', flexDirection: 'column', gap: '0.75rem' }}>
        <button className="waitlist-trigger gold-btn" onClick={onTicket}>Request a Golden Ticket to the Magic Show</button>
        <button className="waitlist-trigger" onClick={onJoin}>Invest in Our Species</button>
      </div>
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
          <h2 style={{ color: 'var(--gold)' }}>Experience the Magic Show</h2>
          <p>IYKYK</p>
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
              <label>Why do you want in?</label>
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
        <h2>Who&apos;s gonna pay for it?</h2>
        <p>We all are.</p>
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
            <label>Phone</label>
            <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
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
            {status === 'submitting' ? 'Joining...' : status === 'error' ? 'Try again' : 'Feed the Organism'}
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
