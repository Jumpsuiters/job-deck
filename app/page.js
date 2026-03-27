'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const slides = [
  // 0 — COVER
  () => (
    <div className="slide cover">
      <h1>JOB</h1>
      <p className="subtitle">The New Human Resources</p>
      <p className="tagline">Work trained humans to be workers. We&apos;re building the company that trains them to be human.</p>
    </div>
  ),

  // 1 — THE WORLD CHANGED
  () => (
    <div className="slide">
      <h3>The shift</h3>
      <h1>Three things happened at once.</h1>
      <ul>
        <li><strong>AI is replacing human labor at scale.</strong> 300M jobs affected globally (Goldman Sachs). Among young workers in AI-exposed roles, employment is already down 16%.</li>
        <li><strong>Work broke humans.</strong> We were trained to be workers, never fully human. Healthcare chained to compliance. Identity fused to job title. Burnout, fragmentation, loss of meaning.</li>
        <li><strong>A generation did the inner work anyway.</strong> Millions invested in therapy, coaching, somatic work, plant medicine, meditation. They developed capacities the market never valued. Until now.</li>
      </ul>
    </div>
  ),

  // 2 — THE PROBLEM
  () => (
    <div className="slide">
      <h3>The problem</h3>
      <h1>Human Resources was never about resourcing humans.</h1>
      <p>Old HR manages humans <em>as</em> resources &mdash; to be optimized, utilized, and replaced.</p>
      <p>It connected our healthcare to our compliance. Our worth to our output. Our identity to our role.</p>
      <p>Now AI is doing the replacing. And the $739B HR industry has no answer for what comes next.</p>
      <p>Everyone is trying to fix the old system. But you never change things by fighting the existing reality.</p>
    </div>
  ),

  // 3 — THE FULLER QUOTE
  () => (
    <div className="slide close-slide">
      <p className="big-quote">&ldquo;You never change things by fighting the existing reality. To change something, build a new model that makes the existing model obsolete.&rdquo;</p>
      <p className="attribution">&mdash; Buckminster Fuller</p>
    </div>
  ),

  // 4 — THE QUESTION
  () => (
    <div className="slide close-slide">
      <h3>The question</h3>
      <h1>What becomes possible when being human <em>is</em> the job?</h1>
      <p>Not a question to answer. A question to build around.</p>
      <p>Every company, every experiment, every human in this organism is exploring this question together.</p>
    </div>
  ),

  // 5 — THE INSIGHT
  () => (
    <div className="slide">
      <h3>The insight</h3>
      <h1>To build something different, we must first <em>become</em> something different.</h1>
      <p>Otherwise, we&apos;ll recreate the same system in a different skin.</p>
      <p>The skills that remain after AI are the ones we were never trained for: emotional intelligence, nervous system regulation, creative intuition, power literacy, repair, truth-telling.</p>
      <p>These aren&apos;t soft skills. They&apos;re the <strong>only skills left.</strong></p>
      <p>And millions of people have been quietly training in them for years &mdash; waiting for the market to catch up.</p>
    </div>
  ),

  // 6 — THE SOLUTION
  () => (
    <div className="slide">
      <h3>The solution</h3>
      <h1>JOB &mdash; The Joy of Being</h1>
      <p style={{ fontSize: '1.35rem', color: 'var(--text)', fontWeight: 600, marginBottom: '1.5rem' }}>JOB is the new Human Resources. Not a department &mdash; a living organism.</p>
      <p>JOB wakes humans up to who they actually are, trains them in the capacities AI can&apos;t replicate, and launches them into the new human economy.</p>
      <p>Some will start companies. Some will transform organizations. Some &mdash; the therapists, the healers, the bodyworkers, the artists &mdash; will finally get paid for gifts the old economy never valued.</p>
      <p>We&apos;re not building a pipeline back into the old system. <strong>We&apos;re building the new economy itself.</strong></p>
    </div>
  ),

  // 7 — THE ORGANISM
  () => (
    <div className="slide">
      <h3>The organism</h3>
      <h2>JOB is structured as a Regenerative Community Organism (RCO)</h2>
      <p>A mycelial network of sovereign companies and a nonprofit, all committed to exploring the same question.</p>
      <div className="two-col" style={{ marginTop: '1rem' }}>
        <div className="card">
          <h3>Nonprofit 508(c)(1)(a)</h3>
          <p>The commons. Holds the purpose. Can never be corrupted.</p>
          <ul>
            <li>Doctrine &amp; sacrament</li>
            <li>Public benefit &amp; mutual aid</li>
            <li>Grants &amp; microgrants</li>
            <li>Owns the IP (licensed to HoldCo)</li>
            <li>Holds land</li>
            <li>Research &amp; publication</li>
          </ul>
        </div>
        <div className="card">
          <h3>For-Profit HoldCo</h3>
          <p>The engine. Incubates subsidiaries. Distributes profits to investors.</p>
          <ul>
            <li>Business 3.0 (consulting &amp; IP)</li>
            <li>SpiritTech</li>
            <li>MagicShowLand (immersive real estate)</li>
            <li>Magic Shows</li>
            <li>JOB Board (talent)</li>
            <li>Future experiments, as they emerge</li>
          </ul>
        </div>
      </div>
    </div>
  ),

  // 8 — THE NETWORK
  () => (
    <div className="slide">
      <h3>The mycelial network</h3>
      <div className="network-layout">
        <div className="network-text">
          <h1>Any company can join the organism.</h1>
          <p>They keep their sovereignty &mdash; their brand, their clients, their agency. But they plug into a living network and get access to everything JOB builds.</p>
          <p><strong>The organism grows like mycelium &mdash; decentralized, interconnected, and impossible to kill.</strong></p>
          <div className="network-mobile">
            <div className="network-mobile-hub">JOB</div>
            <div className="network-mobile-resources">
              <span>Training</span><span>Talent</span><span>IP</span>
            </div>
            <div className="network-mobile-nodes">
              <div>Jumpsuit</div>
              <div>Your Co</div>
              <div>Studio X</div>
              <div>Agency Y</div>
              <div>Lab Z</div>
            </div>
          </div>
        </div>
        <div className="network-diagram">
          <div className="network-core">
            <div className="network-hub">JOB</div>
            <div className="network-ring">
              <div className="network-resource nr-1">Training</div>
              <div className="network-resource nr-2">Talent</div>
              <div className="network-resource nr-3">IP</div>
            </div>
          </div>
          <div className="network-nodes">
            <div className="network-node nn-1">Jumpsuit</div>
            <div className="network-node nn-2">Your Co</div>
            <div className="network-node nn-3">Studio X</div>
            <div className="network-node nn-4">Agency Y</div>
            <div className="network-node nn-5">Lab Z</div>
          </div>
          <svg className="network-lines" viewBox="0 0 440 380" xmlns="http://www.w3.org/2000/svg">
            {/* Resource ring connections */}
            <circle cx="220" cy="175" r="70" fill="none" stroke="var(--gold-dim)" strokeWidth="1" strokeDasharray="4 3" />
            {/* Lines from nodes to center */}
            <line x1="220" y1="175" x2="80" y2="30" stroke="var(--border)" strokeWidth="1" strokeDasharray="6 4" />
            <line x1="220" y1="175" x2="380" y2="30" stroke="var(--border)" strokeWidth="1" strokeDasharray="6 4" />
            <line x1="220" y1="175" x2="420" y2="200" stroke="var(--border)" strokeWidth="1" strokeDasharray="6 4" />
            <line x1="220" y1="175" x2="350" y2="350" stroke="var(--border)" strokeWidth="1" strokeDasharray="6 4" />
            <line x1="220" y1="175" x2="90" y2="350" stroke="var(--border)" strokeWidth="1" strokeDasharray="6 4" />
          </svg>
        </div>
      </div>
    </div>
  ),

  // 9 — MANY DOORS
  () => (
    <div className="slide">
      <h3>Many doors, one house</h3>
      <h2>JOB creates experiments. Lots of ways in to the same thing.</h2>
      <p>Every subsidiary, every experiment is a door back to JOB &mdash; waking people up, supporting their becoming, co-creating the new model.</p>
      <div className="three-col" style={{ marginTop: '1rem' }}>
        <div className="card">
          <h3>Business 3.0</h3>
          <p>The professional door. Consulting, cohorts, franchise &mdash; for founders and orgs ready to operate differently.</p>
        </div>
        <div className="card">
          <h3>Magic Shows</h3>
          <p>The experiential door. Playful, creative containers that trick you into remembering who you are.</p>
        </div>
        <div className="card">
          <h3>JOB Board</h3>
          <p>The marketplace door. Matching sovereign humans to work that wants them.</p>
        </div>
        <div className="card">
          <h3>MagicShowLand</h3>
          <p>The physical door. Immersive centers and real estate for IRL transformation.</p>
        </div>
        <div className="card">
          <h3>SpiritTech</h3>
          <p>The technology door. Tools designed to support human consciousness, not just productivity.</p>
        </div>
        <div className="card">
          <h3>What&apos;s next?</h3>
          <p>We create, compost, and create again. All in service of the question.</p>
        </div>
      </div>
    </div>
  ),

  // 10 — THE MARKET
  () => (
    <div className="slide">
      <h3>The market</h3>
      <h1>Four audiences. One organism.</h1>
      <div className="two-col">
        <div className="card">
          <h3>The Displaced</h3>
          <p>300M jobs affected by AI. 92M displaced by 2030. They don&apos;t need a new resume. They need a new identity &mdash; and a new economy to step into.</p>
        </div>
        <div className="card">
          <h3>The Companies</h3>
          <p>$739B spent on HR. $42B on HR tech. They need humans who can do what AI can&apos;t &mdash; and they have no idea where to find them.</p>
        </div>
        <div className="card">
          <h3>The Builders</h3>
          <p>The next wave of implementers, consultants, and systems designers. They&apos;ll deploy B3.0 through decentralized technology, blueprints, and new business models &mdash; building the infrastructure of the new economy.</p>
        </div>
        <div className="card">
          <h3>The Already-There</h3>
          <p>Gen Z already proved you can get paid for being who the fuck you are. 232K coaches. 530K therapists. 321K bodyworkers. They&apos;ve been training for a job that didn&apos;t exist yet. Now it does.</p>
        </div>
      </div>
    </div>
  ),

  // 11 — TAM
  () => (
    <div className="slide">
      <h3>Total addressable market</h3>
      <h2>JOB sits at the intersection</h2>
      <div className="three-col" style={{ marginTop: '1.5rem' }}>
        <div className="stat">
          <div className="stat-number">$739B</div>
          <div className="stat-label">Global HR &amp; recruiting</div>
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
      <p style={{ marginTop: '2rem', textAlign: 'center', maxWidth: '100%' }}>Every one of these industries is solving a fragment of the same problem. <strong>JOB is the whole organism.</strong></p>
    </div>
  ),

  // 12 — THE COMP (EOS)
  () => (
    <div className="slide">
      <h3>The comp</h3>
      <h2>EOS proved this model works. We&apos;re building what comes after it.</h2>
      <table className="deck-table">
        <thead>
          <tr>
            <th></th>
            <th>EOS</th>
            <th>JOB</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>What</td>
            <td>Operating system for businesses</td>
            <td>Initiatory journey for humans &amp; incubator for the new economy</td>
          </tr>
          <tr>
            <td>Method</td>
            <td>Traction (cognitive, process)</td>
            <td>Embodiment (somatic, relational, whole-intelligence)</td>
          </tr>
          <tr>
            <td>Revenue</td>
            <td>$145M</td>
            <td>Starting</td>
          </tr>
          <tr>
            <td>Network</td>
            <td>800+ implementers, 37 countries</td>
            <td>Starting</td>
          </tr>
          <tr>
            <td>Output</td>
            <td>Better-run companies</td>
            <td>Sovereign humans &amp; the companies they create</td>
          </tr>
        </tbody>
      </table>
      <p style={{ marginTop: '1.5rem' }}><strong>The person who scaled EOS to $145M is now building what comes after it.</strong></p>
      <p>EOS optimized the machine. JOB transforms the humans &mdash; and the humans build what&apos;s next.</p>
    </div>
  ),

  // 13 — REVENUE MODEL
  () => (
    <div className="slide">
      <h3>The model</h3>
      <h2>Multiple revenue streams. One organism.</h2>
      <div className="two-col" style={{ marginTop: '0.75rem' }}>
        <div className="card">
          <h3>B3.0 Consulting &amp; Cohorts</h3>
          <ul>
            <li><strong>Org engagements:</strong> $25&ndash;150K per company</li>
            <li><strong>Initiatory journey cohorts:</strong> $2&ndash;5K per person</li>
            <li><strong>Implementer certification:</strong> annual licensing fee</li>
            <li><strong>At 25 implementers:</strong> recurring franchise revenue</li>
          </ul>
        </div>
        <div className="card">
          <h3>JOB Board</h3>
          <ul>
            <li><strong>20% platform fee</strong> on every transaction</li>
            <li>Sovereign humans getting paid for what AI can&apos;t do</li>
            <li>Supply-led &mdash; humans post what they offer, buyers find them</li>
            <li>Network effects compound as the organism grows</li>
          </ul>
        </div>
        <div className="card">
          <h3>Magic Shows &amp; Events</h3>
          <ul>
            <li><strong>Ticket sales + sponsorships</strong></li>
            <li>Recurring &amp; touring model</li>
            <li>Corporate bookings for team transformation</li>
            <li>Every show is a door back into the organism</li>
          </ul>
        </div>
        <div className="card">
          <h3>Membership &amp; Community</h3>
          <ul>
            <li><strong>JOB membership:</strong> $99&ndash;200/month</li>
            <li>Access to training, talent network, IP, community</li>
            <li>Sliding scale tithes for church functions</li>
            <li>Mycelial network fees for partner companies</li>
          </ul>
        </div>
      </div>
      <p style={{ marginTop: '1rem', textAlign: 'center', maxWidth: '100%' }}><strong>Every SPV feeds the others.</strong> A Magic Show attendee joins the church. A church member posts on the Board. A Board seller enters B3.0. A B3.0 grad certifies as an implementer. <strong>The flywheel is the business model.</strong></p>
    </div>
  ),

  // 14 — GO TO MARKET
  () => (
    <div className="slide">
      <h3>Go to market</h3>
      <h2>Three channels. Exponential compounding.</h2>
      <div className="three-col" style={{ marginTop: '1rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>1</h3>
          <h3>Offboarding benefit</h3>
          <p>Companies laying off thousands offer JOB as a transition benefit &mdash; not a resume workshop, a <strong>human transformation</strong>.</p>
          <p style={{ marginTop: '0.75rem' }}>One company laying off 15K people. 20% opt in. <strong>That&apos;s 3,000 humans</strong> through JOB in a single deal.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>Current outplacement = $2.5B market. We replace it with something people actually want.</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>2</h3>
          <h3>Job seekers</h3>
          <p>Target people actively searching for jobs. <strong>Lowest CPA on the internet</strong> &mdash; they&apos;re already raising their hand.</p>
          <p style={{ marginTop: '0.75rem' }}>But instead of another job board, we offer them something radical: <strong>become the person who doesn&apos;t need to search.</strong></p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>300M AI-affected jobs = an ocean of intent. We fish where the fish are.</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>3</h3>
          <h3>The network itself</h3>
          <p>Every human who goes through JOB becomes a node. They start companies, join the Board, bring their teams through B3.0, host Magic Shows.</p>
          <p style={{ marginTop: '0.75rem' }}><strong>The organism is the growth engine.</strong> No ad spend required once it&apos;s alive.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>EOS grew to $145M primarily through word of mouth. Same playbook, bigger mission.</p>
        </div>
      </div>
    </div>
  ),

  // 15 — TRACTION
  () => (
    <div className="slide">
      <h3>What exists today</h3>
      <h2>We&apos;re not starting from zero.</h2>
      <div className="two-col" style={{ marginTop: '1rem' }}>
        <div>
          <ul>
            <li><strong>Magic Shows</strong> &mdash; already produced. The format works. People transform in the room.</li>
            <li><strong>JOB Church</strong> &mdash; live app, doctrine written, community forming</li>
            <li><strong>JOB Board</strong> &mdash; live app, marketplace for human services</li>
            <li><strong>Business 3.0</strong> &mdash; framework built, IP developed, ready to deploy</li>
          </ul>
        </div>
        <div>
          <ul>
            <li><strong>Jumpsuit</strong> &mdash; 7 years, $4M/yr, zero employees. Living proof the B3.0 model works before it had a name.</li>
            <li><strong>Pam left EOS for this.</strong> The person who scaled a $145M franchise walked away to build what comes next.</li>
            <li><strong>Network ready to invest</strong> &mdash; aligned capital waiting for the entity to form</li>
            <li><strong>This deck is a live app.</strong> We build fast.</li>
          </ul>
        </div>
      </div>
    </div>
  ),

  // 16 — FOUNDERS
  () => (
    <div className="slide">
      <h3>Why us</h3>
      <div className="two-col">
        <div className="card">
          <h3 style={{ color: 'var(--text)', textTransform: 'none', letterSpacing: '-0.01em', fontSize: '1.3rem' }}>Nicole Ayres</h3>
          <div className="founder-role">The Architect</div>
          <ul>
            <li>Founder, Jumpsuit &mdash; bootstrapped to $4M/yr, <strong>zero employees</strong>. The company runs itself.</li>
            <li>Co-founded Jauntboards, an AI-powered Future of Work platform &rarr; acquired (2025)</li>
            <li>Co-visionary for Business 3.0 and the RCO</li>
            <li>200+ contractor network &mdash; has been running a B3.0 company for 7 years before it had a name</li>
          </ul>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--text)', textTransform: 'none', letterSpacing: '-0.01em', fontSize: '1.3rem' }}>Pam Kosanke</h3>
          <div className="founder-role">The Scaler</div>
          <ul>
            <li>Former CRO, EOS Worldwide &mdash; $145M revenue, 800+ implementers</li>
            <li>Unified 700+ independent brands into a global franchise</li>
            <li>Raised $6M Series A (Mark Cuban, General Mills, CircleUp)</li>
            <li>Invented the McDonald&apos;s breakfast dollar menu. 6x world champion, Team USA.</li>
          </ul>
        </div>
      </div>
      <p style={{ marginTop: '1.5rem', textAlign: 'center', maxWidth: '100%' }}>
        <strong>Nicole&apos;s big ideas + Pam&apos;s big implementation = over $100B in combined revenue impact.</strong>
      </p>
    </div>
  ),

  // 14 — THE ASK
  () => (
    <div className="slide">
      <h3>The ask</h3>
      <h1><span className="gold">$3&ndash;5M</span> Seed Round</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>SAFE into the HoldCo. Lead checks from our network + Wefunder community round.<br /><strong>Own what you co-create.</strong></p>
      <div className="two-col">
        <div className="card">
          <h3>What the money builds (24 months)</h3>
          <ul>
            <li><strong>Form the RCO</strong> &mdash; nonprofit + HoldCo + first SPVs</li>
            <li><strong>Launch B3.0 at scale</strong> &mdash; paid cohorts + org consulting</li>
            <li><strong>Certify first 25 implementers</strong> &mdash; prove the franchise flywheel</li>
            <li><strong>Unify the platform</strong> &mdash; Church + Board + member portal</li>
            <li><strong>Scale Magic Shows</strong> &mdash; recurring, touring model</li>
            <li><strong>1,000 humans</strong> through the JOB journey</li>
          </ul>
        </div>
        <div className="card">
          <h3>Team of 7</h3>
          <ul>
            <li><strong>Chief People Officer</strong> &mdash; the role HR never actually filled</li>
            <li><strong>Head of Product</strong> &mdash; whipping out experiments nonstop</li>
            <li><strong>Decentralized Community Builder</strong> &mdash; grows the mycelial network</li>
            <li><strong>Head of Tech</strong> &mdash; platform + SpiritTech</li>
            <li><strong>Head of Ops &amp; Finance</strong> &mdash; forms the entities, runs the money</li>
            <li><strong>B3.0 Program Lead</strong> &mdash; runs cohorts, trains implementers</li>
            <li><strong>Creative Director</strong> &mdash; Magic Shows, brand, experiential</li>
          </ul>
        </div>
      </div>
      <p style={{ marginTop: '1rem' }}><strong>What exists today:</strong> The vision. The IP. The frameworks. Two founders who&apos;ve touched $100B+ in revenue impact. Live apps. Magic Shows already produced. And a network of people ready to write checks.</p>
    </div>
  ),

  // 15 — CLOSE (onJoin passed as prop)
  null,
];

function CloseSlide({ onJoin }) {
  return (
    <div className="slide close-slide">
      <h1>The job was never the job.</h1>
      <p>For thousands of years, we trained humans to be workers but never fully human.</p>
      <p>Now AI is taking the old jobs. Good. Let it.</p>
      <p>Because there&apos;s only one job left. And it&apos;s the only one that ever mattered.</p>
      <p style={{ color: 'var(--text)', fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>Being human is the job now.</p>
      <p style={{ marginTop: '1rem' }}><strong className="gold">Welcome to the new Human Resources.</strong></p>
      <div className="cta-row">
        <button className="waitlist-trigger" onClick={onJoin}>Join the Investor Waitlist</button>
        <a href="#donate" className="waitlist-trigger donate-btn" onClick={e => { e.preventDefault(); alert('Donation account coming soon — we\u0027ll notify you when it\u0027s live.'); }}>Invest Now with Church Donation (tax exempt)</a>
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
        <p>Be first to invest in the new Human Resources.</p>
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
