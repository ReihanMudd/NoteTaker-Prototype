import { useEffect, useMemo, useState } from 'react'
import type { ReactElement } from 'react'
import { Clock3, FileText, LayoutDashboard, Mic, PanelLeft, Play, Search, Settings, Sparkles, Square, Waves } from 'lucide-react'
import type { Meeting, MeetingSummary } from '@shared/types'

function formatDate(date: string): string {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date))
}

function formatDuration(seconds: number): string {
  const minutes = Math.max(1, Math.round(seconds / 60))
  return `${minutes} min`
}

function App(): ReactElement {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [activeMeeting, setActiveMeeting] = useState<Meeting | null>(null)
  const [notes, setNotes] = useState('')
  const [summary, setSummary] = useState<MeetingSummary | undefined>()
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isEnhancing, setIsEnhancing] = useState(false)

  useEffect(() => {
    window.meetingMind.meetings.list().then((items) => {
      setMeetings(items)
      setIsLoading(false)
    })
  }, [])

  const filteredMeetings = useMemo(
    () => meetings.filter((meeting) => meeting.title.toLowerCase().includes(search.toLowerCase())),
    [meetings, search],
  )

  async function startMeeting(): Promise<void> {
    const meeting = await window.meetingMind.meetings.start({ title: 'New meeting' })
    setActiveMeeting(meeting)
    setNotes('')
    setSummary(undefined)
  }

  async function stopMeeting(): Promise<void> {
    if (!activeMeeting) return
    const completed = await window.meetingMind.meetings.stop(activeMeeting.id, notes)
    setMeetings((current) => [completed, ...current.filter((meeting) => meeting.id !== completed.id)])
    setActiveMeeting(completed)
  }

  async function enhanceNotes(): Promise<void> {
    if (!activeMeeting) return
    setIsEnhancing(true)
    const nextSummary = await window.meetingMind.meetings.enhance({
      meetingId: activeMeeting.id,
      notes,
      transcript: activeMeeting.transcript,
    })
    setSummary(nextSummary)
    setMeetings((current) => current.map((meeting) => meeting.id === activeMeeting.id ? { ...meeting, summary: nextSummary } : meeting))
    setIsEnhancing(false)
  }

  function openMeeting(meeting: Meeting): void {
    setActiveMeeting(meeting)
    setNotes(meeting.notes)
    setSummary(meeting.summary)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Waves size={18} /></div>
          <div>
            <strong>MeetingMind</strong>
            <span>AI meeting assistant</span>
          </div>
          <button className="icon-button sidebar-toggle" title="Collapse sidebar"><PanelLeft size={16} /></button>
        </div>

        <button className="new-meeting-button" onClick={startMeeting}><Mic size={17} /> Start meeting</button>

        <nav className="primary-nav" aria-label="Primary navigation">
          <button className="nav-item active"><LayoutDashboard size={17} /> Home</button>
          <button className="nav-item"><FileText size={17} /> All meetings</button>
          <button className="nav-item"><Settings size={17} /> Settings</button>
        </nav>

        <div className="sidebar-footer">
          <div className="privacy-note"><span className="status-dot" /> Audio is only captured during a meeting</div>
          <span className="version-label">Skeleton v0.1</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Personal workspace</p>
            <h1>{activeMeeting ? activeMeeting.title : 'Your meetings'}</h1>
          </div>
          <div className="topbar-actions">
            <label className="search-box">
              <Search size={16} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search meetings" />
            </label>
            <div className="avatar">R</div>
          </div>
        </header>

        {activeMeeting ? (
          <MeetingWorkspace
            meeting={activeMeeting}
            notes={notes}
            summary={summary}
            isEnhancing={isEnhancing}
            onNotesChange={setNotes}
            onStop={stopMeeting}
            onEnhance={enhanceNotes}
            onBack={() => setActiveMeeting(null)}
          />
        ) : (
          <HomeWorkspace
            meetings={filteredMeetings}
            isLoading={isLoading}
            onStart={startMeeting}
            onOpen={openMeeting}
          />
        )}
      </main>
    </div>
  )
}

