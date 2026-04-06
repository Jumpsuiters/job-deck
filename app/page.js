'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const slides = [
  // 0 — COVER
  () => (
    <div className="slide cover">
      <h1>J.O.B.</h1>
      <p className="subtitle">The Transition Company</p>
      <p className="tagline">The machines are taking the jobs. We&apos;re taking the humans.</p>
    </div>
  ),

  // 1 — THE MOMENT
  () => (
    <div className="slide">
      <h3>2026</h3>
      <h1>Your job is a dead man walking.</h1>
      <p>Every week, another round. Another function. Another &ldquo;strategic realignment&rdquo; that means the same thing.</p>
      <p>The machines can do it now.</p>
      <p><strong>The economists call it a crisis. They&apos;re reading the wrong chart.</strong></p>
    </div>
  ),

  // 2 — THE REFRAME
  () => (
    <div className="slide">
      <h3>Plot twist</h3>
      <h1>They weren&apos;t laid off. They were let out.</h1>
      <p style={{ fontSize: '1.6rem', color: 'var(--gold)', fontWeight: 300, margin: '1.5rem 0' }}>This is the largest involuntary liberation in economic history.</p>
      <p>Tens of millions of people. Stripped of the performance. Forced to ask the question their paycheck was paying them not to.</p>
      <p><strong>What would you actually do if the old deal disappeared?</strong></p>
    </div>
  ),

  // 3 — THURMAN QUOTE
  () => (
    <div className="slide close-slide">
      <p className="big-quote">&ldquo;Don&apos;t ask what the world needs. Ask what makes you come alive, and go do it. Because what the world needs is people who have come alive.&rdquo;</p>
      <p className="attribution">&mdash; Howard Thurman</p>
    </div>
  ),

  // 4 — WHAT THE LAYOFF REVEALS
  () => (
    <div className="slide">
      <h3>The secret everyone was keeping</h3>
      <h1>You weren&apos;t working. You were hiding.</h1>
      <div className="three-col" style={{ marginTop: '1rem' }}>
        <div className="card">
          <h3>The deal</h3>
          <p>Trade your energy for a paycheck. Trade your time for a title. Trade your aliveness for a LinkedIn profile your parents finally understood.</p>
        </div>
        <div className="card">
          <h3>The cost</h3>
          <p>Everyone kept a list. The things they&apos;d do if they could afford to. Build. Cook. Teach. Heal. Parent. The list got longer every year.</p>
        </div>
        <div className="card">
          <h3>The reveal</h3>
          <p>Take the paycheck away and a different person walks out of the office. Same human. Completely different skill set. It was in there the whole time.</p>
        </div>
      </div>
    </div>
  ),

  // 5 — THE PASSAGE
  () => (
    <div className="slide">
      <h3>The part nobody tells you</h3>
      <h1>It&apos;s not a job search. It&apos;s a funeral.</h1>
      <p>You&apos;re not grieving the paycheck. You&apos;re grieving the <em>person you thought you were.</em> The one with the title. The one your parents bragged about. The one the culture told you was the point.</p>
      <p>A resume workshop can&apos;t fix this. A Udemy course can&apos;t fix this. A chatbot definitely can&apos;t fix this.</p>
      <p style={{ fontSize: '1.35rem', color: 'var(--gold)', fontWeight: 400, margin: '1.25rem 0' }}>The passage takes 12 to 18 months.</p>
      <p><strong>On the other side is a human AI can&apos;t fake — because AI can&apos;t grieve.</strong></p>
    </div>
  ),

  // 7 — THE PROBLEM
  () => (
    <div className="slide">
      <h3>Meanwhile, in HR</h3>
      <h1>They hand them a LinkedIn code and call it closure.</h1>
      <p>Old HR was never about resourcing humans. It manages humans <em>as</em> resources. Optimize, utilize, replace.</p>
      <p>Now it&apos;s replacing them at scale — and sending them back into the loop that just spit them out.</p>
      <p style={{ marginTop: '1rem' }}><strong>The $2.5B outplacement industry is a $4 billion lie:</strong> that a sharper resume will land people back where they were before.</p>
      <p>But where they were before is exactly what stopped working.</p>
    </div>
  ),

  // 8 — THE THESIS
  () => (
    <div className="slide">
      <h3>Enter us</h3>
      <h1>J.O.B. is the transition company.</h1>
      <p style={{ fontSize: '1.35rem', color: 'var(--text)', fontWeight: 600, marginBottom: '1.25rem' }}>Not a job board. Not retraining. Not outplacement with better branding.</p>
      <p>A living organism. It catches people when they fall out of the old system. It holds them through the passage. It launches them into the new economy.</p>
      <p><strong>We&apos;re not rebuilding the old system. We&apos;re the infrastructure for the one replacing it.</strong></p>
    </div>
  ),

  // 9 — THE ORGANISM
  () => (
    <div className="slide">
      <h3>How it works</h3>
      <h2>Six doors. One transition.</h2>
      <p>Every door is a way in. Every door feeds the others.</p>
      <div className="three-col" style={{ marginTop: '1rem' }}>
        <div className="card">
          <h3>The Church</h3>
          <p><em>The grief container.</em> Where the performance dies and the real person surfaces.</p>
        </div>
        <div className="card">
          <h3>Transition Centers</h3>
          <p><em>The physical space.</em> Abandoned churches. Castles. Colleges. The room you walk into when the floor falls out.</p>
        </div>
        <div className="card">
          <h3>Magic Shows</h3>
          <p><em>The reset.</em> Multi-day stateside. Multi-week Costa Rica. Breaks the fear loop in days, not months.</p>
        </div>
        <div className="card">
          <h3>The J.O.B. Board</h3>
          <p><em>The marketplace.</em> Where sovereign humans get paid for what AI can&apos;t do. 20% platform fee.</p>
        </div>
        <div className="card">
          <h3>Business 3.0</h3>
          <p><em>The OS.</em> For the companies the transitioned build next. Organisms, not machines.</p>
        </div>
        <div className="card">
          <h3>New Human Resources</h3>
          <p><em>The enterprise door.</em> Companies pay us to put their laid-off people through all of it. The revenue engine.</p>
        </div>
      </div>
    </div>
  ),

  // 10 — THE CHURCH
  () => (
    <div className="slide">
      <h3>Door one</h3>
      <h1>What if AA, Indeed, and Meow Wolf had a baby?</h1>
      <p>No deity. No dogma. One sacrament: <em>what makes you come alive?</em></p>
      <div className="three-col" style={{ marginTop: '1rem' }}>
        <div className="card">
          <h3>From AA</h3>
          <p>The container. Small groups. Body-based check-ins that bypass the performance. People admitting, out loud, that the thing they&apos;ve been isn&apos;t the thing they are.</p>
        </div>
        <div className="card">
          <h3>From Indeed</h3>
          <p>The function. People arrive because they lost the job. They leave ready to build something LinkedIn couldn&apos;t find a category for.</p>
        </div>
        <div className="card">
          <h3>From Meow Wolf</h3>
          <p>The weirdness. Church is an experience, not a service. The professional self won&apos;t come out for a webinar. It has to be surprised.</p>
        </div>
      </div>
      <p style={{ marginTop: '1rem', textAlign: 'center', maxWidth: '100%' }}><strong>Live now. Congregation forming.</strong></p>
    </div>
  ),

  // 11 — TRANSITION CENTERS
  () => (
    <div className="slide">
      <h3>Door two</h3>
      <h1>You can&apos;t become someone new on Zoom.</h1>
      <p>Transition Centers are the physical side of the passage. Abandoned churches. Castles. Colleges the old economy couldn&apos;t keep running.</p>
      <p>We rent them for pennies. We fill them with humans. We call it real estate arbitrage on the collapse of the old world.</p>
      <div className="two-col" style={{ marginTop: '1rem' }}>
        <div className="card">
          <h3>What happens inside</h3>
          <ul>
            <li>Small groups of 6&ndash;8, twice a week</li>
            <li>Body-based check-ins, not performance reviews</li>
            <li>Real skill-building, real emotional honesty</li>
            <li>Co-regulation &mdash; nervous systems in the same room</li>
            <li>AI-native toolkit layered on top</li>
          </ul>
        </div>
        <div className="card">
          <h3>Why it works</h3>
          <p><strong>Presence is the product.</strong></p>
          <p>People who grieve in community take real risk on the other side. People who white-knuckle through it alone, refreshing LinkedIn, mostly just spiral.</p>
          <p>AI can&apos;t replicate this. Not a capability gap &mdash; a category error.</p>
        </div>
      </div>
    </div>
  ),

  // 12 — THE FLYWHEEL
  () => (
    <div className="slide">
      <h3>The flywheel</h3>
      <h1>The people we save become the people we sell.</h1>
      <div className="two-col" style={{ marginTop: '0.75rem' }}>
        <div className="card">
          <h3>1 &middot; Catch</h3>
          <p>Companies pay us (NHR) to put their laid-off people through the passage. Church holds them. Magic Shows reset them. Centers ground them.</p>
        </div>
        <div className="card">
          <h3>2 &middot; Launch</h3>
          <p>Some start companies. Some sell on the J.O.B. Board (20% fee). Some build Business 3.0 organisms. Some come back as Guides.</p>
        </div>
        <div className="card">
          <h3>3 &middot; Multiply</h3>
          <p>Every alive human is a door back in. Their businesses grow. Their stories spread. EOS scaled to $145M on exactly this mechanic.</p>
        </div>
        <div className="card">
          <h3>4 &middot; Compound</h3>
          <p>The companies they build eventually face their own transitions. They already trust us. The passage never stops.</p>
        </div>
      </div>
      <p style={{ marginTop: '1rem', textAlign: 'center', maxWidth: '100%' }}><strong>NHR funds the organism. The organism makes NHR impossible to copy.</strong></p>
    </div>
  ),

  // 13 — NHR
  () => (
    <div className="slide">
      <h3>The revenue engine</h3>
      <h1>Old HR offboards people. New HR sets them free.</h1>
      <p>Companies pay per seat. Their laid-off employees get the whole organism &mdash; Church, Guides, Board, B3.0, and (optionally) the Magic Show.</p>
      <p>It&apos;s the most legible thing we sell to a CFO. Outplacement is already a line item on every P&amp;L. We&apos;re just making it actually work.</p>
      <p style={{ fontSize: '1.35rem', color: 'var(--gold)', fontWeight: 400, margin: '1.25rem 0' }}>It&apos;s the biggest line. But it&apos;s one door of six.</p>
      <p><strong>Which is exactly why outplacement can&apos;t copy it.</strong></p>
      <p style={{ marginTop: '1rem', fontSize: '0.95rem', color: 'var(--muted)' }}>new-human-resources.vercel.app &mdash; live, taking applications</p>
    </div>
  ),

  // 14 — PRICING
  () => (
    <div className="slide">
      <h3>NHR pricing</h3>
      <h1>Priced like outplacement. Works nothing like it.</h1>
      <div className="three-col" style={{ marginTop: '1rem' }}>
        <div className="card">
          <h3>Founder-led</h3>
          <p style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}>1&ndash;50 people</p>
          <p style={{ fontSize: '2rem', color: 'var(--gold)', fontWeight: 300, margin: '0.5rem 0', lineHeight: 1 }}>$3,500<span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>/seat</span></p>
          <p>For CEOs letting go of people they hired themselves.</p>
        </div>
        <div className="card">
          <h3>Growth-stage</h3>
          <p style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}>51&ndash;1,000 people</p>
          <p style={{ fontSize: '2rem', color: 'var(--gold)', fontWeight: 300, margin: '0.5rem 0', lineHeight: 1 }}>$2,500<span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>/seat</span></p>
          <p>For CHROs protecting the brand while the headcount drops.</p>
        </div>
        <div className="card">
          <h3>Enterprise</h3>
          <p style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}>1,000+ people</p>
          <p style={{ fontSize: '2rem', color: 'var(--gold)', fontWeight: 300, margin: '0.5rem 0', lineHeight: 1 }}>Custom</p>
          <p>For mass workforce transitions. Co-branded. Board-defensible.</p>
        </div>
      </div>
      <p style={{ marginTop: '1rem', textAlign: 'center', maxWidth: '100%' }}>
        <strong>Magic Show add-on: +$5K stateside / +$10K Costa Rica, per person.</strong>
      </p>
      <p style={{ marginTop: '0.75rem', textAlign: 'center', maxWidth: '100%', fontSize: '0.95rem', color: 'var(--muted)' }}>
        One enterprise deal &middot; 30,000 seats × $2,500 = <strong style={{ color: 'var(--text)' }}>$75M</strong>. 10% Magic Show uptake = <strong style={{ color: 'var(--text)' }}>+$22.5M</strong>. <strong style={{ color: 'var(--text)' }}>One customer.</strong>
      </p>
    </div>
  ),

  // 15 — TAM
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
      <p style={{ marginTop: '2rem', textAlign: 'center', maxWidth: '100%' }}>Every one of these is a fragment of the same problem. Nobody built the passage. <strong>The seventh industry is the transition economy itself. We&apos;re inventing it.</strong></p>
    </div>
  ),

  // 16 — COMP
  () => (
    <div className="slide">
      <h3>The comp</h3>
      <h1>LinkedIn sells hope. We sell the passage.</h1>
      <table className="deck-table">
        <thead>
          <tr>
            <th></th>
            <th>LHH / Randstad</th>
            <th>EOS Worldwide</th>
            <th>J.O.B.</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>What</td>
            <td>Resume workshops</td>
            <td>Operating system for SMBs</td>
            <td>Transition infrastructure</td>
          </tr>
          <tr>
            <td>Method</td>
            <td>LinkedIn hacks</td>
            <td>Cognitive process</td>
            <td>Embodiment + community</td>
          </tr>
          <tr>
            <td>Revenue</td>
            <td>$2.5B, shrinking</td>
            <td>$145M, growing</td>
            <td>Wedge live</td>
          </tr>
          <tr>
            <td>Output</td>
            <td>A better resume</td>
            <td>Better-run companies</td>
            <td>Sovereign humans</td>
          </tr>
        </tbody>
      </table>
      <p style={{ marginTop: '1.5rem' }}><strong>The woman who scaled EOS to $145M is now building the thing that replaces outplacement.</strong></p>
    </div>
  ),

  // 17 — TRACTION
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
      <h1><span className="gold">$3&ndash;5M</span> seed. One check. Every door.</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>SAFE into the <strong>HoldCo</strong> &mdash; the for-profit parent that owns every door: Church, Transition Centers, Magic Shows, J.O.B. Board, Business 3.0, NHR.</p>
      <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Lead checks from our network + Wefunder community round. <strong>Own what you co-create.</strong></p>
      <div className="two-col">
        <div className="card">
          <h3>What 24 months builds</h3>
          <ul>
            <li><strong>Close first 10 NHR enterprise deals</strong> — the wedge, proven at scale</li>
            <li><strong>Open the first 3 Transition Centers</strong> — physical proof of the passage</li>
            <li><strong>Put 3,000 humans through the 6-month program</strong></li>
            <li><strong>Form the RCO</strong> — nonprofit + HoldCo + first SPVs</li>
            <li><strong>Certify first 25 Guides &amp; B3.0 implementers</strong></li>
            <li><strong>Unify the platform</strong> — one front door, many experiments</li>
          </ul>
        </div>
        <div className="card">
          <h3>Team of 7</h3>
          <ul>
            <li><strong>Chief People Officer</strong> — the role HR never actually filled</li>
            <li><strong>Head of NHR Enterprise</strong> — owns the B2B wedge</li>
            <li><strong>Head of Program Delivery</strong> — runs the 6-month passage</li>
            <li><strong>Head of Transition Centers</strong> — physical infrastructure</li>
            <li><strong>Head of Tech</strong> — unified platform + SpiritTech</li>
            <li><strong>B3.0 Program Lead</strong> — cohorts and implementers</li>
            <li><strong>Creative Director</strong> — Magic Shows, brand, experiential</li>
          </ul>
        </div>
      </div>
    </div>
  ),

  // 20 — CLOSE (handled separately)
  null,
];

function CloseSlide({ onJoin }) {
  return (
    <div className="slide close-slide">
      <h1>The machines can have the jobs.</h1>
      <p>We want the part they can&apos;t touch.</p>
      <p>The layoffs aren&apos;t the crisis. They&apos;re the opening.</p>
      <p style={{ color: 'var(--text)', fontSize: '1.5rem', fontWeight: 700, marginTop: '1.25rem' }}>Catch the humans on the way out. Launch them into what comes next.</p>
      <p style={{ marginTop: '1.25rem' }}><strong className="gold">Welcome to the transition company.</strong></p>
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
