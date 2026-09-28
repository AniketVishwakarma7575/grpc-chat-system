import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Command,
  Hash,
  Home,
  LogOut,
  MessageCircle,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Settings,
  Smile,
  Sparkles,
  Sun,
  Users,
  WandSparkles,
  X,
} from 'lucide-react'
import { Avatar } from '../../components/ui/avatar'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { useTheme } from '../../hooks/useTheme'
import { notify } from '../../lib/toast'
import './app.css'

type Room = {
  id: string
  name: string
  description: string
  members: number
  unread?: number
}

type ChatMessage = {
  id: number
  author: string
  time: string
  text: string
  own?: boolean
}

const rooms: Room[] = [
  { id: 'general', name: 'general', description: 'The place for everything', members: 12, unread: 2 },
  { id: 'product', name: 'product-updates', description: 'Making the product better', members: 8 },
  { id: 'design', name: 'design-room', description: 'A little space to create', members: 6, unread: 1 },
  { id: 'launch', name: 'launch-planning', description: 'The big launch, together', members: 9 },
]

const initialMessages: Record<string, ChatMessage[]> = {
  general: [
    { id: 1, author: 'Aisha Khan', time: '9:41 AM', text: 'Morning, team! Hope everyone had a lovely weekend ☀️' },
    { id: 2, author: 'Theo Martin', time: '9:44 AM', text: 'Morning! Ready to make this week a good one.' },
    { id: 3, author: 'Rin Park', time: '9:48 AM', text: 'The new onboarding flow is ready for a first look. I’ll share a preview in a bit ✨' },
    { id: 4, author: 'Aisha Khan', time: '10:02 AM', text: 'Amazing, Rin! I’ll take a look before our check-in.' },
  ],
  product: [
    { id: 1, author: 'Theo Martin', time: '10:16 AM', text: 'The settings refresh is in review. The new layout feels so much calmer.' },
    { id: 2, author: 'Aisha Khan', time: '10:22 AM', text: 'Love that direction — especially the clearer notification controls.' },
  ],
  design: [
    { id: 1, author: 'Rin Park', time: '11:05 AM', text: 'Sharing the latest explorations for the workspace today. Excited to hear what you think!' },
    { id: 2, author: 'You', time: '11:12 AM', text: 'The softer colors make this feel really welcoming.', own: true },
  ],
  launch: [
    { id: 1, author: 'Aisha Khan', time: 'Yesterday', text: 'Checklist is looking good. We are getting so close 🚀' },
    { id: 2, author: 'Theo Martin', time: 'Yesterday', text: 'Everything is on track from my side. Nice work, everyone!' },
  ],
}

const teammates = [
  { name: 'Aisha Khan', detail: 'Product lead', presence: 'online' as const },
  { name: 'Theo Martin', detail: 'Engineering', presence: 'online' as const },
  { name: 'Rin Park', detail: 'Design', presence: 'away' as const },
]

