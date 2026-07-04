import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './Session.css'

const STEPS = [
  'Identify coefficients',
  'Compute the discriminant',
  'Apply the formula',
  'Interpret the roots',
]

function PanelToggleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 4v16" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function PaperclipIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M17.5 8.5 9.7 16.3a3.2 3.2 0 0 1-4.5-4.5l8.1-8.1a2.2 2.2 0 0 1 3.1 3.1l-7.8 7.8a1.1 1.1 0 0 1-1.6-1.6l6.9-6.9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HintIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.5.36.8.95.8 1.6v.5h5.4v-.5c0-.65.3-1.24.8-1.6A6 6 0 0 0 12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 19V5M12 5l-6 6M12 5l6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="chevron">
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function RetryIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 12a9 9 0 1 1 2.6 6.3M3 12V6m0 6h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const INITIAL_MESSAGES = [
  {
    id: 'm1',
    kind: 'tutor',
    tag: 'Tutor · Analogy-first',
    text: "Let's treat the quadratic formula like a recipe — a, b, and c are just the ingredients you plug into a fixed set of steps.",
  },
  {
    id: 't1',
    kind: 'toast',
    fn: 'recall',
    text: 'retrieved 4 past sessions on factoring before choosing this analogy',
  },
  {
    id: 'm2',
    kind: 'tutor',
    text: 'Given x squared − 5x + 6 = 0 — what are a, b, and c?',
  },
]

// Scripted tutor turns, keyed by how many answers the student has sent so
// far. Stands in for the real backend response until that's wired up —
// each turn still drives the same lifecycle toasts / mastery / misconception
// state updates the real integration will produce.
const SCRIPT = [
  {
    tutorText: 'Exactly right.',
    masteryGain: 8,
    toast: { fn: 'remember', text: 'logged correct coefficient identification' },
    nextQuestion:
      "Now plug them into −b ± √(b squared − 4ac) over 2a — what's the discriminant?",
  },
  {
    tutorText: 'Close, but check that middle sign again.',
    misconception: 'Dropped the negative on −4ac — you added instead of subtracting.',
    toast: { fn: 'improve', text: 'reweighted strategy after a sign-error pattern (2nd occurrence)' },
    addMisconception: 'Drops negative sign in −4ac',
  },
  {
    tutorText: "Let's try that once more — recompute b² − 4ac carefully.",
    toast: { fn: 'remember', text: 'logged retry attempt' },
  },
]

const INITIAL_MASTERY = [
  { name: 'Factoring', pct: 92 },
  { name: 'Quadratic Formula', pct: 61 },
  { name: 'Completing the Square', pct: 24 },
]

const STRATEGIES = [
  { name: 'Analogy-first', pct: 78, sessions: 12, active: true },
  { name: 'Worked-example', pct: 64, sessions: 9, active: false },
  { name: 'Question-first', pct: 55, sessions: 6, active: false },
]

const INITIAL_MISCONCEPTIONS = [
  { text: 'Confuses slope with intercept', status: 'resolved' },
  { text: 'Thinks √ removes negativity', status: 'resolved' },
]

const INITIAL_LOG = [
  { time: '14:02:11', fn: 'recall', text: 'retrieved factoring history' },
]

const INITIAL_COUNTERS = { recall: 14, remember: 22, improve: 3, forget: 2 }

const CHAT_HISTORY = [
  { id: 1, title: 'Session 1 — Factoring basics', date: 'Jun 28' },
  { id: 2, title: 'Session 2 — Linear equations', date: 'Jul 1' },
  { id: 3, title: 'Session 3 — Quadratic formula', date: 'Jul 4', current: true },
]

const masteryLevel = (pct) => (pct >= 70 ? 'good' : pct >= 40 ? 'warn' : 'bad')

const nowStamp = () =>
  new Date().toLocaleTimeString('en-GB', { hour12: false })

const shortTime = () =>
  new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

