import { IconCheck, IconChecks, IconTrash } from './Icons.jsx'
import { formatTime } from '../utils.js'

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

export default function MessageBubble({ msg, mine, onDelete }) {
  return (
    <div
      className={`group flex w-full ${mine ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`msg-anim relative max-w-[82%] rounded-2xl px-3 py-1.5 shadow-[0_1px_1px_rgba(0,0,0,0.22)] md:max-w-[65%] ${
          mine
            ? 'rounded-br-md bg-bubble text-white'
            : 'rounded-bl-md bg-panel2 text-cream'
        } ${msg.deleted ? 'italic text-muted' : ''}`}
      >
        {!msg.deleted && <Tail out={mine} />}
        <p className="whitespace-pre-wrap break-words pr-14 text-[14.5px] leading-relaxed">
          {msg.deleted ? 'This message was deleted' : msg.text}
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
        {mine && !msg.deleted && (
          <button
            onClick={onDelete}
            title="Delete message"
            className="absolute -top-2.5 -left-2.5 hidden h-6 w-6 items-center justify-center rounded-full border border-line bg-elev text-muted opacity-0 shadow transition hover:text-rose group-hover:opacity-100 md:flex"
          >
            <IconTrash size={12} />
          </button>
        )}
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
