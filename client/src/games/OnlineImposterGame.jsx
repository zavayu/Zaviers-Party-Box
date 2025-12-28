import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnlineGame } from '../hooks/useOnlineGame'
import OnlineGameLobby from '../components/online/OnlineGameLobby'
import RoomManager from '../components/online/RoomManager'
import GameSettings from '../components/online/GameSettings'

function OnlineImposterGame() {
  const navigate = useNavigate()
  const {
    gamePhase,
    roomCode,
    setRoomCode,
    playerName,
    setPlayerName,
    players,
    clientId,
    isHost,
    gameState,
    setGameState,
    connectionStatus,
    wsError,
    isConnected,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    updateGameSettings,
    sendMessage,
    onMessage,
    clearError,
    
    // Refs
    clientIdRef
  } = useOnlineGame('secret-word')

  // Game-specific state
  const [isImposter, setIsImposter] = useState(false)
  const [secretWord, setSecretWord] = useState('')
  const [votedPlayer, setVotedPlayer] = useState('')
  const [votes, setVotes] = useState({})
  const [chatInput, setChatInput] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const chatMessagesRef = useRef(null)

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
    }
  }, [gameState.chatMessages])

  // Set up game-specific message handlers
  useEffect(() => {
    if (!isConnected) return

    const cleanupPlayerRole = onMessage('playerRole', (message) => {
      setIsImposter(message.isImposter)
      if (message.secretWord) {
        setSecretWord(message.secretWord)
      }
    })

    const cleanupGameStateUpdate = onMessage('gameStateUpdate', (message) => {
      if (message.roomState.gameState) {
        setVotes(message.roomState.gameState.votes || {})
      }
      // Reset local game state when returning to lobby
      if (message.roomState.gamePhase === 'lobby') {
        setIsImposter(false)
        setSecretWord('')
        setVotedPlayer('')
        setChatInput('')
      }
    })

    return () => {
      cleanupPlayerRole()
      cleanupGameStateUpdate()
    }
  }, [isConnected, onMessage])

  const handleGameSelect = (gameId) => {
    if (gameId === 'secret-word') {
      // Game selection is now handled by routing
    }
  }

  const handleCreateRoom = (name) => {
    createRoom(name)
  }

  const handleJoinRoom = (code, name) => {
    joinRoom(code, name)
  }

  const handleStartGame = () => {
    startGame()
  }

  const handleOpenSettings = () => {
    setShowSettings(true)
  }

  const handleCloseSettings = () => {
    setShowSettings(false)
  }

  const handleUpdateSettings = (settings) => {
    updateGameSettings(settings)
  }

  const handleRevealComplete = () => {
    if (!isConnected || !isHost) return
    sendMessage({ type: 'advancePhase', newPhase: 'discussion' })
  }

  const handleStartVoting = () => {
    if (!isConnected || !isHost) return
    sendMessage({ type: 'advancePhase', newPhase: 'voting' })
  }

  const handleVote = (votedPlayerId) => {
    if (!isConnected) return
    // Prevent voting for yourself
    const currentId = clientIdRef.current || clientId
    if (votedPlayerId === currentId) {
      console.warn('Cannot vote for yourself')
      return
    }
    
    // Find current player ID from the players list using playerName
    const currentPlayer = players.find(p => p.name === playerName)
    const myPlayerId = currentPlayer?.id || currentId
    
    console.log('Voting - myPlayerId:', myPlayerId, 'votedPlayerId:', votedPlayerId)
    sendMessage({ type: 'vote', votedPlayerId })
    setVotedPlayer(votedPlayerId)
    // Optimistically update votes state for immediate UI update
    if (myPlayerId) {
      setVotes(prevVotes => {
        const updated = { ...prevVotes, [myPlayerId]: votedPlayerId }
        console.log('Updated votes state:', updated)
        return updated
      })
    }
  }

  const handleShowResults = () => {
    if (!isConnected || !isHost) return
    sendMessage({ type: 'advancePhase', newPhase: 'results' })
  }

  const handlePlayAgain = () => {
    if (!isConnected || !isHost) return
    sendMessage({ type: 'playAgain' })
  }

  const handleSendChatMessage = (e) => {
    e.preventDefault()
    if (!isConnected || !chatInput.trim()) return
    
    sendMessage({ 
      type: 'sendChatMessage', 
      message: chatInput.trim() 
    })
    setChatInput('')
  }

  const handleBackToHome = () => {
    leaveRoom()
    navigate('/online')
    // Reset game-specific state
    setIsImposter(false)
    setSecretWord('')
    setVotedPlayer('')
    setVotes({})
    setChatInput('')
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {gamePhase !== 'createJoinRoom' && (
          <div className="mb-4">
            <button
              onClick={() => gamePhase === 'createJoinRoom' ? handleBackToHome() : navigate('/online')}
              className="text-gray-200 hover:text-white text-sm bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg transition-colors"
            >
              ← {gamePhase === 'createJoinRoom' ? 'Games' : 'Games'}
            </button>
          </div>
        )}

        {gamePhase === 'createJoinRoom' && (
          <RoomManager
            connectionStatus={connectionStatus}
            wsError={wsError}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            onClearError={clearError}
            gameTitle="Secret Word"
          />
        )}

        {gamePhase === 'lobby' && (
          <OnlineGameLobby
            roomCode={roomCode}
            players={players}
            isHost={isHost}
            onStartGame={handleStartGame}
            onOpenSettings={handleOpenSettings}
            gameSettings={gameState}
            minPlayers={3}
            gameTitle="Secret Word"
            connectionStatus={connectionStatus}
            wsError={wsError}
          />
        )}

        {gamePhase === 'roleReveal' && (
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Your Role
            </h2>

            <div className={`rounded-xl p-8 mb-8 text-center ${
              isImposter ? 'bg-red-900' : 'bg-green-900'
            }`}>
              {isImposter ? (
                <>
                  <p className="text-6xl mb-4">🎭</p>
                  <p className="text-3xl font-bold text-white mb-4">
                    You are the Imposter!
                  </p>
                  <p className="text-red-200">
                    Pretend you know the secret word. Try not to get caught!
                  </p>
                </>
              ) : (
                <>
                  <p className="text-6xl mb-4">✓</p>
                  <p className="text-2xl text-green-200 mb-4">
                    The secret word is:
                  </p>
                  <p className="text-4xl font-bold text-white mb-4">
                    {secretWord || gameState.secretWord || ''}
                  </p>
                  <p className="text-green-200">
                    Find the imposter who doesn't know this word!
                  </p>
                </>
              )}
            </div>

            {isHost && (
              <button
                onClick={handleRevealComplete}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
              >
                Continue to Discussion
              </button>
            )}
            {!isHost && (
              <div className="w-full bg-gray-700 text-gray-400 font-bold py-4 px-8 rounded-xl text-center">
                Waiting for host to continue...
              </div>
            )}
          </div>
        )}

        {gamePhase === 'discussion' && (
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white text-center flex-1">
                Discussion Time
              </h2>
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold w-10 h-10 rounded-full transition-colors flex items-center justify-center text-xl"
                title="Toggle instructions"
              >
                ?
              </button>
            </div>

            {/* Error Display */}
            {wsError && (
              <div className="mb-4 bg-red-900/50 border border-red-700 rounded-xl p-3 text-center">
                <p className="text-red-200 text-sm">{wsError}</p>
              </div>
            )}
            
            {/* Chat Messages */}
            <div className="bg-gray-700 rounded-xl p-4 mb-6 h-96 overflow-y-auto" ref={chatMessagesRef}>
              <h3 className="text-white font-bold mb-3">Chat Messages</h3>
              {gameState.chatMessages && gameState.chatMessages.length > 0 ? (
                <div className="space-y-2">
                  {gameState.chatMessages.map((msg, index) => (
                    <div key={index} className="bg-gray-600 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-blue-300 font-semibold text-sm">
                          {msg.playerName}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {new Date(msg.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <p className="text-white text-lg font-medium">{msg.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center italic">No messages yet. Start the discussion!</p>
              )}
            </div>

            {/* Turn Indicator and Chat Input */}
            {(() => {
              const currentPlayer = players.find(p => p.name === playerName)
              const currentId = currentPlayer?.id || clientIdRef.current || clientId
              const isMyTurn = gameState.currentTurnPlayerId === currentId
              const currentTurnPlayer = players.find(p => p.id === gameState.currentTurnPlayerId)
              
              return (
                <div className="mb-6">
                  {isMyTurn ? (
                    <div className="space-y-4">
                      <div className="bg-green-900 rounded-xl p-4 text-center border-2 border-green-400">
                        <p className="text-green-200 font-bold text-lg">
                          🎯 Your turn! Send one word hint
                        </p>
                      </div>
                      <form onSubmit={handleSendChatMessage} className="flex gap-3">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Type one word..."
                          className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:border-blue-500"
                          maxLength={50}
                          autoFocus
                        />
                        <button
                          type="submit"
                          disabled={!chatInput.trim()}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-colors"
                        >
                          Send
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="bg-gray-700 rounded-xl p-4 text-center">
                      <p className="text-gray-300 text-lg">
                        ⏳ Waiting for <span className="text-white font-bold">
                          {currentTurnPlayer?.name || 'someone'}
                        </span> to send their hint...
                      </p>
                    </div>
                  )}
                </div>
              )
            })()}

            {/* Game Instructions - Collapsible */}
            {showInstructions && (
              <div className="bg-gray-700 rounded-xl p-6 mb-6 space-y-3">
                <p className="text-gray-300 text-base">
                  💬 Take turns giving <strong>one word</strong> hints about the secret word
                </p>
                <p className="text-gray-300 text-base">
                  🕵️ Try to identify the imposter based on their hints
                </p>
                <p className="text-gray-300 text-base">
                  🎭 Imposter: give hints that could fit but don't give yourself away!
                </p>
              </div>
            )}

            {/* Host Controls */}
            <p className="text-gray-400 text-center mb-6">
              When everyone is ready to vote...
            </p>
            {isHost && (
              <button
                onClick={handleStartVoting}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
              >
                Start Voting
              </button>
            )}
            {!isHost && (
              <div className="w-full bg-gray-700 text-gray-400 font-bold py-4 px-8 rounded-xl text-center">
                Waiting for host to start voting...
              </div>
            )}
          </div>
        )}

        {gamePhase === 'voting' && (
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Vote for the Imposter
            </h2>
            <p className="text-gray-400 text-center mb-6">
              Who do you think is the imposter?
            </p>

            {(() => {
              const currentPlayer = players.find(p => p.name === playerName)
              const currentId = currentPlayer?.id || clientIdRef.current || clientId
              const myVote = currentId ? votes[currentId] : null
              return (
                <>
                  <div className="space-y-3 mb-6">
                    {players
                      .filter((player) => player.id !== currentId)
                      .map((player) => {
                        const playerId = player.id
                        const hasVoted = myVote === playerId

                        return (
                          <button
                            key={playerId}
                            onClick={() => handleVote(playerId)}
                            disabled={!!myVote}
                            className={`w-full font-bold py-4 px-8 rounded-xl text-lg transition-colors flex items-center justify-between ${
                              hasVoted
                                ? 'bg-green-600 text-white border-2 border-green-400'
                                : myVote
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-700 hover:bg-gray-600 text-white'
                            }`}
                          >
                            <span>{player.name}</span>
                            {hasVoted && <span className="text-2xl">✓</span>}
                          </button>
                        )
                      })}
                  </div>

                  {myVote && (
                    <div className="bg-green-900 rounded-xl p-4 mb-4 text-center border-2 border-green-400">
                      <p className="text-white text-lg">
                        ✓ You voted for: <span className="font-bold text-green-200">
                          {players.find(p => p.id === myVote)?.name || 'Unknown'}
                        </span>
                      </p>
                    </div>
                  )}
                </>
              )
            })()}

            {isHost && (
              <button
                onClick={handleShowResults}
                disabled={Object.keys(votes).length < players.length}
                className={`w-full font-bold py-4 px-8 rounded-xl text-xl transition-colors mt-4 ${
                  Object.keys(votes).length < players.length
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {Object.keys(votes).length < players.length
                  ? `Waiting for ${players.length - Object.keys(votes).length} more vote(s)...`
                  : 'Show Results'}
              </button>
            )}
          </div>
        )}

        {gamePhase === 'results' && (
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Results
            </h2>
            <div className="bg-red-900 rounded-xl p-8 mb-6 text-center">
              <p className="text-6xl mb-4">🎭</p>
              <p className="text-2xl text-red-200 mb-4">
                The imposters were:
              </p>
              <div className="text-white font-bold text-3xl mb-4 space-y-2">
                {gameState.imposters.map((imposterId) => {
                  const imposter = players.find(p => p.id === imposterId)
                  return imposter ? (
                    <div key={imposterId}>{imposter.name}</div>
                  ) : null
                })}
              </div>
            </div>
            <div className="bg-gray-700 rounded-xl p-6 mb-8 text-center">
              <p className="text-gray-300 text-lg mb-2">
                The secret word was:
              </p>
              <p className="text-3xl font-bold text-white">
                {gameState.secretWord || secretWord}
              </p>
            </div>
            <div className="bg-gray-700 rounded-xl p-6 mb-8">
              <p className="text-white font-bold mb-3">Votes:</p>
              <div className="space-y-2 text-gray-300">
                {players.map((player) => {
                  // Count votes for this player
                  const voteCount = Object.values(votes).filter(votedPlayerId => votedPlayerId === player.id).length
                  return (
                    <div key={player.id}>
                      {player.name}: {voteCount} {voteCount === 1 ? 'vote' : 'votes'}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="space-y-4">
              {isHost && (
                <button
                  onClick={handlePlayAgain}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
                >
                  Play Again
                </button>
              )}
              {!isHost && (
                <div className="w-full bg-gray-700 text-gray-400 font-bold py-4 px-8 rounded-xl text-center">
                  Waiting for host to restart game...
                </div>
              )}
              <button
                onClick={handleBackToHome}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
              >
                Back to Games
              </button>
            </div>
          </div>
        )}

        {/* Game Settings Modal */}
        <GameSettings
          isOpen={showSettings}
          onClose={handleCloseSettings}
          currentSettings={gameState}
          onUpdateSettings={handleUpdateSettings}
          gameTitle="Secret Word"
        />
      </div>
    </div>
  )
}

export default OnlineImposterGame
