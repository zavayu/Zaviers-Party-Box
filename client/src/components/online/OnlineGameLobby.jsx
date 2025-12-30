import { useState } from 'react'

function OnlineGameLobby({ 
  roomCode, 
  players, 
  isHost, 
  onStartGame, 
  onOpenSettings,
  gameSettings = {},
  minPlayers = 3,
  gameTitle = "Game",
  connectionStatus,
  wsError,
  gameType = "" // Add gameType prop for generating URLs
}) {
  const [copySuccess, setCopySuccess] = useState(false)
  
  const canStart = players.length >= minPlayers

  // Generate shareable URL
  const shareableUrl = roomCode ? `${window.location.origin}/online/${gameType}/${roomCode}` : ''

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = shareableUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  // Debug info
  const storedRoomCode = localStorage.getItem('partybox-room-code')
  const storedPlayerName = localStorage.getItem('partybox-player-name')
  const persistentPlayerId = localStorage.getItem('partybox-player-id')

  return (
    <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
      {/* Debug Panel - only show in development */}
      {import.meta.env.DEV && (
        <div className="bg-red-900 rounded-lg p-3 mb-4 text-xs">
          <div className="text-red-200 font-bold mb-2">Debug Info:</div>
          <div className="text-red-300 space-y-1">
            <div>Connection: {connectionStatus}</div>
            <div>WS Error: {wsError || 'None'}</div>
            <div>Stored Room: {storedRoomCode || 'None'}</div>
            <div>Stored Name: {storedPlayerName || 'None'}</div>
            <div>Persistent ID: {persistentPlayerId ? persistentPlayerId.slice(0, 8) + '...' : 'None'}</div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-3xl font-bold text-white text-center flex-1">
          Lobby
        </h2>
        {isHost && onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
            title="Game Settings"
          >
            <span className="text-xl">⚙️</span>
          </button>
        )}
      </div>
      
      {roomCode && (
        <>
          <p className="text-gray-400 text-center mb-4">
            Room Code: <span className="text-white font-bold text-xl">{roomCode}</span>
          </p>
          
          {/* Share Link Section */}
          <div className="bg-gray-700 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-semibold">Share Link</span>
              <button
                onClick={handleCopyLink}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  copySuccess 
                    ? 'bg-green-600 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {copySuccess ? '✓ Copied!' : '📋 Copy Link'}
              </button>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-gray-300 text-sm font-mono break-all">
                {shareableUrl}
              </p>
            </div>
            <p className="text-gray-500 text-xs mt-2">
              Share this link with friends to let them join instantly
            </p>
          </div>
        </>
      )}

      {/* Game Settings Display - only show if settings are available */}
      {onOpenSettings && (
        gameSettings.selectedCategory ? (
          <div className="bg-gray-700 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="text-white font-semibold">Category Selected</div>
                <div className="text-gray-300 text-sm">{gameSettings.selectedCategory}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-700 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎲</span>
              <div>
                <div className="text-white font-semibold">Random Category</div>
                <div className="text-gray-300 text-sm">Game will choose randomly</div>
              </div>
            </div>
          </div>
        )
      )}

      <div className="bg-gray-700 rounded-xl p-6 mb-6">
        <h3 className="text-white font-bold mb-4">Players ({players.length})</h3>
        <div className="space-y-2">
          {players.map((player, index) => (
            <div key={index} className={`flex items-center justify-between rounded-lg p-3 ${
              player.isConnected === false ? 'bg-gray-600 opacity-60' : 'bg-gray-600'
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-white">{player.name}</span>
                {!player.isConnected && (
                  <span className="text-yellow-400 text-xs">🔌 Disconnected</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {player.isHost && (
                  <span className="text-yellow-400 text-sm">👑 Host</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-gray-400 text-sm mb-6">
        Waiting for more players... (Minimum {minPlayers} players)
      </div>

      {isHost && (
        <button
          onClick={onStartGame}
          disabled={!canStart}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
        >
          {canStart ? `Start ${gameTitle}` : `Need ${minPlayers - players.length} more player(s)`}
        </button>
      )}
      {!isHost && (
        <div className="w-full bg-gray-700 text-gray-400 font-bold py-4 px-8 rounded-xl text-center">
          Waiting for host to start the game...
        </div>
      )}
    </div>
  )
}

export default OnlineGameLobby