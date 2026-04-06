'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

function RevenueChartSlide() {
  const [openIndex, setOpenIndex] = useState(null);
  const experiments = [
    { name: 'New Human Resources', label: 'Per-seat enterprise + Magic Show add-on', revenue: '$200M+', max: 200, breakdown: 'One enterprise deal at 30K seats × $2,500 = $75M. 10 deals/yr at varied scale = $200M+. Magic Show add-on adds 10–30% per cohort.' },
    { name: 'Business 3.0', label: 'Founder cohorts + certification', revenue: '$50M', max: 50, breakdown: '2,000 founders × $25K entry = $50M. Plus platform fees from certified implementers and ongoing cohorts.' },
    { name: 'Transition Centers', label: 'Physical cohorts + residencies', revenue: '$30M', max: 30, breakdown: '10 centers × ~$3M each (cohorts, retreats, residencies). Real estate arbitrage on the collapse of the old economy.' },
    { name: 'Magic Shows', label: 'Immersions + host certification', revenue: '$40M', max: 40, breakdown: 'Two streams: (1) attendees pay to be transformed (~3,500/yr blended across formats). (2) Members pay to be trained as certified Magic Show hosts \u2014 spaceholding, sacrament training, facilitation craft. The host network compounds as the organism grows.' },
    { name: 'J.O.B. Board', label: 'Marketplace fees', revenue: '$20M', max: 20, breakdown: '20% platform fee on $100M GMV. Sovereign humans selling what AI can\u2019t do — coaching, mediation, hands-on craft, presence work.' },
    { name: 'The Church', label: 'Tracks + community', revenue: '$5M', max: 5, breakdown: 'Paid tracks ($500–$2K), community membership tiers, doctrine licensing to HoldCo experiments.' },
  ];
  const maxValue = 200;
  return (
    <div className="slide">
      <h3>Revenue at scale</h3>
      <h1>Many experiments. Many revenue lines. One organism.</h1>
      <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>Click any experiment for the math. Numbers are early-stage models, not promises.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
        {experiments.map((exp, i) => (
          <button
            key={i}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            style={{
              background: openIndex === i ? 'rgba(212,184,76,0.08)' : 'rgba(255,255,255,0.03)',
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
                <span style={{ color: 'var(--muted)', marginLeft: '0.5rem', fontSize: '0.85rem' }}>&middot; {exp.label}</span>
              </div>
              <span style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '1.1rem', whiteSpace: 'nowrap' }}>{exp.revenue}/yr</span>
            </div>
            <div style={{ marginTop: '0.6rem', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${(exp.max / maxValue) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--gold), #d466b0)' }} />
            </div>
            {openIndex === i && (
              <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.5 }}>{exp.breakdown}</p>
            )}
          </button>
        ))}
      </div>
      <p style={{ marginTop: '1rem', textAlign: 'center', maxWidth: '100%', fontSize: '1.05rem' }}>
        <strong>Combined run-rate at scale: <span style={{ color: 'var(--gold)' }}>$345M+/yr.</span></strong> Resources flow to whichever experiments compound fastest. The rest compost.
      </p>
    </div>
  );
}

