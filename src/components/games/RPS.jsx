import { useGameState, useJoinGame, updateGame } from '../../hooks/useGame.js'
import { ref, set } from 'firebase/database'
import { db } from '../../firebase.js'
import Avatar from '../Avatar.jsx'
import { IconRefresh, IconTrophy } from '../Icons.jsx'

/* ---------- hand-drawn choice icons ---------- */

export function ChoiceIcon({ choice, size = 56, className = '' }) {
  if (choice === 'rock') {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        <path
          d="M12 40c-3-8 1-17 9-19 2-6 10-8 14-4 5-4 13-1 14 6 6 1 8 8 5 13-3 6-10 9-17 9H18c-3 0-5-2-6-5z"
          fill="#94a3b8" stroke="#cbd5e1" strokeWidth="2.5"
        />
        <path d="M21 27l6 6M34 22l3 8" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="26" cy="26" rx="5" ry="3" fill="#e2e8f0" opacity="0.5" transform="rotate(-20 26 26)" />
      </svg>
    )
  }
  if (choice === 'paper') {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        <path d="M16 8h22l10 10v38a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2.5" />
        <path d="M38 8v10h10" stroke="#94a3b8" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M20 28h24M20 36h24M20 44h15" stroke="#94a3b8" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    )
  }
  if (choice === 'scissors') {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        <path d="M20 10l24 32M44 10L20 42" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
        <circle cx="17" cy="49" r="7" stroke="#cbd5e1" strokeWidth="4" />
        <circle cx="47" cy="49" r="7" stroke="#cbd5e1" strokeWidth="4" />
        <circle cx="32" cy="26" r="2.4" fill="#f8fafc" />
      </svg>
    )
  }
  // hidden
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <rect x="8" y="8" width="48" height="48" rx="12" fill="#202c33" stroke="#3b4d59" strokeWidth="2.5" strokeDasharray="6 5" />
      <text x="32" y="41" textAnchor="middle" fontSize="26" fontWeight="800" fill="#8696a0">?</text>
    </svg>
  )
}

const LABEL = { rock: 'Rock', paper: 'Paper', scissors: 'Scissors' }
const BEATS = { rock: 'scissors', paper: 'rock', scissors: 'paper' }

