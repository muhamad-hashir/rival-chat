import { useGameState, useJoinGame, updateGame } from '../../hooks/useGame.js'
import Avatar from '../Avatar.jsx'
import { IconRefresh, IconTrophy } from '../Icons.jsx'

const ROWS = 6
const COLS = 7
const CELL = 60
const PAD = 10
const W = COLS * CELL + PAD * 2
const H = ROWS * CELL + PAD * 2

function emptyBoard() {
  return Array(ROWS * COLS).fill('')
}

function normalise(board) {
  if (!board) return emptyBoard()
  const list = Array.isArray(board) ? board : Object.values(board)
  return Array.from({ length: ROWS * COLS }, (_, i) => list[i] || '')
}

function findWinner(board) {
  const at = (r, c) => board[r * COLS + c]
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]]
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const p = at(r, c)
      if (!p) continue
      for (const [dr, dc] of dirs) {
        const pattern = [r * COLS + c]
        let rr = r + dr
        let cc = c + dc
        while (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS && at(rr, cc) === p && pattern.length < 4) {
          pattern.push(rr * COLS + cc)
          rr += dr
          cc += dc
        }
        if (pattern.length === 4) return { winner: p, pattern }
      }
    }
  }
  return board.every((c) => c) ? { winner: 'draw', pattern: [] } : { winner: null, pattern: [] }
}

function dropRow(board, col) {
  for (let r = ROWS - 1; r >= 0; r--) if (!board[r * COLS + col]) return r
  return -1
}