const slides = [
  // 0 — COVER
  () => (
    <div className="slide cover">
      <h1>J.O.B.</h1>
      <p className="subtitle">The Joy of Being Company</p>
      <p className="tagline">What if being human is the only job left?</p>
    </div>
  ),

  // 1 — PROBLEM (three systems collapsing)
  () => (
    <div className="slide">
      <h3>The problem</h3>
      <h1>We are under-resourced for the moment we&apos;re in.</h1>
      <p>We built our lives on three systems:</p>
      <div className="three-col" style={{ marginTop: '1rem' }}>
        <div className="card">
          <h3>Education</h3>
          <p>told us who to become.</p>
        </div>
        <div className="card">
          <h3>Work</h3>
          <p>told us what we were worth.</p>
        </div>
        <div className="card">
          <h3>Religion</h3>
          <p>told us why we were here.</p>
        </div>
      </div>
      <p style={{ marginTop: '1.25rem', textAlign: 'center', maxWidth: '100%' }}>All three are collapsing at once. People aren&apos;t just losing jobs and beliefs. They&apos;re losing identity, structure, and meaning.</p>
      <p style={{ marginTop: '0.75rem', textAlign: 'center', maxWidth: '100%', color: 'var(--gold)', fontStyle: 'italic' }}>Looks like institutional collapse. Is actually the masks coming off.</p>
    </div>
  ),

  // 2 — CURRENT REALITY (layoff = funeral)
  () => (
    <div className="slide">
      <h3>Current reality</h3>
      <h1>It&apos;s not a layoff. It&apos;s a funeral.</h1>
      <p>People aren&apos;t grieving the paycheck. They&apos;re grieving the life they had and the person they thought they were.</p>
      <p>Which makes the resources we currently provide feel almost offensive:</p>
      <ul style={{ margin: '0.75rem 0 0.75rem 1.5rem', lineHeight: 1.8 }}>
        <li>1&ndash;3 months severance</li>
        <li>A resume workshop</li>
        <li>A LinkedIn Premium stipend</li>
      </ul>
      <p>To what? Send them right back into the system that just spit them out? The bereavement of a professional identity takes 12 to 18 months &mdash; and a chatbot can&apos;t close that gap.</p>
    </div>
  ),

  // 3 — FULLER QUOTE
  () => (
    <div className="slide close-slide">
      <p className="big-quote">&ldquo;You never change things by fighting the existing reality. To change something, build a new model that makes the existing model obsolete.&rdquo;</p>
      <p className="attribution">&mdash; Buckminster Fuller</p>
    </div>
  ),

  // 4 — OPPORTUNITY
  () => (
    <div className="slide">
      <h3>The opportunity</h3>
      <h1>We&apos;re creating the new model that makes the old one obsolete.</h1>
      <p>Right now, we&apos;re experiencing the largest involuntary liberation in history.</p>
      <p>We were paid to be laborers. We were never taught to be fully human.</p>
      <p>As AI threatens to automate the work, we&apos;re being invited to ask the question the paycheck was paying us not to: <em>what happens when being human is the job?</em></p>
      <p style={{ marginTop: '1rem', color: 'var(--gold)', fontStyle: 'italic' }}>Looks like the largest crisis. Is actually the largest invitation.</p>
    </div>
  ),

  // 5 — THURMAN QUOTE
  () => (
    <div className="slide close-slide">
      <p className="big-quote">&ldquo;Don&apos;t ask what the world needs. Ask what makes you come alive, and go do it. Because what the world needs is people who have come alive.&rdquo;</p>
      <p className="attribution">&mdash; Howard Thurman</p>
    </div>
  ),

  // 6 — THE NAME (reveal)
  () => (
    <div className="slide">
      <h3>The name</h3>
      <h1>J.O.B. = <span className="gold">Joy of Being.</span></h1>
      <p style={{ fontSize: '1.15rem', marginTop: '1rem' }}>For 200 years, a &ldquo;job&rdquo; was the thing you did for money so you could maybe have a life on the weekend.</p>
      <p style={{ fontSize: '1.15rem' }}>We took the most loaded word in the working world and gave it back its real meaning.</p>
      <p style={{ fontSize: '1.4rem', color: 'var(--gold)', fontStyle: 'italic', marginTop: '1.5rem', textAlign: 'center', maxWidth: '100%' }}>The only job left is to be human. So we took the word.</p>
    </div>
  ),

  // 7 — SOLUTION
  () => (
    <div className="slide">
      <h3>The solution</h3>
      <p style={{ fontSize: '1.15rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>We all feel it coming. There&apos;s no clear place to land.</p>
      <h1>J.O.B. is the missing infrastructure.</h1>
      <p>For the shift from <em>doing for survival</em> to <em>being as the source of human value</em>.</p>
      <p style={{ fontSize: '1.35rem', color: 'var(--gold)', fontWeight: 400, margin: '1.25rem 0' }}>How we build is just as important as why and what.</p>
      <p>Right now, we&apos;re the transition company. Long-term, we&apos;re the infrastructure for the human economy that&apos;s replacing the old one.</p>
    </div>
  ),

  // 7 — DIFFERENTIATOR (RCO)
  () => (
    <div className="slide">
      <h3>The differentiator</h3>
      <h1>J.O.B. is the first RCO in America.</h1>
      <p style={{ fontSize: '1.35rem', color: 'var(--text)', fontWeight: 600, marginBottom: '1rem' }}>Regenerative Community Organism.</p>
      <p>Most corporations are extractive by nature. The RCO is a living system organized around one question:</p>
      <p style={{ fontSize: '1.6rem', color: 'var(--gold)', fontWeight: 400, margin: '1.25rem 0', fontStyle: 'italic', textAlign: 'center' }}>&ldquo;What happens when the only job left is to be human?&rdquo;</p>
      <p>Every experiment, product, and business is in service of this question. The organism flows resources to the places with the most aliveness &mdash; and composts what no longer holds energy.</p>
    </div>
  ),

  // 8 — STRUCTURE (RCO chart iframe)
  () => (
    <div className="slide">
      <h3>The structure</h3>
      <h1>Two entities. One organism.</h1>
      <p style={{ marginBottom: '0.75rem' }}>The Church (nonprofit) holds the mission and keeps the HoldCo accountable to the question. The HoldCo (for-profit) houses the experiments, distributes profits, and keeps the organism financially alive.</p>
      <iframe
        src="https://rco-explorer.vercel.app/"
        title="J.O.B. RCO Structure — interactive"
        style={{
          width: '100%',
          height: '52vh',
          border: '1px solid rgba(212,184,76,0.3)',
          borderRadius: '8px',
          background: '#0a0a0a',
          marginTop: '0.5rem',
        }}
      />
      <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--muted)' }}>Click any row to explore. Live at rco-explorer.vercel.app.</p>
    </div>
  ),

  // 9 — HOW IT WORKS (experiments in motion)
  () => (
    <div className="slide">
      <h3>How it works</h3>
      <h1>Many experiments. One question.</h1>
      <p>Every experiment below is currently in motion. Each one is an answer to the guiding question. The ones that grow get fed. The ones that don&apos;t get composted.</p>
      <div className="three-col" style={{ marginTop: '0.75rem' }}>
        <div className="card">
          <h3>The Church</h3>
          <p><em>The initiation.</em> Not a grief container &mdash; an initiatory process for remembering who we actually are. Also the accountability layer for the whole organism.</p>
        </div>
        <div className="card">
          <h3>Transition Centers</h3>
          <p><em>The physical space.</em> Abandoned churches, castles, colleges. The room you walk into when the floor falls out.</p>
        </div>
        <div className="card">
          <h3>Magic Shows</h3>
          <p><em>The activation.</em> The fastest way we&apos;ve found to rediscover your human magic. Days, not months.</p>
        </div>
        <div className="card">
          <h3>The J.O.B. Board</h3>
          <p><em>The marketplace.</em> Sovereign humans get paid for what AI can&apos;t do. 20% platform fee.</p>
        </div>
        <div className="card">
          <h3>Business 3.0</h3>
          <p><em>The new way of building.</em> Regenerative companies for the people the transition makes. Living systems, not machines.</p>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(212,184,76,0.12), rgba(212,102,176,0.08))', borderColor: 'var(--gold)' }}>
          <h3 style={{ color: 'var(--gold)' }}>★ New Human Resources</h3>
          <p><em>The primary revenue engine. Live now.</em> Companies pay us to put their laid-off people through the passage. The wedge that funds the organism.</p>
        </div>
      </div>
    </div>
  ),

  // 10 — TROJAN HORSE (spine reveal + why each piece earns its place)
  () => (
    <div className="slide">
      <h3>The pattern</h3>
      <h1>Every door is a Trojan Horse.</h1>
      <p style={{ fontSize: '1rem', color: 'var(--gold)', fontStyle: 'italic', margin: '0.5rem 0', textAlign: 'center', maxWidth: '100%' }}>
        &ldquo;Man only plays when he is in the fullest sense of the word a human being, and he is only fully a human being when he plays.&rdquo; <span style={{ color: 'var(--muted)', fontStyle: 'normal' }}>&mdash; Friedrich Schiller</span>
      </p>
      <p style={{ marginBottom: '0.4rem' }}>The passage from old self to new self has stages, and no one&apos;s built infrastructure for any of them. Each experiment exists because a stage requires it &mdash; and each one is legible to the buyer on the outside, transformative on the inside.</p>
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
            <td>A 12&ndash;18 month passage their employer accidentally paid for. Holds the acute crisis.</td>
          </tr>
          <tr>
            <td><strong>The Church</strong></td>
            <td>A spiritual community</td>
            <td>The initiation that helps people remember who they are. Holds the long arc.</td>
          </tr>
          <tr>
            <td><strong>Magic Shows</strong></td>
            <td>A retreat / immersive experience</td>
            <td>The nervous-system activation that rediscovers your human magic in days.</td>
          </tr>
          <tr>
            <td><strong>Transition Centers</strong></td>
            <td>Cohort real estate</td>
            <td>The room you walk into when the floor falls out. Co-regulation as infrastructure.</td>
          </tr>
          <tr>
            <td><strong>The J.O.B. Board</strong></td>
            <td>A gig marketplace</td>
            <td>Income for the newly sovereign &mdash; and a redefinition of valuable work in the AI age.</td>
          </tr>
          <tr>
            <td><strong>Business 3.0</strong></td>
            <td>A leadership program</td>
            <td>A new way of building regenerative companies. Somewhere to take what you remembered.</td>
          </tr>
          <tr>
            <td><strong>The RCO</strong></td>
            <td>A holding company</td>
            <td>A living organism investors fund as a single check. Aliveness as the KPI.</td>
          </tr>
        </tbody>
      </table>
      <p style={{ marginTop: '0.6rem', textAlign: 'center', maxWidth: '100%', fontSize: '0.95rem' }}><strong>Outplacement vendors can&apos;t copy us &mdash; they don&apos;t know what game we&apos;re playing.</strong></p>
    </div>
  ),

  // 11 — FLYWHEEL / METABOLISM
  () => (
    <div className="slide">
      <h3>The metabolism</h3>
      <h1>How the organism actually runs.</h1>
      <p>Most companies optimize for revenue and hope aliveness follows. We optimize for aliveness and revenue follows. Here&apos;s the loop, in order:</p>
      <div className="two-col" style={{ marginTop: '0.75rem' }}>
        <div className="card">
          <h3>1 &middot; Money in</h3>
          <p><strong>Enterprises pay New Human Resources</strong> to hold their laid-off people through the passage. This is the wedge. Every dollar fuels the rest of the organism.</p>
        </div>
        <div className="card">
          <h3>2 &middot; Humans through</h3>
          <p>Each cohort moves through the experiments &mdash; Church, Magic Shows, Transition Centers &mdash; and emerges as a different version of themselves.</p>
        </div>
        <div className="card">
          <h3>3 &middot; Humans out, new revenue in</h3>
          <p>They start companies on the Board (20% fee), train as certified Magic Show hosts, build B3.0 companies, come back as Guides. Each path is a new revenue line.</p>
        </div>
        <div className="card">
          <h3>4 &middot; Aliveness sets the budget</h3>
          <p>Resources flow to whichever experiments compound fastest. What stops serving the question gets composted on purpose &mdash; no sunk-cost zombies.</p>
        </div>
      </div>
      <p style={{ marginTop: '0.85rem', textAlign: 'center', maxWidth: '100%' }}><strong>One check funds an organism whose north star is the one thing AI can&apos;t fake: aliveness.</strong></p>
    </div>
  ),

  // 12 — HOW IT FEELS
  () => (
    <div className="slide">
      <h3>How it feels</h3>
      <h1>We stole from what scales. Then we got weird on purpose.</h1>
      <p style={{ fontSize: '1.05rem', color: 'var(--gold)', fontStyle: 'italic', margin: '0.75rem 0', textAlign: 'center', maxWidth: '100%' }}>
        &ldquo;The opposite of play is not work. It&apos;s depression.&rdquo; <span style={{ color: 'var(--muted)', fontStyle: 'normal' }}>&mdash; Stuart Brown</span>
      </p>
      <p>The resume trap doesn&apos;t work anymore. So we built a better option &mdash; not from scratch, but from the parts of culture that already proved they could scale. Then we bent each one weird on purpose.</p>
      <div className="three-col" style={{ marginTop: '0.75rem' }}>
        <div className="card">
          <h3>Stole from AA</h3>
          <p>The container model that scales spiritual work. People stop performing and tell the truth out loud. Held until something real surfaces.</p>
        </div>
        <div className="card">
          <h3>Stole from Indeed</h3>
          <p>The distribution model that scales work. People come because the old job ended. They leave with work LinkedIn doesn&apos;t have a category for yet.</p>
        </div>
        <div className="card">
          <h3>Stole from Meow Wolf</h3>
          <p>The experience model that scales weird. Every experiment is immersive, playful, alive on purpose. The professional self can&apos;t be coaxed out &mdash; it has to be surprised.</p>
        </div>
      </div>
      <p style={{ marginTop: '0.85rem', textAlign: 'center', maxWidth: '100%' }}><strong>Trickster economics. A better option than the resume trap. Play is the medicine.</strong></p>
    </div>
  ),

  // 13 — NHR UNIT ECONOMICS (the wedge, by the numbers)
  () => (
    <div className="slide">
      <h3>The wedge, by the numbers</h3>
      <h1>New Human Resources is the engine. Here&apos;s how it pays.</h1>
      <p>Companies already have a budget for layoffs &mdash; severance, outplacement, EAP. We&apos;re the line item that actually does something with it. The 6-month container is what they buy. The 12&ndash;18 month passage is what they get.</p>
      <table className="deck-table" style={{ marginTop: '0.75rem' }}>
        <tbody>
          <tr>
            <td><strong>Price per seat</strong></td>
            <td>$2,500 standard &middot; $3,500 premium &middot; custom at enterprise scale</td>
          </tr>
          <tr>
            <td><strong>Buyer</strong></td>
            <td>CHRO / Chief People Officer, CFO sign-off (HR or severance line)</td>
          </tr>
          <tr>
            <td><strong>Sales cycle</strong></td>
            <td>60&ndash;120 days enterprise; faster through warm network (Pam &rarr; CHRO direct)</td>
          </tr>
          <tr>
            <td><strong>First-deal ACV target</strong></td>
            <td>$250K (100 seats &times; $2,500)</td>
          </tr>
          <tr>
            <td><strong>Enterprise ceiling</strong></td>
            <td>$75M single deal (Oracle-scale, 30K seats &times; $2,500)</td>
          </tr>
          <tr>
            <td><strong>Gross margin</strong></td>
            <td>~65% at launch, expanding as platform &amp; cohort delivery scale</td>
          </tr>
          <tr>
            <td><strong>Blended CAC</strong></td>
            <td>~$75K per enterprise deal (warm intro &rarr; outbound &rarr; inbound mix)</td>
          </tr>
          <tr>
            <td><strong>Payback</strong></td>
            <td>Under 6 months on the first contract</td>
          </tr>
        </tbody>
      </table>
      <p style={{ marginTop: '0.85rem', textAlign: 'center', maxWidth: '100%', fontSize: '0.95rem', color: 'var(--muted)' }}>Model assumptions, not commitments. Validated against severance benchmarks and EOS network pricing.</p>
    </div>
  ),

  // 14 — REVENUE CHART (interactive)
  RevenueChartSlide,

  // 14 — TAM
  () => (
    <div className="slide">
      <h3>TAM</h3>
      <h1>Six broken industries. One fix.</h1>
      <div className="three-col" style={{ marginTop: '1.5rem' }}>
        <div className="stat">
          <div className="stat-number">$739B</div>
          <div className="stat-label">HR &amp; recruiting</div>
        </div>
        <div className="stat">
          <div className="stat-number">$461B</div>
          <div className="stat-label">Mental health &amp; therapy</div>
        </div>
        <div className="stat">
          <div className="stat-number">$222B</div>
          <div className="stat-label">Wellness &amp; retreats</div>
        </div>
        <div className="stat">
          <div className="stat-number">$42B</div>
          <div className="stat-label">HR technology</div>
        </div>
        <div className="stat">
          <div className="stat-number">$5.3B</div>
          <div className="stat-label">Coaching</div>
        </div>
        <div className="stat">
          <div className="stat-number">$2.5B</div>
          <div className="stat-label">Outplacement</div>
        </div>
      </div>
      <p style={{ marginTop: '2rem', textAlign: 'center', maxWidth: '100%' }}>Every one of these is a fragment of the same problem. Nobody built the passage. <strong>The seventh industry is the human economy itself. We&apos;re inventing it.</strong></p>
    </div>
  ),

  // 15 — TRACTION
  () => (
    <div className="slide">
      <h3>Traction</h3>
      <h1>We&apos;re not starting from zero. We&apos;re starting from live.</h1>
      <div className="two-col" style={{ marginTop: '1rem' }}>
        <div className="card">
          <h3>Live product</h3>
          <ul>
            <li><strong>itsthejob.com</strong> &mdash; the front door</li>
            <li><strong>new-human-resources.vercel.app</strong> &mdash; B2B wedge, taking inbound</li>
            <li><strong>Magic Show platform</strong> &mdash; shows produced in Nashville, Minneapolis, Big Sky</li>
            <li><strong>The Church</strong> &mdash; live app, Sunday Night Live running</li>
            <li><strong>J.O.B. Board</strong> &mdash; marketplace MVP, 20% fee in place</li>
            <li><strong>Business 3.0</strong> &mdash; framework built, pricing set</li>
          </ul>
        </div>
        <div className="card">
          <h3>Network &amp; brand</h3>
          <ul>
            <li><strong>Reach:</strong> 800+ EOS implementers, 200+ Jumpsuit contractors</li>
            <li><strong>Brand north stars:</strong> Meow Wolf, Blah Airlines, Dramcorp</li>
            <li><strong>Pipeline:</strong> Wefunder community round prepped, lead conversations open</li>
            <li><strong>NHR inbound:</strong> applications flowing</li>
          </ul>
        </div>
      </div>
    </div>
  ),

  // 18 — FOUNDERS
  () => (
    <div className="slide">
      <h3>Why us</h3>
      <h1>Big idea + big implementation = over $100B shipped.</h1>
      <div className="two-col">
        <div className="card">
          <h3 style={{ color: 'var(--text)', textTransform: 'none', letterSpacing: '-0.01em', fontSize: '1.3rem' }}>Nicole Ayres</h3>
          <div className="founder-role">The Architect</div>
          <ul>
            <li>Founder, Jumpsuit — bootstrapped to $4M/yr, <strong>zero employees</strong>. The company runs itself.</li>
            <li>Co-founded Jauntboards, an AI-powered Future of Work platform &rarr; acquired (2025)</li>
            <li>Co-visionary for Business 3.0 and the RCO</li>
            <li>200+ contractor network — running a B3.0 company for 7 years before it had a name</li>
          </ul>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--text)', textTransform: 'none', letterSpacing: '-0.01em', fontSize: '1.3rem' }}>Pam Kosanke</h3>
          <div className="founder-role">The Scaler</div>
          <ul>
            <li>Former CRO, EOS Worldwide — $145M revenue, 800+ implementers</li>
            <li>Unified 700+ independent brands into a global franchise</li>
            <li>Raised $6M Series A (Mark Cuban, General Mills, CircleUp)</li>
            <li>Invented the McDonald&apos;s breakfast dollar menu. 6x world champion, Team USA.</li>
          </ul>
        </div>
      </div>
    </div>
  ),

  // 19 — THE ASK
  () => (
    <div className="slide">
      <h3>The ask</h3>
      <h1><span className="gold">$3&ndash;5M</span> seed. One check into the organism.</h1>
      <p style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>SAFE into the <strong>HoldCo</strong> &mdash; the for-profit parent of the RCO. You&apos;re not betting on a product line. You&apos;re betting on a living system that follows aliveness and composts what doesn&apos;t work. Lead checks from our network + Wefunder community round.</p>
      <div className="three-col" style={{ marginTop: '0.5rem' }}>
        <div className="card">
          <h3>Where the $4M goes</h3>
          <ul style={{ fontSize: '0.92rem' }}>
            <li><strong>40% &middot; $1.6M</strong> &mdash; Team of 7 + delivery staff</li>
            <li><strong>20% &middot; $800K</strong> &mdash; First 3 Transition Centers</li>
            <li><strong>15% &middot; $600K</strong> &mdash; Platform &amp; tech (NHR ops, Board, Church)</li>
            <li><strong>15% &middot; $600K</strong> &mdash; GTM (enterprise sales, brand)</li>
            <li><strong>10% &middot; $400K</strong> &mdash; RCO formation + operating buffer</li>
          </ul>
        </div>
        <div className="card">
          <h3>What 24 months builds</h3>
          <ul style={{ fontSize: '0.92rem' }}>
            <li>Close first <strong>10 New Human Resources enterprise deals</strong></li>
            <li>Open the first <strong>3 Transition Centers</strong></li>
            <li>Put <strong>3,000 humans</strong> through the 6-month program</li>
            <li><strong>Form the RCO</strong> &mdash; nonprofit + HoldCo + first SPVs</li>
            <li>Certify first <strong>25 Guides &amp; B3.0 implementers</strong></li>
            <li>Unify the platform &mdash; one front door, many experiments</li>
          </ul>
        </div>
        <div className="card">
          <h3>Team of 7</h3>
          <ul style={{ fontSize: '0.92rem' }}>
            <li><strong>Chief People Officer</strong></li>
            <li><strong>Head of NHR Enterprise</strong></li>
            <li><strong>Head of Program Delivery</strong></li>
            <li><strong>Head of Transition Centers</strong></li>
            <li><strong>Head of Tech</strong></li>
            <li><strong>B3.0 Program Lead</strong></li>
            <li><strong>Creative Director</strong></li>
          </ul>
        </div>
      </div>
      <p style={{ marginTop: '0.85rem', fontSize: '0.95rem', color: 'var(--muted)', textAlign: 'center', maxWidth: '100%' }}>
        <strong style={{ color: 'var(--gold)' }}>The honest risk:</strong> the RCO framing is unusual and the category doesn&apos;t exist yet. Our mitigation: every conversation leads with the wedge that already makes financial sense (NHR), and the organism reveals itself from there.
      </p>
    </div>
  ),

  // 20 — CLOSE (handled separately)
  null,
];

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
