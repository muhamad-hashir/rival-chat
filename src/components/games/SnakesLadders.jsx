import { useGameState, useJoinGame, updateGame } from '../../hooks/useGame.js'
import { IconRefresh, IconTrophy, IconDice } from '../Icons.jsx'

/* same board data as the original vanilla app */
const SNAKES = { 16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78 }
const LADDERS = { 1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100 }

const CS = 46 // cell size
const N = 10
const W = N * CS
const H = N * CS

function cellCenter(n) {
  const idx = n - 1
  const row = Math.floor(idx / 10) // 0 = bottom row
  const col = row % 2 === 0 ? idx % 10 : 9 - (idx % 10)
  const x = col * CS + CS / 2
  const y = H - (row * CS + CS / 2) // bottom row at bottom
  return { x, y }
}

function checkerColor(n) {
  const idx = n - 1
  const row = Math.floor(idx / 10)
  const col = row % 2 === 0 ? idx % 10 : 9 - (idx % 10)
  return (row + col) % 2 === 0 ? '#dfe9e5' : '#c8d8d1'
}

/* ---------- board art ---------- */

function Snake({ head, tail }) {
  const h = cellCenter(head)
  const t = cellCenter(tail)
  const dx = h.x - t.x
  const dy = h.y - t.y
  const len = Math.hypot(dx, dy) || 1
  // perpendicular offset for the S-curve
  const px = -dy / len
  const py = dx / len
  const bend = len * 0.22
  const c1x = t.x + dx * 0.3 + px * bend
  const c1y = t.y + dy * 0.3 + py * bend
  const c2x = t.x + dx * 0.7 - px * bend
  const c2y = t.y + dy * 0.7 - py * bend
  const d = `M${t.x} ${t.y} C${c1x} ${c1y} ${c2x} ${c2y} ${h.x} ${h.y}`

  return (
    <g>
      <path d={d} fill="none" stroke="#16a34a" strokeWidth="13" strokeLinecap="round" opacity="0.95" />
      <path d={d} fill="none" stroke="#4ade80" strokeWidth="7" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#bbf7d0" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 9" />
      {/* head */}
      <circle cx={h.x} cy={h.y} r="10" fill="#16a34a" />
      <circle cx={h.x} cy={h.y} r="10" fill="none" stroke="#065f46" strokeWidth="2" />
      {/* eyes */}
      <circle cx={h.x - 3.5} cy={h.y - 4} r="2.2" fill="#fff" />
      <circle cx={h.x + 3.5} cy={h.y - 4} r="2.2" fill="#fff" />
      <circle cx={h.x - 3.5} cy={h.y - 4} r="1" fill="#111" />
      <circle cx={h.x + 3.5} cy={h.y - 4} r="1" fill="#111" />
      {/* tongue */}
      <path d={`M${h.x + 8} ${h.y + 2} l7 3 l-6 2`} fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" />
    </g>
  )
}

function Ladder({ from, to }) {
  const a = cellCenter(from)
  const b = cellCenter(to)
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const px = (-dy / len) * 6.5
  const py = (dx / len) * 6.5
  const rungs = Math.max(3, Math.round(len / 16))
  return (
    <g stroke="#f59e0b" strokeLinecap="round">
      <path d={`M${a.x + px} ${a.y + py} L${b.x + px} ${b.y + py}`} strokeWidth="4" />
      <path d={`M${a.x - px} ${a.y - py} L${b.x - px} ${b.y - py}`} strokeWidth="4" />
      {Array.from({ length: rungs }, (_, i) => {
        const f = (i + 1) / (rungs + 1)
        const x = a.x + dx * f
        const y = a.y + dy * f
        return <path key={i} d={`M${x + px} ${y + py} L${x - px} ${y - py}`} strokeWidth="3" />
      })}
    </g>
  )
}

/* ---------- dice ---------- */

const DICE_PIPS = {
  1: [[0, 0]],
  2: [[-1, -1], [1, 1]],
  3: [[-1, -1], [0, 0], [1, 1]],
  4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
  6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]],
}

