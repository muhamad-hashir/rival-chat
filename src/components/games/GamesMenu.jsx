import { TTTArt, RPSArt, C4Art, SLArt } from './gameArt.jsx'
import { IconX, IconGamepad, IconDice } from '../Icons.jsx'

const GAMES = [
  { id: 'tictactoe', name: 'Tic Tac Toe', tag: 'Three in a row', Art: TTTArt },
  { id: 'rps', name: 'Rock Paper Scissors', tag: 'First to 3', Art: RPSArt },
  { id: 'connect4', name: 'Connect Four', tag: 'Drop & connect', Art: C4Art },
  { id: 'ladsnake', name: 'Snakes & Ladders', tag: 'Race to 100', Art: SLArt },
]

export default function GamesMenu({ friendName, onPick, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm md:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg animate-slide-up rounded-t-3xl border border-line/60 bg-panel p-5 pb-7 shadow-2xl md:rounded-3xl md:pb-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal/15 text-teal">
            <IconGamepad size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold leading-tight">Play a game</h2>
            <p className="text-xs text-muted">Live against {friendName} — loser buys the virtual chai.</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-elev hover:text-cream"
          >
            <IconX size={19} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {GAMES.map(({ id, name, tag, Art }) => (
            <button
              key={id}
              onClick={() => onPick(id)}
              className="group overflow-hidden rounded-2xl border border-line/60 bg-elev/50 text-left transition hover:-translate-y-0.5 hover:border-teal/50 hover:shadow-[0_10px_30px_rgba(0,168,132,0.15)] active:scale-[0.98]"
            >
              <div className="aspect-[10/7] w-full overflow-hidden">
                <Art />
              </div>
              <div className="p-3">
                <p className="text-sm font-bold">{name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted">
                  <IconDice size={11} /> {tag}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
