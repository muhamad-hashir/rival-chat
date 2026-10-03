import { useEffect, useState } from 'react'
import { ref, onValue, query, limitToLast } from 'firebase/database'
import { db } from '../firebase.js'
import { chatIdFor } from '../utils.js'

export function useLastMessage(meUid, friendUid) {
  const [last, setLast] = useState(null)

  useEffect(() => {
    if (!meUid || !friendUid) return
    const chatId = chatIdFor(meUid, friendUid)
    const unsub = onValue(
      query(ref(db, `chats/${chatId}/messages`), limitToLast(25)),
      (snap) => {
        const list = Object.values(snap.val() || {})
        if (!list.length) {
          setLast(null)
          return
        }
        list.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
        const lastMsg = list[list.length - 1]
        const unread = list.filter((m) => m.sender !== meUid && !m.read).length
        setLast({ ...lastMsg, unread })
      },
    )
    return () => unsub()
  }, [meUid, friendUid])

  return last
}
