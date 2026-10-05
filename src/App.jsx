import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from './firebase.js'
import { useAuth } from './hooks/useAuth.js'
import { useFriends } from './hooks/useFriends.js'
import AuthScreen from './components/AuthScreen.jsx'
import Sidebar from './components/Sidebar.jsx'
import ChatWindow from './components/ChatWindow.jsx'
import { Logo } from './components/Icons.jsx'

export default function App() {
  const { user, loading } = useAuth()
  const {
    friends,
    requests,
    statuses,
    sendFriendRequest,
    acceptRequest,
    rejectRequest,
  } = useFriends(user)

  const [tab, setTab] = useState('chats')
  const [activeFriend, setActiveFriend] = useState(null)

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-ink">
        <div className="flex animate-pulse-dot flex-col items-center gap-3">
          <Logo size={56} />
          <p className="text-sm font-semibold text-muted">Loading RivalChat…</p>
        </div>
      </div>
    )
  }

  if (!user) return <AuthScreen />

  function selectFriend(friend) {
    setActiveFriend(friend)
    setTab('chats')
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-ink">
      {/* main chat layout — viewport-locked so only the message list scrolls
          and the chat header (name + status + Games) always stays visible */}
      <main className="mx-auto flex w-full max-w-[1400px] flex-1 overflow-hidden md:p-4">
        <div className="flex w-full overflow-hidden rounded-none border-0 shadow-none md:rounded-2xl md:border md:border-line/60 md:shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
          {/* sidebar — full on mobile when no chat open, always on desktop */}
          <div
            className={`h-full w-full shrink-0 md:block md:w-[360px] lg:w-[400px] ${
              activeFriend ? 'hidden' : 'flex'
            }`}
          >
            <Sidebar
              me={user}
              friends={friends}
              requests={requests}
              statuses={statuses}
              tab={tab}
              onTabChange={setTab}
              activeFriend={activeFriend}
              onSelectFriend={selectFriend}
              onAcceptRequest={acceptRequest}
              onRejectRequest={rejectRequest}
              onLogout={() => {
                setActiveFriend(null)
                signOut(auth)
              }}
              className="w-full"
            />
          </div>

          {/* chat window */}
          {activeFriend && (
            <ChatWindow
              me={user}
              friend={activeFriend}
              statuses={statuses}
              onBack={() => setActiveFriend(null)}
              className="flex-1"
            />
          )}
        </div>
      </main>

      {/* desktop footer credit */}
      <footer className="hidden pb-2 text-center text-[11px] text-muted/50 md:block">
        RivalChat — chat fast, play hard
      </footer>
    </div>
  )
}
