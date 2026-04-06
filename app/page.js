'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const slides = [
  // 0 — COVER
  () => (
    <div className="slide cover">
      <h1>J.O.B.</h1>
      <p className="subtitle">The Transition Company</p>
      <p className="tagline">The largest involuntary liberation in economic history is underway. We&apos;re building the infrastructure to catch the people falling out of the old system — and launch the ones ready to come alive.</p>
    </div>
  ),

  // 1 — THE CANARY (MANIFESTO OPENER)
  () => (
    <div className="slide">
      <h3>March 2026</h3>
      <h1>The canary looks like it&apos;s dying.</h1>
      <p>IBM lost 13% in a day. Andrew Yang is calling it the jobpocalypse. Researchers are naming clinical conditions after what happens when a professional identity dissolves.</p>
      <p>The Citrini doom loop is tracking with uncomfortable accuracy. Q3 2026: agentic AI reaches competence across white-collar work. Q1 2027: Ghost GDP — output that shows up in national accounts but never circulates through the consumer economy. Q2 2027: the S&amp;P down 35% from its highs.</p>
      <p>The bears see the canary and conclude it&apos;s dying.</p>
      <p><strong>They&apos;re half right.</strong></p>
    </div>
  ),

  // 2 — THE CAGE DOOR
  () => (
    <div className="slide">
      <h3>What the bears are missing</h3>
      <h1>Canaries don&apos;t only die in toxic environments.</h1>
      <p style={{ fontSize: '1.6rem', color: 'var(--gold)', fontWeight: 300, margin: '1.5rem 0' }}>Sometimes the cage door opens.</p>
      <p>Tens of millions of people are about to be stripped of the performance of productivity — forced to ask, finally, what actually makes them come alive.</p>
      <p>Some panic, retrain, and compete for roles that are being automated on a six-month lag. One labor economist called them <em>&ldquo;the most credentialed unemployable population in American history.&rdquo;</em></p>
      <p>But a growing minority does something no economic model predicted, because no economic model had a variable for it.</p>
      <p><strong>They stop.</strong> Not stop working. Stop <em>performing</em>. And they sit with a question the professional class had been too busy, too comfortable, or too afraid to ask.</p>
    </div>
  ),

  // 3 — THURMAN QUOTE
  () => (
    <div className="slide close-slide">
      <p className="big-quote">&ldquo;Don&apos;t ask what the world needs. Ask what makes you come alive, and go do it. Because what the world needs is people who have come alive.&rdquo;</p>
      <p className="attribution">&mdash; Howard Thurman</p>
    </div>
  ),

  // 4 — THE THREE TURNS
  () => (
    <div className="slide">
      <h3>The restructuring nobody&apos;s measuring</h3>
      <h1>Three turns are happening at once.</h1>
      <div className="three-col" style={{ marginTop: '1rem' }}>
        <div className="card">
          <h3>Inward</h3>
          <p>The &ldquo;in order to&rdquo; collapsed. When the transaction disappeared — trade your energy for money and identity — a reservoir of suppressed intrinsic motivation was revealed. Millions of people who had been captured and metabolized by an economic machine that needed compliant cognitive labor, not alive human beings.</p>
        </div>
        <div className="card">
          <h3>Toward each other</h3>
          <p>When you can no longer perform the Capable Person Who Has It All Together, you&apos;re left with the actual person — scared, grieving, real. And that person is far more available for genuine connection than the professional mask ever was. Loneliness is declining for the first time in fifteen years.</p>
        </div>
        <div className="card">
          <h3>The plumbing changed</h3>
          <p>AI agents are optimization machines with no loyalty to payment rails. They evaluate every settlement mechanism on cost, speed, and programmability — and decentralized rails win on all three. Nobody fought the dollar. They just stopped needing it to be the only language value could speak.</p>
        </div>
      </div>
    </div>
  ),

  // 5 — THE DRUDGERY REVELATION
  () => (
    <div className="slide">
      <h3>The drudgery revelation</h3>
      <h1>The &ldquo;in order to&rdquo; collapsed. Something was revealed.</h1>
      <div className="two-col" style={{ marginTop: '0.75rem' }}>
        <div className="card">
          <h3>The father in Seattle</h3>
          <p>Former VP of Product. Seven months into a job search that produced nothing. His daughter asked him to help build a treehouse. They spent the whole day doing it. <em>&ldquo;I hadn&apos;t felt that absorbed, that present, that alive in fifteen years. I&apos;d spent my entire career managing Jira tickets so I could afford a life I was too exhausted to live.&rdquo;</em></p>
          <p>He now runs a woodworking studio in Ballard. Four-month waiting list. He earns less than half his old salary. He has never been wealthier.</p>
        </div>
        <div className="card">
          <h3>The corporate lawyer</h3>
          <p>Volunteered at a conflict mediation center every Saturday for six years. Couldn&apos;t afford to do it while billing 2,200 hours annually. When his firm restructured, he grieved for four months. Then hung a shingle. His mediation practice now serves three school districts. His wife told a reporter she feels like she got her husband back.</p>
        </div>
      </div>
      <p style={{ marginTop: '1.5rem', textAlign: 'center', maxWidth: '100%' }}>These weren&apos;t people who lacked skills or drive. Their skills had been <em>allocated</em> — by incentive, by social expectation, by the gravitational pull of the &ldquo;in order to&rdquo; — to work that did not make them come alive.</p>
    </div>
  ),

  // 6 — THE PASSAGE
  () => (
    <div className="slide">
      <h3>The passage</h3>
      <h1>This isn&apos;t a weekend workshop. It&apos;s bereavement.</h1>
      <p>The people losing their jobs are grieving an identity. The ones who surrender to the grief — who let it strip away the professional performance, who sit with the terrifying question of who they are without a title — emerge different. Different in a way that shows up in hard economic data.</p>
      <div className="three-col" style={{ marginTop: '1.25rem' }}>
        <div className="stat">
          <div className="stat-number">12–18</div>
          <div className="stat-label">Months the passage actually takes</div>
        </div>
        <div className="stat">
          <div className="stat-number">3.4x</div>
          <div className="stat-label">Business formation rate vs baseline</div>
        </div>
        <div className="stat">
          <div className="stat-number">89%</div>
          <div className="stat-label">Customer retention for the companies they start (vs 67% baseline)</div>
        </div>
      </div>
      <p style={{ marginTop: '1.25rem', textAlign: 'center', maxWidth: '100%' }}>They don&apos;t start more businesses because they learned new skills. <strong>They stop suppressing the ones they already had.</strong></p>
    </div>
  ),

  // 7 — THE PROBLEM
  () => (
    <div className="slide">
      <h3>The problem</h3>
      <h1>Nobody&apos;s building a passage.</h1>
      <p>Old HR was never about resourcing humans. It manages humans <em>as</em> resources — to be optimized, utilized, and replaced. Now it&apos;s replacing them at scale.</p>
      <p>And when the severance check hits, what does HR offer? A templated goodbye and a LinkedIn Premium code. Sending people right back into the loop that just spit them out.</p>
      <p>The $2.5B outplacement industry is a $4 billion lie: that a sharper resume will land people back where they were before. <strong>But where they were before is exactly what stopped working.</strong></p>
      <p style={{ marginTop: '1rem' }}>Every CEO and CHRO knows this. Every therapist, coach, and healer knows this. Every laid-off worker knows this.</p>
      <p>None of them have an answer. <strong>We do.</strong></p>
    </div>
  ),

  // 8 — THE THESIS
  () => (
    <div className="slide">
      <h3>Our thesis</h3>
      <h1>J.O.B. is the transition company.</h1>
      <p style={{ fontSize: '1.35rem', color: 'var(--text)', fontWeight: 600, marginBottom: '1.25rem' }}>We&apos;re building the infrastructure for the largest involuntary liberation in economic history.</p>
      <p>Not a job board. Not a retraining program. Not another outplacement service with better branding.</p>
      <p>A living organism that catches people when they fall out of the old system, holds them through the 12-to-18-month passage, and launches them into the new economy on the other side.</p>
      <p>Some start businesses. Some transform organizations. Some — the therapists, healers, bodyworkers, artists, furniture makers, mediators, farmers — finally get paid for gifts the old economy never valued.</p>
      <p><strong>We&apos;re not rebuilding the old system. We&apos;re the infrastructure for the one that&apos;s replacing it.</strong></p>
    </div>
  ),

  // 9 — THE ORGANISM
  () => (
    <div className="slide">
      <h3>The organism</h3>
      <h2>Six doors. One transition.</h2>
      <p>Every experiment is a way in. Every experiment feeds the others. The whole thing is built to catch you wherever you are in the passage — and launch you when you&apos;re ready.</p>
      <div className="three-col" style={{ marginTop: '1rem' }}>
        <div className="card">
          <h3>The Church</h3>
          <p><em>The grief container.</em> AA × Indeed × Meow Wolf had a baby. Where the &ldquo;in order to&rdquo; dissolves and the real question surfaces.</p>
        </div>
        <div className="card">
          <h3>MagicShowLand</h3>
          <p><em>The Transition Centers.</em> Physical spaces — abandoned churches, castles, colleges — where the passage happens in-person, in community.</p>
        </div>
        <div className="card">
          <h3>Magic Shows</h3>
          <p><em>The nervous system reset.</em> Multi-day stateside and multi-week Costa Rica immersions that break the fear loop and accelerate the passage.</p>
        </div>
        <div className="card">
          <h3>The J.O.B. Board</h3>
          <p><em>The marketplace for the alive.</em> Sovereign humans get paid for what AI can&apos;t do. 20% platform fee on every transaction.</p>
        </div>
        <div className="card">
          <h3>Business 3.0</h3>
          <p><em>The new operating system.</em> For the companies built by the transitioned — organisms instead of machines. Consulting, cohorts, certification.</p>
        </div>
        <div className="card">
          <h3>New Human Resources</h3>
          <p><em>The enterprise door.</em> Companies doing layoffs pay us to put their people through the passage. The revenue engine that funds the whole organism.</p>
        </div>
      </div>
    </div>
  ),

  // 10 — THE CHURCH (zoom in)
  () => (
    <div className="slide">
      <h3>The Church</h3>
      <h1>AA × Indeed × Meow Wolf had a baby.</h1>
      <p>It isn&apos;t a religion. There&apos;s no deity. No dogma. But there&apos;s sacrament — and the sacrament is the question itself: <em>what makes you come alive?</em></p>
      <div className="three-col" style={{ marginTop: '1rem' }}>
        <div className="card">
          <h3>From AA</h3>
          <p>The container. Sunday Night Live. Small groups. Body-based check-ins that bypass the intellectualization professionals use as a defense. People admitting, out loud, that the thing they&apos;ve been performing isn&apos;t the thing they are — and being held there until something true surfaces.</p>
        </div>
        <div className="card">
          <h3>From Indeed</h3>
          <p>The practical function. People arrive because they&apos;ve lost or hate their jobs. Church is the place they go <em>after</em> LinkedIn didn&apos;t work — and the place they leave ready to build something the old economy couldn&apos;t imagine.</p>
        </div>
        <div className="card">
          <h3>From Meow Wolf</h3>
          <p>The weirdness. Church is an immersive experience, not a service. Playful, strange, alive — on purpose. The professional self can&apos;t be coaxed out through a webinar. It has to be <em>surprised.</em></p>
        </div>
      </div>
      <p style={{ marginTop: '1rem', textAlign: 'center', maxWidth: '100%' }}>Live now at apply.itsthejob.com. Doctrine written. Congregation forming.</p>
    </div>
  ),

  // 11 — TRANSITION CENTERS (MagicShowLand)
  () => (
    <div className="slide">
      <h3>MagicShowLand</h3>
      <h1>Transition Centers.</h1>
      <p>In Austin by mid-2027 there were twelve of them. In Detroit they drew on Black mutual aid traditions. In rural areas they looked like agricultural cooperatives. In Appalachia they were VFW halls. The form adapted. The function was constant.</p>
      <p><strong>We&apos;re building the national network — and we&apos;re starting in abandoned churches, castles, and colleges.</strong></p>
      <div className="two-col" style={{ marginTop: '1rem' }}>
        <div className="card">
          <h3>What&apos;s inside</h3>
          <ul>
            <li>Small groups of 6–8, meeting twice a week</li>
            <li>Body-based check-ins, not performance reviews</li>
            <li>Practical skill-building alongside emotional honesty</li>
            <li>Practices that distinguish what you&apos;re feeling from the story you&apos;re telling about it</li>
            <li>Co-regulation — nervous systems in the same room</li>
            <li>An AI-native toolkit layered on top of all of it</li>
          </ul>
        </div>
        <div className="card">
          <h3>Why physical matters</h3>
          <p><strong>Co-regulation is the precondition for economic reinvention.</strong> Not a nice-to-have. The precondition.</p>
          <p>People who process their grief in community take entrepreneurial risk at far higher rates than people white-knuckling through shame while refreshing LinkedIn. The furniture maker in Ballard had a customer base before she had a website. The mediator had a referral network before he had a business card.</p>
          <p>No AI can replicate this. Not because of a capability gap. Because co-regulation is not prediction. It is <em>presence.</em></p>
        </div>
      </div>
    </div>
  ),

  // 12 — THE FLYWHEEL
  () => (
    <div className="slide">
      <h3>The flywheel</h3>
      <h1>How the organism feeds itself.</h1>
      <div className="two-col" style={{ marginTop: '0.75rem' }}>
        <div className="card">
          <h3>1 &middot; Catch them when they fall</h3>
          <p>Companies doing layoffs pay us (<strong>NHR</strong>) to put their people through the passage. The Church takes them in. Magic Shows reset their nervous systems. Transition Centers hold them physically for 12–18 months.</p>
        </div>
        <div className="card">
          <h3>2 &middot; Launch them into the new economy</h3>
          <p>The ones who come through start companies. Some become sellers on the <strong>J.O.B. Board</strong> (20% platform fee). Some build <strong>Business 3.0</strong> organisms. Some become Guides for the next cohort.</p>
        </div>
        <div className="card">
          <h3>3 &middot; They bring the next wave</h3>
          <p>Their businesses grow. Their communities refer. Their stories spread. Every alive human is a door back into the organism. EOS scaled to $145M on the same mechanic.</p>
        </div>
        <div className="card">
          <h3>4 &middot; The cycle compounds</h3>
          <p>Eventually the companies they build face their own transitions. They already trust us. The flywheel never stops — because the passage never stops.</p>
        </div>
      </div>
      <p style={{ marginTop: '1rem', textAlign: 'center', maxWidth: '100%' }}><strong>NHR funds the organism. The organism feeds NHR. Every door compounds every other door.</strong></p>
    </div>
  ),

  // 13 — NHR (the revenue engine, now framed inside the whole)
  () => (
    <div className="slide">
      <h3>The revenue engine</h3>
      <h1>New Human Resources.</h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text)', fontWeight: 600, marginBottom: '1.25rem' }}>Old HR offboards people. New HR sets them free.</p>
      <p>Companies letting people go pay us per seat. Their laid-off employees get the entire J.O.B. ecosystem — six months of passage through the Church, the Guides, the Board, Business 3.0, and (optionally) the Magic Show.</p>
      <p>This is our wedge into the enterprise. It&apos;s the biggest single revenue line in the organism. And it&apos;s the most legible thing we sell to a CFO — because outplacement is already a line item on every corporate P&amp;L.</p>
      <p><strong>But it&apos;s one door among six.</strong> The whole organism is what makes every door valuable — and what makes NHR something outplacement vendors can&apos;t replicate no matter how much they spend.</p>
      <p style={{ marginTop: '1rem', fontSize: '0.95rem', color: 'var(--muted)' }}>new-human-resources.vercel.app — live, taking applications</p>
    </div>
  ),

  // 14 — PRICING
  () => (
    <div className="slide">
      <h3>NHR pricing</h3>
      <h2>Priced like outplacement. Works nothing like it.</h2>
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
          <p>For CHROs navigating a restructure. Protect the brand. Take care of the people.</p>
        </div>
        <div className="card">
          <h3>Enterprise</h3>
          <p style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}>1,000+ people</p>
          <p style={{ fontSize: '2rem', color: 'var(--gold)', fontWeight: 300, margin: '0.5rem 0', lineHeight: 1 }}>Custom</p>
          <p>For mass workforce transitions. Multi-cohort, co-branded, board-defensible.</p>
        </div>
      </div>
      <p style={{ marginTop: '1rem', textAlign: 'center', maxWidth: '100%' }}>
        <strong>Magic Show add-on: +$5K stateside (multi-day) / +$10K Costa Rica (multi-week), per person.</strong>
      </p>
      <p style={{ marginTop: '0.75rem', textAlign: 'center', maxWidth: '100%', fontSize: '0.95rem', color: 'var(--muted)' }}>
        A single enterprise deal at 30,000 seats × $2,500 = <strong style={{ color: 'var(--text)' }}>$75M</strong>. 10% Magic Show uptake at a blended $7,500 = <strong style={{ color: 'var(--text)' }}>+$22.5M</strong>. One customer.
      </p>
    </div>
  ),

  // 15 — TAM
  () => (
    <div className="slide">
      <h3>Total addressable market</h3>
      <h2>We sit at the intersection of six industries — and a seventh we&apos;re inventing.</h2>
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
          <div className="stat-label">Outplacement (direct replacement)</div>
        </div>
      </div>
      <p style={{ marginTop: '2rem', textAlign: 'center', maxWidth: '100%' }}>Every one of these industries is a fragment of the same problem — nobody built a passage. <strong>The seventh industry is the transition economy itself. It doesn&apos;t exist yet. We&apos;re building it.</strong></p>
    </div>
  ),

  // 16 — COMP
  () => (
    <div className="slide">
      <h3>The comp</h3>
      <h2>Outplacement is the incumbent. EOS is the playbook.</h2>
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
            <td>Resume workshops, job search tools</td>
            <td>Operating system for businesses</td>
            <td>Transition infrastructure for the largest involuntary liberation in economic history</td>
          </tr>
          <tr>
            <td>Method</td>
            <td>LinkedIn hacks, templated advice</td>
            <td>Traction (cognitive, process)</td>
            <td>Embodiment (somatic, relational, whole-intelligence)</td>
          </tr>
          <tr>
            <td>Revenue</td>
            <td>$2.5B market, shrinking</td>
            <td>$145M, growing</td>
            <td>Wedge live, pipeline forming</td>
          </tr>
          <tr>
            <td>Output</td>
            <td>A slightly better resume</td>
            <td>Better-run companies</td>
            <td>Sovereign humans &amp; the companies they create</td>
          </tr>
        </tbody>
      </table>
      <p style={{ marginTop: '1.5rem' }}><strong>The person who scaled EOS to $145M is now building the thing that replaces outplacement.</strong></p>
    </div>
  ),

  // 17 — TRACTION
  () => (
    <div className="slide">
      <h3>What exists today</h3>
      <h2>We&apos;re not starting from zero. We&apos;re starting from live.</h2>
      <div className="two-col" style={{ marginTop: '1rem' }}>
        <div className="card">
          <h3>Live product</h3>
          <ul>
            <li><strong>itsthejob.com</strong> — the front door. Every experiment lives here.</li>
            <li><strong>new-human-resources.vercel.app</strong> — the B2B wedge. Pricing, application flow, taking inbound.</li>
            <li><strong>Magic Show platform</strong> — multi-show portal, golden tickets, intake + waivers. Shows already produced (Nashville, Minneapolis, Big Sky).</li>
            <li><strong>The Church</strong> — live app, Sunday Night Live running, doctrine written, congregation forming.</li>
            <li><strong>The J.O.B. Board</strong> — marketplace MVP live, fixed pricing, 20% fee in place.</li>
            <li><strong>Business 3.0</strong> — framework fully built, pricing set, ready to deploy.</li>
          </ul>
        </div>
        <div className="card">
          <h3>Network &amp; brand</h3>
          <ul>
            <li><strong>Founders&apos; combined reach:</strong> 800+ EOS implementers, 200+ Jumpsuit contractors, investor network ready to write checks.</li>
            <li><strong>Brand north stars:</strong> Meow Wolf, Blah Airlines, Dramcorp — weird on purpose, culture-shaping.</li>
            <li><strong>Investor pipeline:</strong> Wefunder community round prepped. Lead conversations open.</li>
            <li><strong>First NHR conversations:</strong> inbound applications already flowing through the new site.</li>
          </ul>
        </div>
      </div>
    </div>
  ),

  // 18 — FOUNDERS
  () => (
    <div className="slide">
      <h3>Why us</h3>
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
      <p style={{ marginTop: '1.5rem', textAlign: 'center', maxWidth: '100%' }}>
        <strong>Nicole&apos;s big ideas + Pam&apos;s big implementation = over $100B in combined revenue impact.</strong>
      </p>
    </div>
  ),

  // 19 — THE ASK
  () => (
    <div className="slide">
      <h3>The ask</h3>
      <h1><span className="gold">$3&ndash;5M</span> Seed Round</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>SAFE into the <strong>HoldCo</strong> — the for-profit parent that owns every door in the organism: Church, MagicShowLand Transition Centers, Magic Shows, J.O.B. Board, Business 3.0, and New Human Resources.</p>
      <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>One investment. Every door. Lead checks from our network + Wefunder community round. <strong>Own what you co-create.</strong></p>
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
      <h1>The canary is still alive.</h1>
      <p>For thousands of years we trained humans to be workers but never fully human.</p>
      <p>Now AI is taking the old jobs. Good. Let it.</p>
      <p>The bears saw the canary and concluded it was dying. They were half right.</p>
      <p>The canary was in distress. The air was changing. The old environment couldn&apos;t sustain it. But canaries don&apos;t only die in toxic environments.</p>
      <p style={{ color: 'var(--text)', fontSize: '1.5rem', fontWeight: 700, marginTop: '0.75rem' }}>Sometimes the cage door opens. And the canary doesn&apos;t just survive. It sings.</p>
      <p style={{ marginTop: '1rem' }}><strong className="gold">Welcome to the transition company.</strong></p>
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
