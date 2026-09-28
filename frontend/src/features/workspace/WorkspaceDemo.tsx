import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
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
  Pencil,
  Plus,
  Search,
  Send,
  Settings,
  Smile,
  Sparkles,
  Sun,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import { Avatar } from '../../components/ui/avatar'
import { Badge } from '../../components/ui/badge'
import { BrandMark } from '../../components/ui/brand-mark'
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
  kind?: 'room' | 'dm'
  personName?: string
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
    { id: 1, author: 'Aniket Vishwakarma', time: '9:41 AM', text: 'Morning, team! Hope everyone had a lovely weekend ☀️' },
    { id: 2, author: 'Kaif Shaikh', time: '9:44 AM', text: 'Morning! Ready to make this week a good one.' },
    { id: 3, author: 'Kartikey Singh', time: '9:48 AM', text: 'The new onboarding flow is ready for a first look. I’ll share a preview in a bit ✨' },
    { id: 4, author: 'Aniket Vishwakarma', time: '10:02 AM', text: 'Amazing, Rin! I’ll take a look before our check-in.' },
  ],
  product: [
    { id: 1, author: 'Kaif Shaikh', time: '10:16 AM', text: 'The settings refresh is in review. The new layout feels so much calmer.' },
    { id: 2, author: 'Aniket Vishwakarma', time: '10:22 AM', text: 'Love that direction — especially the clearer notification controls.' },
  ],
  design: [
    { id: 1, author: 'Kartikey Singh', time: '11:05 AM', text: 'Sharing the latest explorations for the workspace today. Excited to hear what you think!' },
    { id: 2, author: 'You', time: '11:12 AM', text: 'The softer colors make this feel really welcoming.', own: true },
  ],
  launch: [
    { id: 1, author: 'Aniket Vishwakarma', time: 'Yesterday', text: 'Checklist is looking good. We are getting so close 🚀' },
    { id: 2, author: 'Kaif Shaikh', time: 'Yesterday', text: 'Everything is on track from my side. Nice work, everyone!' },
  ],
}

const teammates = [
  { name: 'Aniket Vishwakarma', detail: 'Product lead', presence: 'online' as const },
  { name: 'Kaif Shaikh', detail: 'Engineering', presence: 'online' as const },
  { name: 'Kartikey Singh', detail: 'Design', presence: 'away' as const },
]

type Teammate = (typeof teammates)[number]

const directMessages: Record<string, ChatMessage[]> = {
  'dm-aisha': [
    { id: 1, author: 'Aniket Vishwakarma', time: '10:24 AM', text: 'Want to review the launch checklist together this afternoon?' },
    { id: 2, author: 'You', time: '10:28 AM', text: 'Absolutely — I’ll bring the latest notes.', own: true },
  ],
  'dm-theo': [
    { id: 1, author: 'Kaif Shaikh', time: 'Yesterday', text: 'The settings refresh is ready for your first look.' },
    { id: 2, author: 'You', time: 'Yesterday', text: 'Great, I’ll review it after lunch.', own: true },
  ],
  'dm-rin': [
    { id: 1, author: 'Kartikey Singh', time: '11:05 AM', text: 'Sharing the latest workspace explorations here ✨' },
    { id: 2, author: 'You', time: '11:12 AM', text: 'The softer colors make this feel really welcoming.', own: true },
  ],
}

