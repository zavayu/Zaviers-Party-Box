import { useState, useEffect } from 'react'

function EnterName({ 
  connectionStatus, 
  wsError, 
  onEnterName,
  onBack,
  onClearError,
  gameTitle = "Game",
  roomCode = "",
  isCreatingRoom = false,
  autoJoinError = null,
  onClearAutoJoinError = null
}) {
  const [playerName, setPlayerName] = useState('')

  // Load stored player name if available
  useEffect(() => {
    const storedName = localStorage.getItem('partybox-player-name')
    if (storedName && storedName.trim()) {
      setPlayerName(storedName.trim())
    }
  }, [])

  const isConnected = connectionStatus === 'connected'

  const handleEnterName = () => {
    if (!isConnected || !playerName.trim()) return
    onEnterName(playerName.trim())
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEnterName()
    }
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Enter Your Name
      </h2>
      <p className="text-gray-400 text-center mb-6">
        {gameTitle}
      </p>

      {roomCode && (
        <div className="bg-gray-700 rounded-xl p-4 mb-6 text-center">
          <p className="text-gray-300 text-sm mb-1">
            {isCreatingRoom ? 'Creating room...' : 'Joining room:'}
          </p>
          <p className="text-white font-bold text-xl">{roomCode}</p>
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center justify-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' :
            connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
            'bg-red-500'
          }`}></div>
          <span className="text-gray-400">
            {connectionStatus === 'connected' ? 'Connected' :
             connectionStatus === 'connecting' ? 'Connecting...' :
             'Disconnected'}
          </span>
        </div>
      </div>

      {(wsError || autoJoinError) && (
        <div className="mb-4 bg-red-900/50 border border-red-700 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <p className="text-red-200 text-sm">
              {autoJoinError || wsError}
            </p>
            {(onClearError || onClearAutoJoinError) && (
              <button
                onClick={() => {
                  if (autoJoinError && onClearAutoJoinError) {
                    onClearAutoJoinError()
                  } else if (onClearError) {
                    onClearError()
                  }
                }}
                className="text-red-300 hover:text-red-100 text-xs ml-2 px-2 py-1 rounded border border-red-600 hover:border-red-400 transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Your Name</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your name"
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:border-blue-500"
            autoFocus
            maxLength={20}
          />
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleEnterName}
          disabled={!isConnected || !playerName.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
        >
          {isCreatingRoom ? 'Create Room' : 'Join Room'}
        </button>

        <button
          onClick={onBack}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  )
}

export default EnterName