export function WorkspaceDemo() {
  const { preference, setPreference } = useTheme()
  const [signedIn, setSignedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [activeView, setActiveView] = useState<'home' | 'chat'>('home')
  const [activeRoom, setActiveRoom] = useState(rooms[0])
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [mobileRoomsOpen, setMobileRoomsOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const messageListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
      if (event.key === 'Escape') {
        setSearchOpen(false)
        setNotificationsOpen(false)
        setSettingsOpen(false)
        setMobileRoomsOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    if (messageListRef.current) messageListRef.current.scrollTop = messageListRef.current.scrollHeight
  }, [activeRoom, messages])

  const filteredRooms = useMemo(
    () => rooms.filter((room) => `${room.name} ${room.description}`.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery],
  )

  const openRoom = (room: Room) => {
    setActiveRoom(room)
    setActiveView('chat')
    setSearchOpen(false)
    setMobileRoomsOpen(false)
    setSearchQuery('')
  }

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSignedIn(true)
    notify.success('Welcome to Threadline', { description: 'Your demo workspace is ready.' })
  }

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    const message: ChatMessage = {
      id: Date.now(),
      author: 'You',
      time: new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date()),
      text,
      own: true,
    }
    setMessages((current) => ({ ...current, [activeRoom.id]: [...(current[activeRoom.id] ?? []), message] }))
    setDraft('')
  }

  if (!signedIn) {
    return (
      <main className="workspace-login">
        <div className="workspace-login__glow" />
        <a aria-label="Threadline home" className="workspace-brand" href="/">
          <span className="workspace-brand__mark"><WandSparkles size={17} /></span>
          <span>threadline<span className="workspace-brand__period">.</span></span>
        </a>
        <Card className="login-card">
          <Badge tone="accent"><Sparkles size={12} /> YOUR TEAM, IN A GOOD PLACE</Badge>
          <h1>Good work<br />happens <span>together.</span></h1>
          <p>A little more room to think out loud, make things, and move forward.</p>
          <form onSubmit={handleLogin}>
            <Input
              autoComplete="email"
              label="Work email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              required
              type="email"
              value={email}
            />
            <Button className="login-card__submit" size="lg" type="submit">Continue to your workspace <ArrowUpRight size={17} /></Button>
          </form>
          <div className="login-card__divider"><span /> <span>OR</span> <span /></div>
          <Button className="login-card__demo" onClick={() => { setEmail('alex@studio.co'); setSignedIn(true) }} variant="secondary">
            <WandSparkles size={16} /> Explore the demo workspace
          </Button>
          <span className="login-card__note">No password needed — this is a local demo.</span>
        </Card>
        <footer className="login-footer"><span>© 2026 Threadline</span><a href="/dev/design">Explore the design system</a></footer>
      </main>
    )
  }

  const displayedMessages = messages[activeRoom.id] ?? []

  return (
    <main className="workspace">
      <aside className={`workspace-sidebar ${mobileRoomsOpen ? 'workspace-sidebar--mobile-open' : ''}`}>
        <a aria-label="Threadline home" className="workspace-brand" href="/" onClick={(event) => { event.preventDefault(); setActiveView('home') }}>
          <span className="workspace-brand__mark"><WandSparkles size={16} /></span>
          <span>threadline<span className="workspace-brand__period">.</span></span>
        </a>
        <button className="workspace-switcher" onClick={() => notify.info('You’re in the Studio workspace', { description: 'This demo has one shared workspace.' })}>
          <span className="workspace-switcher__icon">S</span>
          <span><strong>Studio workspace</strong><small>Free plan</small></span>
          <ChevronDown size={15} />
        </button>
        <Button className={`sidebar-link ${activeView === 'home' ? 'sidebar-link--active' : ''}`} onClick={() => { setActiveView('home'); setMobileRoomsOpen(false) }} variant="ghost">
          <Home size={17} /> Overview
        </Button>
        <div className="sidebar-section">
          <div className="sidebar-section__heading"><span>YOUR ROOMS</span><Button aria-label="Create room" onClick={() => notify.info('Room creation is just for show', { description: 'You can explore the sample rooms below.' })} size="icon" variant="ghost"><Plus size={16} /></Button></div>
          <nav aria-label="Rooms" className="room-list">
            {rooms.map((room) => (
              <button aria-current={activeView === 'chat' && activeRoom.id === room.id ? 'page' : undefined} className={`room-link ${activeView === 'chat' && activeRoom.id === room.id ? 'room-link--active' : ''}`} key={room.id} onClick={() => openRoom(room)}>
                <Hash size={16} /><span>{room.name}</span>{room.unread && <i aria-label={`${room.unread} unread messages`}>{room.unread}</i>}
              </button>
            ))}
          </nav>
        </div>
        <div className="sidebar-section sidebar-section--people">
          <div className="sidebar-section__heading"><span>YOUR PEOPLE</span><Button aria-label="Invite teammate" onClick={() => notify.info('Your invite link is ready', { description: 'Invitations are disabled in this local demo.' })} size="icon" variant="ghost"><Plus size={16} /></Button></div>
          {teammates.map((person) => (
            <button className="person-link" key={person.name} onClick={() => notify.info(`Say hello to ${person.name}`, { description: `${person.detail} · ${person.presence}` })}>
              <Avatar name={person.name} presence={person.presence} size="sm" /><span>{person.name}</span>
            </button>
          ))}
        </div>
        <div className="sidebar-bottom">
          <button className="sidebar-link" onClick={() => notify.info('Here to help', { description: 'This is a self-contained demo workspace.' })}><CircleHelp size={17} /> Help & feedback</button>
          <button className="workspace-profile" onClick={() => setSettingsOpen((open) => !open)}>
            <Avatar name="Alex Morgan" size="sm" presence="online" />
            <span><strong>Alex Morgan</strong><small>alex@studio.co</small></span><MoreHorizontal size={18} />
          </button>
        </div>
      </aside>

      <section className="workspace-main">
        <header className="workspace-topbar">
          <div className="workspace-topbar__left">
            <Button aria-label="Open rooms" className="mobile-menu-button" onClick={() => setMobileRoomsOpen((open) => !open)} size="icon" variant="ghost"><Hash size={18} /></Button>
            <span className="breadcrumb">Studio workspace</span><span className="breadcrumb__slash">/</span>
            <span className="breadcrumb__current">{activeView === 'home' ? 'Overview' : `# ${activeRoom.name}`}</span>
          </div>
          <div className="workspace-topbar__actions">
            <Button aria-label="Search" className="topbar-search" onClick={() => setSearchOpen(true)} variant="secondary"><Search size={16} /><span>Search anything...</span><kbd><Command size={11} /> K</kbd></Button>
            <div className="popover-anchor">
              <Button aria-expanded={notificationsOpen} aria-label="Notifications" onClick={() => { setNotificationsOpen((open) => !open); setSettingsOpen(false) }} size="icon" variant="ghost"><Bell size={18} /><i className="notification-dot" /></Button>
              {notificationsOpen && <div className="small-popover notifications-popover"><div className="popover-title"><strong>Notifications</strong><Badge tone="accent">2 new</Badge></div><div className="notification-item"><Avatar name="Rin Park" size="sm" /><p><strong>Rin Park</strong> mentioned you in <b>#design-room</b><small>12 minutes ago</small></p><i /></div><div className="notification-item"><Avatar name="Aisha Khan" size="sm" /><p><strong>Aisha Khan</strong> shared an update in <b>#general</b><small>1 hour ago</small></p></div><button className="popover-footer" onClick={() => { setNotificationsOpen(false); notify.success('All caught up') }}>Mark all as read <Check size={14} /></button></div>}
            </div>
            <div className="popover-anchor">
              <Button aria-expanded={settingsOpen} aria-label="Settings" onClick={() => { setSettingsOpen((open) => !open); setNotificationsOpen(false) }} size="icon" variant="ghost"><Settings size={18} /></Button>
              {settingsOpen && <div className="small-popover settings-popover"><strong>Appearance</strong><p>Make yourself at home.</p><div aria-label="Color theme" className="theme-control" role="group">{(['light', 'dark', 'system'] as const).map((theme) => <button aria-pressed={preference === theme} key={theme} onClick={() => setPreference(theme)}>{theme === 'light' ? <Sun size={14} /> : theme === 'dark' ? <Moon size={14} /> : <Command size={14} />}{theme}</button>)}</div><a href="/dev/design">Design system <ArrowUpRight size={14} /></a><button className="settings-logout" onClick={() => { setSignedIn(false); setActiveView('home'); setSettingsOpen(false) }}><LogOut size={14} /> Sign out</button></div>}
            </div>
            <Avatar className="topbar-avatar" name="Alex Morgan" size="sm" />
          </div>
        </header>

        {activeView === 'home' ? (
          <div className="dashboard-content">
            <div className="dashboard-greeting">
              <div><span className="eyebrow">MONDAY, SEPTEMBER 28</span><h1>Good morning, Alex <span>✳</span></h1><p>Here’s what’s happening with your team today.</p></div>
              <Button onClick={() => openRoom(rooms[0])}><MessageCircle size={16} /> Open a conversation</Button>
            </div>
            <div className="dashboard-grid">
              <Card className="welcome-card"><div className="welcome-card__copy"><Badge tone="accent"><Sparkles size={12} /> YOUR TEAM AT A GLANCE</Badge><h2>There’s good energy<br />in the room.</h2><p>Your team has shared 18 updates this week. Keep the momentum going.</p><Button onClick={() => openRoom(rooms[0])} size="sm" variant="secondary">See what’s new <ArrowUpRight size={14} /></Button></div><div className="welcome-card__art" aria-hidden="true"><div className="welcome-orbit welcome-orbit--one" /><div className="welcome-orbit welcome-orbit--two" /><div className="welcome-card__spark">✳</div><Avatar className="welcome-avatar welcome-avatar--one" name="Aisha Khan" size="md" /><Avatar className="welcome-avatar welcome-avatar--two" name="Theo Martin" size="md" /><Avatar className="welcome-avatar welcome-avatar--three" name="Rin Park" size="md" /></div></Card>
              <Card className="team-card"><div className="card-title-row"><div><span className="eyebrow">YOUR PEOPLE</span><h3>Team presence</h3></div><Users size={17} /></div><div className="team-presence"><div className="team-presence__avatars"><Avatar name="Aisha Khan" presence="online" /><Avatar name="Theo Martin" presence="online" /><Avatar name="Rin Park" presence="away" /><span>+9</span></div><strong>12 teammates</strong><small><i /> 8 online right now</small></div><div className="team-card__footer"><span>Most active</span><strong>Aisha, Theo & Rin</strong></div></Card>
              <Card className="activity-card"><div className="card-title-row"><div><span className="eyebrow">AROUND THE WORKSPACE</span><h3>Recent conversations</h3></div><Button aria-label="See all conversations" onClick={() => openRoom(rooms[0])} size="icon" variant="ghost"><ArrowUpRight size={17} /></Button></div><button className="activity-row" onClick={() => openRoom(rooms[0])}><span className="activity-icon activity-icon--purple"><Hash size={16} /></span><span className="activity-row__copy"><strong>#general</strong><span>Aisha: Morning, team! Hope everyone...</span></span><span className="activity-row__time">8m</span></button><button className="activity-row" onClick={() => openRoom(rooms[2])}><span className="activity-icon activity-icon--peach"><Hash size={16} /></span><span className="activity-row__copy"><strong>#design-room <Badge tone="warning">1 new</Badge></strong><span>Rin: Sharing the latest explorations...</span></span><span className="activity-row__time">12m</span></button><button className="activity-row" onClick={() => openRoom(rooms[1])}><span className="activity-icon activity-icon--mint"><Hash size={16} /></span><span className="activity-row__copy"><strong>#product-updates</strong><span>Theo: The settings refresh is in review...</span></span><span className="activity-row__time">1h</span></button><button className="activity-see-all" onClick={() => openRoom(rooms[0])}>Browse all rooms <ArrowUpRight size={14} /></button></Card>
              <Card className="schedule-card"><div className="card-title-row"><div><span className="eyebrow">COMING UP</span><h3>Your day, at a glance</h3></div><CalendarDays size={17} /></div><div className="schedule-item"><span className="schedule-item__time">11:30</span><span className="schedule-item__line" /><span><strong>Design check-in</strong><small><Users size={12} /> Aisha, Rin + you</small></span><ArrowUpRight size={14} /></div><div className="schedule-item"><span className="schedule-item__time">2:00</span><span className="schedule-item__line schedule-item__line--muted" /><span><strong>Weekly team sync</strong><small><Users size={12} /> Studio workspace</small></span><ArrowUpRight size={14} /></div><div className="schedule-note"><span>✳</span> A little time to focus, too.</div></Card>
            </div>
            <div className="dashboard-footnote"><span><i /> Your workspace is looking good</span><span>Made for the moments in between.</span></div>
          </div>
        ) : (
          <section aria-label={`${activeRoom.name} conversation`} className="chat-view">
            <header className="chat-header"><div className="chat-header__title"><span className="chat-room-icon"><Hash size={19} /></span><div><h1>{activeRoom.name}</h1><p>{activeRoom.description}</p></div></div><div className="chat-header__actions"><div className="chat-member-stack"><Avatar name="Aisha Khan" size="sm" /><Avatar name="Theo Martin" size="sm" /><Avatar name="Rin Park" size="sm" /><span>+{activeRoom.members - 3}</span></div><span className="chat-member-count"><Users size={14} /> {activeRoom.members}</span><Button aria-label="More room actions" onClick={() => notify.info('Room details', { description: `${activeRoom.members} teammates are in #${activeRoom.name}.` })} size="icon" variant="ghost"><MoreHorizontal size={18} /></Button></div></header>
            <div className="chat-messages" ref={messageListRef}>
              <div className="chat-day-divider"><span /> <Badge>Today</Badge> <span /></div>
              {displayedMessages.map((message, index) => {
                const previousMessage = displayedMessages[index - 1]
                const grouped = previousMessage?.author === message.author
                return <article className={`chat-message ${message.own ? 'chat-message--own' : ''} ${grouped ? 'chat-message--grouped' : ''}`} key={message.id}>
                  {!grouped && <Avatar name={message.author} size="sm" />}
                  <div className="chat-message__body">{!grouped && <div className="chat-message__meta"><strong>{message.author}</strong><time>{message.time}</time></div>}<p>{message.text}</p></div>
                </article>
              })}
            </div>
            <form className="chat-composer" onSubmit={sendMessage}><div className="chat-composer__input"><textarea aria-label={`Message #${activeRoom.name}`} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit() } }} placeholder={`Message #${activeRoom.name}`} rows={1} value={draft} /><div className="chat-composer__actions"><span>Return to send · Shift + Return for a new line</span><Button aria-label="Add emoji" onClick={() => setDraft((value) => `${value}${value ? ' ' : ''}✨`)} size="icon" type="button" variant="ghost"><Smile size={17} /></Button><Button aria-label="Send message" disabled={!draft.trim()} size="icon" type="submit"><Send size={16} /></Button></div></div></form>
          </section>
        )}
      </section>

      <nav aria-label="Mobile navigation" className="mobile-bottom-nav">
        <button aria-current={activeView === 'home' ? 'page' : undefined} onClick={() => { setActiveView('home'); setMobileRoomsOpen(false) }}><Home size={18} /><span>Home</span></button>
        <button aria-current={activeView === 'chat' ? 'page' : undefined} onClick={() => openRoom(activeRoom)}><MessageCircle size={18} /><span>Chat</span></button>
        <button aria-expanded={mobileRoomsOpen} onClick={() => setMobileRoomsOpen((open) => !open)}><Hash size={18} /><span>Rooms</span></button>
        <button onClick={() => { setSettingsOpen((open) => !open); setMobileRoomsOpen(false) }}><Settings size={18} /><span>Settings</span></button>
      </nav>
      {mobileRoomsOpen && <button aria-label="Close room menu" className="mobile-drawer-backdrop" onClick={() => setMobileRoomsOpen(false)} />}
      {searchOpen && <div className="command-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setSearchOpen(false) }}>      <section aria-label="Search workspace" aria-modal="true" className="command-palette" role="dialog"><div className="command-palette__search"><Search size={19} /><Input aria-label="Search rooms" inputRef={searchRef} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search rooms and people..." value={searchQuery} /><kbd>ESC</kbd><Button aria-label="Close search" onClick={() => setSearchOpen(false)} size="icon" variant="ghost"><X size={16} /></Button></div><div className="command-palette__results"><span className="eyebrow">JUMP TO A ROOM</span>{filteredRooms.length ? filteredRooms.map((room) => <button className="command-result" key={room.id} onClick={() => openRoom(room)}><span><Hash size={16} /></span><span><strong>{room.name}</strong><small>{room.description}</small></span><ArrowUpRight size={15} /></button>) : <div className="command-empty">No rooms match “{searchQuery}”</div>}<span className="command-palette__hint"><Command size={12} /> K to open anytime <span>↑↓ Navigate <b>↵</b> Select</span></span></div></section></div>}
      {settingsOpen && <div className="mobile-settings-panel"><div className="mobile-settings-panel__heading"><strong>Appearance</strong><Button aria-label="Close settings" onClick={() => setSettingsOpen(false)} size="icon" variant="ghost"><X size={17} /></Button></div><p>Make yourself at home.</p><div aria-label="Color theme" className="theme-control" role="group">{(['light', 'dark', 'system'] as const).map((theme) => <button aria-pressed={preference === theme} key={theme} onClick={() => setPreference(theme)}>{theme === 'light' ? <Sun size={14} /> : theme === 'dark' ? <Moon size={14} /> : <Command size={14} />}{theme}</button>)}</div><a href="/dev/design">Explore the design system <ArrowUpRight size={14} /></a><button className="settings-logout" onClick={() => { setSignedIn(false); setSettingsOpen(false) }}><LogOut size={14} /> Sign out</button></div>}
    </main>
  )
}
