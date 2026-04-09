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
      <h3>11 · JOB Report · Interactive</h3>
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
      <h3>17 · Revenue at scale</h3>
      <h1>We&apos;re not betting on one product. We&apos;re betting on a question.</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>Click any experiment for the math. Numbers are early-stage models, not promises.</p>
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
  () => (
    <div className="slide cover">
      <h1>J.O.B.</h1>
      <p className="subtitle">The Joy of Being Company</p>
      <p className="tagline">Being human is the only job left.</p>
    </div>
  ),

  // 1 — THE MOMENT (new, data hook)
  () => (
    <div className="slide">
      <h3>01 · The moment</h3>
      <h1>The largest involuntary liberation in history.</h1>
      <div className="three-col" style={{ marginTop: '1.5rem' }}>
        <div className="stat">
          <div className="stat-number">30%</div>
          <div className="stat-label">of the workforce displaced by 2027</div>
        </div>
        <div className="stat">
          <div className="stat-number">200M+</div>
          <div className="stat-label">jobs automated this decade</div>
        </div>
        <div className="stat">
          <div className="stat-number">$739B</div>
          <div className="stat-label">HR &amp; recruiting &mdash; all reactive</div>
        </div>
      </div>
      <p style={{ marginTop: '1.75rem', textAlign: 'center', maxWidth: '100%', fontSize: '1.75rem', fontWeight: 600 }} className="gold">We were optimized for a system that no longer exists.</p>
    </div>
  ),

  // 2 — CURRENT REALITY
  () => (
    <div className="slide">
      <h3>02 · Current reality</h3>
      <h1>It&apos;s not a layoff. It&apos;s a funeral.</h1>
      <p>People aren&apos;t grieving the paycheck &mdash; they&apos;re grieving the life they had and the person they thought they were.</p>
      <p>Which makes the resources we currently provide feel almost offensive:</p>
      <ul style={{ margin: '0.75rem 0 0.75rem 1.5rem', lineHeight: 1.8 }}>
        <li>1&ndash;3 months severance</li>
        <li>A resume workshop</li>
        <li>A LinkedIn Premium stipend</li>
      </ul>
      <p>To send them right back into the system that just spit them out?</p>
      <p style={{ marginTop: '1rem', textAlign: 'center', maxWidth: '100%', fontStyle: 'italic', fontSize: '1.4rem' }} className="gold">Severance pays you to leave. J.O.B. pays you to arrive.</p>
    </div>
  ),

  // 3 — THE PROBLEM (3 systems collapsing)
  () => (
    <div className="slide">
      <h3>03 · The problem</h3>
      <h1>Three systems. Collapsing at once.</h1>
      <div className="three-col" style={{ marginTop: '1rem' }}>
        <div className="card">
          <h3>Education</h3>
          <p>told us <strong>who</strong> to become.</p>
        </div>
        <div className="card">
          <h3>Work</h3>
          <p>told us <strong>what</strong> we were worth.</p>
        </div>
        <div className="card">
          <h3>Religion</h3>
          <p>told us <strong>why</strong> we were here.</p>
        </div>
      </div>
      <p style={{ marginTop: '1.25rem', textAlign: 'center', maxWidth: '100%' }}>The system worked because it fragmented us &mdash; it paid us to be laborers, but never fully human.</p>
      <p style={{ marginTop: '0.5rem', textAlign: 'center', maxWidth: '100%', fontStyle: 'italic' }} className="gold">We need a new solution to actually resource humans.</p>
    </div>
  ),

  // 4 — FULLER QUOTE
  () => (
    <div className="slide close-slide">
      <p className="big-quote">&ldquo;You never change things by fighting the existing reality. To change something, build a new model that makes the existing model obsolete.&rdquo;</p>
      <p className="attribution">&mdash; Buckminster Fuller</p>
    </div>
  ),

  // 5 — THE SOLUTION (moved before Name)
  () => (
    <div className="slide">
      <h3>04 · The solution</h3>
      <h1>J.O.B. is where humans land after work ends.</h1>
      <div className="two-col" style={{ marginTop: '0.75rem' }}>
        <div className="card">
          <h3 className="gold">◎ Grieve</h3>
          <p>Process the identity loss. Not just income &mdash; who you thought you were.</p>
        </div>
        <div className="card">
          <h3 className="gold">◈ Deprogram</h3>
          <p>Undo what the system installed. Rediscover agency, creativity, presence.</p>
        </div>
        <div className="card">
          <h3 className="gold">◉ Upskill</h3>
          <p>New human skills + AI fluency. The jobs that remain and expand.</p>
        </div>
        <div className="card">
          <h3 className="gold">◍ Re-enter</h3>
          <p>Into the new human economy &mdash; on your terms, valued for who you are.</p>
        </div>
      </div>
      <p style={{ marginTop: '1rem', textAlign: 'center', maxWidth: '100%' }}>Right now, we&apos;re the transition company. Long-term, we&apos;re the infrastructure for the human economy.</p>
    </div>
  ),

  // 6 — THE NAME REVEAL
  () => (
    <div className="slide">
      <h3>05 · The name</h3>
      <h1>J.O.B. = <span className="gold">Joy of Being.</span></h1>
      <p style={{ fontSize: '1.15rem', marginTop: '1rem' }}>We&apos;ve been raised to be human doings, not human beings. For over 200 years, we did our jobs to make money to maybe have a life on the weekend &mdash; or after we retire. Our nervous systems literally do not have the capacity to slow down and feel safe. We have new work to do. The inner work.</p>
      <p style={{ fontSize: '1.5rem', color: 'var(--text)', fontWeight: 600, marginTop: '1.25rem', textAlign: 'center', maxWidth: '100%' }}>Our new job is becoming our selves. And consciously creating the next thing from that place.</p>
      <p style={{ fontSize: '1.15rem', fontStyle: 'italic', marginTop: '1rem', textAlign: 'center', maxWidth: '100%' }} className="gold">In order to build something new, you must first become it.</p>
    </div>
  ),

  // 7 — TEAM (moved from end)
  () => (
    <div className="slide">
      <h3>06 · Team</h3>
      <h1>Big idea + big implementation.</h1>
      <div className="two-col">
        <div className="card">
          <h3 style={{ color: 'var(--text)', textTransform: 'none', letterSpacing: '-0.01em', fontSize: '1.3rem', WebkitTextFillColor: 'var(--text)' }}>Pam Kosanke</h3>
          <p style={{ color: 'var(--purple)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '0.5rem' }}>The Scaler</p>
          <ul>
            <li>Former CRO, EOS Worldwide &mdash; $145M revenue, 800+ implementers</li>
            <li>Unified 700+ independent brands globally</li>
            <li>Raised $6M Series A (Mark Cuban, General Mills)</li>
            <li>Invented McDonald&apos;s breakfast dollar menu</li>
            <li>6× world champion, Team USA</li>
          </ul>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--text)', textTransform: 'none', letterSpacing: '-0.01em', fontSize: '1.3rem', WebkitTextFillColor: 'var(--text)' }}>Nicole Ayres</h3>
          <p style={{ color: 'var(--purple)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '0.5rem' }}>The Architect</p>
          <ul>
            <li>Jumpsuit &mdash; bootstrapped to $4M/yr, <strong>zero employees</strong></li>
            <li>Co-founded Jauntboards → acquired (2025)</li>
            <li>Co-visionary: Business 3.0 + the RCO</li>
            <li><strong>2,000+ Jumpsuiters</strong> network &mdash; running a B3.0 company for 7 years before it had a name</li>
            <li>Building J.O.B. in real time with AI</li>
          </ul>
        </div>
      </div>
    </div>
  ),

  // 8 — THE RCO
  () => (
    <div className="slide">
      <h3>07 · What J.O.B. is</h3>
      <h1>A Business 3.0 company. And the first RCO in the US.</h1>
      <p style={{ marginBottom: '0.75rem' }}>
        <strong>Business 3.0</strong> is the philosophy — a new paradigm for organizing companies around aliveness, contribution, and regeneration. <strong>The RCO</strong> (Regenerative Community Organism) is the structure that philosophy produced. <strong>J.O.B.</strong> is where we prove both — and become the vehicle that spreads them throughout the world.
      </p>
      <div className="three-col" style={{ marginTop: '0.5rem' }}>
        <div className="card">
          <h3>It starts with a question</h3>
          <p>&ldquo;What happens when being human is the only job left?&rdquo; Every product, every hire, every experiment answers it.</p>
        </div>
        <div className="card">
          <h3>Aliveness is the KPI</h3>
          <p>Resources flow to whatever has the most energy. What stops serving the question gets composted.</p>
        </div>
        <div className="card">
          <h3>Living organism, not a machine</h3>
          <p>The organism adapts. It breathes. It grows what works and releases what doesn&apos;t.</p>
        </div>
        <div className="card">
          <h3>Tracks value beyond capital</h3>
          <p>Money is one input. So is time, code, introductions, presence, relationships. All of it tracked. All of it honored.</p>
        </div>
      </div>
      <p style={{ marginTop: '0.85rem', textAlign: 'center', maxWidth: '100%', fontStyle: 'italic' }} className="gold">
        We don&apos;t just build a contribution layer for ourselves &mdash; it&apos;s part of the new thing that makes the old thing obsolete.
      </p>
    </div>
  ),

  // 9 — STRUCTURE (iframe)
  () => (
    <div className="slide">
      <h3>08 · The structure</h3>
      <h1>Two entities, one organism.</h1>
      <p style={{ marginBottom: '0.5rem' }}>The Church (nonprofit) holds the question. The C-Corp houses the experiments, SPVs, and LLCs aimed at the question &mdash; and distributes profits.</p>
      <iframe
        src="https://rco-explorer.vercel.app/"
        title="J.O.B. RCO Structure — interactive"
        style={{
          width: '100%',
          height: '52vh',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: '8px',
          background: '#0a0a0a',
          marginTop: '0.25rem',
        }}
      />
      <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click any row to explore. Live at rco-explorer.vercel.app.</p>
    </div>
  ),

  // 10 — EXPERIMENTS
  () => (
    <div className="slide">
      <h3>09 · Experiments</h3>
      <h1>Many experiments, all in service of the question.</h1>
      <p><em>What happens when being human is the only job left?</em> The HoldCo invests in its own experiments. The ones that grow get fed. The ones that don&apos;t get composted.</p>
      <div className="three-col" style={{ marginTop: '0.75rem' }}>
        <div className="card" style={{ borderColor: 'var(--purple)' }}>
          <h3 style={{ color: 'var(--text)' }}>★ New Human Resources <span style={{ fontSize: '0.65rem', fontWeight: 600, background: 'var(--iridescent)', color: 'var(--bg)', padding: '0.15rem 0.4rem', borderRadius: '4px', marginLeft: '0.3rem', WebkitBackgroundClip: 'padding-box', WebkitTextFillColor: 'var(--bg)' }}>WEDGE · LIVE</span></h3>
          <p>Corporate transition as initiation. The revenue engine.</p>
        </div>
        <div className="card">
          <h3>The Church <span className="exp-pill">LIVE</span></h3>
          <p>Grief container, initiatory passage, spiritual accountability.</p>
        </div>
        <div className="card">
          <h3>Magic Shows <span className="exp-pill">LIVE</span></h3>
          <p>Psychedelic-adjacent journeys. Human magic rediscovered in days.</p>
        </div>
        <div className="card">
          <h3>J.O.B. Board <span className="exp-pill exp-pill-dev">DEV</span></h3>
          <p>Marketplace for human presence. 20% fee. AI can&apos;t do this work.</p>
        </div>
        <div className="card">
          <h3>Business 3.0 <span className="exp-pill">LIVE</span></h3>
          <p>Curriculum for regenerative company building. The what&apos;s next.</p>
        </div>
        <div className="card">
          <h3>Transition Centers <span className="exp-pill exp-pill-dev">DEV</span></h3>
          <p>Physical spaces in abandoned buildings. The room you walk into.</p>
        </div>
      </div>
    </div>
  ),

  // 11 — MEMBERSHIP ECONOMY (moved up)
  () => (
    <div className="slide">
      <h3>10 · RCO Membership Economy</h3>
      <h1>Members invest in their own.</h1>
      <p>RCO members invest in their own work, their own ideas, their own people. If it benefits the organism, members earn JOB Points &mdash; redeemable across whatever the organism builds.</p>
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
        Points redeem as: retreat stays &middot; course access &middot; revenue share &middot; community governance. <em>Not a security, not equity &mdash; a membership benefit.</em>
      </p>
    </div>
  ),

  // 12 — JOB REPORT INTERACTIVE (moved here from position 7)
  JobReportSlide,

  // 13 — TROJAN HORSE / THE TRICK
  () => (
    <div className="slide">
      <h3>12 · The trick</h3>
      <h1>People think they&apos;re buying a product. They&apos;re actually walking into a passage.</h1>
      <p style={{ marginBottom: '0.4rem' }}>Every experiment is legible on the outside &mdash; a service, a platform, a program. Something the rational mind can justify to a CFO or explain to a spouse. But inside, they all do the same thing: trick you into remembering who you are.</p>
      <p style={{ marginBottom: '0.5rem', fontStyle: 'italic' }} className="gold">J.O.B. is a giant Trojan Horse.</p>
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
      <h3>13 · The unfair advantage</h3>
      <h1>The organism is self-replicating.</h1>
      <p style={{ fontSize: '1.3rem', color: 'var(--text)', fontWeight: 600, marginBottom: '0.75rem' }}>Most companies build. J.O.B. grows.</p>
      <p>Every person who comes through the program doesn&apos;t just heal &mdash; they become a node. Some start the first J.O.B. headquarters in their city. Some host the first J.O.B. Fair. Some build products on Claude and contribute them into the organism. Some certify as Guides and run cohorts. Some become the Business 3.0 company that proves the model works.</p>
      <p>The Trojan Horse runs in every direction. <strong>People enter as participants and exit as infrastructure.</strong></p>
      <p style={{ fontStyle: 'italic' }} className="gold">That&apos;s not a distribution strategy. That&apos;s a living system reproducing itself.</p>
      <table className="deck-table" style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
        <thead>
          <tr>
            <th>What existing studios have</th>
            <th>What we have</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Centralized team building products</td>
            <td>A community that builds because it became something</td>
          </tr>
          <tr>
            <td>Capital as the entry point</td>
            <td>Contribution as the entry point &mdash; money, time, code, presence, relationships</td>
          </tr>
          <tr>
            <td>Staff-run locations</td>
            <td>Members who open the next city because the organism changed their life</td>
          </tr>
          <tr>
            <td>Products that serve users</td>
            <td>Products built by the people the organism transformed</td>
          </tr>
          <tr>
            <td>A studio</td>
            <td>A movement that accidentally keeps making companies</td>
          </tr>
        </tbody>
      </table>
      <p style={{ marginTop: '0.85rem', fontSize: '0.95rem' }}>
        The AI fluency piece is real &mdash; members learn it inside the program and quietly ship products on Claude, contributing them into the organism with a clean acquisition pathway. But that&apos;s one expression of the bigger thing.
      </p>
      <p style={{ marginTop: '0.5rem', textAlign: 'center', maxWidth: '100%', fontSize: '1.15rem', fontWeight: 700 }} className="gold">
        The bigger thing: we&apos;re the only studio whose raw material is transformed humans.
      </p>
      <p style={{ marginTop: '0.4rem', textAlign: 'center', maxWidth: '100%', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Nobody can replicate that. You can&apos;t hire for it. You can&apos;t fund your way to it. You have to build the passage first.
      </p>
    </div>
  ),

  // 16 — NHR WEDGE
  () => (
    <div className="slide">
      <h3>14 · New Human Resources · The Wedge</h3>
      <h1>The budget already exists. We&apos;re just the first honest use of it.</h1>
      <p>Every company laying people off has already allocated the money &mdash; severance, outplacement, EAP. It&apos;s a line item with no ROI, no story, and no one inside the company proud of how they spent it.</p>
      <p><strong>We walk in and offer them something they can actually feel good about.</strong></p>
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
      <h3>15 · The metabolism</h3>
      <h1>We optimize for aliveness. Revenue follows.</h1>
      <div className="two-col" style={{ marginTop: '0.75rem' }}>
        <div className="card">
          <h3>1 &middot; Money in</h3>
          <p>A company is laying people off. They have a budget, a guilty CHRO, and no good options. They pay J.O.B. to hold their people through the passage. This is the wedge &mdash; and it funds everything else.</p>
        </div>
        <div className="card">
          <h3>2 &middot; Humans through</h3>
          <p>Each cohort moves through the organism. The Church holds the grief. Magic Shows wake something up. Transition Centers give them a room and a body of people. They arrive as employees. They leave as something else.</p>
        </div>
        <div className="card">
          <h3>3 &middot; Humans out, new energy in</h3>
          <p>Some start companies on the J.O.B. Board. Some certify as Guides and run the next cohort. Some build products on Claude and contribute them into the organism. Some open the first J.O.B. headquarters in their city. The people who came through become the infrastructure.</p>
        </div>
        <div className="card">
          <h3>4 &middot; Aliveness sets the budget</h3>
          <p>Resources flow to whatever is most alive. What stops serving the question gets composted &mdash; no sunk-cost zombies, no zombie products kept on life support because someone&apos;s attached. The organism self-corrects.</p>
        </div>
      </div>
    </div>
  ),

  // 18 — HOW IT FEELS
  () => (
    <div className="slide">
      <h3>16 · How it feels</h3>
      <h1>Imagine if AA, Meow Wolf, and Indeed had a baby.</h1>
      <div className="three-col" style={{ marginTop: '0.75rem' }}>
        <div className="card">
          <h3>AA</h3>
          <p>Nobody owns it. Nobody runs it. It just shows up &mdash; every day, in every city, in church basements and rented rooms &mdash; because people need it badly enough to make it happen themselves. <strong>J.O.B. transition groups will form the same way.</strong> Wherever the passage is happening, people will hold each other through it. The organism self-replicates because the need is real.</p>
        </div>
        <div className="card">
          <h3>Meow Wolf</h3>
          <p>You can&apos;t talk someone out of their professional identity. You can&apos;t workshop it away or coach it into submission. You have to surprise it. Our Magic Shows and Transition Centers are <strong>weird on purpose</strong> &mdash; immersive, playful, slightly disorienting. The professional self walks in. Something else walks out.</p>
        </div>
        <div className="card">
          <h3>Indeed</h3>
          <p>Indeed built the world&apos;s largest labor marketplace by leading with demand &mdash; here&apos;s what employers need, go become that. <strong>We&apos;re running the opposite experiment: lead with supply.</strong> Sovereign humans, offering work only humans can do, until the supply becomes the new demand. We&apos;re not filling jobs. We&apos;re defining what a job is allowed to mean.</p>
        </div>
      </div>
      <p style={{ marginTop: '0.85rem', textAlign: 'center', maxWidth: '100%', fontStyle: 'italic' }} className="gold">Trickster economics. Play is the medicine. The joke is that it works.</p>
    </div>
  ),

  // 19 — REVENUE CHART
  RevenueChartSlide,

  // 20 — TAM
  () => (
    <div className="slide">
      <h3>18 · Market</h3>
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
      <h3>19 · Traction</h3>
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
          </ul>
        </div>
        <div className="card">
          <h3>The distribution nobody else has</h3>
          <p style={{ fontSize: '0.95rem' }}>This is the part that doesn&apos;t show up in a cap table.</p>
          <p style={{ fontSize: '0.95rem' }}>Pam spent a decade as CRO of EOS Worldwide &mdash; she didn&apos;t just run a $145M business, she built the relationships with the exact people who sign our checks. Every CHRO, every Chief People Officer at every company about to make a hard call about their people &mdash; she either knows them or knows someone who does.</p>
          <p style={{ fontSize: '0.95rem' }}><strong>800+ EOS implementers.</strong> A growing Sunday Night Live audience. A Wefunder community round prepped and ready. And a pipeline of warm enterprise conversations that don&apos;t require us to explain what we do &mdash; because Pam already did.</p>
          <p style={{ fontSize: '0.95rem', fontStyle: 'italic' }} className="gold">The wedge is sharp. The network is already there. The first deal is a conversation, not a cold call.</p>
        </div>
      </div>
    </div>
  ),

  // 21 — THE ASK
  () => (
    <div className="slide">
      <h3>20 · The ask</h3>
      <h1><span className="gold">$3&ndash;5M</span> seed. One check into the organism.</h1>
      <p>This isn&apos;t a bet on a product line. It&apos;s a bet on a question &mdash; and the infrastructure to let the answer keep revealing itself.</p>
      <p style={{ marginBottom: '0.75rem' }}>SAFE into the HoldCo. <strong>You&apos;re not getting equity in one experiment. You&apos;re getting equity in the system that holds all of them.</strong></p>
      <div className="two-col" style={{ marginTop: '0.25rem' }}>
        <div className="card">
          <h3>Where the $4M goes</h3>
          <ul style={{ fontSize: '0.9rem' }}>
            <li><strong>40% · $1.6M</strong> Team of 7 + delivery staff</li>
            <li><strong>20% · $800K</strong> First 3 Transition Centers</li>
            <li><strong>15% · $600K</strong> Platform &amp; tech &mdash; JOB Report, Board, Church</li>
            <li><strong>15% · $600K</strong> GTM &mdash; enterprise sales, brand</li>
            <li><strong>10% · $400K</strong> RCO formation + operating buffer</li>
          </ul>
        </div>
        <div className="card">
          <h3>What 24 months builds</h3>
          <p style={{ fontSize: '0.9rem' }}>First 10 NHR enterprise deals. First 3 Transition Centers open. 3,000 humans through the program. 25 certified Guides running cohorts. The RCO formally structured &mdash; nonprofit, HoldCo, first SPVs. JOB Report live as the organism&apos;s operating system.</p>
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
      <h1>The machines can have the jobs. We want the part they can&apos;t touch.</h1>
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
