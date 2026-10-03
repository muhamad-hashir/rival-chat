// Cover art SVGs for the games menu — each drawn to look great at ~card size.

export function TTTArt() {
  return (
    <svg viewBox="0 0 120 84" className="h-full w-full">
      <defs>
        <linearGradient id="ttt-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7c2d12" />
          <stop offset="1" stopColor="#431407" />
        </linearGradient>
      </defs>
      <rect width="120" height="84" rx="12" fill="url(#ttt-bg)" />
      <path d="M44 14v56M76 14v56M22 33h76M22 53h76" stroke="#f5c33b" strokeOpacity="0.85" strokeWidth="3" strokeLinecap="round" />
      <path d="M28 17l10 10M38 17L28 27" stroke="#ff6b6b" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="22" r="6.5" stroke="#53bdeb" strokeWidth="4" />
      <path d="M83 38l9 9M92 38l-9 9" stroke="#ff6b6b" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="64" r="6.5" stroke="#00d9a6" strokeWidth="4" />
      <circle cx="33" cy="64" r="6.5" stroke="#00d9a6" strokeWidth="4" />
      <path d="M31 20l7 7" stroke="#ff6b6b" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
    </svg>
  )
}

export function RPSArt() {
  return (
    <svg viewBox="0 0 120 84" className="h-full w-full">
      <defs>
        <linearGradient id="rps-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1e3a8a" />
          <stop offset="1" stopColor="#0c1e4e" />
        </linearGradient>
      </defs>
      <rect width="120" height="84" rx="12" fill="url(#rps-bg)" />
      {/* rock */}
      <path
        d="M18 52c-3-6 0-14 7-16 1-5 8-7 11-3 4-3 10-1 11 4 5 0 8 5 6 9-2 5-8 7-13 7H24c-3 0-5 0-6-1z"
        fill="#94a3b8" transform="translate(0 2) scale(0.78)"
      />
      {/* scissors */}
      <g stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" transform="translate(58 8) scale(0.9)">
        <path d="M4 36L24 8M24 36L4 8" />
        <circle cx="2" cy="42" r="4" fill="none" />
        <circle cx="26" cy="42" r="4" fill="none" />
      </g>
      {/* paper */}
      <g transform="translate(34 34) rotate(8)">
        <rect x="0" y="0" width="26" height="32" rx="4" fill="#f8fafc" />
        <path d="M5 8h16M5 14h16M5 20h11" stroke="#1e3a8a" strokeWidth="2.4" strokeLinecap="round" />
      </g>
      <circle cx="60" cy="46" r="9" fill="#f5c33b" />
      <text x="60" y="50" textAnchor="middle" fontSize="10" fontWeight="800" fill="#0c1e4e">VS</text>
    </svg>
  )
}

export function C4Art() {
  return (
    <svg viewBox="0 0 120 84" className="h-full w-full">
      <defs>
        <linearGradient id="c4-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d4ed8" />
          <stop offset="1" stopColor="#0f2461" />
        </linearGradient>
        <radialGradient id="c4-red" cx="0.35" cy="0.3" r="1">
          <stop offset="0" stopColor="#ffb3a0" />
          <stop offset="0.6" stopColor="#ff6b6b" />
          <stop offset="1" stopColor="#c22f2f" />
        </radialGradient>
        <radialGradient id="c4-yel" cx="0.35" cy="0.3" r="1">
          <stop offset="0" stopColor="#fff3c4" />
          <stop offset="0.6" stopColor="#f5c33b" />
          <stop offset="1" stopColor="#b8860b" />
        </radialGradient>
      </defs>
      <rect width="120" height="84" rx="12" fill="url(#c4-bg)" />
      {[0, 1, 2, 3, 4].map((r) =>
        [0, 1, 2, 3, 4].map((c) => (
          <circle key={`${r}-${c}`} cx={26 + c * 17} cy={18 + r * 14} r="5.5" fill="#0a1a45" opacity="0.9" />
        )),
      )}
      <circle cx="26" cy="60" r="5.5" fill="url(#c4-red)" />
      <circle cx="43" cy="60" r="5.5" fill="url(#c4-red)" />
      <circle cx="60" cy="60" r="5.5" fill="url(#c4-red)" />
      <circle cx="77" cy="60" r="5.5" fill="url(#c4-red)" />
      <circle cx="43" cy="46" r="5.5" fill="url(#c4-yel)" />
      <circle cx="60" cy="46" r="5.5" fill="url(#c4-yel)" />
      <circle cx="77" cy="46" r="5.5" fill="url(#c4-yel)" />
      <circle cx="26" cy="32" r="5.5" fill="url(#c4-yel)" />
    </svg>
  )
}

export function SLArt() {
  return (
    <svg viewBox="0 0 120 84" className="h-full w-full">
      <defs>
        <linearGradient id="sl-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#064e3b" />
          <stop offset="1" stopColor="#022c22" />
        </linearGradient>
      </defs>
      <rect width="120" height="84" rx="12" fill="url(#sl-bg)" />
      {/* mini snake */}
      <path
        d="M14 60 C22 44, 34 66, 44 50 S 62 34, 70 44"
        fill="none" stroke="#34d399" strokeWidth="5" strokeLinecap="round"
      />
      <circle cx="72" cy="43" r="5.5" fill="#34d399" />
      <circle cx="74" cy="41.5" r="1.2" fill="#022c22" />
      <path d="M77 40l5-2-4 4z" fill="#ff6b6b" />
      {/* ladder */}
      <g stroke="#f5c33b" strokeWidth="3" strokeLinecap="round">
        <path d="M84 72 L104 20" />
        <path d="M92 74 L112 22" />
        <path d="M87 62h6M90 52h6M93 42h6M96 32h6" />
      </g>
      {/* dice */}
      <g transform="translate(8 8)">
        <rect width="18" height="18" rx="5" fill="#f8fafc" />
        <circle cx="6" cy="6" r="1.8" fill="#064e3b" />
        <circle cx="12" cy="12" r="1.8" fill="#064e3b" />
      </g>
    </svg>
  )
}