function Session() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [turn, setTurn] = useState(0)
  const [mastery, setMastery] = useState(INITIAL_MASTERY)
  const [misconceptions, setMisconceptions] = useState(INITIAL_MISCONCEPTIONS)
  const [log, setLog] = useState(INITIAL_LOG)
  const [counters, setCounters] = useState(INITIAL_COUNTERS)
  const [dashboardOpen, setDashboardOpen] = useState(
    () => !window.matchMedia('(max-width: 880px)').matches,
  )
  const transcriptRef = useRef(null)

  useEffect(() => {
    const el = transcriptRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  const pushLog = (fn, text) => {
    setLog((prev) => [...prev, { time: nowStamp(), fn, text }])
    setCounters((prev) => ({ ...prev, [fn]: prev[fn] + 1 }))
  }

  const handleSend = () => {
    const text = input.trim()
    if (!text || isThinking) return

    const studentId = `s-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      { id: studentId, kind: 'student', text, time: shortTime() },
    ])
    setInput('')
    setIsThinking(true)

    const step = SCRIPT[Math.min(turn, SCRIPT.length - 1)]

    window.setTimeout(() => {
      const toastId = `toast-${Date.now()}`
      setMessages((prev) => [
        ...prev,
        { id: toastId, kind: 'toast', fn: step.toast.fn, text: step.toast.text },
      ])
      pushLog(step.toast.fn, step.toast.text)
    }, 500)

    window.setTimeout(() => {
      const tutorId = `t-${Date.now()}`
      setMessages((prev) => [
        ...prev,
        {
          id: tutorId,
          kind: 'tutor',
          text: step.tutorText,
          masteryGain: step.masteryGain,
          misconception: step.misconception,
        },
      ])

      if (step.masteryGain) {
        setMastery((prev) =>
          prev.map((m) =>
            m.name === 'Quadratic Formula'
              ? { ...m, pct: Math.min(100, m.pct + step.masteryGain) }
              : m,
          ),
        )
      }

      if (step.addMisconception) {
        setMisconceptions((prev) => [
          { text: step.addMisconception, status: 'active' },
          ...prev,
        ])
      }

      if (step.nextQuestion) {
        window.setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { id: `q-${Date.now()}`, kind: 'tutor', text: step.nextQuestion },
          ])
        }, 500)
      }

      setIsThinking(false)
      setTurn((prev) => prev + 1)
    }, 1300)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  const triggerImprove = () => {
    const text = 'manually triggered from dev panel'
    setMessages((prev) => [
      ...prev,
      { id: `dev-${Date.now()}`, kind: 'toast', fn: 'improve', text },
    ])
    pushLog('improve', text)
  }

  const copyText = (text) => {
    navigator.clipboard?.writeText(text)
  }

  const stepIndex = Math.min(turn, STEPS.length - 1)

  return (
    <div className="session-page">
      <div className="topbar">
        <Link to="/" className="brand">
          continuum
        </Link>
        <div className="ctx-item">
          Concept <strong>Quadratic Formula</strong>
        </div>
        <span className="badge">◆ Analogy-first</span>
        <div className="ctx-item">
          Session <strong>3</strong>
        </div>
        <div className="memory-live">
          <span className="pulse-dot" /> Memory active
        </div>
        <button
          type="button"
          className="icon-btn dash-toggle"
          onClick={() => setDashboardOpen((open) => !open)}
          aria-label={dashboardOpen ? 'Hide knowledge map' : 'Show knowledge map'}
          aria-pressed={dashboardOpen}
        >
          <PanelToggleIcon />
        </button>
      </div>

      <div className={`workspace ${dashboardOpen ? '' : 'dash-hidden'}`}>
        <div className="chat-col">
          <div className="transcript" ref={transcriptRef}>
            {messages.map((msg) => {
              if (msg.kind === 'toast') {
                return (
                  <div key={msg.id} className="status-line">
                    <span className="status-dot" />
                    <span className="fn">{msg.fn}()</span> {msg.text}
                  </div>
                )
              }

              if (msg.kind === 'student') {
                return (
                  <div key={msg.id} className="msg student">
                    <div className="bubble">{msg.text}</div>
                    <span className="msg-time">{msg.time}</span>
                  </div>
                )
              }

              return (
                <div key={msg.id} className="msg tutor">
                  {msg.tag && <span className="msg-tag">{msg.tag}</span>}
                  <div className="tutor-text">{msg.text}</div>
                  {msg.masteryGain && (
                    <span className="mastery-gain">
                      ▲ +{msg.masteryGain}% mastery — Quadratic Formula
                    </span>
                  )}
                  {msg.misconception && (
                    <div className="misconception-chip">
                      <b>Misconception</b>
                      <span>{msg.misconception}</span>
                    </div>
                  )}
                  <div className="msg-toolbar">
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => copyText(msg.text)}
                      aria-label="Copy message"
                    >
                      <CopyIcon />
                    </button>
                    <button type="button" className="icon-btn" aria-label="Retry">
                      <RetryIcon />
                    </button>
                  </div>
                </div>
              )
            })}
            {isThinking && (
              <div className="status-line">
                <span className="status-dot spin" />
                Thinking about the concept…
              </div>
            )}
          </div>

          <div className="composer">
            <div className="step-progress">
              <span className="step-label">
                Step {stepIndex + 1} of {STEPS.length}: {STEPS[stepIndex]}
              </span>
              <div className="step-dashes">
                {STEPS.map((label, i) => (
                  <span key={label} className={`dash ${i <= stepIndex ? 'done' : ''}`} />
                ))}
              </div>
            </div>

            <div className="composer-bar">
              <button type="button" className="icon-btn ghost" aria-label="Attach">
                <PaperclipIcon />
              </button>
              <textarea
                placeholder="How can I help you?"
                rows="1"
                value={input}
                disabled={isThinking}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button type="button" className="icon-btn ghost" aria-label="Hint">
                <HintIcon />
              </button>
              <button
                type="button"
                className="send-circle"
                onClick={handleSend}
                disabled={isThinking || !input.trim()}
                aria-label="Send"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>

        {dashboardOpen && (
          <div className="dash-backdrop" onClick={() => setDashboardOpen(false)} />
        )}

        <div className={`dash-col ${dashboardOpen ? '' : 'dash-closed'}`}>
         <div className="dash-panel">
          <details className="panel">
            <summary>
              <h2>Chat History</h2>
              <ChevronIcon />
            </summary>
            <div className="panel-body">
              {CHAT_HISTORY.map((item) => (
                <div className={`history-item ${item.current ? 'current' : ''}`} key={item.id}>
                  <span>{item.title}</span>
                  <span className="history-date">{item.date}</span>
                </div>
              ))}
            </div>
          </details>

          <details className="panel" open>
            <summary>
              <h2>Mastery Map</h2>
              <ChevronIcon />
            </summary>
            <div className="panel-body">
              {mastery.map((m) => (
                <div className="mastery-row" key={m.name}>
                  <span className="label">{m.name}</span>
                  <div className="mastery-track">
                    <div
                      className={`mastery-fill ${masteryLevel(m.pct)}`}
                      style={{ width: `${m.pct}%` }}
                    />
                  </div>
                  <span className="mastery-pct">{m.pct}%</span>
                </div>
              ))}
              <div className="gate-msg">
                🔒 Reach 70% on Quadratic Formula to unlock Completing the Square.
              </div>
            </div>
          </details>

          <details className="panel" open>
            <summary>
              <h2>Strategy Performance</h2>
              <ChevronIcon />
            </summary>
            <div className="panel-body">
              {STRATEGIES.map((s) => (
                <div className={`strategy-row ${s.active ? 'active' : ''}`} key={s.name}>
                  <span className="s-name">
                    {s.active && <span className="active-dot" />}
                    {s.name}
                  </span>
                  <span className="s-stat">
                    {s.pct}% · {s.sessions} sessions
                  </span>
                </div>
              ))}
            </div>
          </details>

          <details className="panel" open>
            <summary>
              <h2>Misconceptions</h2>
              <ChevronIcon />
            </summary>
            <div className="panel-body">
              {misconceptions.map((m) => (
                <div className={`miscon-item ${m.status}`} key={m.text}>
                  <span>{m.text}</span>
                  <span className="miscon-status">{m.status}</span>
                </div>
              ))}
            </div>
          </details>

          <details className="panel" open>
            <summary>
              <h2>Memory Lifecycle Log</h2>
              <ChevronIcon />
            </summary>
            <div className="panel-body">
              {log.map((entry, index) => (
                <div className="log-item" key={`${entry.time}-${index}`}>
                  <span className="log-time">{entry.time}</span>
                  <span className={`log-fn ${entry.fn}`}>{entry.fn}()</span>
                  <span>{entry.text}</span>
                </div>
              ))}
            </div>
          </details>

          <details className="panel dev-panel" open>
            <summary>
              <span className="dev-label">Dev only — hidden in production</span>
              <ChevronIcon />
            </summary>
            <div className="panel-body">
              <div className="dev-counters">
                {Object.entries(counters).map(([fn, count]) => (
                  <div className="dev-counter" key={fn}>
                    <div className="n">{count}</div>
                    <div className="l">{fn}</div>
                  </div>
                ))}
              </div>
              <button className="dev-btn" type="button" onClick={triggerImprove}>
                Trigger improve() manually
              </button>
            </div>
          </details>
         </div>
        </div>
      </div>
    </div>
  )
}

export default Session
