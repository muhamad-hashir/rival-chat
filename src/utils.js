export function chatIdFor(a, b) {
  return [a, b].sort().join('_')
}

export function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  let h = d.getHours()
  const m = String(d.getMinutes()).padStart(2, '0')
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h}:${m} ${ampm}`
}

export function formatListTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return formatTime(ts)
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function dayLabel(ts) {
  const d = new Date(ts)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return 'Today'
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

const AVATAR_GRADIENTS = [
  'from-teal to-emerald-600',
  'from-rose to-orange-500',
  'from-sky to-blue-600',
  'from-amber to-orange-600',
  'from-violet-500 to-fuchsia-600',
  'from-lime-500 to-teal-600',
  'from-pink-500 to-rose-600',
  'from-cyan-400 to-sky-600',
]

export function avatarGradient(name = '') {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length]
}

export function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase()
}

const AUTH_ERRORS = {
  'auth/invalid-email': 'That email address doesn’t look right.',
  'auth/user-not-found': 'No account found with that email.',
  'auth/wrong-password': 'Wrong password. Try again.',
  'auth/invalid-credential': 'Wrong email or password.',
  'auth/email-already-in-use': 'That email is already registered — try logging in.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Wait a moment and try again.',
  'auth/network-request-failed': 'Network error. Check your connection.',
}

export function friendlyAuthError(error) {
  return AUTH_ERRORS[error?.code] || error?.message || 'Something went wrong.'
}
