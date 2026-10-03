import { useMemo, useState } from 'react'
import Avatar from './Avatar.jsx'
import FindFriends from './FindFriends.jsx'
import { useLastMessage } from '../hooks/useLastMessage.js'
import { formatListTime } from '../utils.js'
import {
  IconChats,
  IconCompass,
  IconLogout,
  IconSearch,
  IconCheck,
  IconX,
  IconUserPlus,
} from './Icons.jsx'

function ChatRow({ me, friend, active, online, onSelect }) {
  const last = useLastMessage(me.uid, friend.uid)
  const mine = last?.sender === me.uid

  return (
    <button
      onClick={() => onSelect(friend)}
      className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition ${
        active ? 'bg-elev' : 'hover:bg-elev/60'
      }`}
    >
      <Avatar name={friend.name} size={48} online={online} />
      <div className="min-w-0 flex-1 border-b border-line/40 pb-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate font-semibold text-cream/95">{friend.name}</span>
          <span className={`shrink-0 text-[11px] ${last?.unread ? 'font-bold text-teal' : 'text-muted'}`}>
            {last ? formatListTime(last.timestamp) : ''}
          </span>
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <span className={`truncate text-[13px] ${last ? (last.deleted ? 'italic text-muted/80' : 'text-muted') : 'text-muted/60 italic'}`}>
            {last
              ? `${mine ? 'You: ' : ''}${last.deleted ? last.text : last.text}`
              : 'Say hi 👋'}
          </span>
          {last?.unread > 0 && (
            <span className="flex h-5 min-w-5 shrink-0 animate-pop items-center justify-center rounded-full bg-teal px-1.5 text-[11px] font-bold text-ink">
              {last.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

function RequestCard({ request, onAccept, onReject }) {
  return (
    <div className="flex animate-fade-up items-center gap-3 rounded-2xl border border-amber/25 bg-amber/[0.06] p-3">
      <Avatar name={request.fromName} size={40} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{request.fromName}</p>
        <p className="text-xs text-muted">wants to be your rival</p>
      </div>
      <div className="flex gap-1.5">
        <button
          onClick={() => onAccept(request)}
          title="Accept"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-teal text-ink transition hover:brightness-110 active:scale-95"
        >
          <IconCheck size={17} />
        </button>
        <button
          onClick={() => onReject(request)}
          title="Reject"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-elev text-muted transition hover:border-rose/50 hover:text-rose active:scale-95"
        >
          <IconX size={16} />
        </button>
      </div>
    </div>
  )
}

export default function Sidebar({
  me,
  friends,
  requests,
  statuses,
  tab,
  onTabChange,
  activeFriend,
  onSelectFriend,
  onAcceptRequest,
  onRejectRequest,
  onLogout,
  className = '',
}) {
  const [filter, setFilter] = useState('')

  const visibleFriends = useMemo(() => {
    const f = filter.trim().toLowerCase()
    if (!f) return friends
    return friends.filter((fr) => fr.name?.toLowerCase().includes(f))
  }, [friends, filter])

  return (
    <aside className={`flex h-full min-h-0 flex-col bg-panel ${className}`}>
      {/* profile header */}
      <header className="flex items-center gap-3 border-b border-line/60 bg-panel2 px-4 py-2.5">
        <Avatar name={me.displayName || me.email} size={38} online />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="font-extrabold tracking-tight">RivalChat</p>
          <p className="truncate text-xs text-muted">{me.displayName || me.email}</p>
        </div>
        <button
          onClick={onLogout}
          title="Log out"
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-elev hover:text-rose"
        >
          <IconLogout size={19} />
        </button>
      </header>

      {/* tabs */}
      <nav className="flex border-b border-line/60 bg-panel">
        {[
          { id: 'chats', label: 'Chats', Icon: IconChats, badge: requests.length },
          { id: 'find', label: 'Discover', Icon: IconCompass },
        ].map(({ id, label, Icon, badge }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`relative flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold transition ${
              tab === id ? 'text-teal' : 'text-muted hover:text-cream'
            }`}
          >
            <Icon size={18} />
            {label}
            {badge > 0 && (
              <span className="absolute right-[22%] top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose px-1 text-[10px] font-bold text-white">
                {badge}
              </span>
            )}
            {tab === id && <span className="absolute inset-x-0 bottom-0 h-[2.5px] rounded-full bg-teal" />}
          </button>
        ))}
      </nav>

      {/* body */}
      {tab === 'chats' ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="p-2.5 pb-0">
            <div className="flex items-center gap-2 rounded-xl bg-elev px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-teal/30">
              <IconSearch size={17} className="shrink-0 text-muted" />
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search conversations"
                className="w-full bg-transparent text-sm placeholder:text-muted/70"
              />
            </div>
          </div>

          <div className="nice-scroll min-h-0 flex-1 overflow-y-auto">
            {requests.length > 0 && (
              <div className="flex flex-col gap-2 p-2.5">
                {requests.map((r) => (
                  <RequestCard key={r.id} request={r} onAccept={onAcceptRequest} onReject={onRejectRequest} />
                ))}
              </div>
            )}

            {visibleFriends.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-8 py-14 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-elev text-teal">
                  <IconUserPlus size={30} />
                </div>
                <p className="mt-1 font-semibold">No chats here yet</p>
                <p className="text-sm text-muted">
                  Head to <span className="font-semibold text-teal">Discover</span> to find friends and start a rivalry.
                </p>
              </div>
            ) : (
              <div className="pb-3">
                {visibleFriends.map((friend) => (
                  <ChatRow
                    key={friend.uid}
                    me={me}
                    friend={friend}
                    active={activeFriend?.uid === friend.uid}
                    online={Boolean(statuses[friend.uid]?.online)}
                    onSelect={onSelectFriend}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <FindFriends me={me} />
      )}
    </aside>
  )
}
