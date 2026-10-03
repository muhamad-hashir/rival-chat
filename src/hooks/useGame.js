import { useEffect, useRef, useState } from 'react'
import { ref, onValue, get, update } from 'firebase/database'
import { db, auth } from '../firebase.js'

/** Live state of `chats/{chatId}/games/{game}` */
export function useGameState(game, chatId) {
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!chatId) {
      setData(null)
      return
    }
    const gameRef = ref(db, `chats/${chatId}/games/${game}`)
    const unsub = onValue(gameRef, (snap) => setData(snap.val()))
    return () => unsub()
  }, [game, chatId])

  return data
}

/**
 * Claims a free slot in `players` exactly once per mount of the game screen.
 * slotKeys: ordered candidate keys, e.g. ['X','O'] or ['p1','p2'].
 * onClaim: optional extra fields to write together with the slot claim.
 */
export function useJoinGame(game, chatId, slotKeys, onClaim) {
  const joinedRef = useRef(false)
  // keep latest callbacks in refs to avoid effect re-runs
  const claimRef = useRef(onClaim)
  claimRef.current = onClaim
  const keysRef = useRef(slotKeys)
  keysRef.current = slotKeys

  useEffect(() => {
    if (!chatId || joinedRef.current) return
    joinedRef.current = true

    const uid = auth.currentUser?.uid
    if (!uid) return
    const base = `chats/${chatId}/games/${game}`

    get(ref(db, `${base}/players`)).then((snap) => {
      const players = snap.val() || {}
      if (keysRef.current.some((k) => players[k] === uid)) return
      const free = keysRef.current.find((k) => !players[k])
      if (!free) return
      const extras = claimRef.current ? claimRef.current(players, free) : {}
      update(ref(db, base), { [`players/${free}`]: uid, ...extras })
    })
  }, [chatId, game])
}

export function updateGame(game, chatId, updates) {
  return update(ref(db, `chats/${chatId}/games/${game}`), updates)
}
