import { useState } from 'react'

function RoomManager({ 
  connectionStatus, 
  wsError, 
  onCreateRoom, 
  onJoinRoom,
  onClearError,
  gameTitle = "Game"
}) {
  const [roomCode, setRoomCode] = useState('')
  const [playerName, setPlayerName] = useState('')

  const isConnected = connectionStatus === 'connected'

  const handleCreateRoom = () => {
    if (!isConnected || !playerName.trim()) return
    onCreateRoom(playerName.trim())
  }

  const handleJoinRoom = () => {
    if (!isConnected || !roomCode.trim() || !playerName.trim()) return
    onJoinRoom(roomCode.trim().toUpperCase(), playerName.trim())
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Create or Join Room
      </h2>
      <p className="text-gray-400 text-center mb-6">
        {gameTitle}
      </p>

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

      {wsError && (
        <div className="mb-4 bg-red-900/50 border border-red-700 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <p className="text-red-200 text-sm">{wsError}</p>
            {onClearError && (
              <button
                onClick={onClearError}
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
            placeholder="Enter your name"
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleCreateRoom}
          disabled={!isConnected || !playerName.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
        >
          Create Room
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-400">OR</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Room Code</label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Enter room code"
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:border-blue-500 uppercase"
              maxLength={6}
            />
          </div>
          <button
            onClick={handleJoinRoom}
            disabled={!isConnected || !roomCode.trim() || !playerName.trim()}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoomManager