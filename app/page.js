'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// ============================================================
// JOB REPORT — INTERACTIVE DEMO COMPONENT
// ============================================================

const SEEDED_ENTRIES = [
  {
    id: 'seed-pam',
    who: 'Nicole',
    description: 'Spent $100k on Telepathy Tapes ads for Jumpsuit. Made 5x ROI so far — but also met Pam Kosanke (I would have easily spent $100k just to meet her) and attracted the third RCO.',
    category: 'Network',
    bucket: 'C',
    points_min: 2000,
    points_max: 3500,
    explanation: 'Validated 5x ROI on the ad spend, plus two catalytic open loops: the Pam relationship and a third RCO attracted into orbit. No spreadsheet would have logged either.',
    open_loop_reason: 'Pam became co-founder of J.O.B. and the enterprise sales pathway into CHROs. The third RCO is still unfolding. Full compounded value is yet to land.',
  },
  {
    id: 'seed-levi',
    who: 'Levi',
    description: 'Built the JOB Board MVP on Claude — marketplace, auth, Stripe integration, 20% platform fee logic. 6 weeks solo.',
    category: 'Build',
    bucket: 'B',
    points_min: 1800,
    points_max: 2400,
    explanation: 'Shipped a working marketplace end-to-end in 6 weeks. This is validated execution capital — the product is live and ready for supply.',
    open_loop_reason: null,
  },
  {
    id: 'seed-sarah',
    who: 'Sarah',
    description: 'Showed up to Sunday Night Live for 8 weeks straight. Helped hold the container for the grief work.',
    category: 'Community',
    bucket: 'A',
    points_min: 200,
    points_max: 350,
    explanation: 'Operating presence. The Church doesn\'t work without people who keep showing up. This is the foundation every other contribution sits on.',
    open_loop_reason: null,
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
      <h3>14 · JOB Report · Interactive</h3>
      <h1>How the organism tracks value beyond capital.</h1>
      <p style={{ marginBottom: '0.6rem' }}>
        Every contribution system asks people to price their own worth. We ask them to report evidence &mdash; and the AI does the attribution.
      </p>
      <p style={{ marginBottom: '0.6rem' }}>
        Money is one input. So is an introduction, an idea, code you built at 2am, a relationship you opened. JOB Report tracks all of it, assigns it to a bucket, and keeps value alive even when the ROI hasn&apos;t landed yet.
      </p>
      <p style={{ marginBottom: '0.6rem' }}>
        The person who helps build the JOB Guide program today might redeem that contribution as a month&apos;s stay at a Costa Rica retreat center two years from now. <strong>The ledger remembers. The organism honors it.</strong>
      </p>
      <p style={{ marginBottom: '0.75rem' }}>
        <strong>Try it below</strong> &mdash; describe something you&apos;d contribute to J.O.B. and see how the system reads it.
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
      <h3>20 · Revenue at scale</h3>
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

  // 1 — THE FLIP (opening reframe)
  () => (
    <div className="slide">
      <h3>01 · The trick</h3>
      <h1>What if the systems collapse is actually the largest <span className="gold">involuntary liberation</span> in human history?</h1>
      <div className="three-col" style={{ marginTop: '1.5rem' }}>
        <div className="card">
          <p style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }} className="gold">Work</p>
          <p style={{ fontSize: '2rem', fontWeight: 700 }} className="gold">300M</p>
          <p>full-time job equivalents affected by AI globally (Goldman Sachs)</p>
        </div>
        <div className="card">
          <p style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }} className="gold">Religion</p>
          <p style={{ fontSize: '2rem', fontWeight: 700 }} className="gold">15,000</p>
          <p>churches closed last year &mdash; the most in American history</p>
        </div>
        <div className="card">
          <p style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }} className="gold">Education</p>
          <p style={{ fontSize: '2rem', fontWeight: 700 }} className="gold">63%</p>
          <p>say college isn&apos;t worth it &mdash; including 54% of people who actually have the degree</p>
        </div>
      </div>
      <p style={{ marginTop: '1rem', textAlign: 'center', maxWidth: '100%', fontStyle: 'italic', fontSize: '1.15rem' }}>The three institutions who told us who to be are dissolving simultaneously.</p>
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
      <h1>J.O.B. = <span className="gold">Joy of Being.</span></h1>
      <p style={{ fontSize: '1.2rem', marginTop: '1.25rem', lineHeight: 1.6 }}>The world&apos;s first infrastructure for <em>being</em> human. We hold people through this transition, help them discover who they really are, and then pay each other to do that.</p>
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
        <h1>Four layers, <span className="gold">one organism.</span></h1>
        <p style={{ fontSize: '1rem', marginTop: '0.5rem', marginBottom: '1rem', lineHeight: 1.6, textAlign: 'center', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>To pull off a Trojan Horse at this scale, you need a structure the old world can&apos;t buy, break, or co-opt. So we built one that works like nature.</p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

          {/* J.O.B. */}
          <div style={{ background: 'var(--iridescent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: '1.4rem', fontWeight: 800 }}>J.O.B.</div>
          <div style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--gold)', marginBottom: '0.2rem' }}>&ldquo;What happens when being human is the job?&rdquo;</div>

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
          ['The RCO has members', 'People aren\u2019t buying a service — they\u2019re joining an organism'],
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

  // 9 — THE FIRST PORTAL
  () => (
    <div className="slide">
      <h3>08 · The first portal</h3>
      <h1>J.O.B. is the <span className="gold">New Human Resources.</span></h1>
      <p style={{ fontSize: '1.15rem', marginTop: '1.25rem', lineHeight: 1.65 }}>You don&apos;t have to look them in the eye and feel like you failed them. HR has always wanted to do the right thing. Now there&apos;s something right to do.</p>
      <p style={{ fontSize: '1.15rem', marginTop: '1rem', lineHeight: 1.65 }}>Severance. Outplacement. EAP. It&apos;s a line item with no ROI and no one inside the company proud of how they spent it. The budget already exists. We&apos;re just the first honest use of it.</p>
      <p style={{ fontSize: '1.25rem', marginTop: '1.25rem', lineHeight: 1.55, fontStyle: 'italic', textAlign: 'center' }} className="gold">The new model needs a wedge. A place where the old world&apos;s money meets the new world&apos;s work.</p>
    </div>
  ),

  // 9 — THE PASSAGE
  () => (
    <div className="slide">
      <h3>09 · The passage</h3>
      <h1>Every portal leads to <span className="gold">one passage.</span></h1>
      <p style={{ fontSize: '1.15rem', marginTop: '1.25rem', lineHeight: 1.65 }}>It doesn&apos;t matter how you found us. The corporate offboarding. The retreat. The leadership program. The job board. Every door looks different on the outside.</p>
      <p style={{ fontSize: '1.25rem', marginTop: '1rem', lineHeight: 1.55, fontWeight: 700 }} className="gold">Inside, the work is always the same.</p>
      <p style={{ fontSize: '1.15rem', marginTop: '1rem', lineHeight: 1.65 }}>Grieve the old self. Deconstruct the old world. Wake the human underneath. Discover what only you can do. Build from there.</p>
      <p style={{ fontSize: '1.15rem', marginTop: '1.25rem', lineHeight: 1.55, fontStyle: 'italic', textAlign: 'center' }}>The rite of passage the old economy never had time for. J.O.B. makes it the whole point.</p>
    </div>
  ),

  // 10 — THE TROJAN HORSE
  () => {
    const [showPhaseTwo, setShowPhaseTwo] = useState(false);
    const thStyle = { textAlign: 'left', padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' };
    const tdStyle = { padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)' };
    const tdBold = { ...tdStyle, fontWeight: 700 };
    return (
      <div className="slide">
        <h3>05 · The Trojan Horse</h3>
        <h1>J.O.B. is a giant <span className="gold">Trojan Horse.</span></h1>
        <p style={{ fontSize: '1.2rem', marginTop: '0.75rem', lineHeight: 1.5 }}>We&apos;re going to pay people to do the real work. And we&apos;re going to play with the energetics of money and human value.</p>
        <p style={{ fontSize: '1.2rem', marginTop: '1rem', lineHeight: 1.5 }}>Every door looks different on the outside. Inside, they all lead to the same thing.</p>
        <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
          <thead>
            <tr>
              <th style={thStyle}>Experiment</th>
              <th style={thStyle}>What they think they&apos;re buying</th>
              <th style={thStyle}>What they&apos;re actually getting</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdBold} className="gold">New Human Resources</td>
              <td style={tdStyle}>Outplacement &mdash; a P&amp;L line item</td>
              <td style={tdStyle} className="gold">The fastest route from your last title to your actual self &mdash; funded by the company that let you go</td>
            </tr>
            <tr>
              <td style={tdBold} className="gold">Magic Shows</td>
              <td style={tdStyle}>A retreat experience</td>
              <td style={tdStyle} className="gold">The fastest route back to yourself that doesn&apos;t require ten years of therapy</td>
            </tr>
            <tr>
              <td style={{ ...tdBold, borderBottom: showPhaseTwo ? '1px solid var(--border)' : 'none' }} className="gold">Business 3.0</td>
              <td style={{ ...tdStyle, borderBottom: showPhaseTwo ? '1px solid var(--border)' : 'none' }}>A leadership program</td>
              <td style={{ ...tdStyle, borderBottom: showPhaseTwo ? '1px solid var(--border)' : 'none' }} className="gold">Permission to build something alive &mdash; and a map for how to do it without burning out or selling out</td>
            </tr>
            {showPhaseTwo && (
              <>
                <tr>
                  <td colSpan="3" style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Phase Two</td>
                </tr>
                <tr>
                  <td style={tdBold} className="gold">Transition Centers</td>
                  <td style={tdStyle}>A co-working space</td>
                  <td style={tdStyle} className="gold">Real estate arbitrage meets sacred ground &mdash; where the passage actually happens in person</td>
                </tr>
                <tr>
                  <td style={tdBold} className="gold">JOB Board</td>
                  <td style={tdStyle}>A job marketplace</td>
                  <td style={tdStyle} className="gold">A human marketplace &mdash; where supply creates demand for work that doesn&apos;t exist yet</td>
                </tr>
                <tr>
                  <td style={{ ...tdBold, borderBottom: 'none' }} className="gold">JOB Report</td>
                  <td style={{ ...tdStyle, borderBottom: 'none' }}>A performance tracker</td>
                  <td style={{ ...tdStyle, borderBottom: 'none' }} className="gold">An AI-tracked contribution engine that attributes value beyond money &mdash; redeemable anywhere in the organism</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
        {!showPhaseTwo && (
          <p
            onClick={() => setShowPhaseTwo(true)}
            style={{ marginTop: '0.75rem', fontSize: '0.95rem', cursor: 'pointer', animation: 'pulseGlow 2s ease-in-out infinite' }}
            className="gold"
          >
            ▼ Phase Two
          </p>
        )}
        <p style={{ marginTop: '0.75rem', textAlign: 'center', maxWidth: '100%', fontStyle: 'italic', fontSize: '1.2rem' }}>The rite of passage is the remembering of who you are.</p>
      </div>
    );
  },

  // 6 — HOW IT FEELS
  () => (
    <div className="slide">
      <h3>06 · How it feels</h3>
      <h1>Imagine if <span className="gold">AA, Meow Wolf, and Indeed</span> had a baby.</h1>
      <p style={{ fontSize: '1.05rem', marginTop: '0.75rem', lineHeight: 1.5 }}>J.O.B. is three things at once: a self-replicating, self-organizing community, an experience that bypasses the rational mind, and a marketplace that creates demand for work that doesn&apos;t exist yet.</p>
      <div className="three-col" style={{ marginTop: '0.75rem' }}>
        <div className="card">
          <h3 className="gold">AA</h3>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>Nobody owns it. Nobody runs it. It just shows up &mdash; every day, in every city, in church basements and rented rooms &mdash; because people need it badly enough to make it happen themselves. J.O.B. transition groups will form the same way.</p>
        </div>
        <div className="card">
          <h3 className="gold">Meow Wolf</h3>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>You can&apos;t talk someone out of their professional identity. You can&apos;t workshop it away or coach it into submission. You have to surprise it. Our Magic Shows and Transition Centers are weird on purpose &mdash; immersive, playful, slightly disorienting. The professional self walks in. A more honest, childlike version walks out.</p>
        </div>
        <div className="card">
          <h3 className="gold">Indeed</h3>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>Indeed built the world&apos;s largest labor marketplace by leading with demand. We&apos;re doing the opposite: we&apos;re creating the supply. The new human jobs don&apos;t exist yet &mdash; and you&apos;re going to have to see them to want them. That&apos;s why every portal we build is really a showroom for a self you haven&apos;t imagined yet.</p>
        </div>
      </div>
      <p style={{ marginTop: '0.75rem', textAlign: 'center', maxWidth: '100%', fontSize: '1.2rem', fontWeight: 600 }} className="gold">People&apos;s minds are being blown by what AI can do. The same thing is about to happen with humanity.</p>
    </div>
  ),

  // 7 — TEAM
  () => (
    <div className="slide">
      <h3>09 · Team</h3>
      <h1>Big idea and big implementation experts.</h1>
      <div className="two-col">
        <div className="card">
          <h3 style={{ color: 'var(--text)', textTransform: 'none', letterSpacing: '-0.01em', fontSize: '1.3rem', WebkitTextFillColor: 'var(--text)', marginBottom: '0.15rem' }}>Nicole Ayres</h3>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', fontWeight: 700, marginBottom: '0.5rem' }}>The Visionary Architect</p>
          <ul>
            <li>Bootstrapped Jumpsuit to $4M/yr with 0 funding, 0 paid ads, and 0 employees</li>
            <li>Future of Work AI platform acquired in 2024 by Chief Outsiders</li>
            <li>Co-visionary: Business 3.0 + the RCO</li>
            <li>Building J.O.B. in real time with AI</li>
          </ul>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--text)', textTransform: 'none', letterSpacing: '-0.01em', fontSize: '1.3rem', WebkitTextFillColor: 'var(--text)', marginBottom: '0.15rem' }}>Pam Kosanke</h3>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', fontWeight: 700, marginBottom: '0.5rem' }}>The Visionary Scaler</p>
          <ul>
            <li>Former CRO, EOS Worldwide &mdash; $145M revenue, 800+ implementers</li>
            <li>Unified 700+ independent brands globally</li>
            <li>Invented McDonald&apos;s breakfast dollar menu</li>
            <li>6× world champion, Team USA</li>
          </ul>
        </div>
      </div>
    </div>
  ),

  // 8 — THE RCO



  // 11 — MEMBERSHIP ECONOMY (moved up)
  () => (
    <div className="slide">
      <h3>13 · RCO Membership Economy</h3>
      <h1>Hire yourself. Get going. We&apos;ll track the value over time.</h1>
      <p>The RCO removes every barrier to starting. You don&apos;t need permission, a job description, or a title. You tell us what you&apos;re doing &mdash; money, time, build, network, idea, care &mdash; and the organism remembers. This is how members explore the question with us. It compounds energy and flow.</p>
      <div className="three-col" style={{ marginTop: '0.75rem' }}>
        <div className="card">
          <h3 className="gold">Money</h3>
          <p>Capital investment via Wefunder or direct.</p>
        </div>
        <div className="card">
          <h3 className="gold">Time</h3>
          <p>Facilitation, delivery, operations.</p>
        </div>
        <div className="card">
          <h3 className="gold">Build</h3>
          <p>Products, code, design &mdash; including Claude-built tools.</p>
        </div>
        <div className="card">
          <h3 className="gold">Network</h3>
          <p>Introductions, partnerships, clients.</p>
        </div>
        <div className="card">
          <h3 className="gold">Intellectual</h3>
          <p>Ideas, IP, frameworks, strategy.</p>
        </div>
        <div className="card">
          <h3 className="gold">Community</h3>
          <p>Bringing people in, holding the culture.</p>
        </div>
      </div>
      <p style={{ marginTop: '0.85rem', textAlign: 'center', maxWidth: '100%', fontSize: '0.95rem' }}>
        Our Contribution AI will attribute and track value over time. Value can be redeemed anywhere in the organism as: retreat stays, course access, community governance, and so on. <em>Not a security, not equity &mdash; an RCO membership benefit.</em>
      </p>
    </div>
  ),


  // 13 — TROJAN HORSE / THE TRICK
  () => (
    <div className="slide">
      <h3>15 · The trick</h3>
      <h1>J.O.B. is a giant Trojan Horse. Every doorway in leads to the same rite of passage.</h1>
      <p style={{ marginBottom: '0.4rem' }}>Every experiment is legible on the outside &mdash; a service, a platform, a program. Something the rational mind can justify to a CFO or explain to a spouse. But inside, they all do the same thing: trick you into remembering who you are.</p>
      <table className="deck-table" style={{ marginTop: '0.4rem', fontSize: '0.85rem' }}>
        <thead>
          <tr>
            <th>Experiment</th>
            <th>What they think they&apos;re buying</th>
            <th>What they&apos;re actually getting</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>New Human Resources</strong></td>
            <td>Outplacement &mdash; a P&amp;L line item</td>
            <td>The grief, the deprogramming, and the reinvention their employer accidentally funded</td>
          </tr>
          <tr>
            <td><strong>The Church</strong></td>
            <td>A spiritual community</td>
            <td>The place where the professional self finally stops running the show</td>
          </tr>
          <tr>
            <td><strong>Magic Shows</strong></td>
            <td>A retreat experience</td>
            <td>The fastest route back to yourself that doesn&apos;t require ten years of therapy</td>
          </tr>
          <tr>
            <td><strong>Transition Centers</strong></td>
            <td>Cohort real estate</td>
            <td>A physical body of people holding you while you figure out who you are without the title</td>
          </tr>
          <tr>
            <td><strong>J.O.B. Board</strong></td>
            <td>A gig marketplace</td>
            <td>Proof that what makes you irreplaceable is exactly what AI can&apos;t touch</td>
          </tr>
          <tr>
            <td><strong>Business 3.0</strong></td>
            <td>A leadership program</td>
            <td>Permission to build something alive &mdash; and a map for how to do it without burning out or selling out</td>
          </tr>
          <tr>
            <td><strong>The RCO</strong></td>
            <td>A holding company</td>
            <td>The first economy that tracks what you&apos;re actually worth &mdash; not just what you were paid</td>
          </tr>
        </tbody>
      </table>
    </div>
  ),

  // 15 — DISTRIBUTED AI STUDIO
  () => (
    <div className="slide">
      <h3>16 · The unfair advantage</h3>
      <h1>J.O.B. is the mycelial network.</h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text)', fontWeight: 600, marginBottom: '0.75rem' }}>The organism becomes self-organizing and self-replicating.</p>
      <p style={{ marginBottom: '0.5rem' }}>Every person moves through the same living funnel:</p>
      <table className="deck-table" style={{ marginTop: '0.4rem', fontSize: '0.9rem' }}>
        <thead>
          <tr>
            <th style={{ width: '30%' }}>Stage</th>
            <th>What happens</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1 · Laid off</strong></td>
            <td>Their company sends them into J.O.B. as part of offboarding. The guilty CHRO finally has something to hand them worth having.</td>
          </tr>
          <tr>
            <td><strong>2 · Deprogrammed</strong></td>
            <td>Church, Magic Shows, Transition Centers. They grieve the old self and wake the human underneath.</td>
          </tr>
          <tr>
            <td><strong>3 · Upskilled</strong></td>
            <td>AI fluency + the new human crafts &mdash; presence, mediation, facilitation, care. The jobs only humans can do.</td>
          </tr>
          <tr>
            <td><strong>4 · Plugged in</strong></td>
            <td>They join one of our companies, or list on the J.O.B. Board, or host the next cohort in their city.</td>
          </tr>
          <tr>
            <td><strong>5 · Replicating</strong></td>
            <td>They start their own experiment. Contribute it into the HoldCo. The organism grows a new limb. Repeat.</td>
          </tr>
        </tbody>
      </table>
      <p style={{ marginTop: '0.85rem', textAlign: 'center', maxWidth: '100%', fontSize: '1.2rem', fontWeight: 700 }} className="gold">
        We&apos;re the only company whose raw material is transformed humans.
      </p>
    </div>
  ),

  // 16 — NHR WEDGE
  () => (
    <div className="slide">
      <h3>17 · New Human Resources · The Wedge</h3>
      <h1>The budget already exists. We&apos;re just the first honest use of it.</h1>
      <p>HR&apos;s job is to take care of humans. But the company has to lay them off to survive. That&apos;s the paradox every CHRO lives inside &mdash; and nobody has given them a way out of it.</p>
      <p>Every company laying people off has already allocated the money &mdash; severance, outplacement, EAP. It&apos;s a line item with no ROI, no story, and no one inside the company proud of how they spent it.</p>
      <p><strong>We walk in and offer them something they can actually feel good about: a door where the real work finally begins.</strong></p>
      <p style={{ fontSize: '1.1rem', fontWeight: 600, fontStyle: 'italic' }} className="gold">Imagine what becomes possible when we pay people to do their new job.</p>
      <div className="three-col" style={{ marginTop: '0.5rem' }}>
        <div className="stat"><div className="stat-number">$2,500</div><div className="stat-label">per seat standard</div></div>
        <div className="stat"><div className="stat-number">$3,500</div><div className="stat-label">per seat premium</div></div>
        <div className="stat"><div className="stat-number">$250K</div><div className="stat-label">first deal target · 100 seats</div></div>
        <div className="stat"><div className="stat-number">$75M</div><div className="stat-label">enterprise ceiling · Oracle-scale</div></div>
        <div className="stat"><div className="stat-number">65%</div><div className="stat-label">gross margin at launch</div></div>
        <div className="stat"><div className="stat-number">&lt;6 mo</div><div className="stat-label">payback period</div></div>
      </div>
      <p style={{ marginTop: '0.85rem', fontSize: '0.95rem' }}>
        The buyer is the CHRO &mdash; the person who has to look laid-off employees in the eye. They&apos;re not buying outplacement. <strong>They&apos;re buying relief from guilt.</strong> We give them something that actually earns it.
      </p>
      <p style={{ marginTop: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Sales cycle: 60&ndash;120 days enterprise. Faster through warm network. Pam knows every CHRO worth knowing.
      </p>
    </div>
  ),

  // 17 — METABOLISM
  () => (
    <div className="slide">
      <h3>18 · The metabolism</h3>
      <h1>Many doors. One passage.</h1>
      <p style={{ fontSize: '1.15rem', color: 'var(--text)', fontWeight: 600, marginBottom: '0.25rem' }}>We optimize for aliveness. Revenue follows.</p>
      <p style={{ marginBottom: '0.6rem' }}>NHR is the main revenue door &mdash; but every experiment is a door to the same passage. A laid-off exec comes in through NHR. A curious founder comes in through Business 3.0. A grieving creative comes in through Magic Shows. A freelancer comes in through the J.O.B. Board. <strong>All of them end up in the same organism &mdash; and the output is equally wild in every direction.</strong></p>
      <div className="three-col" style={{ marginTop: '0.35rem' }}>
        <div className="card">
          <h3>The doors</h3>
          <p>NHR · Church · Magic Shows · J.O.B. Board · Transition Centers · Business 3.0. Each one is legible to a different kind of person. Each one charges money at the door.</p>
        </div>
        <div className="card">
          <h3>The passage</h3>
          <p>Grieve. Deprogram. Upskill. Rediscover what only a human can do. No matter the door, the work inside is the same &mdash; and the Church holds it.</p>
        </div>
        <div className="card">
          <h3>The output</h3>
          <p>People become nodes. Some start companies. Some host cohorts. Some build products. Some open the next city. <em>People enter as participants and exit as infrastructure.</em></p>
        </div>
        <div className="card">
          <h3>Aliveness sets the budget</h3>
          <p>Resources flow to whatever is most alive. What stops serving the question gets composted. No zombie products. The organism self-corrects.</p>
        </div>
        <div className="card">
          <h3>Supply creates demand</h3>
          <p>The new human jobs don&apos;t exist yet. You have to see them to want them. Every door &mdash; Magic Show, job fair, marketplace &mdash; is how we reveal what&apos;s possible.</p>
        </div>
        <div className="card">
          <h3>Compounding</h3>
          <p>Every transformed human is an asset in the cap table of the organism. The longer we run, the more the network is worth &mdash; and the less any one experiment matters.</p>
        </div>
      </div>
    </div>
  ),


  // 20 — TAM
  () => (
    <div className="slide">
      <h3>21 · Market</h3>
      <h1>The $1.5 trillion problem nobody solved because nobody wanted to name it.</h1>
      <p>Six industries exist to treat the same wound &mdash; the one left when a system tells you your value is what you produce. Each one treats a symptom. None of them treat the cause.</p>
      <div className="three-col" style={{ marginTop: '0.75rem' }}>
        <div className="stat"><div className="stat-number">$739B</div><div className="stat-label">HR &amp; recruiting</div></div>
        <div className="stat"><div className="stat-number">$461B</div><div className="stat-label">Mental health &amp; therapy</div></div>
        <div className="stat"><div className="stat-number">$222B</div><div className="stat-label">Wellness &amp; retreats</div></div>
        <div className="stat"><div className="stat-number">$42B</div><div className="stat-label">HR technology</div></div>
        <div className="stat"><div className="stat-number">$5.3B</div><div className="stat-label">Coaching</div></div>
        <div className="stat"><div className="stat-number">$2.5B</div><div className="stat-label">Outplacement</div></div>
      </div>
      <p style={{ marginTop: '0.85rem' }}>Every one of these is a fragment of the same broken thing. They exist in separate budget lines, separate industries, separate conversations &mdash; because no one has been willing to stand up and say: the problem isn&apos;t your resume, your stress levels, your productivity, or your mindfulness practice. <strong>The problem is that the system never taught you to be human. It only taught you to be useful.</strong></p>
      <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>That&apos;s not a wellness problem. That&apos;s not an HR problem. That&apos;s a civilizational problem. And civilizational problems create civilizational markets.</p>
      <p style={{ marginTop: '0.5rem', textAlign: 'center', maxWidth: '100%' }} className="gold"><strong>The seventh industry doesn&apos;t have a name yet. It&apos;s the human economy &mdash; the one being born right now, in real time, as the old one burns. Nobody built the passage. We did.</strong></p>
    </div>
  ),

  // 21 — TRACTION
  () => (
    <div className="slide">
      <h3>22 · Traction</h3>
      <h1>The organism is already alive.</h1>
      <p>The energy is clear. <strong>We need resources to feed it.</strong></p>
      <div className="two-col" style={{ marginTop: '0.75rem' }}>
        <div className="card">
          <h3>In market now</h3>
          <ul>
            <li><strong>itsthejob.com</strong> &mdash; front door live</li>
            <li><strong>New Human Resources</strong> &mdash; taking inbound, first enterprise conversations open; <strong>HR Unconferenced</strong> planned for July</li>
            <li><strong>Magic Shows</strong> &mdash; 5 executed with a growing waitlist</li>
            <li><strong>The Church</strong> &mdash; app live, Sunday Night Live running weekly, adding members daily</li>
            <li><strong>J.O.B. Board</strong> &mdash; in development, 20% fee structure in place</li>
            <li><strong>Business 3.0</strong> &mdash; framework built, pricing set, first cohort ready</li>
            <li><strong>JOB Report</strong> &mdash; prototype built with Claude, live inside this deck right now</li>
            <li><strong>Additional experiments</strong> &mdash; TBD, in exploration; the organism keeps attracting new ones</li>
          </ul>
        </div>
        <div className="card">
          <h3>The distribution nobody else has</h3>
          <p style={{ fontSize: '0.95rem' }}>This is the part that doesn&apos;t show up in a cap table.</p>
          <p style={{ fontSize: '0.95rem' }}>Pam spent a decade as CRO of EOS Worldwide &mdash; she didn&apos;t just run a $145M business, she built the network of operators and executives who trust her when she says something matters.</p>
          <p style={{ fontSize: '0.95rem' }}><strong>800+ EOS implementers.</strong> A growing Sunday Night Live audience. A Wefunder community round prepped and ready. Warm paths into enterprise conversations through people who already know her.</p>
          <p style={{ fontSize: '0.95rem', fontStyle: 'italic' }} className="gold">The wedge is sharp. The network is already there.</p>
        </div>
      </div>
    </div>
  ),

  // 21 — THE ASK
  () => (
    <div className="slide">
      <h3>23 · The ask</h3>
      <h1><span className="gold">$3&ndash;5M</span> seed. One check into the organism.</h1>
      <p><strong>J.O.B. is the ultimate portfolio investment strategy.</strong> What you&apos;re seeing in this deck was built by three people. Now imagine a whole economy of brilliant humans &mdash; freshly liberated from their jobs &mdash; throwing themselves at the same question. You own a piece of everything they build.</p>
      <p style={{ marginBottom: '0.75rem' }}>SAFE into the HoldCo. <strong>You&apos;re not getting equity in one experiment. You&apos;re getting equity in the system that holds all of them.</strong></p>
      <div className="two-col" style={{ marginTop: '0.25rem' }}>
        <div className="card">
          <h3>Where the $4M goes</h3>
          <ul style={{ fontSize: '0.9rem' }}>
            <li><strong>40% · $1.6M</strong> Team of 7 + delivery staff</li>
            <li><strong>20% · $800K</strong> First Transition Center</li>
            <li><strong>15% · $600K</strong> Platform &amp; tech &mdash; JOB Report, Board, Church</li>
            <li><strong>15% · $600K</strong> GTM &mdash; enterprise sales, brand</li>
            <li><strong>10% · $400K</strong> RCO formation + operating buffer</li>
          </ul>
        </div>
        <div className="card">
          <h3>What 24 months builds</h3>
          <p style={{ fontSize: '0.9rem' }}>First 10 NHR enterprise deals. First Transition Center open. 3,000 humans through the program. 25 certified Guides running cohorts. The RCO formally structured &mdash; nonprofit, HoldCo, first SPVs. JOB Report live as the organism&apos;s operating system.</p>
          <p style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>And the thing that doesn&apos;t fit in a milestone list: a community of people whose lives changed, who are now building the next layer of the organism because that&apos;s what happens when the passage is real.</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '0.85rem' }}>
        <h3>The honest risk</h3>
        <p style={{ fontSize: '0.9rem' }}>The RCO framing is unusual. The category doesn&apos;t exist yet. We know that.</p>
        <p style={{ fontSize: '0.9rem' }}>Our mitigation is also our strategy: every conversation leads with New Human Resources &mdash; the wedge that already makes financial sense to a CHRO and a CFO. The organism reveals itself from there. People don&apos;t have to understand the whole thing to say yes to the part in front of them.</p>
        <p style={{ fontSize: '0.9rem', fontStyle: 'italic' }} className="gold">That&apos;s not a workaround. That&apos;s the Trojan Horse working exactly as designed.</p>
      </div>
    </div>
  ),

  // 22 — CLOSE (handled separately)
  null,
];

