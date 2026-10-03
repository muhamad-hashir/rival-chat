import { IconArrowLeft, IconChats } from '../Icons.jsx'

export default function GameShell({ title, icon, onExit, children }) {
  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in flex-col bg-gradient-to-b from-panel via-[#0e1c24] to-ink">
      <header className="flex items-center gap-3 border-b border-line/60 bg-panel2/80 px-3 py-2.5 backdrop-blur">
        <button
          onClick={onExit}
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-elev hover:text-cream"
          title="Back to chat"
        >
          <IconArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2.5">
          {icon}
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
        </div>
        <button
          onClick={onExit}
          className="ml-auto flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-teal/50 hover:text-teal"
        >
          <IconChats size={14} /> Chat
        </button>
      </header>
      <div className="nice-scroll flex min-h-0 flex-1 flex-col items-center overflow-y-auto p-4">{children}</div>
    </div>
  )
}
