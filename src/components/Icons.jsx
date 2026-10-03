// Hand-rolled 24x24 stroke icon set (lucide-ish style)
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function Svg({ size = 24, className = '', children, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base} {...rest}>
      {children}
    </svg>
  )
}

export const IconChats = (p) => (
  <Svg {...p}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </Svg>
)

export const IconSearch = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </Svg>
)

export const IconCompass = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5z" />
  </Svg>
)

export const IconSend = (p) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M3.4 20.4 20.9 12 3.4 3.6l.9 6.6c.1.6.6 1 1.2 1.1l8.1 1.1c.2 0 .2.3 0 .3l-8.1 1.1c-.6.1-1.1.5-1.2 1.1z" />
  </Svg>
)

export const IconArrowLeft = (p) => (
  <Svg {...p}>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </Svg>
)

export const IconGamepad = (p) => (
  <Svg {...p}>
    <path d="M6.5 7h11a4.5 4.5 0 0 1 4.4 5.5l-.8 3.6a2.8 2.8 0 0 1-4.9 1.2L15 15.6H9l-1.2 1.7a2.8 2.8 0 0 1-4.9-1.2l-.8-3.6A4.5 4.5 0 0 1 6.5 7Z" />
    <path d="M8 10.5v3M6.5 12h3" />
    <circle cx="15.5" cy="10.8" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="17.8" cy="13" r="0.9" fill="currentColor" stroke="none" />
  </Svg>
)

export const IconLogout = (p) => (
  <Svg {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5" />
    <path d="M21 12H9" />
  </Svg>
)

export const IconCheck = (p) => (
  <Svg {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Svg>
)

export const IconChecks = (p) => (
  <Svg {...p}>
    <path d="m1 13 4 4L14 7" />
    <path d="m9 15 2 2L21 7" />
  </Svg>
)

export const IconTrash = (p) => (
  <Svg {...p}>
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M10 11v6M14 11v6" />
  </Svg>
)

export const IconX = (p) => (
  <Svg {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Svg>
)

export const IconUserPlus = (p) => (
  <Svg {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M19 8v6M22 11h-6" />
  </Svg>
)

export const IconTrophy = (p) => (
  <Svg {...p}>
    <path d="M8 21h8M12 17v4" />
    <path d="M7 4h10v6a5 5 0 0 1-10 0z" />
    <path d="M7 6H4a1 1 0 0 0-1 1c0 2.5 1.8 4 4 4.5M17 6h3a1 1 0 0 1 1 1c0 2.5-1.8 4-4 4.5" />
  </Svg>
)

export const IconDice = (p) => (
  <Svg {...p}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="8.5" cy="15.5" r="1.2" fill="currentColor" stroke="none" />
  </Svg>
)

export const IconBell = (p) => (
  <Svg {...p}>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </Svg>
)

export const IconPlay = (p) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M8 5.5v13a1 1 0 0 0 1.5.9l10.5-6.5a1 1 0 0 0 0-1.8L9.5 4.6A1 1 0 0 0 8 5.5z" />
  </Svg>
)

export const IconRefresh = (p) => (
  <Svg {...p}>
    <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" />
    <path d="M3 21v-5h5" />
  </Svg>
)

export const IconLock = (p) => (
  <Svg {...p}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </Svg>
)

/** RivalChat logo — speech bubble with gamepad inside */
export function Logo({ size = 40, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <defs>
        <linearGradient id="lg-teal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#00d9a6" />
          <stop offset="1" stopColor="#008069" />
        </linearGradient>
      </defs>
      <path
        d="M24 4C12.4 4 4 12 4 22.2c0 5.5 2.6 10.4 6.8 13.8-.3 2.4-1.3 5.2-3.4 7.4 3.9-.4 7.2-1.9 9.5-3.6 2.2.7 4.6 1 7.1 1C35.6 40.8 44 32.8 44 22.2S35.6 4 24 4z"
        fill="url(#lg-teal)"
      />
      <g fill="none" stroke="#0b141a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 18.5h13a3.6 3.6 0 0 1 3.5 4.4l-.6 2.8a2.2 2.2 0 0 1-3.9 1L28 25h-8l-1.5 1.7a2.2 2.2 0 0 1-3.9-1l-.6-2.8a3.6 3.6 0 0 1 3.5-4.4Z" />
        <path d="M19.6 21.2v2.6M18.3 22.5h2.6" />
      </g>
      <circle cx="29.2" cy="21.2" r="1.15" fill="#0b141a" />
      <circle cx="31.3" cy="23.2" r="1.15" fill="#0b141a" />
    </svg>
  )
}
