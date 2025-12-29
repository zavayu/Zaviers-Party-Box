import { GameFactory } from '../games/GameFactory.js'
import { Room } from '../models/Room.js'
import { getGameConfig, validatePlayerCount } from '../utils/gameRegistry.js'

// Valid categories for imposter game (could be imported from game data)
const VALID_CATEGORIES = [
  'Animals', 'Food', 'Movies', 'Sports', 'Professions', 'Countries', 'Cities', 
  'Brands', 'Instruments', 'Colors', 'Vehicles', 'Furniture', 'Technology', 
  'Clothing', 'Weather', 'School', 'Superheroes', 'Body', 'Hobbies', 
  'VideoGames', 'Animes', 'Nature'
]

// Generate unique room code
function generateRoomCode(rooms) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let attempts = 0
  let code
  
  do {
    code = ''
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)]
    }
    attempts++
  } while (rooms.has(code) && attempts < 100)
  
  if (attempts >= 100) {
    throw new Error('Unable to generate unique room code')
  }
  
  return code
}

export function createMessageHandler(rooms, clients, broadcastToRoom, sendMessage, sendError) {
  return function handleMessage(clientId, message) {
    const client = clients.get(clientId)
    if (!client) return

    switch (message.type) {
      case 'createRoom':
        handleCreateRoom(clientId, message.gameType, message.playerName, message.persistentPlayerId)
        break
      case 'joinRoom':
        handleJoinRoom(clientId, message.roomCode, message.playerName, message.persistentPlayerId, message.expectedGameType)
        break
      case 'reconnectToRoom':
        handleReconnectToRoom(clientId, message.roomCode, message.playerName, message.persistentPlayerId, message.expectedGameType)
        break
      case 'leaveRoom':
        handleLeaveRoom(clientId)
        break
      case 'startGame':
        handleStartGame(clientId)
        break
      case 'advancePhase':
        handleAdvancePhase(clientId, message.newPhase)
        break
      case 'updateGameSettings':
        handleUpdateGameSettings(clientId, message.settings)
        break
      case 'playAgain':
        handlePlayAgain(clientId)
        break
      default:
        // Try to handle as game-specific message
        handleGameMessage(clientId, message)
    }
  }

  function handleCreateRoom(clientId, gameType, playerName, persistentPlayerId) {
    const client = clients.get(clientId)
    if (!client) return

    // Validate game type
    if (!GameFactory.isGameTypeSupported(gameType)) {
      sendError(clientId, `Unsupported game type: ${gameType}`)
      return
    }

    const roomCode = generateRoomCode(rooms)
    const room = new Room(roomCode, clientId, gameType)

    client.roomCode = roomCode
    client.playerName = playerName
    room.addPlayer(clientId, playerName, persistentPlayerId)
    rooms.set(roomCode, room)

    console.log(`Room created: ${roomCode} by ${clientId} for game ${gameType}`)

    // Send room created confirmation
    sendMessage(clientId, {
      type: 'roomCreated',
      roomCode,
      roomState: room.getRoomState()
    })
  }

  function handleJoinRoom(clientId, roomCode, playerName, persistentPlayerId, expectedGameType = null) {
    const client = clients.get(clientId)
    if (!client) return

    const room = rooms.get(roomCode)
    if (!room) {
      sendError(clientId, 'Room not found')
      return
    }

    // Check if the game type matches what the client expects
    if (expectedGameType && room.gameType !== expectedGameType) {
      const gameConfig = getGameConfig(room.gameType)
      const expectedConfig = getGameConfig(expectedGameType)
      sendError(clientId, `This room is for ${gameConfig?.name || room.gameType}, but you selected ${expectedConfig?.name || expectedGameType}. Please go back and select the correct game.`)
      return
    }

    // Check if room is full
    const gameConfig = getGameConfig(room.gameType)
    if (gameConfig && room.players.size >= gameConfig.maxPlayers) {
      sendError(clientId, 'Room is full')
      return
    }

    client.roomCode = roomCode
    client.playerName = playerName
    room.addPlayer(clientId, playerName, persistentPlayerId)

    console.log(`Client ${clientId} joined room ${roomCode}`)

    // Send join confirmation
    sendMessage(clientId, {
      type: 'roomJoined',
      roomState: room.getRoomState()
    })

    // Notify other players in room
    broadcastToRoom(roomCode, {
      type: 'playerJoined',
      player: room.players.get(clientId),
      roomState: room.getRoomState()
    }, clientId)

    // Send current game state to the newly joined player
    sendMessage(clientId, {
      type: 'gameStateUpdate',
      roomState: room.getRoomState()
    })

    // If game is in progress, send player their role
    if (room.gamePhase !== 'lobby' && room.gameInstance) {
      const playerGameState = room.gameInstance.getPlayerGameState(clientId)
      sendMessage(clientId, {
        type: 'playerRole',
        ...playerGameState
      })
    }
  }

  function handleReconnectToRoom(clientId, roomCode, playerName, persistentPlayerId, expectedGameType = null) {
    console.log(`[RECONNECT] Reconnection attempt: clientId=${clientId}, roomCode=${roomCode}, playerName=${playerName}, persistentId=${persistentPlayerId}`)
    
    const client = clients.get(clientId)
    if (!client) {
      console.log(`[RECONNECT] Client ${clientId} not found`)
      return
    }

    const room = rooms.get(roomCode)
    if (!room) {
      console.log(`[RECONNECT] Room ${roomCode} not found for reconnection`)
      sendError(clientId, 'Room not found')
      return
    }

    // Check if the game type matches what the client expects
    if (expectedGameType && room.gameType !== expectedGameType) {
      const gameConfig = getGameConfig(room.gameType)
      const expectedConfig = getGameConfig(expectedGameType)
      sendError(clientId, `This room is for ${gameConfig?.name || room.gameType}, but you selected ${expectedConfig?.name || expectedGameType}. Please go back and select the correct game.`)
      return
    }

    console.log(`[RECONNECT] Room found. Players in room:`, Array.from(room.players.entries()).map(([id, player]) => ({
      id,
      name: player.name,
      persistentId: player.persistentId,
      isConnected: player.isConnected
    })))

    // Try to reconnect the player
    const reconnected = room.reconnectPlayer(null, clientId, persistentPlayerId)
    
    if (reconnected) {
      client.roomCode = roomCode
      client.playerName = playerName

      console.log(`[RECONNECT] Client ${clientId} successfully reconnected to room ${roomCode}`)

      // Send reconnection confirmation
      sendMessage(clientId, {
        type: 'reconnected',
        roomState: room.getRoomState()
      })

      // Notify other players
      broadcastToRoom(roomCode, {
        type: 'playerReconnected',
        player: room.players.get(clientId),
        roomState: room.getRoomState()
      }, clientId)

      // If game is in progress, send player their role
      if (room.gamePhase !== 'lobby' && room.gameInstance) {
        const playerGameState = room.gameInstance.getPlayerGameState(clientId)
        sendMessage(clientId, {
          type: 'playerRole',
          ...playerGameState
        })
      }
    } else {
      console.log(`[RECONNECT] Reconnection failed for ${persistentPlayerId}, treating as new join`)
      // Player not found, treat as new join
      handleJoinRoom(clientId, roomCode, playerName, persistentPlayerId, expectedGameType)
    }
  }

  function handleLeaveRoom(clientId) {
    const client = clients.get(clientId)
    if (!client || !client.roomCode) return

    const room = rooms.get(client.roomCode)
    if (room) {
      room.removePlayer(clientId)

      // Notify other players
      broadcastToRoom(client.roomCode, {
        type: 'playerLeft',
        playerId: clientId,
        roomState: room.getRoomState()
      }, clientId)

      // Clean up empty rooms
      if (room.isEmpty()) {
        rooms.delete(client.roomCode)
        console.log(`Room deleted: ${client.roomCode}`)
      }
    }

    client.roomCode = null
    client.playerName = null
  }

  function handleStartGame(clientId) {
    const client = clients.get(clientId)
    if (!client || !client.roomCode) {
      sendError(clientId, 'Not in a room')
      return
    }

    const room = rooms.get(client.roomCode)
    if (!room) {
      sendError(clientId, 'Room not found')
      return
    }

    // Only host can start game
    if (!room.isHost(clientId)) {
      sendError(clientId, 'Only the host can start the game')
      return
    }

    // Check minimum players
    const gameConfig = getGameConfig(room.gameType)
    if (!validatePlayerCount(room.gameType, room.players.size)) {
      sendError(clientId, `Need at least ${gameConfig.minPlayers} players to start`)
      return
    }

    // Check if already started
    if (room.gamePhase !== 'lobby') {
      sendError(clientId, 'Game already started')
      return
    }

    // Create game instance
    try {
      const gameInstance = GameFactory.createGame(room.gameType, room, broadcastToRoom)
      room.setGameInstance(gameInstance)
      
      // Initialize the game
      const selectedCategory = room.gameState?.selectedCategory || null
      if (!gameInstance.initializeGame(selectedCategory)) {
        sendError(clientId, 'Failed to initialize game')
        return
      }

      // Set initial game phase based on game type
      const gameConfig = getGameConfig(room.gameType)
      if (gameConfig && gameConfig.phases.length > 1) {
        // Use the first non-lobby phase
        room.gamePhase = gameConfig.phases[1]
      } else {
        // Fallback to roleReveal for backward compatibility
        room.gamePhase = 'roleReveal'
      }

      console.log(`Game started in room ${client.roomCode}`)

      // Broadcast game state to all players
      broadcastToRoom(client.roomCode, {
        type: 'gameStateUpdate',
        roomState: room.getRoomState()
      })

      // Send individual player roles (only for games that have roles)
      if (room.gameType === 'secret-word') {
        room.players.forEach((player, playerId) => {
          const playerGameState = gameInstance.getPlayerGameState(playerId)
          sendMessage(playerId, {
            type: 'playerRole',
            ...playerGameState
          })
        })
      }

      // Auto-start timer for Word Hunt games
      if (room.gameType === 'word-hunt') {
        // Automatically start the game timer
        const timerResult = gameInstance.handleGameMessage(clientId, { type: 'startGameTimer' })
        if (timerResult.success) {
          // Broadcast updated game state with active timer
          broadcastToRoom(client.roomCode, {
            type: 'gameStateUpdate',
            roomState: room.getRoomState()
          })
        }
      }
    } catch (error) {
      console.error('Error starting game:', error)
      sendError(clientId, 'Failed to start game')
    }
  }

  function handleAdvancePhase(clientId, newPhase) {
    const client = clients.get(clientId)
    if (!client || !client.roomCode) {
      sendError(clientId, 'Not in a room')
      return
    }

    const room = rooms.get(client.roomCode)
    if (!room) {
      sendError(clientId, 'Room not found')
      return
    }

    // Only host can advance phase
    if (!room.isHost(clientId)) {
      sendError(clientId, 'Only the host can advance the game phase')
      return
    }

    // Validate phase transition with game instance
    if (room.gameInstance) {
      const canAdvance = room.gameInstance.canAdvancePhase(newPhase)
      if (!canAdvance.canAdvance) {
        sendError(clientId, canAdvance.error || 'Cannot advance to this phase')
        return
      }
    }

    // Update phase
    room.gamePhase = newPhase

    // Notify game instance of phase change
    if (room.gameInstance) {
      room.gameInstance.onPhaseAdvanced(newPhase)
    }

    console.log(`Phase advanced to ${newPhase} in room ${client.roomCode}`)

    // Broadcast game state update to all players
    broadcastToRoom(client.roomCode, {
      type: 'gameStateUpdate',
      roomState: room.getRoomState()
    })
  }

  function handleUpdateGameSettings(clientId, settings) {
    const client = clients.get(clientId)
    if (!client || !client.roomCode) {
      sendError(clientId, 'Not in a room')
      return
    }

    const room = rooms.get(client.roomCode)
    if (!room) {
      sendError(clientId, 'Room not found')
      return
    }

    // Only host can update settings
    if (!room.isHost(clientId)) {
      sendError(clientId, 'Only the host can update game settings')
      return
    }

    // Only allow settings updates in lobby phase
    if (room.gamePhase !== 'lobby') {
      sendError(clientId, 'Settings can only be updated in the lobby')
      return
    }

    // Initialize game state if it doesn't exist
    if (!room.gameState) {
      room.gameState = {}
    }

    // Update settings
    if (settings.category) {
      // Validate category exists
      if (!VALID_CATEGORIES.includes(settings.category)) {
        sendError(clientId, 'Invalid category selected')
        return
      }
      room.gameState.selectedCategory = settings.category
    }

    console.log(`Game settings updated in room ${client.roomCode}:`, settings)

    // Broadcast updated game state to all players
    broadcastToRoom(client.roomCode, {
      type: 'gameStateUpdate',
      roomState: room.getRoomState()
    })
  }

  function handlePlayAgain(clientId) {
    const client = clients.get(clientId)
    if (!client || !client.roomCode) {
      sendError(clientId, 'Not in a room')
      return
    }

    const room = rooms.get(client.roomCode)
    if (!room) {
      sendError(clientId, 'Room not found')
      return
    }

    // Only host can reset the game
    if (!room.isHost(clientId)) {
      sendError(clientId, 'Only the host can reset the game')
      return
    }

    // Reset game state
    room.resetForNewGame()

    console.log(`Game reset to lobby in room ${client.roomCode}`)

    // Broadcast updated game state to all players
    broadcastToRoom(client.roomCode, {
      type: 'gameStateUpdate',
      roomState: room.getRoomState()
    })
  }

  function handleGameMessage(clientId, message) {
    const client = clients.get(clientId)
    if (!client || !client.roomCode) {
      sendError(clientId, 'Not in a room')
      return
    }

    const room = rooms.get(client.roomCode)
    if (!room || !room.gameInstance) {
      sendError(clientId, 'Game not found or not started')
      return
    }

    // Let the game instance handle the message
    const result = room.gameInstance.handleGameMessage(clientId, message)
    
    if (!result.success) {
      sendError(clientId, result.error)
      return
    }

    // Handle game-specific responses
    if (message.type === 'submitWord' && result.success) {
      // Send word result back to the player
      sendMessage(clientId, {
        type: 'wordResult',
        success: true,
        word: result.word,
        points: result.points
      })
    }

    // Broadcast updated game state to all players
    broadcastToRoom(client.roomCode, {
      type: 'gameStateUpdate',
      roomState: room.getRoomState()
    })
  }
}