function HomeWorkspace({ meetings, isLoading, onStart, onOpen }: { meetings: Meeting[]; isLoading: boolean; onStart: () => void; onOpen: (meeting: Meeting) => void }): ReactElement {
  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <span className="hero-kicker"><Sparkles size={15} /> Capture the conversation, keep the signal</span>
          <h2>Turn rough notes into useful meeting memory.</h2>
          <p>Record a meeting, add the things you care about, and let MeetingMind organize the transcript into decisions and follow-ups.</p>
          <button className="primary-button" onClick={onStart}><Play size={16} fill="currentColor" /> Start a new meeting</button>
        </div>
        <div className="hero-illustration"><Waves size={82} strokeWidth={1.2} /></div>
      </section>

      <section className="section-heading">
        <div><p className="eyebrow">Your library</p><h2>Recent meetings</h2></div>
        <span className="muted-label">{meetings.length} saved</span>
      </section>

      <section className="meeting-grid">
        {isLoading ? <div className="empty-state">Loading your meeting library…</div> : null}
        {!isLoading && meetings.length === 0 ? <div className="empty-state">No meetings match your search.</div> : null}
        {meetings.map((meeting) => (
          <button className="meeting-card" key={meeting.id} onClick={() => onOpen(meeting)}>
            <div className="meeting-card-top"><span className={`meeting-status ${meeting.status}`}>{meeting.status === 'completed' ? 'Completed' : meeting.status}</span><FileText size={17} /></div>
            <h3>{meeting.title}</h3>
            <p>{meeting.summary?.summary ?? 'No AI notes yet. Open this meeting to continue.'}</p>
            <div className="meeting-card-meta"><span>{formatDate(meeting.startedAt)}</span><span><Clock3 size={14} /> {formatDuration(meeting.durationSeconds)}</span></div>
          </button>
        ))}
      </section>
    </div>
  )
}

function MeetingWorkspace({ meeting, notes, summary, isEnhancing, onNotesChange, onStop, onEnhance, onBack }: { meeting: Meeting; notes: string; summary?: MeetingSummary; isEnhancing: boolean; onNotesChange: (value: string) => void; onStop: () => void; onEnhance: () => void; onBack: () => void }): ReactElement {
  const isRecording = meeting.status === 'recording'

  return (
    <div className="page-stack meeting-page">
      <div className="meeting-toolbar">
        <button className="back-button" onClick={onBack}>← Back to meetings</button>
        <div className={`recording-pill ${isRecording ? 'recording' : ''}`}><span className="status-dot" /> {isRecording ? 'Recording' : 'Meeting saved'}</div>
        {isRecording ? <button className="stop-button" onClick={onStop}><Square size={14} fill="currentColor" /> Stop meeting</button> : <button className="primary-button compact" onClick={onEnhance} disabled={isEnhancing}><Sparkles size={15} /> {isEnhancing ? 'Enhancing…' : 'Enhance notes'}</button>}
      </div>

      <section className="meeting-layout">
        <div className="notes-panel panel">
          <div className="panel-heading"><div><p className="eyebrow">Your input</p><h2>My notes</h2></div><span className="you-badge">YOU</span></div>
          <textarea value={notes} onChange={(event) => onNotesChange(event.target.value)} placeholder="Capture rough thoughts, questions, deadlines, and names…" />
          <div className="panel-hint">Your notes guide what the AI pays attention to.</div>
        </div>

        <div className="transcript-panel panel">
          <div className="panel-heading"><div><p className="eyebrow">Audio pipeline</p><h2>Live transcript</h2></div><Waves size={19} className={isRecording ? 'pulse-icon' : ''} /></div>
          {meeting.transcript.length === 0 && isRecording ? <div className="transcript-empty"><Mic size={26} /><p>Listening for speech…</p><span>Transcript segments will appear here when the speech-to-text adapter is connected.</span></div> : <div className="transcript-list">{meeting.transcript.map((segment) => <div className="transcript-segment" key={segment.id}><span>{segment.speaker ?? 'Speaker'}</span><p>{segment.text}</p></div>)}</div>}
        </div>
      </section>

      {summary ? <SummaryPanel summary={summary} /> : <div className="future-state"><Sparkles size={18} /><div><strong>AI-enhanced notes will appear here</strong><span>Stop the meeting, then enhance your notes to generate a summary, decisions, and action items.</span></div></div>}
    </div>
  )
}

function SummaryPanel({ summary }: { summary: MeetingSummary }): ReactElement {
  return (
    <section className="summary-panel panel">
      <div className="panel-heading"><div><p className="eyebrow">AI output</p><h2>Meeting summary</h2></div><span className="ai-badge"><Sparkles size={13} /> AI</span></div>
      <p className="summary-copy">{summary.summary}</p>
      <div className="summary-columns">
        <SummaryList title="Key points" items={summary.keyPoints} />
        <SummaryList title="Decisions" items={summary.decisions} />
        <SummaryList title="Open questions" items={summary.openQuestions} />
        <div><h3>Action items</h3>{summary.actionItems.length === 0 ? <p className="muted-copy">No action items yet.</p> : summary.actionItems.map((item) => <label className="action-item" key={item.id}><input type="checkbox" checked={item.completed} readOnly /><span>{item.task}<small>{item.owner ?? 'Unassigned'}{item.deadline ? ` · ${item.deadline}` : ''}</small></span></label>)}</div>
      </div>
    </section>
  )
}

function SummaryList({ title, items }: { title: string; items: string[] }): ReactElement {
  return <div><h3>{title}</h3>{items.length === 0 ? <p className="muted-copy">Nothing extracted yet.</p> : <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>}</div>
}

export default App
