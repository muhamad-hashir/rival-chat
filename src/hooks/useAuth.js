import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { ref, onValue, set, onDisconnect } from 'firebase/database'
import { auth, db } from '../firebase.js'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setUser(u)
        setLoading(false)
      }),
    [],
  )

  // Presence: mark me online while connected, offline on disconnect
  useEffect(() => {
    if (!user) return
    const statusRef = ref(db, `status/${user.uid}`)
    const unsub = onValue(ref(db, '.info/connected'), (snap) => {
      if (snap.val() === true) {
        onDisconnect(statusRef).set({ online: false, lastSeen: Date.now() })
        set(statusRef, { online: true })
      }
    })
    return () => unsub()
  }, [user])

  return { user, loading }
}