export default function ConnectFour({ chatId, me, friend }) {
  const data = useGameState('connect4', chatId)

  useJoinGame('connect4', chatId, ['red', 'yellow'], () => ({
    board: emptyBoard(),
    currentTurn: 'red',
    firstPlayer: 'red',
  }))

  const players = data?.players || {}
  const myColor = players.red === me.uid ? 'red' : players.yellow === me.uid ? 'yellow' : null
  const board = normalise(data?.board)
  const { winner, pattern } = findWinner(board)
  const myTurn = myColor && data?.currentTurn === myColor && !winner

  function drop(col) {
    if (!myTurn) return
    const row = dropRow(board, col)
    if (row === -1) return
    const next = [...board]
    next[row * COLS + col] = myColor
    const result = findWinner(next)
    updateGame('connect4', chatId, {
      board: next,
      currentTurn: result.winner ? data.currentTurn : myColor === 'red' ? 'yellow' : 'red',
      winner: result.winner || null,
    })
  }

  function reset() {
    const nextFirst = data?.firstPlayer === 'red' ? 'yellow' : 'red'
    updateGame('connect4', chatId, {
      board: emptyBoard(),
      currentTurn: nextFirst,
      firstPlayer: nextFirst,
      winner: null,
    })
  }

  const status = winner
    ? winner === 'draw'
      ? 'Board is full — draw!'
      : winner === myColor
        ? 'You win! 🏆'
        : `${friend.name} wins`
    : !myColor
      ? 'Waiting for a slot…'
      : myTurn
        ? 'Your turn — pick a column'
        : `Waiting for ${friend.name}…`

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-4">
      {/* players bar */}
      <div className="flex w-full items-center justify-between rounded-2xl border border-line/60 bg-panel2/60 px-4 py-3">
        <Side name={me.displayName || 'You'} color="red" active={data?.currentTurn === 'red' && !winner} mine={myColor === 'red'} />
        <span className="text-xs font-bold text-muted">VS</span>
        <Side name={friend.name} color="yellow" active={data?.currentTurn === 'yellow' && !winner} mine={myColor === 'yellow'} flip />
      </div>

      <svg viewBox={`0 0 ${W} ${H + 26}`} className="w-full max-w-[500px] drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
        <defs>
          <linearGradient id="c4-board" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2563eb" />
            <stop offset="1" stopColor="#1a3fae" />
          </linearGradient>
          <radialGradient id="disc-red" cx="0.35" cy="0.3" r="1">
            <stop offset="0" stopColor="#ffb3a0" />
            <stop offset="0.55" stopColor="#ff6b6b" />
            <stop offset="1" stopColor="#c22f2f" />
          </radialGradient>
          <radialGradient id="disc-yellow" cx="0.35" cy="0.3" r="1">
            <stop offset="0" stopColor="#fff3c4" />
            <stop offset="0.55" stopColor="#f5c33b" />
            <stop offset="1" stopColor="#b8860b" />
          </radialGradient>
        </defs>

        {/* board plate */}
        <rect x="0" y="0" width={W} height={H} rx="20" fill="url(#c4-board)" stroke="#3b82f6" strokeOpacity="0.4" strokeWidth="2" />

        {/* holes */}
        {board.map((_, i) => {
          const r = Math.floor(i / COLS)
          const c = i % COLS
          return (
            <circle
              key={`hole-${i}`}
              cx={PAD + c * CELL + CELL / 2}
              cy={PAD + r * CELL + CELL / 2}
              r={CELL * 0.36}
              fill="#0b141a"
              opacity="0.55"
            />
          )
        })}

        {/* discs */}
        {board.map((v, i) => {
          if (!v) return null
          const r = Math.floor(i / COLS)
          const c = i % COLS
          const cx = PAD + c * CELL + CELL / 2
          const cy = PAD + r * CELL + CELL / 2
          return (
            <g
              key={`disc-${i}`}
              className={`c4-disc ${pattern.includes(i) ? 'win-glow' : ''}`}
              style={{ '--drop-from': `${-(r + 1) * CELL}px` }}
            >
              <circle cx={cx} cy={cy} r={CELL * 0.4} fill={v === 'red' ? 'url(#disc-red)' : 'url(#disc-yellow)'} />
              <ellipse cx={cx - CELL * 0.12} cy={cy - CELL * 0.14} rx={CELL * 0.14} ry={CELL * 0.09} fill="#fff" opacity="0.4" />
            </g>
          )
        })}

        {/* column hit zones */}
        {Array.from({ length: COLS }, (_, c) => (
          <rect
            key={`col-${c}`}
            x={c * CELL}
            y={-26}
            width={CELL}
            height={H + 26}
            fill="transparent"
            className={myTurn ? 'cursor-pointer hover:fill-white/10' : ''}
            onClick={() => drop(c)}
          />
        ))}

        {/* arrow indicators over columns */}
        {myTurn &&
          Array.from({ length: COLS }, (_, c) =>
            dropRow(board, c) === -1 ? null : (
              <path
                key={`arrow-${c}`}
                d={`M${PAD + c * CELL + CELL / 2 - 8} 10 l8 9 l8 -9`}
                fill="none"
                stroke="#e2e8f0"
                strokeOpacity="0.7"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-bounce"
              />
            ),
          )}
      </svg>

      <p className={`flex items-center gap-2 text-sm font-semibold ${winner && winner === myColor ? 'text-amber' : 'text-cream/90'}`}>
        {winner && winner !== 'draw' && winner === myColor && <IconTrophy size={17} />}
        {status}
      </p>

      {winner && (
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-full bg-teal px-6 py-2.5 text-sm font-bold text-ink shadow transition hover:bg-[#00c495] active:scale-95"
        >
          <IconRefresh size={16} /> Play again
        </button>
      )}
    </div>
  )
}

function Side({ name, color, active, mine, flip }) {
  const tone = color === 'red' ? 'text-rose' : 'text-amber'
  return (
    <div className={`flex min-w-0 items-center gap-2.5 ${flip ? 'flex-row-reverse text-right' : ''}`}>
      <div className={`flex h-9 w-9 items-center justify-center rounded-full ${color === 'red' ? 'bg-gradient-to-br from-[#ffb3a0] to-[#c22f2f]' : 'bg-gradient-to-br from-[#fff3c4] to-[#b8860b]'} shadow-inner`}>
        <span className="h-3.5 w-3.5 rounded-full bg-black/25" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">
          {name}
          {mine && ' (you)'}
        </p>
        <p className={`text-[11px] font-medium ${active ? tone : 'text-muted'}`}>{active ? '● their move' : '\u00A0'}</p>
      </div>
    </div>
  )
}
