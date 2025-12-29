import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnlineGame } from '../hooks/useOnlineGame'
import OnlineGameLobby from '../components/online/OnlineGameLobby'
import RoomManager from '../components/online/RoomManager'
import { WORD_HUNT_DICTIONARY } from '../game-data/wordHuntData'

// Helper functions (copied from offline version)
const getAdjacentIndices = (index) => {
  const row = Math.floor(index / 4)
  const col = index % 4
  const adjacent = []
  
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r >= 0 && r < 4 && c >= 0 && c < 4) {
        const adjIndex = r * 4 + c
        if (adjIndex !== index) adjacent.push(adjIndex)
      }
    }
  }
  
  return adjacent
}

const calculateScore = (wordLength) => {
  if (wordLength === 3) return 100
  if (wordLength === 4) return 400
  if (wordLength === 5) return 800
  if (wordLength === 6) return 1400
  if (wordLength === 7) return 1800
  return 2000 + (wordLength - 8) * 400
}

const getTileCenter = (index) => {
  const row = Math.floor(index / 4)
  const col = index % 4
  return {
    x: col * 100 + 50, // assuming 100% width divided by 4
    y: row * 100 + 50
  }
}

function OnlineWordHuntGame() {
  const navigate = useNavigate()
  const {
    gamePhase,
    roomCode,
    players,
    clientId,
    isHost,
    gameState,
    connectionStatus,
    wsError,
    isConnected,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    sendMessage,
    onMessage,
    clearError,
    clientIdRef
  } = useOnlineGame('word-hunt')

  // Game-specific state
  const [board, setBoard] = useState([])
  const [selectedPath, setSelectedPath] = useState([])
  const [foundWords, setFoundWords] = useState(new Set())
  const [playerScore, setPlayerScore] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(80)
  const [gameStartTime, setGameStartTime] = useState(null)
  const [gameDuration, setGameDuration] = useState(80)
  const [isGameActive, setIsGameActive] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [wordFeedback, setWordFeedback] = useState(null)
  const [allPlayerScores, setAllPlayerScores] = useState({})
  
  const boardRef = useRef(null)
  const audioContextRef = useRef(null)
  const audioBuffersRef = useRef({})
  const clientTimerRef = useRef(null)

  // Initialize Web Audio API for better mobile performance
  useEffect(() => {
    const initAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
        
        const audioFiles = {
          word1: '/sounds/word1.wav',
          word2: '/sounds/word2.wav',
          word3: '/sounds/word3.wav',
          word4: '/sounds/word4.wav',
          tile: '/sounds/tile.wav',
          gameStart: '/sounds/entrance.wav'
        }
        
        for (const [key, url] of Object.entries(audioFiles)) {
          try {
            const response = await fetch(url)
            const arrayBuffer = await response.arrayBuffer()
            audioBuffersRef.current[key] = await audioContextRef.current.decodeAudioData(arrayBuffer)
          } catch (error) {
            console.log(`Failed to load ${key}:`, error)
          }
        }
      } catch (error) {
        console.log('Web Audio API not supported:', error)
      }
    }
    
    initAudio()
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Client-side timer for smooth countdown
  useEffect(() => {
    if (isGameActive && gameStartTime && gameDuration) {
      // Start client-side timer
      clientTimerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - gameStartTime) / 1000)
        const remaining = Math.max(0, gameDuration - elapsed)
        setTimeRemaining(remaining)
        
        // Stop timer when it reaches 0
        if (remaining <= 0) {
          clearInterval(clientTimerRef.current)
          clientTimerRef.current = null
        }
      }, 1000)
    } else {
      // Clear timer when game is not active
      if (clientTimerRef.current) {
        clearInterval(clientTimerRef.current)
        clientTimerRef.current = null
      }
    }

    // Cleanup on unmount or dependency change
    return () => {
      if (clientTimerRef.current) {
        clearInterval(clientTimerRef.current)
        clientTimerRef.current = null
      }
    }
  }, [isGameActive, gameStartTime, gameDuration])

  // Set up game-specific message handlers
  useEffect(() => {
    if (!isConnected) return

    const cleanupGameStateUpdate = onMessage('gameStateUpdate', (message) => {
      if (message.roomState.gameState) {
        const gs = message.roomState.gameState
        setBoard(gs.board || [])
        setIsGameActive(gs.isGameActive || false)
        setAllPlayerScores(gs.allPlayerScores || {})
        
        // Update timing information
        if (gs.gameStartTime) {
          setGameStartTime(gs.gameStartTime)
        }
        if (gs.gameDuration) {
          setGameDuration(gs.gameDuration)
        }
        
        // Set server time as fallback, but client timer will take over
        if (gs.timeRemaining !== undefined) {
          setTimeRemaining(gs.timeRemaining)
        }
        
        // Update current player's data
        const currentId = clientIdRef.current || clientId
        if (currentId && gs.playerScores && gs.playerScores[currentId]) {
          const playerData = gs.playerScores[currentId]
          setPlayerScore(playerData.score || 0)
          setFoundWords(new Set(playerData.foundWords || [])) // foundWords is now an array
        }
      }
      
      // Reset local game state when returning to lobby
      if (message.roomState.gamePhase === 'lobby') {
        setBoard([])
        setSelectedPath([])
        setFoundWords(new Set())
        setPlayerScore(0)
        setTimeRemaining(80)
        setGameStartTime(null)
        setGameDuration(80)
        setIsGameActive(false)
        setWordFeedback(null)
        setAllPlayerScores({})
      }
    })

    const cleanupWordResult = onMessage('wordResult', (message) => {
      if (message.success) {
        setWordFeedback({ 
          word: message.word, 
          status: 'valid', 
          points: message.points 
        })
        playDingSound(message.word.length)
      } else {
        setWordFeedback({ 
          word: selectedPath.map(i => board[i]).join(''), 
          status: 'invalid', 
          message: message.error 
        })
      }
      setTimeout(() => setWordFeedback(null), 1500)
    })

    return () => {
      cleanupGameStateUpdate()
      cleanupWordResult()
    }
  }, [isConnected, onMessage, clientId, selectedPath, board])

  // Sound functions
  const playDingSound = (wordLength) => {
    let bufferKey
    if (wordLength === 3) bufferKey = 'word1'
    else if (wordLength === 4) bufferKey = 'word2'
    else if (wordLength === 5) bufferKey = 'word3'
    else bufferKey = 'word4'
    
    if (audioContextRef.current && audioBuffersRef.current[bufferKey]) {
      const source = audioContextRef.current.createBufferSource()
      source.buffer = audioBuffersRef.current[bufferKey]
      source.connect(audioContextRef.current.destination)
      source.start(0)
    }
  }

  const playTileSelectSound = () => {
    if (audioContextRef.current && audioBuffersRef.current.tile) {
      const source = audioContextRef.current.createBufferSource()
      source.buffer = audioBuffersRef.current.tile
      source.connect(audioContextRef.current.destination)
      source.start(0)
    }
  }

  const playGameStartSound = () => {
    if (audioContextRef.current && audioBuffersRef.current.gameStart) {
      const source = audioContextRef.current.createBufferSource()
      source.buffer = audioBuffersRef.current.gameStart
      source.connect(audioContextRef.current.destination)
      source.start(0)
    }
  }

  // Game actions
  const handleCreateRoom = (name) => {
    createRoom(name)
  }

  const handleJoinRoom = (code, name) => {
    joinRoom(code, name)
  }

  const handleStartGame = () => {
    startGame()
  }

  const handlePlayAgain = () => {
    if (!isConnected || !isHost) return
    sendMessage({ type: 'playAgain' })
  }

  const handleBackToHome = () => {
    leaveRoom()
    navigate('/online')
    // Reset game-specific state
    setBoard([])
    setSelectedPath([])
    setFoundWords(new Set())
    setPlayerScore(0)
    setTimeRemaining(80)
    setGameStartTime(null)
    setGameDuration(80)
    setIsGameActive(false)
    setWordFeedback(null)
    setAllPlayerScores({})
    
    // Clear client timer
    if (clientTimerRef.current) {
      clearInterval(clientTimerRef.current)
      clientTimerRef.current = null
    }
  }

  // Touch/mouse handlers for board interaction
  const handlePointerDown = (e, index) => {
    e.preventDefault()
    
    if (!isGameActive) return
    
    // Resume audio context on first user interaction
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
    }
    
    setIsDragging(true)
    setSelectedPath([index])
    setWordFeedback(null)
    playTileSelectSound()
  }

  const handlePointerMove = (e) => {
    if (!isDragging || !boardRef.current || !isGameActive) return
    
    const tiles = boardRef.current.querySelectorAll('[data-tile-index]')
    const point = { x: e.clientX, y: e.clientY }
    const lastIndex = selectedPath[selectedPath.length - 1]
    const adjacentIndices = getAdjacentIndices(lastIndex)
    
    let selectedIndex = null
    const bufferPercent = 0.18
    
    // Check if pointer is over any tile
    for (const tile of tiles) {
      const rect = tile.getBoundingClientRect()
      const bufferX = rect.width * bufferPercent
      const bufferY = rect.height * bufferPercent
      
      if (
        point.x >= rect.left + bufferX &&
        point.x <= rect.right - bufferX &&
        point.y >= rect.top + bufferY &&
        point.y <= rect.bottom - bufferY
      ) {
        const index = parseInt(tile.dataset.tileIndex)
        if (!selectedPath.includes(index) && adjacentIndices.includes(index)) {
          selectedIndex = index
          break
        }
      }
    }
    
    // Add tile if found
    if (selectedIndex !== null && selectedPath[selectedPath.length - 1] !== selectedIndex) {
      setSelectedPath(prev => {
        if (prev.includes(selectedIndex)) return prev
        return [...prev, selectedIndex]
      })
      playTileSelectSound()
      if (navigator.vibrate) navigator.vibrate(10)
    }
  }

  const handlePointerUp = () => {
    if (!isDragging || !isGameActive) return
    
    setIsDragging(false)
    
    if (selectedPath.length >= 3) {
      const word = selectedPath.map(i => board[i]).join('')
      submitWord(word, selectedPath)
    }
    
    setSelectedPath([])
  }

  const submitWord = (word, path) => {
    if (!isConnected || !isGameActive) return
    
    const lowerWord = word.toLowerCase()
    
    // Check if already found locally (for immediate feedback)
    if (foundWords.has(lowerWord)) {
      setWordFeedback({ word, status: 'duplicate', message: 'Already used' })
      setTimeout(() => setWordFeedback(null), 1500)
      return
    }
    
    // Send to server for validation
    sendMessage({ 
      type: 'submitWord', 
      word: lowerWord,
      path: path
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBackToHome}
            className="text-gray-200 hover:text-white text-sm bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg transition-colors"
          >
            ← Games
          </button>
          <span className="text-gray-400 text-sm">Word Hunt</span>
        </div>

        {gamePhase === 'createJoinRoom' && (
          <RoomManager
            connectionStatus={connectionStatus}
            wsError={wsError}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            onClearError={clearError}
            gameTitle="Word Hunt"
          />
        )}

        {gamePhase === 'lobby' && (
          <OnlineGameLobby
            roomCode={roomCode}
            players={players}
            isHost={isHost}
            onStartGame={handleStartGame}
            minPlayers={2}
            gameTitle="Word Hunt"
            connectionStatus={connectionStatus}
            wsError={wsError}
          />
        )}

        {gamePhase === 'playing' && (
          <div className="space-y-4">
            {/* Game Header */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Score</p>
                  <p className="text-2xl font-bold text-white">{playerScore.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Time</p>
                  <p className={`text-2xl font-bold ${timeRemaining <= 10 ? 'text-red-400' : 'text-white'}`}>
                    {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Words</p>
                  <p className="text-2xl font-bold text-blue-400">{foundWords.size}</p>
                </div>
              </div>

              {!isGameActive && (
                <div className="w-full bg-gray-700 text-gray-400 font-bold py-3 px-6 rounded-xl text-center">
                  Game starting...
                </div>
              )}
            </div>

            {/* Word Feedback */}
            <div className="h-14 flex items-center justify-center">
              <div
                className={`rounded-lg px-4 font-bold text-lg tracking-wider transition-all duration-200
                  ${selectedPath.length || wordFeedback ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                  ${(() => {
                    if (selectedPath.length) return 'bg-gray-800 text-white'
                    if (!wordFeedback) return 'bg-gray-800 text-gray-200'
                    if (wordFeedback.status === 'valid') return 'bg-green-600 text-white'
                    if (wordFeedback.status === 'duplicate') return 'bg-yellow-400 text-gray-900'
                    return 'bg-red-600 text-white'
                  })()}`}
              >
                {selectedPath.length
                  ? selectedPath.map(i => board[i]).join('')
                  : wordFeedback
                    ? wordFeedback.status === 'valid'
                      ? `${wordFeedback.word.toUpperCase()} (+${wordFeedback.points})`
                      : `${wordFeedback.word.toUpperCase()}`
                    : ' '}
              </div>
            </div>

            {/* Game Board */}
            {board.length > 0 && (
              <div 
                ref={boardRef}
                className="relative w-full aspect-square bg-gray-800 rounded-2xl p-2 select-none"
                style={{ touchAction: 'none' }}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              >
                {/* SVG for connecting lines */}
                {selectedPath.length > 1 && (() => {
                  let lineColor = '#3B82F6' // Blue - default
                  if (selectedPath.length >= 3) {
                    const currentWord = selectedPath.map(i => board[i]).join('').toLowerCase()
                    if (foundWords.has(currentWord)) {
                      lineColor = '#EAB308' // Yellow - already used
                    } else if (WORD_HUNT_DICTIONARY.has(currentWord)) {
                      lineColor = '#16A34A' // Green - valid word
                    }
                  }
                  
                  return (
                    <svg className="absolute inset-0 pointer-events-none z-10" style={{ width: '100%', height: '100%' }}>
                      {selectedPath.slice(0, -1).map((fromIndex, i) => {
                        const toIndex = selectedPath[i + 1]
                        const from = getTileCenter(fromIndex)
                        const to = getTileCenter(toIndex)
                        return (
                          <line
                            key={`${fromIndex}-${toIndex}`}
                            x1={`${from.x / 4}%`}
                            y1={`${from.y / 4}%`}
                            x2={`${to.x / 4}%`}
                            y2={`${to.y / 4}%`}
                            stroke={lineColor}
                            strokeWidth="8"
                            strokeLinecap="round"
                          />
                        )
                      })}
                    </svg>
                  )
                })()}

                {/* Grid */}
                <div className="grid grid-cols-4 gap-3 h-full">
                  {board.map((letter, index) => {
                    const isSelected = selectedPath.includes(index)
                    
                    let tileColor = 'bg-gray-700 text-white hover:bg-gray-600'
                    if (isSelected && selectedPath.length >= 3) {
                      const currentWord = selectedPath.map(i => board[i]).join('').toLowerCase()
                      if (foundWords.has(currentWord)) {
                        tileColor = 'bg-yellow-500 text-gray-900'
                      } else if (WORD_HUNT_DICTIONARY.has(currentWord)) {
                        tileColor = 'bg-green-600 text-white'
                      } else {
                        tileColor = 'bg-blue-600 text-white'
                      }
                    } else if (isSelected) {
                      tileColor = 'bg-blue-600 text-white'
                    }
                    
                    return (
                      <div
                        key={index}
                        data-tile-index={index}
                        onPointerDown={(e) => handlePointerDown(e, index)}
                        className={`
                          relative flex items-center justify-center rounded-xl font-black text-3xl
                          transition-all duration-150 cursor-pointer select-none
                          ${isSelected ? 'scale-105 shadow-xl z-10' : 'scale-100 shadow-md'}
                          ${tileColor}
                          ${!isGameActive ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        style={{ touchAction: 'none' }}
                      >
                        {letter}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {gamePhase === 'results' && (
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Game Over!
            </h2>

            {/* Final Scores Leaderboard */}
            <div className="bg-gray-700 rounded-xl p-6 mb-6">
              <h3 className="text-white font-bold mb-4 text-center">Final Scores</h3>
              
              <div className="space-y-3">
                {Object.keys(allPlayerScores).length === 0 ? (
                  <div className="text-gray-400 text-center">No scores available</div>
                ) : (
                  Object.entries(allPlayerScores)
                    .sort(([,a], [,b]) => b.score - a.score)
                    .map(([playerId, data], index) => {
                      const currentId = clientIdRef.current || clientId
                      const isCurrentPlayer = playerId === currentId
                      
                      return (
                        <div key={playerId} className={`rounded-lg p-4 ${isCurrentPlayer ? 'bg-blue-600' : 'bg-gray-600'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}
                              </span>
                              <span className={`font-semibold ${isCurrentPlayer ? 'text-white' : 'text-white'}`}>
                                {data.playerName} {isCurrentPlayer ? '(You)' : ''}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-bold text-lg">{data.score.toLocaleString()}</div>
                              <div className={`text-sm ${isCurrentPlayer ? 'text-blue-200' : 'text-gray-400'}`}>
                                {data.wordCount} words
                              </div>
                            </div>
                          </div>
                          
                          {/* Show player's words */}
                          {data.foundWords && data.foundWords.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-500">
                              <div className="flex flex-wrap gap-1">
                                {data.foundWords
                                  .sort((a, b) => b.length - a.length)
                                  .map(word => (
                                    <span
                                      key={word}
                                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        isCurrentPlayer 
                                          ? 'bg-blue-700 text-blue-100' 
                                          : 'bg-gray-700 text-gray-300'
                                      }`}
                                    >
                                      {word.toUpperCase()}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })
                )}
              </div>
            </div>

            {/* Host Controls */}
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
                  Waiting for host to start new game...
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
      </div>
    </div>
  )
}

export default OnlineWordHuntGame