export function WorkspaceDemo() {
  const { preference, setPreference } = useTheme()
  const [signedIn, setSignedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [activeView, setActiveView] = useState<'home' | 'chat'>('home')
  const [activeRoom, setActiveRoom] = useState(rooms[0])
  const [roomItems, setRoomItems] = useState<Room[]>(rooms)
  const [people, setPeople] = useState<Teammate[]>(teammates)
  const [messages, setMessages] = useState({ ...initialMessages, ...directMessages })
  const [draft, setDraft] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackType, setFeedbackType] = useState('Feedback')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackEmail, setFeedbackEmail] = useState('kartikey@studio.co')
  const [profileEditing, setProfileEditing] = useState(false)
  const [profileName, setProfileName] = useState('Kartikey Singh')
  const [profileRole, setProfileRole] = useState('Product designer')
  const [profileBio, setProfileBio] = useState('Building thoughtful tools for teams that care about good work.')
  const [profileAvatar, setProfileAvatar] = useState('https://upload.wikimedia.org/wikipedia/commons/4/4f/Henry_Cavill_by_Gage_Skidmore_2.jpg')
  const [mobileRoomsOpen, setMobileRoomsOpen] = useState(false)
  const [crudOpen, setCrudOpen] = useState<'room' | 'person' | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [crudName, setCrudName] = useState('')
  const [crudDescription, setCrudDescription] = useState('')
  const [crudDetail, setCrudDetail] = useState('')
  const [crudPresence, setCrudPresence] = useState<Teammate['presence']>('online')
  const searchRef = useRef<HTMLInputElement>(null)
  const messageListRef = useRef<HTMLDivElement>(null)
  const composerRef = useRef<HTMLTextAreaElement>(null)

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

  useEffect(() => {
    const textarea = composerRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    textarea.style.overflowY = textarea.scrollHeight > 120 ? 'auto' : 'hidden'
  }, [draft, activeRoom])

  const filteredRooms = useMemo(
    () => roomItems.filter((room) => `${room.name} ${room.description}`.toLowerCase().includes(searchQuery.toLowerCase())),
    [roomItems, searchQuery],
  )

  const openRoom = (room: Room) => {
    setActiveRoom(room)
    setActiveView('chat')
    setSearchOpen(false)
    setMobileRoomsOpen(false)
    setSearchQuery('')
  }

  const openDirectMessage = (person: Teammate) => {
    const id = `dm-${person.name.split(' ')[0].toLowerCase()}`
    setActiveRoom({
      id,
      name: person.name,
      description: `${person.detail} · ${person.presence}`,
      members: 2,
      kind: 'dm',
      personName: person.name,
    })
    setActiveView('chat')
    setMobileRoomsOpen(false)
  }

  const openCrud = (kind: 'room' | 'person', id?: string) => {
    const room = id ? roomItems.find((item) => item.id === id) : undefined
    const person = id ? people.find((item) => item.name === id) : undefined
    setCrudOpen(kind)
    setEditingId(id ?? null)
    setCrudName(kind === 'room' ? room?.name ?? '' : person?.name ?? '')
    setCrudDescription(room?.description ?? '')
    setCrudDetail(person?.detail ?? '')
    setCrudPresence(person?.presence ?? 'online')
  }

  const submitCrud = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = crudName.trim()
    if (!crudOpen || !name) return
    if (crudOpen === 'room') {
      if (editingId) {
        setRoomItems((items) => items.map((room) => room.id === editingId ? { ...room, name, description: crudDescription.trim() || 'A new shared space' } : room))
        if (activeRoom.id === editingId) setActiveRoom((room) => ({ ...room, name, description: crudDescription.trim() || 'A new shared space' }))
      } else {
        const room = { id: `room-${Date.now()}`, name: name.toLowerCase().replace(/\s+/g, '-'), description: crudDescription.trim() || 'A new shared space', members: 1 }
        setRoomItems((items) => [...items, room])
        setMessages((items) => ({ ...items, [room.id]: [] }))
      }
    } else {
      const nextPerson = { name, detail: crudDetail.trim() || 'Teammate', presence: crudPresence }
      setPeople((items) => editingId ? items.map((person) => person.name === editingId ? nextPerson : person) : [...items, nextPerson])
    }
    setCrudOpen(null)
    notify.success(editingId ? 'Updated successfully' : 'Created successfully')
  }

  const deleteCrud = (kind: 'room' | 'person', id: string) => {
    if (!window.confirm(`Delete this ${kind}? This cannot be undone.`)) return
    if (kind === 'room') {
      setRoomItems((items) => items.filter((room) => room.id !== id))
      if (activeRoom.id === id) { setActiveRoom(roomItems.find((room) => room.id !== id) ?? rooms[0]); setActiveView('home') }
    } else setPeople((items) => items.filter((person) => person.name !== id))
    notify.success(`${kind === 'room' ? 'Room' : 'Person'} deleted`)
  }

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSignedIn(true)
    notify.success('Welcome to gRPCTalk', { description: 'Your demo workspace is ready.' })
  }

  const submitFeedback = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!feedbackMessage.trim()) return
    setFeedbackOpen(false)
    setFeedbackMessage('')
    notify.success('Thanks for your feedback', { description: 'We have saved your report for the workspace team.' })
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

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) setProfileAvatar(URL.createObjectURL(file))
  }

  if (!signedIn) {
    return (
      <main className="workspace-login">
        <div className="workspace-login__glow" />
        <a aria-label="gRPCTalk home" className="workspace-brand" href="/">
          <BrandMark />
          <span>gRPCTalk<span className="workspace-brand__period">.</span></span>
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
          <Button className="login-card__demo" onClick={() => { setEmail('kartikey@studio.co'); setSignedIn(true) }} variant="secondary">
            <BrandMark size={22} /> Explore the demo workspace
          </Button>
          <span className="login-card__note">No password needed — this is a local demo.</span>
        </Card>
        <footer className="login-footer"><span>© 2026 gRPCTalk</span><a href="/dev/design">Explore the design system</a></footer>
      </main>
    )
  }

  const displayedMessages = messages[activeRoom.id] ?? []

  return (
    <main className="workspace">
      <aside className={`workspace-sidebar ${mobileRoomsOpen ? 'workspace-sidebar--mobile-open' : ''}`}>
        <a aria-label="gRPCTalk home" className="workspace-brand" href="/" onClick={(event) => { event.preventDefault(); setActiveView('home') }}>
          <BrandMark />
          <span>gRPCTalk<span className="workspace-brand__period">.</span></span>
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
          <div className="sidebar-section__heading"><span>YOUR ROOMS</span><Button aria-label="Create room" onClick={() => openCrud('room')} size="icon" variant="ghost"><Plus size={16} /></Button></div>
          <nav aria-label="Rooms" className="room-list">
            {roomItems.map((room) => (
              <div className="crud-list-row" key={room.id}>
                <button aria-current={activeView === 'chat' && activeRoom.id === room.id ? 'page' : undefined} className={`room-link ${activeView === 'chat' && activeRoom.id === room.id ? 'room-link--active' : ''}`} onClick={() => openRoom(room)}>
                  <Hash size={16} /><span>{room.name}</span>{room.unread && <i aria-label={`${room.unread} unread messages`}>{room.unread}</i>}
                </button>
                <span className="crud-actions"><button aria-label="Edit room" title={`Edit ${room.name}`} onClick={() => openCrud('room', room.id)}><Pencil size={11} /></button><button aria-label="Delete room" title={`Delete ${room.name}`} onClick={() => deleteCrud('room', room.id)}><Trash2 size={11} /></button></span>
              </div>
            ))}
          </nav>
        </div>
        <div className="sidebar-section sidebar-section--people">
          <div className="sidebar-section__heading"><span>YOUR PEOPLE</span><Button aria-label="Create person" onClick={() => openCrud('person')} size="icon" variant="ghost"><Plus size={16} /></Button></div>
          {people.map((person) => (
            <div className="crud-list-row" key={person.name}>
              <button className="person-link" onClick={() => openDirectMessage(person)}>
                <Avatar name={person.name} presence={person.presence} size="sm" /><span>{person.name}</span>
              </button>
              <span className="crud-actions"><button aria-label="Edit person" title={`Edit ${person.name}`} onClick={() => openCrud('person', person.name)}><Pencil size={11} /></button><button aria-label="Delete person" title={`Delete ${person.name}`} onClick={() => deleteCrud('person', person.name)}><Trash2 size={11} /></button></span>
            </div>
          ))}
        </div>
        <div className="sidebar-bottom">
          <button className="sidebar-link" onClick={() => setFeedbackOpen(true)}><CircleHelp size={17} /> Help & feedback</button>
          <button className="workspace-profile" onClick={() => setSettingsOpen((open) => !open)}>
            <Avatar name={profileName} size="sm" presence="online" src={profileAvatar} />
            <span><strong>{profileName}</strong><small>kartikey@studio.co</small></span>
            <span
              aria-label="Open settings"
              className="workspace-profile__more"
              onClick={(event) => { event.stopPropagation(); setSettingsOpen(true) }}
              role="button"
              tabIndex={0}
            >
              <MoreHorizontal size={18} />
            </span>
          </button>
        </div>
      </aside>

      <section className="workspace-main">
        <header className="workspace-topbar">
          <div className="workspace-topbar__left">
            <a aria-label="gRPCTalk home" className="mobile-brand" href="/" onClick={(event) => { event.preventDefault(); setActiveView('home'); setMobileRoomsOpen(false) }}>
              <BrandMark size={32} />
              <span>gRPCTalk<span className="workspace-brand__period">.</span></span>
            </a>
          </div>
          <div className="workspace-topbar__actions">
            <Button aria-label="Search" className="topbar-search" onClick={() => setSearchOpen(true)} variant="secondary"><Search size={16} /><span>Search anything...</span><kbd><Command size={11} /> K</kbd></Button>
            <div className="popover-anchor">
              <Button aria-expanded={notificationsOpen} aria-label="Notifications" onClick={() => { setNotificationsOpen((open) => !open); setSettingsOpen(false) }} size="icon" variant="ghost"><Bell size={18} /><i className="notification-dot" /></Button>
              {notificationsOpen && <div className="small-popover notifications-popover"><div className="popover-title"><strong>Notifications</strong><Badge tone="accent">2 new</Badge></div><div className="notification-item"><Avatar name="Kartikey Singh" size="sm" /><p><strong>Kartikey Singh</strong> mentioned you in <b>#design-room</b><small>12 minutes ago</small></p><i /></div><div className="notification-item"><Avatar name="Aniket Vishwakarma" size="sm" /><p><strong>Aniket Vishwakarma</strong> shared an update in <b>#general</b><small>1 hour ago</small></p></div><button className="popover-footer" onClick={() => { setNotificationsOpen(false); notify.success('All caught up') }}>Mark all as read <Check size={14} /></button></div>}
            </div>
            <Button aria-expanded={settingsOpen} aria-label="Open settings" className="mobile-settings-trigger" onClick={() => { setSettingsOpen((open) => !open); setNotificationsOpen(false) }} size="icon" variant="ghost"><MoreHorizontal size={20} /></Button>
            <Avatar className="topbar-avatar" name="Kartikey Singh" size="sm" />
          </div>
        </header>

        {activeView === 'home' ? (
          <div className="dashboard-content">
            <div className="dashboard-greeting">
              <div><span className="eyebrow">MONDAY, SEPTEMBER 28</span><h1>Good morning, Alex <span>✳</span></h1><p>Here’s what’s happening with your team today.</p></div>
              <Button onClick={() => openRoom(rooms[0])}><MessageCircle size={16} /> Open a conversation</Button>
            </div>
            <div className="dashboard-grid">
              <Card className="welcome-card"><div className="welcome-card__copy"><Badge tone="accent"><Sparkles size={12} /> YOUR TEAM AT A GLANCE</Badge><h2>There’s good energy<br />in the room.</h2><p>Your team has shared 18 updates this week. Keep the momentum going.</p><Button onClick={() => openRoom(rooms[0])} size="sm" variant="secondary">See what’s new <ArrowUpRight size={14} /></Button></div><div className="welcome-card__art" aria-hidden="true"><div className="welcome-orbit welcome-orbit--one" /><div className="welcome-orbit welcome-orbit--two" /><div className="welcome-card__spark">✳</div><Avatar className="welcome-avatar welcome-avatar--one" name="Aniket Vishwakarma" size="md" /><Avatar className="welcome-avatar welcome-avatar--two" name="Kaif Shaikh" size="md" /><Avatar className="welcome-avatar welcome-avatar--three" name="Kartikey Singh" size="md" /></div></Card>
              <Card className="team-card"><div className="card-title-row"><div><span className="eyebrow">YOUR PEOPLE</span><h3>Team presence</h3></div><Users size={17} /></div><div className="team-presence"><div className="team-presence__avatars"><Avatar name="Aniket Vishwakarma" presence="online" /><Avatar name="Kaif Shaikh" presence="online" /><Avatar name="Kartikey Singh" presence="away" /><span>+9</span></div><strong>12 teammates</strong><small><i /> 8 online right now</small></div><div className="team-card__footer"><span>Most active</span><strong>Aisha, Theo & Rin</strong></div></Card>
              <Card className="activity-card"><div className="card-title-row"><div><span className="eyebrow">AROUND THE WORKSPACE</span><h3>Recent conversations</h3></div><Button aria-label="See all conversations" onClick={() => openRoom(rooms[0])} size="icon" variant="ghost"><ArrowUpRight size={17} /></Button></div><button className="activity-row" onClick={() => openRoom(rooms[0])}><span className="activity-icon activity-icon--purple"><Hash size={16} /></span><span className="activity-row__copy"><strong>#general</strong><span>Aisha: Morning, team! Hope everyone...</span></span><span className="activity-row__time">8m</span></button><button className="activity-row" onClick={() => openRoom(rooms[2])}><span className="activity-icon activity-icon--peach"><Hash size={16} /></span><span className="activity-row__copy"><strong>#design-room <Badge tone="warning">1 new</Badge></strong><span>Rin: Sharing the latest explorations...</span></span><span className="activity-row__time">12m</span></button><button className="activity-row" onClick={() => openRoom(rooms[1])}><span className="activity-icon activity-icon--mint"><Hash size={16} /></span><span className="activity-row__copy"><strong>#product-updates</strong><span>Theo: The settings refresh is in review...</span></span><span className="activity-row__time">1h</span></button><button className="activity-see-all" onClick={() => openRoom(rooms[0])}>Browse all rooms <ArrowUpRight size={14} /></button></Card>
              <Card className="schedule-card"><div className="card-title-row"><div><span className="eyebrow">COMING UP</span><h3>Your day, at a glance</h3></div><CalendarDays size={17} /></div><div className="schedule-item"><span className="schedule-item__time">11:30</span><span className="schedule-item__line" /><span><strong>Design check-in</strong><small><Users size={12} /> Aisha, Rin + you</small></span><ArrowUpRight size={14} /></div><div className="schedule-item"><span className="schedule-item__time">2:00</span><span className="schedule-item__line schedule-item__line--muted" /><span><strong>Weekly team sync</strong><small><Users size={12} /> Studio workspace</small></span><ArrowUpRight size={14} /></div><div className="schedule-note"><span>✳</span> A little time to focus, too.</div></Card>
            </div>
            <div className="dashboard-footnote"><span><i /> Your workspace is looking good</span><span>Made for the moments in between.</span></div>
          </div>
        ) : (
          <section aria-label={`${activeRoom.name} conversation`} className="chat-view">
            <header className="chat-header"><div className="chat-header__title"><span className="chat-room-icon">{activeRoom.kind === 'dm' ? <Avatar name={activeRoom.personName ?? activeRoom.name} presence="online" size="sm" /> : <Hash size={19} />}</span><div><h1>{activeRoom.kind === 'dm' ? activeRoom.name : activeRoom.name}</h1><p>{activeRoom.description}</p></div></div><div className="chat-header__actions">{activeRoom.kind === 'dm' ? <Badge tone="success"><span className="badge-dot" /> Online</Badge> : <><div className="chat-member-stack"><Avatar name="Aniket Vishwakarma" size="sm" /><Avatar name="Kaif Shaikh" size="sm" /><Avatar name="Kartikey Singh" size="sm" /><span>+{activeRoom.members - 3}</span></div><span className="chat-member-count"><Users size={14} /> {activeRoom.members}</span></>}<Button aria-label="More room actions" onClick={() => notify.info(activeRoom.kind === 'dm' ? `Message ${activeRoom.name}` : 'Room details', { description: activeRoom.kind === 'dm' ? 'This is a local demo direct message.' : `${activeRoom.members} teammates are in #${activeRoom.name}.` })} size="icon" variant="ghost"><MoreHorizontal size={18} /></Button></div></header>
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
            <form className="chat-composer" onSubmit={sendMessage}><div className="chat-composer__input"><textarea aria-label={`Message ${activeRoom.kind === 'dm' ? activeRoom.name : `#${activeRoom.name}`}`} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit() } }} placeholder={`Message ${activeRoom.kind === 'dm' ? activeRoom.name : `#${activeRoom.name}`}`} ref={composerRef} rows={1} value={draft} /><div className="chat-composer__actions"><span>Return to send · Shift + Return for a new line</span><Button aria-label="Add emoji" onClick={() => setDraft((value) => `${value}${value ? ' ' : ''}✨`)} size="icon" type="button" variant="ghost"><Smile size={17} /></Button><Button aria-label="Send message" disabled={!draft.trim()} size="icon" type="submit"><Send size={16} /></Button></div></div></form>
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
      {settingsOpen && <section aria-label="Your profile" className="profile-panel mobile-settings-panel">
        <div className="mobile-settings-panel__heading"><strong>Your profile</strong><Button aria-label="Close profile" onClick={() => { setSettingsOpen(false); setProfileEditing(false) }} size="icon" variant="ghost"><X size={17} /></Button></div>
        <div className="profile-card__hero">
          <label className="profile-card__avatar" title="Change avatar">
            <Avatar name={profileName} size="lg" presence="online" src={profileAvatar} />
            <span><Plus size={13} /> Change</span>
            <input accept="image/*" onChange={handleAvatarChange} type="file" />
          </label>
          <div><strong>{profileName}</strong><small>@kartikey · Online</small></div>
        </div>
        {profileEditing ? (
          <div className="profile-form">
            <Input label="Display name" onChange={(event) => setProfileName(event.target.value)} value={profileName} />
            <Input label="Role" onChange={(event) => setProfileRole(event.target.value)} value={profileRole} />
            <label className="profile-form__label" htmlFor="profile-bio">Bio</label>
            <textarea id="profile-bio" onChange={(event) => setProfileBio(event.target.value)} value={profileBio} />
            <Button onClick={() => { setProfileEditing(false); notify.success('Profile updated', { description: 'Your profile changes are saved locally.' }) }} size="sm"><Check size={14} /> Save changes</Button>
          </div>
        ) : (
          <>
            <div className="profile-card__details"><div><span>Role</span><strong>{profileRole}</strong></div><div><span>Email</span><strong>kartikey@studio.co</strong></div><div><span>Location</span><strong>Bengaluru, India</strong></div><div><span>Time zone</span><strong>GMT+5:30</strong></div></div>
            <p className="profile-card__bio">{profileBio}</p>
            <Button className="profile-card__edit" onClick={() => setProfileEditing(true)} size="sm" variant="secondary"><Settings size={14} /> Edit profile</Button>
          </>
        )}
        <div className="profile-card__section"><span>Appearance</span><div aria-label="Color theme" className="theme-control" role="group">{(['light', 'dark', 'system'] as const).map((theme) => <button aria-pressed={preference === theme} key={theme} onClick={() => setPreference(theme)}>{theme === 'light' ? <Sun size={14} /> : theme === 'dark' ? <Moon size={14} /> : <Command size={14} />}{theme}</button>)}</div></div>
        <button className="settings-logout" onClick={() => { setSignedIn(false); setSettingsOpen(false) }}><LogOut size={14} /> Sign out</button>
      </section>}
      {feedbackOpen && <div className="feedback-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setFeedbackOpen(false) }}>
        <section aria-label="Help and feedback" aria-modal="true" className="feedback-dialog" role="dialog">
          <div className="feedback-dialog__heading"><div><span className="eyebrow">SUPPORT</span><h2>How can we help?</h2><p>Tell us what happened and we’ll use it to make gRPCTalk better.</p></div><Button aria-label="Close feedback" onClick={() => setFeedbackOpen(false)} size="icon" variant="ghost"><X size={17} /></Button></div>
          <form onSubmit={submitFeedback}>
            <div className="feedback-types" aria-label="Feedback type" role="group">{['Feedback', 'Bug report', 'Question'].map((type) => <button aria-pressed={feedbackType === type} key={type} onClick={() => setFeedbackType(type)} type="button">{type}</button>)}</div>
            <label className="feedback-field"><span>Your message</span><textarea aria-label="Your message" minLength={10} onChange={(event) => setFeedbackMessage(event.target.value)} placeholder="Share an idea, report a problem, or ask a question..." required value={feedbackMessage} /></label>
            <label className="feedback-field"><span>Email for follow-up <small>Optional</small></span><Input aria-label="Email for follow-up" onChange={(event) => setFeedbackEmail(event.target.value)} type="email" value={feedbackEmail} /></label>
            <div className="feedback-dialog__footer"><span>We’ll only use this to respond to your request.</span><Button disabled={feedbackMessage.trim().length < 10} type="submit">Send feedback <ArrowUpRight size={15} /></Button></div>
          </form>
        </section>
      </div>}
      {crudOpen && <div className="feedback-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setCrudOpen(null) }}>
        <section aria-label={`${editingId ? 'Edit' : 'Create'} ${crudOpen}`} aria-modal="true" className="crud-dialog" role="dialog">
          <div className="feedback-dialog__heading"><div><span className="eyebrow">{editingId ? 'EDIT' : 'CREATE'}</span><h2>{editingId ? 'Update' : 'Create'} {crudOpen === 'room' ? 'room' : 'person'}</h2><p>{crudOpen === 'room' ? 'Set up a shared space for your team.' : 'Add a teammate to your workspace directory.'}</p></div><Button aria-label="Close" onClick={() => setCrudOpen(null)} size="icon" variant="ghost"><X size={17} /></Button></div>
          <form onSubmit={submitCrud}>
            <Input autoFocus label={crudOpen === 'room' ? 'Room name' : 'Full name'} onChange={(event) => setCrudName(event.target.value)} placeholder={crudOpen === 'room' ? 'e.g. marketing' : 'e.g. Aisha Khan'} required value={crudName} />
            {crudOpen === 'room' ? <Input label="Description" onChange={(event) => setCrudDescription(event.target.value)} placeholder="What is this room for?" value={crudDescription} /> : <><Input label="Role" onChange={(event) => setCrudDetail(event.target.value)} placeholder="e.g. Engineering" value={crudDetail} /><label className="feedback-field"><span>Presence</span><select onChange={(event) => setCrudPresence(event.target.value as Teammate['presence'])} value={crudPresence}><option value="online">Online</option><option value="away">Away</option><option value="offline">Offline</option></select></label></>}
            <div className="feedback-dialog__footer"><span>Changes are saved locally in this demo.</span><Button disabled={!crudName.trim()} type="submit">{editingId ? 'Save changes' : `Create ${crudOpen}`} <Check size={15} /></Button></div>
          </form>
        </section>
      </div>}
    </main>
  )
}
