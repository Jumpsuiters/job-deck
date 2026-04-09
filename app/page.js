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
    description: 'Spent $100k on Telepathy Tapes ads. Got one client at Jumpsuit worth $500k — and met Pam Kosanke, who I would have spent $100k just to meet.',
    category: 'Network',
    bucket: 'C',
    points_min: 1500,
    points_max: 2500,
    explanation: 'Validated $500k outcome plus a relationship whose full value is visibly still unfolding. The Pam meeting is the kind of catalytic connection no spreadsheet would have logged.',
    open_loop_reason: 'Pam became co-founder of J.O.B. and the enterprise sales pathway into CHROs. Full compounded value is still unfolding.',
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
      <h1>Contribution as the operating system.</h1>
      <p style={{ marginBottom: '0.75rem' }}>
        We ask people to report evidence of non-monetary value &mdash; and the AI does the attribution. For example: investing time early in helping create the JOB Guide program could be redeemed later anywhere in the organism &mdash; say, a month&apos;s stay at a Costa Rica retreat center. <strong>Here, try it.</strong>
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
      <h1>Many experiments. Many revenue lines. One organism.</h1>
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

  // 5 — THE NAME REVEAL
  () => (
    <div className="slide">
      <h3>04 · The name</h3>
      <h1>J.O.B. = <span className="gold">Joy of Being.</span></h1>
      <p style={{ fontSize: '1.15rem', marginTop: '1rem' }}>For 200 years, a &ldquo;job&rdquo; was the thing you did for money so you could maybe have a life on the weekend. We took the most loaded word in the working world and gave it back its real meaning.</p>
      <p style={{ fontSize: '1.5rem', color: 'var(--text)', fontWeight: 600, marginTop: '1.25rem', textAlign: 'center', maxWidth: '100%' }}>The work is becoming yourself.</p>
      <p style={{ fontSize: '1.15rem', fontStyle: 'italic', marginTop: '1rem', textAlign: 'center', maxWidth: '100%' }} className="gold">The new job is our own inner work &mdash; so we can consciously create a new reality.</p>
    </div>
  ),

  // 6 — THE SOLUTION (4 stages from new deck)
  () => (
    <div className="slide">
      <h3>05 · The solution</h3>
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

  // 7 — TEAM (moved from end)
  () => (
    <div className="slide">
      <h3>06 · Team</h3>
      <h1>Big idea + big implementation.</h1>
      <div className="two-col">
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
      </div>
    </div>
  ),

  // 8 — THE RCO
  () => (
    <div className="slide">
      <h3>07 · The differentiator</h3>
      <h1>J.O.B. is the first RCO in the US.</h1>
      <p style={{ fontSize: '1.35rem', color: 'var(--text)', fontWeight: 600, marginBottom: '0.75rem' }}>Regenerative Community Organism.</p>
      <div className="two-col">
        <div className="card">
          <h3>Aliveness is the KPI</h3>
          <p>Resources flow to whatever has the most energy. What stops serving the question gets composted &mdash; no sunk-cost zombies.</p>
        </div>
        <div className="card">
          <h3>Contribution over capital</h3>
          <p>Money is one input. So is time, creativity, relationships, and IP. All of it tracked, all of it honored.</p>
        </div>
        <div className="card">
          <h3>Living system, not machine</h3>
          <p>The organism adapts. It breathes. It grows the experiments that work and releases the ones that don&apos;t.</p>
        </div>
        <div className="card">
          <h3>The question never changes</h3>
          <p>&ldquo;What happens when being human is the job?&rdquo; Every product, every experiment, every hire answers this.</p>
        </div>
      </div>
    </div>
  ),

  // 9 — STRUCTURE (iframe)
  () => (
    <div className="slide">
      <h3>08 · The structure</h3>
      <h1>Two entities. One organism.</h1>
      <p style={{ marginBottom: '0.5rem' }}>The Church (nonprofit) holds the mission. The HoldCo (C-Corp) houses the experiments and distributes profits.</p>
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
      <h1>Many experiments. One question.</h1>
      <p>Every experiment below is currently in motion. The ones that grow get fed. The ones that don&apos;t get composted.</p>
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
      <h1>Capital is one input. It&apos;s not the only one.</h1>
      <p>RCO membership earns JOB Points &mdash; redeemable across whatever the organism builds.</p>
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
      <h1>Every door is a Trojan Horse.</h1>
      <p style={{ marginBottom: '0.4rem' }}>Each portal is designed to bring you into deep transformational work. It&apos;s all the same thing in the end &mdash; infinite pathways to remembering who you are, and that you can change reality.</p>
      <table className="deck-table" style={{ marginTop: '0.4rem', fontSize: '0.88rem' }}>
        <thead>
          <tr>
            <th>Experiment</th>
            <th>What people think they&apos;re buying</th>
            <th>Why it actually exists</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>New Human Resources</strong></td>
            <td>Outplacement &mdash; a P&amp;L line item</td>
            <td>A 12&ndash;18 month passage their employer accidentally paid for.</td>
          </tr>
          <tr>
            <td><strong>The Church</strong></td>
            <td>A spiritual community</td>
            <td>The initiation that helps people remember who they are.</td>
          </tr>
          <tr>
            <td><strong>Magic Shows</strong></td>
            <td>A retreat / immersive experience</td>
            <td>Nervous-system activation that rediscovers your human magic in days.</td>
          </tr>
          <tr>
            <td><strong>Transition Centers</strong></td>
            <td>Cohort real estate</td>
            <td>The room you walk into when the floor falls out.</td>
          </tr>
          <tr>
            <td><strong>The J.O.B. Board</strong></td>
            <td>A gig marketplace</td>
            <td>Income for the newly sovereign &mdash; work only humans can do.</td>
          </tr>
          <tr>
            <td><strong>Business 3.0</strong></td>
            <td>A leadership program</td>
            <td>A new way of building regenerative companies.</td>
          </tr>
          <tr>
            <td><strong>The RCO</strong></td>
            <td>A holding company</td>
            <td>A living organism investors fund as a single check.</td>
          </tr>
        </tbody>
      </table>
      <p style={{ marginTop: '0.6rem', textAlign: 'center', maxWidth: '100%' }}><strong>Competitors can&apos;t copy us &mdash; they don&apos;t know what game we&apos;re playing.</strong></p>
    </div>
  ),

  // 15 — DISTRIBUTED AI STUDIO
  () => (
    <div className="slide">
      <h3>13 · Unfair advantage</h3>
      <h1>Distributed AI Studio. Nobody has built this.</h1>
      <p><strong>The Trojan Horse: we use the upskilling to get people building.</strong> Members learn AI fluency inside the program &mdash; and quietly ship real products on Claude. They contribute them into the organism. J.O.B. <strong>earns the right of first acquisition</strong> as it provides infrastructure, distribution, and resources. The community is the studio.</p>
      <div className="flywheel" style={{ maxWidth: '100%', marginTop: '0.75rem' }}>
        <div className="flywheel-step">
          <strong>1 · Member builds</strong>
          <span>on Claude API, on their own initiative</span>
        </div>
        <div className="flywheel-arrow">↓</div>
        <div className="flywheel-step">
          <strong>2 · Contributes into the organism</strong>
          <span>J.O.B. promotes, integrates, sends users</span>
        </div>
        <div className="flywheel-arrow">↓</div>
        <div className="flywheel-step">
          <strong>3 · Accrues JOB Points</strong>
          <span>JOB Report tracks value creation in real time</span>
        </div>
        <div className="flywheel-arrow">↓</div>
        <div className="flywheel-step">
          <strong>4 · J.O.B. earns right of first acquisition</strong>
          <span>Clean exit pathway at PMF</span>
        </div>
      </div>
      <p style={{ marginTop: '0.85rem', textAlign: 'center', maxWidth: '100%' }}><strong>Existing studios are centralized, capital-funded, staff-built. Ours is community-built, AI-native, contribution-rewarded.</strong></p>
    </div>
  ),

  // 16 — NHR WEDGE
  () => (
    <div className="slide">
      <h3>14 · Wedge</h3>
      <h1>Something human with it.</h1>
      <p>Companies already have a budget for layoffs. We&apos;re the line item that actually does something human with it.</p>
      <div className="three-col" style={{ marginTop: '0.5rem' }}>
        <div className="stat"><div className="stat-number">$2,500</div><div className="stat-label">per seat standard</div></div>
        <div className="stat"><div className="stat-number">$3,500</div><div className="stat-label">per seat premium</div></div>
        <div className="stat"><div className="stat-number">$250K</div><div className="stat-label">first deal target (100 seats)</div></div>
        <div className="stat"><div className="stat-number">$75M</div><div className="stat-label">enterprise ceiling (Oracle-scale)</div></div>
        <div className="stat"><div className="stat-number">65%</div><div className="stat-label">gross margin at launch</div></div>
        <div className="stat"><div className="stat-number">&lt;6 mo</div><div className="stat-label">payback period</div></div>
      </div>
      <p style={{ marginTop: '0.85rem', textAlign: 'center', maxWidth: '100%', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Buyer: CHRO / Chief People Officer &middot; Sales cycle: 60&ndash;120 days &middot; Pam → CHRO direct.
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
          <p>Enterprises pay J.O.B. to hold their people through the passage. The wedge.</p>
        </div>
        <div className="card">
          <h3>2 &middot; Humans through</h3>
          <p>Each cohort moves through the Church, Magic Shows, Transition Centers.</p>
        </div>
        <div className="card">
          <h3>3 &middot; Humans out, new revenue in</h3>
          <p>They start companies on the Board, certify as Guides, build B3.0 companies.</p>
        </div>
        <div className="card">
          <h3>4 &middot; Aliveness sets the budget</h3>
          <p>Resources flow to what compounds. What doesn&apos;t serve the question gets composted.</p>
        </div>
      </div>
      <p style={{ marginTop: '0.85rem', textAlign: 'center', maxWidth: '100%' }}><strong>One check funds an organism whose north star is the one thing AI can&apos;t fake: aliveness.</strong></p>
    </div>
  ),

  // 18 — HOW IT FEELS
  () => (
    <div className="slide">
      <h3>16 · How it feels</h3>
      <h1>Imagine if AA, Meow Wolf, and Indeed had a baby.</h1>
      <p>Three proven models &mdash; remixed into a better option than the resume trap.</p>
      <div className="three-col" style={{ marginTop: '0.75rem' }}>
        <div className="card">
          <h3>AA</h3>
          <p>A decentralized process that self-organizes every day in every city. <strong>J.O.B. transition groups will form the same way</strong> &mdash; wherever the passage is happening, people will hold each other through it.</p>
        </div>
        <div className="card">
          <h3>Meow Wolf</h3>
          <p>Immersive, playful, IRL activations that wake people up. Our Magic Shows and Transition Centers are <strong>weird on purpose</strong>. The professional self can&apos;t be coaxed out &mdash; it has to be surprised.</p>
        </div>
        <div className="card">
          <h3>Indeed</h3>
          <p>Indeed leads with demand. <strong>We&apos;ll lead with supply</strong> &mdash; sovereign humans offering work only humans can do &mdash; until the supply becomes the new demand.</p>
        </div>
      </div>
      <p style={{ marginTop: '0.85rem', textAlign: 'center', maxWidth: '100%' }}><strong>Trickster economics. Play is the medicine.</strong></p>
    </div>
  ),

  // 19 — REVENUE CHART
  RevenueChartSlide,

  // 20 — TAM
  () => (
    <div className="slide">
      <h3>18 · Market</h3>
      <h1>Six broken industries. One fix.</h1>
      <div className="three-col" style={{ marginTop: '1.5rem' }}>
        <div className="stat"><div className="stat-number">$739B</div><div className="stat-label">HR &amp; recruiting</div></div>
        <div className="stat"><div className="stat-number">$461B</div><div className="stat-label">Mental health &amp; therapy</div></div>
        <div className="stat"><div className="stat-number">$222B</div><div className="stat-label">Wellness &amp; retreats</div></div>
        <div className="stat"><div className="stat-number">$42B</div><div className="stat-label">HR technology</div></div>
        <div className="stat"><div className="stat-number">$5.3B</div><div className="stat-label">Coaching</div></div>
        <div className="stat"><div className="stat-number">$2.5B</div><div className="stat-label">Outplacement</div></div>
      </div>
      <p style={{ marginTop: '2rem', textAlign: 'center', maxWidth: '100%' }}>Every one of these is a fragment of the same problem. Nobody built the passage. <strong>The seventh industry is the human economy itself. We&apos;re inventing it.</strong></p>
    </div>
  ),

  // 21 — TRACTION
  () => (
    <div className="slide">
      <h3>19 · Traction</h3>
      <h1>Not starting from zero. Starting from live.</h1>
      <div className="two-col" style={{ marginTop: '0.75rem' }}>
        <div className="card">
          <h3>Live product</h3>
          <ul>
            <li><strong>itsthejob.com</strong> — the front door</li>
            <li><strong>New Human Resources</strong> — taking inbound</li>
            <li><strong>Magic Shows</strong> — produced in Nashville, Minneapolis, Big Sky</li>
            <li><strong>The Church</strong> — live app, Sunday Night Live running</li>
            <li><strong>J.O.B. Board</strong> — in dev, 20% fee in place</li>
            <li><strong>Business 3.0</strong> — framework built, pricing set</li>
            <li><strong>JOB Report</strong> — prototype built with Claude, live in this deck</li>
          </ul>
        </div>
        <div className="card">
          <h3>Pipeline &amp; distribution</h3>
          <ul>
            <li><strong>800+ EOS implementers</strong> &mdash; Pam&apos;s direct CHRO network</li>
            <li><strong>CHRO pipeline</strong> &mdash; warm intros into Fortune 1000</li>
            <li><strong>Sunday Night Live</strong> &mdash; weekly audience already forming</li>
            <li><strong>Wefunder community round</strong> &mdash; prepped</li>
          </ul>
        </div>
      </div>
    </div>
  ),

  // 21 — THE ASK
  () => (
    <div className="slide">
      <h3>20 · The ask</h3>
      <h1><span className="gold">$3&ndash;5M</span> seed. One check into the organism.</h1>
      <p style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>SAFE into the HoldCo. You&apos;re not betting on a product line &mdash; you&apos;re betting on a living system that follows aliveness.</p>
      <div className="three-col" style={{ marginTop: '0.25rem' }}>
        <div className="card">
          <h3>Where the $4M goes</h3>
          <ul style={{ fontSize: '0.9rem' }}>
            <li><strong>40% · $1.6M</strong> Team of 7 + delivery staff</li>
            <li><strong>20% · $800K</strong> First 3 Transition Centers</li>
            <li><strong>15% · $600K</strong> Platform &amp; tech</li>
            <li><strong>15% · $600K</strong> GTM (enterprise sales, brand)</li>
            <li><strong>10% · $400K</strong> RCO formation + buffer</li>
          </ul>
        </div>
        <div className="card">
          <h3>What 24 months builds</h3>
          <ul style={{ fontSize: '0.9rem' }}>
            <li>First <strong>10 NHR enterprise deals</strong></li>
            <li>First <strong>3 Transition Centers</strong></li>
            <li><strong>3,000 humans</strong> through the program</li>
            <li>Form the <strong>RCO</strong> (nonprofit + HoldCo + SPVs)</li>
            <li>Certify first <strong>25 Guides</strong></li>
          </ul>
        </div>
        <div className="card">
          <h3>Team of 7</h3>
          <ul style={{ fontSize: '0.9rem' }}>
            <li>Chief People Officer</li>
            <li>Head of NHR Enterprise</li>
            <li>Head of Program Delivery</li>
            <li>Head of Transition Centers</li>
            <li>Head of Tech</li>
            <li>B3.0 Program Lead</li>
            <li>Creative Director</li>
          </ul>
        </div>
      </div>
      <p style={{ marginTop: '0.85rem', fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '100%' }}>
        <strong className="gold">The honest risk:</strong> the RCO framing is unusual and the category doesn&apos;t exist yet. Mitigation: every conversation leads with the wedge that already makes financial sense (NHR), and the organism reveals itself from there.
      </p>
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