export function DiceFace({ value, size = 64, className = '' }) {
  const s = size * 0.16
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className}>
      <rect x="2" y="2" width="36" height="36" rx="9" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
      {(DICE_PIPS[value] || []).map(([ox, oy], i) => (
        <circle key={i} cx={20 + ox * s} cy={20 + oy * s} r="3" fill="#0f172a" />
      ))}
    </svg>
  )
}

/* ---------- component ---------- */

export default function SnakesLadders({ chatId, me, friend }) {
  const data = useGameState('ladsnake', chatId)

  useJoinGame('ladsnake', chatId, ['p1', 'p2'], () => ({
    positions: { p1: 0, p2: 0 },
    currentTurn: 'p1',
  }))

  const players = data?.players || {}
  const mySlot = players.p1 === me.uid ? 'p1' : players.p2 === me.uid ? 'p2' : null
  const oppSlot = mySlot === 'p1' ? 'p2' : 'p1'
  const positions = data?.positions || { p1: 0, p2: 0 }
  const currentTurn = data?.currentTurn || 'p1'
  const lastRoll = data?.lastRoll || null
  const winner = data?.winner || ''
  const myTurn = mySlot && currentTurn === mySlot && !winner

  function roll() {
    if (!myTurn || !mySlot) return
    const current = positions[mySlot] || 0
    const value = Math.floor(Math.random() * 6) + 1
    let next = current + value
    if (next > 100) next = current
    else next = SNAKES[next] ?? LADDERS[next] ?? next
    const bounced = value !== Math.abs(next - current)

    updateGame('ladsnake', chatId, {
      positions: { ...positions, [mySlot]: next },
      lastRoll: value,
      currentTurn: next === 100 ? mySlot : oppSlot,
      winner: next === 100 ? mySlot : '',
      lastEvent: next === 100 ? 'win' : bounced ? (SNAKES[next - (next - current) + (next - current)] ? 'snake' : 'ladder') : '',
    })
  }

  function reset() {
    updateGame('ladsnake', chatId, {
      positions: { p1: 0, p2: 0 },
      lastRoll: null,
      currentTurn: 'p1',
      winner: '',
      lastEvent: '',
    })
  }

  const eventMsg =
    winner
      ? winner === mySlot
        ? 'You reached 100 first! 🏆'
        : `${friend.name} reached 100 first`
      : lastEventText(data, mySlot, friend)

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-3">
      {/* players + dice row */}
      <div className="flex w-full items-center justify-between rounded-2xl border border-line/60 bg-panel2/60 px-4 py-3">
        <Side name={me.displayName || 'You'} tokenColor="#ff6b6b" active={currentTurn === 'p1' && !winner} mine={mySlot === 'p1'} />
        <div className="flex flex-col items-center gap-1">
          <div key={`${lastRoll}-${winner}`} className={lastRoll ? 'dice-in' : 'opacity-60'}>
            <DiceFace value={lastRoll || 6} size={52} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">dice</span>
        </div>
        <Side name={friend.name} tokenColor="#53bdeb" active={currentTurn === 'p2' && !winner} mine={mySlot === 'p2'} flip />
      </div>

      {/* board */}
      <svg viewBox={`-6 -6 ${W + 12} ${H + 12}`} className="w-full max-w-[460px] rounded-2xl border border-line/60 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
        <defs>
          <linearGradient id="sl-frame" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1d282f" />
            <stop offset="1" stopColor="#111b21" />
          </linearGradient>
        </defs>
        <rect x="-6" y="-6" width={W + 12} height={H + 12} rx="14" fill="url(#sl-frame)" stroke="#2a3942" strokeWidth="1.5" />

        {/* cells */}
        {Array.from({ length: 100 }, (_, i) => i + 1).map((n) => {
          const idx = n - 1
          const row = Math.floor(idx / 10)
          const col = row % 2 === 0 ? idx % 10 : 9 - (idx % 10)
          const x = col * CS
          const y = H - (row * CS + CS)
          const isSnakeHead = SNAKES[n] !== undefined && Object.values(SNAKES).includes(n)
          const isSnakeTailStart = SNAKES[n] !== undefined
          const isLadderBottom = LADDERS[n] !== undefined
          return (
            <g key={n}>
              <rect x={x} y={y} width={CS} height={CS} fill={checkerColor(n)} stroke="#111b21" strokeWidth="1" />
              {(isSnakeTailStart || isLadderBottom) && (
                <circle cx={x + CS / 2} cy={y + CS / 2} r={CS * 0.3} fill={isLadderBottom ? '#f59e0b' : '#16a34a'} opacity="0.28" />
              )}
              <text x={x + 4} y={y + 12} fontSize="8.5" fontWeight="700" fill="#334155">
                {n}
              </text>
            </g>
          )
        })}

        {/* goal star on 100 */}
        <g opacity="0.9">
          <text x={W - CS / 2} y={CS - CS / 2 + 5} textAnchor="middle" fontSize="16">⭐</text>
        </g>

        {/* ladders under snakes */}
        {Object.entries(LADDERS).map(([from, to]) => (
          <Ladder key={`L${from}`} from={Number(from)} to={to} />
        ))}
        {Object.entries(SNAKES).map(([head, tail]) => (
          <Snake key={`S${head}`} head={Number(head)} tail={tail} />
        ))}

        {/* tokens */}
        <PlayerToken n={positions.p1 || 0} color="#ff6b6b" offset={-8} />
        <PlayerToken n={positions.p2 || 0} color="#53bdeb" offset={8} />
      </svg>

      {/* status */}
      <p className={`flex items-center gap-2 text-center text-sm font-semibold ${winner && winner === mySlot ? 'text-amber' : 'text-cream/90'}`}>
        {winner && winner === mySlot && <IconTrophy size={17} />}
        {eventMsg}
      </p>

      {/* roll / reset */}
      {winner ? (
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-full bg-teal px-6 py-2.5 text-sm font-bold text-ink shadow transition hover:bg-[#00c495] active:scale-95"
        >
          <IconRefresh size={16} /> Play again
        </button>
      ) : (
        <button
          onClick={roll}
          disabled={!myTurn}
          className="flex items-center gap-2 rounded-full bg-teal px-7 py-2.5 text-sm font-bold text-ink shadow-[0_6px_20px_rgba(0,168,132,0.35)] transition hover:bg-[#00c495] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          <IconDice size={17} />
          {myTurn ? 'Roll the dice' : `${friend.name}'s turn…`}
        </button>
      )}
    </div>
  )
}

