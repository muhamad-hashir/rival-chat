import { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { auth, db } from '../firebase.js'
import { set, ref } from 'firebase/database'
import { friendlyAuthError } from '../utils.js'
import { Logo, IconChats, IconGamepad, IconTrophy } from './Icons.jsx'

function FloatingArt() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* chat bubble */}
      <div className="absolute left-[8%] top-[16%] animate-floaty" style={{ '--tilt': '-8deg' }}>
        <svg width="90" height="72" viewBox="0 0 90 72" fill="none">
          <path
            d="M45 4C23 4 8 17 8 33c0 8.5 4.3 16 11.2 21.2-.5 3.8-2.1 8.2-5.4 11.6 6.2-.7 11.5-3 15.2-5.7 3.4 1.1 7.3 1.8 11.4 1.8 22 0 37-13 37-29S67 4 45 4z"
            fill="#00a884" fillOpacity="0.14" stroke="#00a884" strokeOpacity="0.55" strokeWidth="2.5"
          />
          <circle cx="30" cy="33" r="3.4" fill="#00a884" />
          <circle cx="45" cy="33" r="3.4" fill="#00a884" />
          <circle cx="60" cy="33" r="3.4" fill="#00a884" />
        </svg>
      </div>
      {/* tic tac toe */}
      <div className="absolute right-[10%] top-[12%] animate-floaty" style={{ '--tilt': '7deg', animationDelay: '-1.2s' }}>
        <svg width="86" height="86" viewBox="0 0 86 86" fill="none">
          <path d="M30 8v70M56 8v70M8 30h70M8 56h70" stroke="#f5c33b" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
          <path d="M14 14l12 12M26 14L14 26" stroke="#ff6b6b" strokeWidth="4" strokeLinecap="round" />
          <circle cx="43" cy="43" r="9" stroke="#53bdeb" strokeWidth="4" />
          <path d="M62 62l12 12M74 62L62 74" stroke="#ff6b6b" strokeWidth="4" strokeLinecap="round" />
          <circle cx="43" cy="70" r="9" stroke="#00d9a6" strokeWidth="4" />
        </svg>
      </div>
      {/* connect four disc */}
      <div className="absolute left-[14%] bottom-[18%] animate-floaty" style={{ '--tilt': '10deg', animationDelay: '-2.4s' }}>
        <svg width="84" height="84" viewBox="0 0 84 84" fill="none">
          <defs>
            <radialGradient id="disc-g" cx="0.35" cy="0.3" r="1">
              <stop offset="0" stopColor="#ffd9a8" />
              <stop offset="0.55" stopColor="#f5c33b" />
              <stop offset="1" stopColor="#b8860b" />
            </radialGradient>
          </defs>
          <rect x="4" y="4" width="76" height="76" rx="16" fill="#2563eb" fillOpacity="0.18" stroke="#53bdeb" strokeOpacity="0.5" strokeWidth="2.5" />
          <circle cx="42" cy="42" r="22" fill="url(#disc-g)" />
          <ellipse cx="34" cy="33" rx="7" ry="5" fill="#ffffff" fillOpacity="0.45" />
        </svg>
      </div>
      {/* trophy */}
      <div className="absolute right-[16%] bottom-[14%] animate-floaty" style={{ '--tilt': '-10deg', animationDelay: '-3.4s' }}>
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="#00d9a6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M27 68h26M40 54v14" strokeOpacity="0.55" />
          <path d="M24 14h32v18a16 16 0 0 1-32 0z" fill="#00d9a6" fillOpacity="0.14" />
          <path d="M24 20H14a4 4 0 0 0-4 4c0 8 6.5 12 14 13.5M56 20h10a4 4 0 0 1 4 4c0 8-6.5 12-14 13.5" strokeOpacity="0.55" />
        </svg>
      </div>
      {/* dice */}
      <div className="absolute left-[45%] top-[4%] animate-floaty" style={{ '--tilt': '14deg', animationDelay: '-4.1s' }}>
        <svg width="58" height="58" viewBox="0 0 58 58" fill="none">
          <rect x="6" y="6" width="46" height="46" rx="12" fill="#53bdeb" fillOpacity="0.12" stroke="#53bdeb" strokeOpacity="0.5" strokeWidth="2.5" />
          <circle cx="20" cy="20" r="4" fill="#53bdeb" />
          <circle cx="38" cy="38" r="4" fill="#53bdeb" />
          <circle cx="38" cy="20" r="4" fill="#53bdeb" />
        </svg>
      </div>
    </div>
  )
}

export default function AuthScreen() {
  const [mode, setMode] = useState('login') // login | signup
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your name.')
      return
    }
    setBusy(true)
    try {
      if (mode === 'signup') {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(result.user, { displayName: name.trim() })
        await set(ref(db, `users/${result.user.uid}`), {
          uid: result.user.uid,
          username: name.trim(),
          email,
          createdAt: Date.now(),
        })
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      setError(friendlyAuthError(err))
    } finally {
      setBusy(false)
    }
  }

  const inputCls =
    'w-full rounded-xl border border-line bg-elev/60 px-4 py-3 text-[15px] placeholder:text-muted/70 transition focus:border-teal focus:ring-4 focus:ring-teal/15'

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-gradient-to-b from-ink via-[#0d1b21] to-ink p-4">
      <FloatingArt />

      <div className="relative z-10 w-full max-w-[420px] animate-fade-up">
        <div className="rounded-3xl border border-line/70 bg-panel/80 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="mb-7 flex flex-col items-center text-center">
            <Logo size={64} className="drop-shadow-[0_8px_24px_rgba(0,168,132,0.4)]" />
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight">RivalChat</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <IconGamepad size={15} className="text-teal" />
              Chat with friends. Beat them at games.
            </p>
          </div>

          {/* segmented control */}
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-elev p-1">
            {['login', 'signup'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError('') }}
                className={`rounded-lg py-2 text-sm font-semibold transition ${
                  mode === m ? 'bg-teal text-ink shadow' : 'text-muted hover:text-cream'
                }`}
              >
                {m === 'login' ? 'Log in' : 'Sign up'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="flex flex-col gap-3">
            {mode === 'signup' && (
              <input className={inputCls} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            )}
            <input className={inputCls} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
            <input className={inputCls} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} required />

            {error && (
              <p className="animate-pop rounded-xl border border-rose/30 bg-rose/10 px-4 py-2.5 text-sm text-rose">{error}</p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-teal py-3 font-bold text-ink transition hover:bg-[#00c495] active:scale-[0.99] disabled:opacity-60"
            >
              {busy ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
              ) : (
                <>
                  <IconChats size={17} />
                  {mode === 'login' ? 'Log in' : 'Create account'}
                </>
              )}
            </button>
          </form>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-muted/70">
            <IconTrophy size={13} /> First to three wins the RPS crown
          </p>
        </div>
      </div>
    </div>
  )
}
