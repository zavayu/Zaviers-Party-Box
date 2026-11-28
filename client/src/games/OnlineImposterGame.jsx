import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnlineGame } from '../hooks/useOnlineGame'
import OnlineGameLobby from '../components/online/OnlineGameLobby'
import CreateJoinRoom from '../components/online/CreateJoinRoom'
import EnterName from '../components/online/EnterName'
import ImposterClueOrder from '../components/ImposterClueOrder'
import ImposterRoleCard from '../components/ImposterRoleCard'
import GameSettings from '../components/online/GameSettings'

function OnlineImposterGame() {
  const navigate = useNavigate()
  const {
    gamePhase,
    setGamePhase,
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
    createRoomWithoutName,
    joinRoomWithoutName,
    enterNameAndJoinRoom,
    leaveRoom,
    startGame,
    updateGameSettings,
    sendMessage,
    onMessage,
    clearError,
    clientIdRef,
    urlRoomCode,
    autoJoinAttempted,
    autoJoinError,
    clearAutoJoinError,
    pendingRoomCode,
    pendingIsHost
  } = useOnlineGame('imposter')

  // Game-specific state
  const [role, setRole] = useState(null)
  const roundRole = role?.roundNumber === gameState.roundNumber ? role : null
  const isClueRound = gamePhase === 'clues'
  const currentTurnPlayer = players.find(player => player.id === gameState.currentTurnPlayerId)
  const myId = clientIdRef.current || clientId
  const canWrite = !isClueRound || currentTurnPlayer?.id === myId
  const votes = gameState.votes ?? {}
  const pendingVotes = players.filter(player => player.isConnected !== false && !votes[player.id]).length
  const clueOrder = (gameState.turnOrder ?? []).flatMap(id => {
    const player = players.find(candidate => candidate.id === id)
    return player ? [player.name] : []
  })
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
      setRole(message)
    })

    const cleanupGameStateUpdate = onMessage('gameStateUpdate', (message) => {
      // Reset local game state when returning to lobby
      if (message.roomState.gamePhase === 'lobby' || message.roomState.gamePhase === 'roleReveal') {
        if (message.roomState.gamePhase === 'lobby') setRole(null)
        setChatInput('')
      }
    })

    return () => {
      cleanupPlayerRole()
      cleanupGameStateUpdate()
    }
  }, [isConnected, onMessage])

  const handleGameSelect = (gameId) => {
    if (gameId === 'imposter') {
      // Game selection is now handled by routing
    }
  }

  const handleCreateRoom = (name) => {
    createRoom(name)
  }

  const handleJoinRoom = (code, name) => {
    joinRoom(code, name)
  }

  // New separated workflow actions
  const handleCreateRoomWithoutName = () => {
    createRoomWithoutName()
  }

  const handleJoinRoomWithoutName = (code) => {
    joinRoomWithoutName(code)
  }

  const handleEnterName = (name) => {
    enterNameAndJoinRoom(name)
  }

  const handleBackToCreateJoin = () => {
    setGamePhase('createJoinRoom')
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
    sendMessage({ type: 'advancePhase', newPhase: 'clues' })
  }

  const handleStartVoting = () => {
    if (!isConnected || !isHost) return
    sendMessage({ type: 'advancePhase', newPhase: 'voting' })
  }

  const handleVote = (votedPlayerId) => {
    if (!isConnected || votedPlayerId === myId) return
    sendMessage({ type: 'vote', votedPlayerId })
  }

  const handleShowResults = () => {
    if (!isConnected || !isHost) return
    sendMessage({ type: 'advancePhase', newPhase: 'results' })
  }

  const handlePlayAgain = (changeCategory = false) => {
    if (!isConnected || !isHost) return
    sendMessage({ type: 'playAgain', changeCategory })
    if (changeCategory) setShowSettings(true)
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
    setRole(null)
    setChatInput('')
  }

  return (
    <div className="game-screen">
      <div className="max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBackToHome}
            className="page-back"
          >
            ← Games
          </button>
          <span className="text-gray-400 text-sm">Secret Word</span>
        </div>

        {gamePhase === 'createJoinRoom' && (
          <CreateJoinRoom
            connectionStatus={connectionStatus}
            wsError={wsError}
            onCreateRoom={handleCreateRoomWithoutName}
            onJoinRoom={handleJoinRoomWithoutName}
            onClearError={clearError}
            gameTitle="Secret Word"
            initialRoomCode={urlRoomCode}
            showCreateRoom={!urlRoomCode}
            autoJoinError={autoJoinError}
            onClearAutoJoinError={clearAutoJoinError}
          />
        )}

        {gamePhase === 'enterName' && (
          <EnterName
            connectionStatus={connectionStatus}
            wsError={wsError}
            onEnterName={handleEnterName}
            onBack={handleBackToCreateJoin}
            onClearError={clearError}
            gameTitle="Secret Word"
            roomCode={pendingRoomCode}
            isCreatingRoom={pendingIsHost}
            autoJoinError={autoJoinError}
            onClearAutoJoinError={clearAutoJoinError}
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
            gameType="imposter"
          />
        )}

        {gamePhase === 'roleReveal' && (
          <div className="game-panel">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Your Role
            </h2>

            <ImposterRoleCard
              category={gameState.category}
              isImposter={roundRole?.isImposter}
              secretWord={roundRole?.secretWord}
              wordHint={roundRole?.wordHint}
            />

            {isHost && (
              <button
                onClick={handleRevealComplete}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
              >
                Start First Clues
              </button>
            )}
            {!isHost && (
              <div className="w-full bg-gray-700 text-gray-400 font-bold py-4 px-8 rounded-xl text-center">
                Waiting for host to continue...
              </div>
            )}
          </div>
        )}

        {(isClueRound || gamePhase === 'discussion') && (
          <div className="game-panel">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white text-center flex-1">
                {isClueRound ? 'First clues' : 'Discussion'}
              </h2>
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold w-10 h-10 rounded-full transition-colors flex items-center justify-center text-xl"
                title="Toggle instructions"
              >
                ?
              </button>
            </div>

            {isClueRound && <ImposterClueOrder names={clueOrder} />}
            {/* Error Display */}
            {wsError && (
              <div className="mb-4 bg-red-900/50 border border-red-700 rounded-xl p-3 text-center">
                <p className="text-red-200 text-sm">{wsError}</p>
              </div>
            )}
            
            {/* Chat Messages */}
            <div className="bg-gray-700 rounded-xl p-4 mb-4 max-h-48 overflow-y-auto" ref={chatMessagesRef}>
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
                <p className="text-gray-400 text-center italic">No messages yet.</p>
              )}
            </div>

            {isClueRound && (
              <p className="text-gray-200 mb-3">
                {canWrite ? 'Your turn. Give one word.' : currentTurnPlayer ? `Waiting for ${currentTurnPlayer.name}.` : 'Everyone has given a clue.'}
              </p>
            )}
            {canWrite && (
              <form onSubmit={handleSendChatMessage} className="flex gap-2 mb-5">
                <input
                  type="text"
                  aria-label={isClueRound ? 'Your clue' : 'Message'}
                  value={chatInput}
                  onChange={event => setChatInput(event.target.value)}
                  placeholder={isClueRound ? 'One word' : 'Discuss the clues'}
                  className="min-w-0 flex-1 bg-gray-700 px-3 py-3 rounded-lg border border-gray-600"
                  maxLength={isClueRound ? 50 : 300}
                />
                <button type="submit" disabled={!chatInput.trim()} className="bg-blue-600 disabled:bg-gray-600 font-bold px-4 rounded-lg">
                  Send
                </button>
              </form>
            )}

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

            {isHost && (
              <button
                onClick={isClueRound
                  ? () => sendMessage({ type: 'advancePhase', newPhase: 'discussion' })
                  : handleStartVoting}
                disabled={isClueRound && Boolean(currentTurnPlayer)}
                className="w-full min-h-12 bg-blue-600 disabled:bg-gray-600 font-bold rounded-lg"
              >
                {isClueRound ? 'Start Discussion' : 'Start Voting'}
              </button>
            )}
          </div>
        )}

        {gamePhase === 'voting' && (
          <div className="game-panel">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Vote for the Imposter
            </h2>
            <p className="text-gray-400 text-center mb-6">
              Who do you think is the imposter?
            </p>

            {(() => {
              const myVote = myId ? votes[myId] : null
              return (
                <>
                  <div className="space-y-3 mb-6">
                    {players
                      .filter(player => player.id !== myId)
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
                disabled={pendingVotes > 0}
                className={`w-full font-bold py-4 px-8 rounded-xl text-xl transition-colors mt-4 ${
                  pendingVotes > 0
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {pendingVotes > 0
                  ? `Waiting for ${pendingVotes} more vote(s)...`
                  : 'Show Results'}
              </button>
            )}
          </div>
        )}

        {gamePhase === 'results' && (
          <div className="game-panel">
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
                {gameState.secretWord || roundRole?.secretWord}
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
                  onClick={() => handlePlayAgain()}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
                >
                  Play Again
                </button>
              )}
              {isHost && (
                <button onClick={() => handlePlayAgain(true)} className="w-full min-h-12 bg-gray-700 font-bold rounded-lg">
                  Change Category
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

        {showSettings && gamePhase === 'lobby' && (
          <GameSettings
            onClose={handleCloseSettings}
            currentSettings={gameState}
            onUpdateSettings={handleUpdateSettings}
            playerCount={players.length}
          />
        )}
      </div>
    </div>
  )
}

export default OnlineImposterGame
