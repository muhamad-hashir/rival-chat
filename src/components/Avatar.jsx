import { avatarGradient, initials } from '../utils.js'

export default function Avatar({ name, size = 44, online = null, className = '' }) {
  const dot = Math.max(9, Math.round(size * 0.26))
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <div
        className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br ${avatarGradient(name)} font-bold text-white select-none shadow-inner`}
        style={{ fontSize: size * 0.38 }}
      >
        {initials(name)}
      </div>
      {online !== null && (
        <span
          className={`absolute -right-0.5 -bottom-0.5 rounded-full border-[2.5px] border-panel ${online ? 'bg-teal' : 'bg-muted/60'}`}
          style={{ width: dot, height: dot }}
        />
      )}
    </div>
  )
}