export default function RPS({ chatId, me, friend }) {
  const data = useGameState('rps', chatId)

  useJoinGame('rps', chatId, ['p1', 'p2'])

  const players = data?.players || {}
  const mySlot = players.p1 === me.uid ? 'p1' : players.p2 === me.uid ? 'p2' : null
  const oppSlot = mySlot === 'p1' ? 'p2' : 'p1'
  const choices = data?.choices || {}
  const score = data?.score || { p1: 0, p2: 0 }
  const matchWinner = data?.matchWinner || ''

  const myChoice = mySlot ? choices[mySlot] : null
  const oppChoice = oppSlot ? choices[oppSlot] : null
  const revealed = Boolean(myChoice) && Boolean(oppChoice)

  // resolve round: only p1 writes (same as original app)
  if (revealed && mySlot === 'p1' && !matchWinner) {
    const result = myChoice === oppChoice ? 'draw' : BEATS[choices.p1] === choices.p2 ? 'p1' : 'p2'
    setTimeout(() => {
      const newScore = {
        p1: (score.p1 || 0) + (result === 'p1' ? 1 : 0),
        p2: (score.p2 || 0) + (result === 'p2' ? 1 : 0),
      }
      updateGame('rps', chatId, {
        choices: { p1: '', p2: '' },
        score: newScore,
        matchWinner: newScore.p1 >= 3 ? 'p1' : newScore.p2 >= 3 ? 'p2' : '',
      })
    }, 1600)
  }

  function pick(choice) {
    if (!mySlot || myChoice || matchWinner) return
    set(ref(db, `chats/${chatId}/games/rps/choices/${mySlot}`), choice)
  }

  function reset() {
    updateGame('rps', chatId, {
      choices: { p1: '', p2: '' },
      score: { p1: 0, p2: 0 },
      matchWinner: '',
    })
  }

  const roundResult = revealed
    ? myChoice === oppChoice
      ? 'draw'
      : BEATS[myChoice] === oppChoice
        ? 'win'
        : 'lose'
    : null

  const status = matchWinner
    ? matchWinner === mySlot
      ? 'You won the match! 🏆'
      : `${friend.name} won the match`
    : revealed
      ? roundResult === 'draw'
        ? 'Draw!'
        : roundResult === 'win'
          ? 'You won this round!'
          : `${friend.name} won this round`
      : myChoice
        ? 'Waiting for opponent…'
        : 'Pick your weapon'

  const bannerTone = matchWinner
    ? matchWinner === mySlot
      ? 'bg-amber/15 text-amber border-amber/30'
      : 'bg-rose/10 text-rose border-rose/30'
    : roundResult === 'win'
      ? 'bg-teal/10 text-teal border-teal/30'
      : roundResult === 'lose'
        ? 'bg-rose/10 text-rose border-rose/30'
        : 'bg-elev/70 text-muted border-line'

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-4">
      {/* scoreboard */}
      <div className="flex w-full items-center justify-between rounded-2xl border border-line/60 bg-panel2/60 px-5 py-3.5">
        <ScoreSide name={me.displayName || 'You'} avatarName={me.displayName || 'You'} pips={score[mySlot] || 0} />
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">First to 3</span>
          <span className="text-lg font-extrabold text-cream">{score[mySlot] || 0} : {score[oppSlot] || 0}</span>
        </div>
        <ScoreSide name={friend.name} avatarName={friend.name} pips={score[oppSlot] || 0} flip />
      </div>

      {/* battle stage */}
      <div className="relative flex w-full items-center justify-between gap-2 rounded-3xl border border-line/60 bg-gradient-to-b from-elev/60 to-panel/80 px-6 py-6">
        <Hand name={me.displayName || 'You'} choice={myChoice} label={LABEL[myChoice]} reveal={revealed} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-extrabold shadow-lg transition ${revealed ? 'bg-amber text-ink scale-110' : 'bg-panel2 text-muted'}`}>
            VS
          </div>
        </div>
        <Hand name={friend.name} choice={oppChoice} label={revealed ? LABEL[oppChoice] : null} reveal={revealed} flip />
      </div>

      {/* status banner */}
      <p className={`animate-pop rounded-xl border px-4 py-2 text-sm font-semibold ${bannerTone}`}>{status}</p>

      {/* choices */}
      {!matchWinner ? (
        <div className="grid w-full grid-cols-3 gap-3">
          {['rock', 'paper', 'scissors'].map((c) => (
            <button
              key={c}
              onClick={() => pick(c)}
              disabled={Boolean(myChoice) || revealed || !mySlot}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border px-3 py-4 transition active:scale-95 disabled:opacity-45 ${
                myChoice === c
                  ? 'border-teal bg-teal/10 shadow-[0_0_0_1px_rgba(0,168,132,0.5),0_8px_24px_rgba(0,168,132,0.2)]'
                  : 'border-line/60 bg-panel2/60 hover:border-teal/40 hover:bg-elev'
              }`}
            >
              <ChoiceIcon choice={c} size={52} />
              <span className="text-xs font-bold text-cream/90">{LABEL[c]}</span>
            </button>
          ))}
        </div>
      ) : (
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-full bg-teal px-6 py-2.5 text-sm font-bold text-ink shadow transition hover:bg-[#00c495] active:scale-95"
        >
          <IconRefresh size={16} /> {matchWinner === mySlot ? <><IconTrophy size={16} /> Defend your title</> : 'Rematch!'}
        </button>
      )}
    </div>
  )
}

function ScoreSide({ name, avatarName, pips, flip }) {
  return (
    <div className={`flex min-w-0 items-center gap-2.5 ${flip ? 'flex-row-reverse text-right' : ''}`}>
      <Avatar name={avatarName} size={36} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{name}</p>
        <div className={`mt-1 flex gap-1 ${flip ? 'justify-end' : ''}`}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition ${i < pips ? 'bg-amber shadow-[0_0_6px_rgba(245,195,59,0.8)]' : 'bg-line'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function Hand({ name, choice, label, reveal, flip }) {
  return (
    <div className={`flex w-28 flex-col items-center gap-1.5 ${flip ? 'scale-x-[-1]' : ''}`}>
      <div key={`${choice}-${reveal}`} className={reveal ? 'rps-shake' : ''}>
        <ChoiceIcon choice={choice} size={84} />
      </div>
      <p className="text-xs font-bold text-cream/90" style={flip ? { transform: 'scaleX(-1)' } : undefined}>{label || '\u00A0'}</p>
      <p className="truncate text-[11px] text-muted" style={flip ? { transform: 'scaleX(-1)' } : undefined}>{name}</p>
    </div>
  )
}
