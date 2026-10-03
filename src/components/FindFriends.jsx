import { useState } from 'react'
import { ref, get, set } from 'firebase/database'
import { db } from '../firebase.js'
import Avatar from './Avatar.jsx'
import { IconSearch, IconUserPlus, IconCheck } from './Icons.jsx'

export default function FindFriends({ me }) {
  const [term, setTerm] = useState('')
  const [results, setResults] = useState(null) // null = not searched yet
  const [searching, setSearching] = useState(false)
  const [sentTo, setSentTo] = useState({})

  async function search(e) {
    e?.preventDefault()
    const q = term.trim().toLowerCase()
    if (!q) return
    setSearching(true)
    try {
      const snap = await get(ref(db, 'users'))
      const users = snap.val() || {}
      const found = Object.values(users)
        .filter(
          (u) =>
            u.uid !== me.uid &&
            (u.username || '').toLowerCase().includes(q),
        )
        .slice(0, 30)
      setResults(found)
    } finally {
      setSearching(false)
    }
  }

  async function addFriend(user) {
    const requestId = `${me.uid}_${user.uid}`
    await set(ref(db, `friendRequests/${requestId}`), {
      fromUid: me.uid,
      fromName: me.displayName || 'Unknown',
      toUid: user.uid,
      toName: user.username,
      createdAt: Date.now(),
      status: 'pending',
    })
    setSentTo((s) => ({ ...s, [user.uid]: true }))
  }

  return (
    <div className="nice-scroll flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="p-4 pb-2">
        <h2 className="text-lg font-bold">Find rivals</h2>
        <p className="mt-0.5 text-sm text-muted">Search by username, then challenge them to anything.</p>
        <form onSubmit={search} className="mt-3 flex gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-elev px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-teal/30">
            <IconSearch size={17} className="shrink-0 text-muted" />
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search by username…"
              className="w-full bg-transparent text-sm placeholder:text-muted/70"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-teal px-4 text-sm font-bold text-ink transition hover:bg-[#00c495] active:scale-95"
          >
            {searching ? '…' : 'Search'}
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-1 p-2.5">
        {results === null ? (
          <p className="px-2 py-8 text-center text-sm text-muted">Type a username to search.</p>
        ) : results.length === 0 ? (
          <p className="px-2 py-8 text-center text-sm text-muted">No users found 🤷</p>
        ) : (
          results.map((user) => (
            <div
              key={user.uid}
              className="flex animate-fade-up items-center gap-3 rounded-2xl px-3 py-2.5 transition hover:bg-elev/70"
            >
              <Avatar name={user.username} size={42} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{user.username}</p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </div>
              {sentTo[user.uid] ? (
                <span className="flex items-center gap-1.5 rounded-full bg-teal/15 px-3 py-1.5 text-xs font-bold text-teal">
                  <IconCheck size={14} /> Sent
                </span>
              ) : (
                <button
                  onClick={() => addFriend(user)}
                  className="flex items-center gap-1.5 rounded-full bg-teal px-3.5 py-1.5 text-xs font-bold text-ink transition hover:bg-[#00c495] active:scale-95"
                >
                  <IconUserPlus size={14} /> Add
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
