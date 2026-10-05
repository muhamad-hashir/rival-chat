import { useEffect, useRef, useState } from 'react'
import { useChat } from '../hooks/useChat.js'
import Avatar from './Avatar.jsx'
import MessageBubble, { TypingBubble, DateDivider } from './MessageBubble.jsx'
import { chatIdFor, dayLabel } from '../utils.js'
import { IconArrowLeft, IconGamepad, IconSend, IconX } from './Icons.jsx'

const GAME_FILES = {
  tictactoe: 'TicTacToe',
  rps: 'RPS',
  connect4: 'ConnectFour',
  ladsnake: 'SnakesLadders',
}

async function loadGameComp(id) {
  const mod = await import(`./games/${GAME_FILES[id]}.jsx`)
  return mod.default || mod
}
async function loadGamesMenu() {
  const mod = await import('./games/GamesMenu.jsx')
  return mod.default || mod
}
async function loadGameShell() {
  const mod = await import('./games/GameShell.jsx')
  return mod.default || mod
}
const GAME_TITLES = {
  tictactoe: 'Tic Tac Toe',
  rps: 'Rock Paper Scissors',
  connect4: 'Connect Four',
  ladsnake: 'Snakes & Ladders',
}

export default function ChatWindow({ me, friend, statuses, onBack, className = '' }) {
  const { messages, friendTyping, sendMessage, notifyTyping, deleteMessage } = useChat(me, friend)
  const [draft, setDraft] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [game, setGame] = useState(null)
  const [GameComp, setGameComp] = useState(null)
  const [GamesMenuComp, setGamesMenuComp] = useState(null)
  const [GameShellComp, setGameShellComp] = useState(null)
  const listRef = useRef(null)
  const inputRef = useRef(null)

  const online = Boolean(statuses[friend.uid]?.online)
  const lastSeen = statuses[friend.uid]?.lastSeen

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages.length, friendTyping, friend.uid])

  // reset overlays when switching friend
  useEffect(() => {
    setMenuOpen(false)
    setGame(null)
    setGameComp(null)
    setGamesMenuComp(null)
    setGameShellComp(null)
  }, [friend.uid])

  // lazy-load the overlay UIs on first use (they only render when gaming)
  useEffect(() => {
    if (!menuOpen) return
    let cancelled = false
    loadGamesMenu().then((C) => {
      if (!cancelled) setGamesMenuComp(() => C)
    })
    return () => {
      cancelled = true
    }
  }, [menuOpen, friend.name])

  useEffect(() => {
    if (!game) return
    let cancelled = false
    loadGameShell().then((C) => {
      if (!cancelled) setGameShellComp(() => C)
    })
    return () => {
      cancelled = true
    }
  }, [game])

  async function openGame(id) {
    setMenuOpen(false)
    const Comp = await loadGameComp(id)
    setGameComp(() => Comp)
    setGame(id)
  }

  function submit(e) {
    e.preventDefault()
    if (!draft.trim()) return
    sendMessage(draft)
    setDraft('')
    inputRef.current?.focus()
  }

  let lastDay = null

  return (
    <section className={`relative flex h-full min-h-0 flex-col bg-ink ${className}`}>
      {/* header */}
      <header className="z-10 flex items-center gap-3 border-b border-line/60 bg-panel2 px-3 py-2 shadow-md md:px-4">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-elev hover:text-cream md:hidden"
          title="Back to chats"
        >
          <IconArrowLeft size={20} />
        </button>
        <Avatar name={friend.name} size={40} online={online} />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate font-semibold">{friend.name}</p>
          <p className={`truncate text-xs ${friendTyping ? 'text-teal' : online ? 'text-teal' : 'text-muted'}`}>
            {friendTyping
              ? 'typing…'
              : online
                ? 'online'
                : lastSeen
                  ? `last seen ${new Date(lastSeen).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`
                  : 'offline'}
          </p>
        </div>
        <button
          onClick={() => setMenuOpen(true)}
          className="group flex items-center gap-2 rounded-full bg-teal px-3.5 py-2 text-sm font-bold text-ink shadow-[0_4px_16px_rgba(0,168,132,0.35)] transition hover:bg-[#00c495] active:scale-95"
          title="Play a game"
        >
          <IconGamepad size={19} />
          <span className="hidden md:inline">Games</span>
        </button>
      </header>

      {/* messages */}
      <div ref={listRef} className="chat-wallpaper nice-scroll flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-3 py-4 md:px-8">
        {messages.length === 0 && (
          <div className="m-auto flex max-w-xs flex-col items-center gap-2 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-panel2 shadow">
              <IconGamepad size={26} className="text-teal" />
            </div>
            <p className="text-sm text-muted">
              No messages yet. Say hi — or hit <span className="font-semibold text-teal">Games</span> and let the rivalry begin.
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const day = dayLabel(msg.timestamp || Date.now())
          const showDay = day !== lastDay
          lastDay = day
          const mine = msg.sender === me.uid
          return (
            <div key={msg.id} className="flex flex-col gap-1.5">
              {showDay && <DateDivider label={day} />}
              <MessageBubble msg={msg} mine={mine} onDelete={() => deleteMessage(msg.id)} />
            </div>
          )
        })}

        {friendTyping && <TypingBubble />}
      </div>

      {/* composer */}
      <form
        onSubmit={submit}
        className="flex items-center gap-2 border-t border-line/60 bg-panel2 px-3 py-2.5 md:px-4"
      >
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value)
            notifyTyping()
          }}
          placeholder="Type a message"
          className="h-11 flex-1 rounded-full bg-elev px-5 text-[15px] placeholder:text-muted/70 focus:ring-2 focus:ring-teal/30"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal text-ink shadow transition hover:bg-[#00c495] active:scale-95 disabled:opacity-40"
          title="Send"
        >
          <IconSend size={20} />
        </button>
      </form>

      {/* games menu sheet */}
      {menuOpen && GamesMenuComp && (
        <GamesMenuComp
          friendName={friend.name}
          onPick={openGame}
          onClose={() => setMenuOpen(false)}
        />
      )}
      {game && GameComp && GameShellComp && (
        <GameShellComp title={GAME_TITLES[game]} onExit={() => setGame(null)}>
          <GameComp chatId={chatIdFor(me.uid, friend.uid)} me={me} friend={friend} />
        </GameShellComp>
      )}
    </section>
  )
}