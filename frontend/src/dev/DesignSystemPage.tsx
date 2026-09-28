import { motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowRight,
  Bell,
  Check,
  Command,
  Moon,
  Plus,
  Search,
  Sun,
  Users,
  WandSparkles,
} from 'lucide-react'
import { Avatar } from '../components/ui/avatar'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Skeleton } from '../components/ui/skeleton'
import { useTheme } from '../hooks/useTheme'
import { notify } from '../lib/toast'

export function DesignSystemPage() {
  const { preference, setPreference } = useTheme()
  const nextTheme = preference === 'dark' ? 'light' : 'dark'

  return (
    <main className="design-page">
      <header className="design-header">
        <a aria-label="Threadline design system" className="brand" href="/dev/design">
          <span className="brand__mark"><WandSparkles size={17} /></span>
          <span>threadline<span className="brand__period">.</span></span>
          <Badge tone="accent">DESIGN SYSTEM</Badge>
        </a>
        <div className="header-actions">
          <span className="header-status"><span /> System ready</span>
          <Button
            aria-label={`Switch to ${nextTheme} theme`}
            onClick={() => setPreference(nextTheme)}
            size="icon"
            variant="secondary"
          >
            {preference === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </Button>
        </div>
      </header>

      <section className="hero">
        <div className="hero__copy">
          <Badge tone="accent"><span className="sparkle-dot" /> THE SHARED SPACE FOR YOUR TEAM</Badge>
          <h1>Good work<br />happens <span>together.</span></h1>
          <p>A quieter, more considered place for your team to think out loud and move forward.</p>
          <div className="hero__buttons">
            <Button onClick={() => notify.success('You’re all caught up', { description: 'Your workspace is ready for what’s next.' })}>
              Explore the system <ArrowRight size={16} />
            </Button>
            <Button variant="secondary">See what’s new <ArrowDown size={16} /></Button>
          </div>
          <div className="hero__social">
            <div className="avatar-stack">
              <Avatar name="Aisha Khan" size="sm" presence="online" />
              <Avatar name="Theo Martin" size="sm" presence="online" />
              <Avatar name="Rin Park" size="sm" presence="away" />
              <span className="avatar-stack__more">+8</span>
            </div>
            <span><strong>12 people</strong> making things happen</span>
          </div>
        </div>
        <div aria-hidden="true" className="hero-art">
          <div className="hero-art__glow" />
          <motion.div
            animate={{ y: [0, -9, 0], rotate: [-1, 1, -1] }}
            className="floating-note floating-note--back"
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="note-author"><Avatar name="Rin Park" size="sm" /><div><strong>Rin Park</strong><span>in product-design</span></div></div>
            <p>That little detail makes the whole flow feel more human ✨</p>
            <div className="note-reaction">💜 <span>4</span></div>
          </motion.div>
          <motion.div
            animate={{ y: [0, 7, 0], rotate: [1, -0.5, 1] }}
            className="floating-note floating-note--front"
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="note-author"><Avatar name="Aisha Khan" size="sm" presence="online" /><div><strong>Aisha Khan</strong><span>just now · in launch-room</span></div><span className="note-more">···</span></div>
            <p>Good morning, everyone! The launch checklist is looking <em>really</em> good. We’re so close 🚀</p>
            <div className="note-footer"><span>♡ 3</span><span>↩ Reply</span><span>···</span></div>
          </motion.div>
          <div className="hero-art__caption"><span /> A little more room to be a team.</div>
        </div>
      </section>

      <section aria-label="Design system component showcase" className="showcase">
        <div className="showcase__intro">
          <div>
            <span className="eyebrow">THE FOUNDATIONS</span>
            <h2>Made to feel like<br />a breath of fresh air.</h2>
          </div>
          <p>Every detail has a purpose: soft enough to invite you in, clear enough to keep you moving.</p>
        </div>

        <div className="showcase-grid">
          <Card className="showcase-card showcase-card--components">
            <div className="card-heading"><div><span className="eyebrow">01 / COMPONENTS</span><h3>Quietly capable.</h3></div><Command size={18} /></div>
            <div className="component-row">
              <Button size="sm"><Plus size={15} /> New room</Button>
              <Button size="sm" variant="secondary">Secondary</Button>
              <Button aria-label="Notifications" size="icon" variant="ghost"><Bell size={17} /></Button>
            </div>
            <div className="component-row">
              <Badge tone="success"><span className="badge-dot" /> Connected</Badge>
              <Badge tone="accent">Design</Badge>
              <Badge tone="warning">3 unread</Badge>
              <Badge>General</Badge>
            </div>
            <div className="component-row component-row--field">
              <Input aria-label="Search components" placeholder="Find something..." />
              <Button aria-label="Search" size="icon" variant="secondary"><Search size={16} /></Button>
            </div>
            <div className="component-row component-row--avatars">
              <Avatar name="Aisha Khan" presence="online" />
              <Avatar name="Theo Martin" presence="away" />
              <Avatar name="Rin Park" presence="offline" />
              <span className="component-note">Human, at a glance.</span>
            </div>
            <div className="skeleton-row">
              <Skeleton className="skeleton-avatar" />
              <div className="skeleton-lines"><Skeleton /><Skeleton /></div>
              <Skeleton className="skeleton-pill" />
            </div>
          </Card>

          <Card className="showcase-card showcase-card--palette">
            <div className="card-heading"><div><span className="eyebrow">02 / COLOR & TYPE</span><h3>Warmth, with clarity.</h3></div><span className="palette-spark">✳</span></div>
            <div className="color-strip">
              <div className="color-swatch color-swatch--ink"><span>Ink</span><small>#201C2B</small></div>
              <div className="color-swatch color-swatch--lavender"><span>Lavender</span><small>#7655E8</small></div>
              <div className="color-swatch color-swatch--coral"><span>Coral</span><small>#F17E78</small></div>
              <div className="color-swatch color-swatch--mint"><span>Mint</span><small>#65B99C</small></div>
            </div>
            <div className="type-sample">
              <span className="type-sample__label">INTER VARIABLE · 100—900</span>
              <div>Thoughts<br /><span>in motion.</span></div>
              <p>Clear words. Comfortable reading. A little room to breathe.</p>
            </div>
            <div className="token-row"><span>Radii</span><div className="radius-chip radius-chip--sm" /><div className="radius-chip radius-chip--md" /><div className="radius-chip radius-chip--lg" /><span>8 · 16 · 24</span></div>
          </Card>

          <Card className="showcase-card showcase-card--empty">
            <div className="card-heading"><div><span className="eyebrow">03 / EMPTY STATES</span><h3>Room for a first hello.</h3></div><Users size={18} /></div>
            <div className="empty-preview">
              <img alt="" height="108" src="/illustrations/empty-state.svg" width="142" />
              <strong>It’s quiet in here.</strong>
              <span>Start a conversation and bring everyone in.</span>
              <Button size="sm"><Plus size={14} /> Start a conversation</Button>
            </div>
          </Card>

          <Card className="showcase-card showcase-card--themes">
            <div className="card-heading"><div><span className="eyebrow">04 / THEMING</span><h3>Light on you.</h3></div><Sun size={18} /></div>
            <p className="theme-copy">Thoughtful in every light. Choose a theme or let your system decide.</p>
            <div className="theme-options" role="group" aria-label="Color theme">
              {(['light', 'dark', 'system'] as const).map((option) => (
                <Button
                  aria-pressed={preference === option}
                  className={preference === option ? 'theme-option--selected' : ''}
                  key={option}
                  onClick={() => setPreference(option)}
                  size="sm"
                  variant="secondary"
                >
                  {preference === option && <Check size={14} />}
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Button>
              ))}
            </div>
            <div className="theme-preview">
              <div className="theme-preview__icon"><Users size={16} /></div>
              <div><strong>Design team</strong><span>Everyone’s in the loop.</span></div>
              <Badge tone="success">Active</Badge>
            </div>
          </Card>
        </div>
      </section>

      <footer className="design-footer">
        <a className="brand brand--small" href="/dev/design"><span className="brand__mark"><WandSparkles size={14} /></span><span>threadline<span className="brand__period">.</span></span></a>
        <span>Made for the moments in between.</span>
        <div className="footer-actions">
          <Button onClick={() => notify.info('You’re all caught up', { description: 'There’s nothing new right now.', id: 'design-demo' })} size="sm" variant="ghost">Try a toast</Button>
          <Button onClick={() => notify.info('You’re all caught up', { description: 'There’s nothing new right now.', id: 'design-demo' })} size="sm" variant="ghost">Show toast again</Button>
          <span>© 2026 Threadline</span>
        </div>
      </footer>
    </main>
  )
}
