import { useEffect, useRef, useState } from 'react'
import { ref, push, onValue, update, set } from 'firebase/database'
import { db } from '../firebase.js'
import { chatIdFor } from '../utils.js'

export function useChat(me, friend) {
  const [messages, setMessages] = useState([])
  const [friendTyping, setFriendTyping] = useState(false)
  const markedRef = useRef(new Set())
  const typingTimer = useRef(null)

  const chatId = me && friend ? chatIdFor(me.uid, friend.uid) : null

  useEffect(() => {
    if (!chatId) {
      setMessages([])
      return
    }
    const unsub = onValue(ref(db, `chats/${chatId}/messages`), (snap) => {
      const val = snap.val() || {}
      const list = Object.entries(val).map(([id, m]) => ({ id, ...m }))
      list.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
      setMessages(list)
    })
    return () => unsub()
  }, [chatId])

  // Mark incoming messages read
  useEffect(() => {
    if (!chatId || !me) return
    for (const m of messages) {
      if (m.sender !== me.uid && !m.read && !markedRef.current.has(m.id)) {
        markedRef.current.add(m.id)
        update(ref(db, `chats/${chatId}/messages/${m.id}`), { read: true })
      }
    }
  }, [messages, chatId, me])

  // Listen to friend's typing flag
  useEffect(() => {
    if (!chatId || !friend) {
      setFriendTyping(false)
      return
    }
    const unsub = onValue(
      ref(db, `chats/${chatId}/typing/${friend.uid}`),
      (snap) => setFriendTyping(Boolean(snap.val())),
    )
    return () => unsub()
  }, [chatId, friend])

  function sendMessage(text) {
    if (!chatId || !text.trim()) return
    push(ref(db, `chats/${chatId}/messages`), {
      text: text.trim(),
      sender: me.uid,
      senderName: me.displayName || 'Unknown',
      timestamp: Date.now(),
      read: false,
    })
    set(ref(db, `chats/${chatId}/typing/${me.uid}`), false)
  }

  function notifyTyping() {
    if (!chatId) return
    set(ref(db, `chats/${chatId}/typing/${me.uid}`), true)
    clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => {
      set(ref(db, `chats/${chatId}/typing/${me.uid}`), false)
    }, 1500)
  }

  function deleteMessage(id) {
    if (!chatId) return
    return new Promise((resolve) => {
      if (window.confirm('Delete this message?')) {
        update(ref(db, `chats/${chatId}/messages/${id}`), {
          text: 'This message was deleted',
          deleted: true,
        }).finally(resolve)
      } else resolve()
    })
  }

  return { messages, friendTyping, sendMessage, notifyTyping, deleteMessage }
}
