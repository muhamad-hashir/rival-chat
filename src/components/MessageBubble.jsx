import { useEffect, useRef, useState } from 'react'
import { IconCheck, IconChecks, IconTrash, IconReply, IconX } from './Icons.jsx'
import { formatTime } from '../utils.js'

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏']

function Tail({ out }) {
  return out ? (
    <svg width="9" height="13" viewBox="0 0 9 13" className="absolute -right-[8px] bottom-0" aria-hidden="true">
      <path d="M0 0 C0 7 3 11 9 13 L0 13 Z" fill="#005c4b" />
    </svg>
  ) : (
    <svg width="9" height="13" viewBox="0 0 9 13" className="absolute -left-[8px] bottom-0" aria-hidden="true">
      <path d="M9 0 C9 7 6 11 0 13 L9 13 Z" fill="#202c33" />
    </svg>
  )
}

/* Long-press (touch) or right-click (desktop) opens the action sheet */
function useLongPress(onOpen) {
  const timer = useRef(null)
  function start() {
    timer.current = setTimeout(onOpen, 450)
  }
  function clear() {
    clearTimeout(timer.current)
  }
  return {
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchMove: clear,
    onContextMenu: (e) => {
      e.preventDefault()
      onOpen()
    },
  }
}

function ReplyPreview({ replyTo }) {
  return (
    <div className="mb-1 flex overflow-hidden rounded-lg bg-black/20 text-left">
      <span className={`w-1 shrink-0 ${replyTo.sender === 'me' ? 'bg-teal' : 'bg-sky'}`} />
      <div className="min-w-0 px-2 py-1">
        <p className={`text-[11.5px] font-bold ${replyTo.sender === 'me' ? 'text-teal' : 'text-sky'}`}>
          {replyTo.sender === 'me' ? 'You' : replyTo.senderName || 'Them'}
        </p>
        <p className="truncate text-[12px] text-white/70">
          {replyTo.deleted ? 'Deleted message' : replyTo.text}
        </p>
      </div>
    </div>
  )
}

function ReactionBar({ reactions, mine, onPick, onClose }) {
  return (
    <div className="absolute -top-9 right-1 z-10 flex items-center gap-0.5 rounded-full border border-line/70 bg-panel2 px-1.5 py-1 shadow-lg">
      {REACTIONS.map((r) => {
        const active = reactions && Object.values(reactions).includes(r)
        return (
          <button
            key={r}
            onClick={(e) => {
              e.stopPropagation()
              onPick(r)
            }}
            className={`text-[17px] leading-none transition hover:scale-125 ${active ? 'bg-teal/25 rounded-full' : ''}`}
          >
            {r}
          </button>
        )
      })}
      <button onClick={onClose} className="ml-0.5 text-muted hover:text-cream">
        <IconX size={13} />
      </button>
    </div>
  )
}