function PlayerToken({ n, color, offset }) {
  if (!n) return null
  const { x, y } = cellCenter(n)
  return (
    <g style={{ transition: 'transform 400ms ease' }} className="animate-pop" transform={`translate(${x + offset} ${y - 6})`}>
      <ellipse cx="0" cy="7" rx="6" ry="2.4" fill="rgba(0,0,0,0.35)" />
      <circle r="7" fill={color} stroke="#0b141a" strokeWidth="2" />
      <circle cx="-2" cy="-2.5" r="2" fill="#fff" opacity="0.55" />
    </g>
  )
}

function lastEventText(data, mySlot, friend) {
  const event = data?.lastEvent || ''
  const roll = data?.lastRoll
  if (!roll) return data?.currentTurn === mySlot ? 'Your turn — roll the dice!' : `${friend.name}'s turn…`
  if (event === 'snake') return `Rolled ${roll} — ssssnake bite! 🐍`
  if (event === 'ladder') return `Rolled ${roll} — climbed a ladder! 🪜`
  return data?.currentTurn === mySlot ? `Rolled ${roll}. Your turn!` : `They rolled ${roll}. Waiting…`
}

function Side({ name, tokenColor, active, mine, flip }) {
  return (
    <div className={`flex min-w-0 items-center gap-2.5 ${flip ? 'flex-row-reverse text-right' : ''}`}>
      <span
        className="inline-block h-4 w-4 rounded-full ring-2 ring-black/30"
        style={{ background: tokenColor }}
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">
          {name}
          {mine && ' (you)'}
        </p>
        <p className={`text-[11px] font-medium ${active ? 'text-teal' : 'text-muted'}`}>
          {active ? '● rolling…' : '\u00A0'}
        </p>
      </div>
    </div>
  )
}
