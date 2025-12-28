// Generic Room class that can handle different game types

export class Room {
  constructor(code, hostId, gameType = null) {
    this.code = code
    this.hostId = hostId
    this.gameType = gameType
    this.players = new Map() // playerId -> Player
    this.gamePhase = 'lobby'
    this.gameState = {}
    this.gameInstance = null // Will hold the specific game implementation
    this.createdAt = Date.now()
  }

  addPlayer(playerId, playerName, persistentPlayerId = null) {
    this.players.set(playerId, {
      id: playerId,
      name: playerName,
      persistentId: persistentPlayerId, // Store persistent ID for reconnection
      isHost: playerId === this.hostId,
      joinedAt: Date.now(),
      isConnected: true
    })
  }

  removePlayer(playerId) {
    this.players.delete(playerId)
    
    // If host leaves, assign new host (first remaining player)
    if (playerId === this.hostId && this.players.size > 0) {
      const newHostId = Array.from(this.players.keys())[0]
      this.hostId = newHostId
      const newHost = this.players.get(newHostId)
      if (newHost) {
        newHost.isHost = true
      }
    }
  }

  // Mark player as disconnected instead of removing them
  disconnectPlayer(playerId) {
    const player = this.players.get(playerId)
    if (player) {
      player.isConnected = false
      player.disconnectedAt = Date.now()
    }
  }

  // Reconnect a player with a new clientId
  reconnectPlayer(oldPlayerId, newPlayerId, persistentPlayerId) {
    // Find player by persistent ID
    let playerToReconnect = null
    let oldKey = null
    
    for (const [key, player] of this.players.entries()) {
      if (player.persistentId === persistentPlayerId) {
        playerToReconnect = player
        oldKey = key
        break
      }
    }
    
    if (playerToReconnect && oldKey) {
      // Update player with new connection ID
      playerToReconnect.id = newPlayerId
      playerToReconnect.isConnected = true
      playerToReconnect.reconnectedAt = Date.now()
      
      // Update host ID if this was the host
      if (this.hostId === oldKey) {
        this.hostId = newPlayerId
      }
      
      // Move player to new key in the map
      this.players.delete(oldKey)
      this.players.set(newPlayerId, playerToReconnect)
      
      return true
    }
    
    return false
  }

  // Find player by persistent ID
  findPlayerByPersistentId(persistentPlayerId) {
    for (const [key, player] of this.players.entries()) {
      if (player.persistentId === persistentPlayerId) {
        return { key, player }
      }
    }
    return null
  }

  getRoomState() {
    return {
      code: this.code,
      gameType: this.gameType,
      players: Array.from(this.players.values()).map(player => ({
        ...player,
        isConnected: player.isConnected !== false // Default to true if not set
      })),
      gamePhase: this.gamePhase,
      gameState: this.gameState
    }
  }

  getPlayerGameState(playerId) {
    if (this.gameInstance) {
      return this.gameInstance.getPlayerGameState(playerId)
    }
    return {}
  }

  isEmpty() {
    return this.players.size === 0
  }

  isHost(playerId) {
    return playerId === this.hostId
  }

  setGameInstance(gameInstance) {
    this.gameInstance = gameInstance
  }

  canStartGame() {
    if (!this.gameType) return false
    
    // This would check against game-specific requirements
    // For now, just check minimum players
    return this.players.size >= 3
  }

  resetForNewGame() {
    this.gamePhase = 'lobby'
    this.gameState = {}
    if (this.gameInstance) {
      this.gameInstance.resetGame()
    }
  }
}