// Abstract base class for online games

export class BaseGame {
  constructor(room, broadcastCallback = null) {
    this.room = room
    this.gameType = null
    this.broadcastCallback = broadcastCallback
  }

  // Abstract methods that must be implemented by subclasses
  initializeGame() {
    throw new Error('initializeGame must be implemented by subclass')
  }

  getPlayerGameState(playerId) {
    throw new Error('getPlayerGameState must be implemented by subclass')
  }

  handleGameMessage(playerId, message) {
    throw new Error('handleGameMessage must be implemented by subclass')
  }

  canAdvancePhase(newPhase) {
    throw new Error('canAdvancePhase must be implemented by subclass')
  }

  onPhaseAdvanced(newPhase) {
    // Optional hook for phase transitions
  }

  resetGame() {
    throw new Error('resetGame must be implemented by subclass')
  }

  // Common utility methods
  broadcastToRoom(message, excludePlayerId = null) {
    if (this.broadcastCallback) {
      this.broadcastCallback(this.room.code, message, excludePlayerId)
    }
  }

  getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Validation helpers
  validateMessage(message, requiredFields) {
    for (const field of requiredFields) {
      if (!(field in message)) {
        return { valid: false, error: `Missing required field: ${field}` }
      }
    }
    return { valid: true }
  }

  validatePlayerTurn(playerId, currentTurnPlayerId) {
    if (currentTurnPlayerId && playerId !== currentTurnPlayerId) {
      return { valid: false, error: 'It is not your turn' }
    }
    return { valid: true }
  }
}