// ============================================================
// CLOSE SLIDE + WAITLIST
// ============================================================

function CloseSlide({ onJoin }) {
  return (
    <div className="slide close-slide">
      <p className="big-quote" style={{ fontSize: '1.4rem' }}>&ldquo;Trickster is the creative idiot, the wise fool, the mythic embodiment of ambiguity and paradox.&rdquo;</p>
      <p className="attribution" style={{ marginBottom: '2rem' }}>&mdash; Lewis Hyde</p>
      <h1>Your body will say yes before your mind understands it. Trust that. Welcome to 3.0.</h1>
      <p style={{ marginTop: '1.5rem' }}><strong className="gold">Welcome to the Joy of Being Company.</strong></p>
      <div className="cta-row">
        <button className="waitlist-trigger" onClick={onJoin}>Join the Investor Waitlist</button>
        <a href="https://donorbox.org/j-o-b-founding-member-donations" target="_blank" rel="noopener noreferrer" className="waitlist-trigger donate-btn">Invest Now with Church Donation (tax exempt)</a>
      </div>
    </div>
  );
}

function WaitlistModal({ onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', investment_level: '' });
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    const { error } = await supabase.from('deck_waitlist').insert([{
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      investment_level: form.investment_level || null,
    }]);
    if (error) {
      console.error(error);
      setStatus('error');
    } else {
      setStatus('success');
    }
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>Join the Waitlist</h2>
        <p>Be first to invest in the transition company.</p>
        <form onSubmit={handleSubmit}>
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
            {status === 'submitting' ? 'Joining...' : status === 'error' ? 'Try again' : 'Join the Organism'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Deck() {
  const [current, setCurrent] = useState(0);
  const [showWaitlist, setShowWaitlist] = useState(false);
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
            <CloseSlide onJoin={() => setShowWaitlist(true)} />
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

      {showWaitlist && <WaitlistModal onClose={() => setShowWaitlist(false)} />}
    </div>
  );
}