export default function MessageBubble({ msg, mine, onReply, onReact, onDeleteForEveryone, onDeleteForMe }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [reactOpen, setReactOpen] = useState(false)
  const longPress = useLongPress(() => !msg.deleted && setMenuOpen(true))

  // group reactions by emoji
  const grouped = {}
  if (msg.reactions) {
    for (const emoji of Object.values(msg.reactions)) {
      if (emoji) grouped[emoji] = (grouped[emoji] || 0) + 1
    }
  }
  const hasReactions = Object.keys(grouped).length > 0

  return (
    <div className={`group flex w-full ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className="relative max-w-[82%] md:max-w-[65%]">
        {/* reaction picker */}
        {reactOpen && (
          <ReactionBar
            reactions={msg.reactions}
            mine={mine}
            onPick={(r) => {
              onReact(msg.id, r)
              setReactOpen(false)
            }}
            onClose={() => setReactOpen(false)}
          />
        )}

        {/* long-press / right-click action menu */}
        {menuOpen && (
          <div className="absolute -top-2 right-0 z-20 w-44 overflow-hidden rounded-xl border border-line/70 bg-elev shadow-2xl">
            <button
              onClick={() => {
                onReply(msg)
                setMenuOpen(false)
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-cream/90 transition hover:bg-panel2 hover:text-cream"
            >
              <IconReply size={15} /> Reply
            </button>
            <button
              onClick={() => {
                setMenuOpen(false)
                setReactOpen(true)
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-cream/90 transition hover:bg-panel2 hover:text-cream"
            >
              <span className="text-base leading-none">😊</span> React
            </button>
            {mine && !msg.deleted && (
              <button
                onClick={() => {
                  if (window.confirm('Delete for everyone?')) onDeleteForEveryone(msg.id)
                  setMenuOpen(false)
                }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-rose transition hover:bg-elev2"
              >
                <IconTrash size={15} /> Delete for everyone
              </button>
            )}
            <button
              onClick={() => {
                if (window.confirm('Delete for me?')) onDeleteForMe(msg.id)
                setMenuOpen(false)
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-cream/90 transition hover:bg-elev2 hover:text-cream"
            >
              <IconTrash size={15} /> Delete for me
            </button>
          </div>
        )}

        <div
          {...longPress}
          className={`msg-anim relative rounded-2xl px-3 py-1.5 shadow-[0_1px_1px_rgba(0,0,0,0.22)] ${
            mine ? 'rounded-br-md bg-bubble text-white' : 'rounded-bl-md bg-panel2 text-cream'
          } ${msg.deleted ? 'italic text-muted' : ''}`}
        >
          {!msg.deleted && <Tail out={mine} />}

          {/* quoted reply */}
          {msg.replyTo && <ReplyPreview replyTo={msg.replyTo} />}

          <p className="whitespace-pre-wrap break-words pr-14 text-[14.5px] leading-relaxed">
            {msg.deleted ? (
              <span className="flex items-center gap-1.5">
                <IconX size={12} /> This message was deleted
              </span>
            ) : (
              msg.text
            )}
          </p>
          <span className="absolute bottom-1 right-2.5 flex items-center gap-1 text-[10.5px] leading-none text-white/55">
            {formatTime(msg.timestamp)}
            {mine &&
              (msg.deleted ? null : msg.read ? (
                <IconChecks size={13} className="text-sky" strokeWidth={2.2} />
              ) : (
                <IconCheck size={12} strokeWidth={2.2} />
              ))}
          </span>

          {/* reaction pills */}
          {hasReactions && (
            <div
              className={`absolute -bottom-3 flex items-center gap-0.5 rounded-full border border-line/60 bg-panel px-1.5 py-0.5 shadow ${
                mine ? 'left-2' : 'right-2'
              }`}
            >
              {Object.entries(grouped).map(([emoji, count]) => (
                <span key={emoji} className="flex items-center gap-0.5 text-[11px] leading-none">
                  {emoji}{count > 1 && <span className="text-[9px] text-muted">{count}</span>}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function TypingBubble({ name }) {
  return (
    <div className="msg-anim flex justify-start">
      <div className="relative flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-panel2 px-4 py-3 shadow-[0_1px_1px_rgba(0,0,0,0.22)]">
        <svg width="9" height="13" viewBox="0 0 9 13" className="absolute -left-[8px] bottom-0" aria-hidden="true">
          <path d="M9 0 C9 7 6 11 0 13 L9 13 Z" fill="#202c33" />
        </svg>
        <span className="tdot h-2 w-2 rounded-full bg-muted" />
        <span className="tdot h-2 w-2 rounded-full bg-muted" />
        <span className="tdot h-2 w-2 rounded-full bg-muted" />
      </div>
    </div>
  )
}

export function DateDivider({ label }) {
  return (
    <div className="my-2 flex justify-center">
      <span className="rounded-lg bg-elev/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted shadow">
        {label}
      </span>
    </div>
  )
}
