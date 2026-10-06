import { useEffect, useRef, useState } from 'react'
import { ref, push, onValue, update, set, remove } from 'firebase/database'
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
      // hide messages that I deleted "for me"
      setMessages(list.filter((m) => !(m.deletedFor && m.deletedFor[me.uid])))
    })
    return () => unsub()
  }, [chatId, me])

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

  function sendMessage(text, replyTo = null) {
    if (!chatId || !text.trim()) return
    const msg = {
      text: text.trim(),
      sender: me.uid,
      senderName: me.displayName || 'Unknown',
      timestamp: Date.now(),
      read: false,
    }
    if (replyTo) {
      // snapshot of the quoted message — survives the original being deleted
      msg.replyTo = {
        id: replyTo.id,
        text: (replyTo.text || '').slice(0, 140),
        sender: replyTo.sender,
        senderName: replyTo.senderName || '',
        deleted: Boolean(replyTo.deleted),
      }
    }
    push(ref(db, `chats/${chatId}/messages`), msg)
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

  /** Delete for everyone (sender only): tombstone like WhatsApp */
  function deleteForEveryone(id) {
    if (!chatId) return
    return update(ref(db, `chats/${chatId}/messages/${id}`), {
      text: '',
      deleted: true,
      reactions: null,
    })
  }

  /** Delete for me: hides the message only for this user */
  function deleteForMe(id) {
    if (!chatId) return
    return set(ref(db, `chats/${chatId}/messages/${id}/deletedFor/${me.uid}`), true)
  }

  /** Toggle an emoji reaction; one reaction per user (last tap wins) */
  function toggleReaction(id, emoji) {
    if (!chatId) return
    const msg = messages.find((m) => m.id === id)
    const current = msg?.reactions?.[me.uid]
    const next = current === emoji ? null : emoji
    return set(ref(db, `chats/${chatId}/messages/${id}/reactions/${me.uid}`), next)
  }

  return {
    messages,
    friendTyping,
    sendMessage,
    notifyTyping,
    deleteForEveryone,
    deleteForMe,
    toggleReaction,
  }
}
