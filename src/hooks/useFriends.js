import { useEffect, useState } from 'react'
import { ref, onValue, set, remove } from 'firebase/database'
import { db } from '../firebase.js'

export function useFriends(me) {
  const [friends, setFriends] = useState([])
  const [requests, setRequests] = useState([])
  const [statuses, setStatuses] = useState({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!me) {
      setFriends([])
      setRequests([])
      setReady(false)
      return
    }

    const unsubs = []

    unsubs.push(
      onValue(ref(db, `friends/${me.uid}`), (snap) => {
        const val = snap.val() || {}
        setFriends(Object.values(val))
        setReady(true)
      }),
    )

    unsubs.push(
      onValue(ref(db, 'friendRequests'), (snap) => {
        const val = snap.val() || {}
        setRequests(
          Object.entries(val)
            .filter(([, r]) => r.toUid === me.uid && r.status === 'pending')
            .map(([id, r]) => ({ id, ...r })),
        )
      }),
    )

    unsubs.push(
      onValue(ref(db, 'status'), (snap) => setStatuses(snap.val() || {})),
    )

    return () => unsubs.forEach((u) => u())
  }, [me])

  function sendFriendRequest(targetUid, targetName) {
    const requestId = `${me.uid}_${targetUid}`
    return set(ref(db, `friendRequests/${requestId}`), {
      fromUid: me.uid,
      fromName: me.displayName || 'Unknown',
      toUid: targetUid,
      toName: targetName,
      createdAt: Date.now(),
      status: 'pending',
    })
  }

  function acceptRequest(request) {
    remove(ref(db, `friendRequests/${request.id}`))
    set(ref(db, `friends/${me.uid}/${request.fromUid}`), {
      uid: request.fromUid,
      name: request.fromName,
      addedAt: Date.now(),
    })
    set(ref(db, `friends/${request.fromUid}/${me.uid}`), {
      uid: me.uid,
      name: me.displayName || 'Unknown',
      addedAt: Date.now(),
    })
  }

  function rejectRequest(request) {
    return remove(ref(db, `friendRequests/${request.id}`))
  }

  return { friends, requests, statuses, ready, sendFriendRequest, acceptRequest, rejectRequest }
}
