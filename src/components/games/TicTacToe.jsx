import { useMemo, useState } from 'react'
import { useGameState, useJoinGame, updateGame } from '../../hooks/useGame.js'
import { IconRefresh, IconTrophy } from '../Icons.jsx'

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function checkWinner(board) {
  for (const line of LINES) {
    const [a, b, c] = line
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line }
    }
  }
  return board.every((c) => c) ? { winner: 'draw', line: null } : { winner: null, line: null }
}

const CELL = 100

function Mark({ mark, index }) {
  const cx = (index % 3) * CELL + CELL / 2
  const cy = Math.floor(index / 3) * CELL + CELL / 2
  if (mark === 'X') {
    const d = 26
    return (
      <g stroke="#ff6b6b" strokeWidth="9" strokeLinecap="round" fill="none">
        <path className="draw-x" d={`M${cx - d} ${cy - d} L${cx + d} ${cy + d}`} />
        <path className="draw-x draw-x-2" d={`M${cx + d} ${cy - d} L${cx - d} ${cy + d}`} />
      </g>
    )
  }
  return (
    <circle
      className="draw-o"
      cx={cx}
      cy={cy}
      r={27}
      stroke="#53bdeb"
      strokeWidth="9"
      strokeLinecap="round"
      fill="none"
    />
  )
}

export default function TicTacToe({ chatId, me, friend }) {
  const data = useGameState('tictactoe', chatId)

  useJoinGame('tictactoe', chatId, ['X', 'O'], () => ({
    board: ['', '', '', '', '', '', '', '', ''],
    currentTurn: me.uid,
  }))

  const players = data?.players || {}
  const myMark = players.X === me.uid ? 'X' : players.O === me.uid ? 'O' : null
  const board = useMemo(
    () => Object.values(data?.board || {}).length ? Object.values(data.board) : Array(9).fill(''),
    [data],
  )
  const { winner, line } = checkWinner(board)
  const myTurn = myMark && data?.currentTurn === me.uid && !winner

  function play(index) {
    if (!myTurn || board[index]) return
    const next = [...board]
    next[index] = myMark
    const result = checkWinner(next)
    updateGame('tictactoe', chatId, {
      board: next,
      currentTurn: myMark === 'X' ? players.O : players.X,
      winner: result.winner || '',
    })
  }

  function reset() {
    const nextFirst = data?.firstPlayer
      ? (data.firstPlayer === players.X ? players.O : players.X)
      : players.O
    updateGame('tictactoe', chatId, {
      board: ['', '', '', '', '', '', '', '', ''],
      currentTurn: nextFirst,
      firstPlayer: nextFirst,
      winner: '',
    })
  }

  // winning line endpoints in SVG coords
  const lineCoords = line
    ? {
        x1: (line[0] % 3) * CELL + CELL / 2,
        y1: Math.floor(line[0] / 3) * CELL + CELL / 2,
        x2: (line[2] % 3) * CELL + CELL / 2,
        y2: Math.floor(line[2] / 3) * CELL + CELL / 2,
      }
    : null

  const status = winner
    ? winner === 'draw'
      ? "It's a draw — rematch?"
      : winner === myMark
        ? 'You win! 🏆'
        : `${friend.name} wins`
    : myTurn
      ? 'Your turn'
      : !myMark
        ? 'Watching as spectator'
        : `Waiting for ${friend.name}…`

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      {/* players bar */}
      <div className="flex w-full items-center justify-between rounded-2xl border border-line/60 bg-panel2/60 px-4 py-3">
        <PlayerChip name={me.displayName || 'You'} mark="X" active={data?.currentTurn === me.uid && !winner} mine={myMark === 'X'} />
        <span className="text-xs font-bold text-muted">VS</span>
        <PlayerChip name={friend.name} mark="O" active={data?.currentTurn === players.O && !winner} mine={myMark === 'O'} flip />
      </div>

      {/* board */}
      <svg
        viewBox="-8 -8 316 316"
        className="w-full max-w-[340px] rounded-3xl border border-line/60 bg-panel/70 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.4)]"
      >
        <g stroke="#2a3942" strokeWidth="7" strokeLinecap="round">
          <path d={`M${CELL} 12 V288`} />
          <path d={`M${CELL * 2} 12 V288`} />
          <path d="M12 100 H288" />
          <path d="M12 200 H288" />
        </g>
        {board.map((v, i) =>
          v ? <Mark key={`${i}-${v}`} mark={v} index={i} /> : null,
        )}
        {/* tap targets */}
        {board.map((v, i) => (
          <rect
            key={`hit-${i}`}
            x={(i % 3) * CELL + 6}
            y={Math.floor(i / 3) * CELL + 6}
            width={CELL - 12}
            height={CELL - 12}
            rx="18"
            fill="transparent"
            className={myTurn && !v ? 'cursor-pointer hover:fill-white/5' : ''}
            onClick={() => play(i)}
          />
        ))}
        {lineCoords && (
          <line
            className="draw-win"
            x1={lineCoords.x1}
            y1={lineCoords.y1}
            x2={lineCoords.x2}
            y2={lineCoords.y2}
            stroke="#f5c33b"
            strokeWidth="10"
            strokeLinecap="round"
          />
        )}
      </svg>

      {/* status */}
      <div className="flex w-full flex-col items-center gap-3">
        <p className={`flex items-center gap-2 text-center text-sm font-semibold ${winner && winner !== 'draw' && winner === myMark ? 'text-amber' : 'text-cream/90'}`}>
          {winner && winner !== 'draw' && winner === myMark && <IconTrophy size={17} />}
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
    </div>
  )
}

function PlayerChip({ name, mark, active, mine, flip }) {
  return (
    <div className={`flex min-w-0 items-center gap-2.5 ${flip ? 'flex-row-reverse text-right' : ''}`}>
      <div className={`rounded-xl px-2.5 py-1 text-sm font-extrabold ${mark === 'X' ? 'bg-rose/15 text-rose' : 'bg-sky/15 text-sky'}`}>
        {mark}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{name}{mine && ' (you)'}</p>
        <p className={`text-[11px] ${active ? 'text-teal' : 'text-muted'}`}>{active ? '● playing…' : '\u00A0'}</p>
      </div>
    </div>
  )
}
