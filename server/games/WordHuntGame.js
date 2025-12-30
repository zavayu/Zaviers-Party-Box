import { BaseGame } from './BaseGame.js'
import wordList from 'word-list-json'

// Letter distribution similar to Scrabble for balanced gameplay
const LETTER_POOL = 'AAAAAAAAABBCCDDDDEEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNOOOOOOOOPPQRRRRRRSSSSTTTTTTUUUUVVWWXYYZ'

// Use the same word dictionary as the client
const filteredWords = wordList.filter((word) => word.length >= 3 && word.length <= 8)
const WORD_HUNT_DICTIONARY = new Set(filteredWords.map((word) => word.toLowerCase()))

const generateBoard = () => {
  const board = []
  for (let i = 0; i < 16; i++) {
    board.push(LETTER_POOL[Math.floor(Math.random() * LETTER_POOL.length)])
  }
  return board
}

const calculateScore = (wordLength) => {
  if (wordLength === 3) return 100
  if (wordLength === 4) return 400
  if (wordLength === 5) return 800
  if (wordLength === 6) return 1400
  if (wordLength === 7) return 1800
  return 2000 + (wordLength - 8) * 400
}

export class WordHuntGame extends BaseGame {
  constructor(room, broadcastCallback = null) {
    super(room, broadcastCallback)
    this.gameType = 'word-hunt'
    this.gameTimer = null
    this.timerInterval = null
    this.gameDuration = 80 // 80 seconds
  }

  initializeGame() {
    // Generate a new board
    const board = generateBoard()
    
    // Initialize game state
    this.room.gameState = {
      board,
      playerScores: {}, // playerId -> { score, foundWords: Set }
      gameStartTime: null,
      gameEndTime: null,
      timeRemaining: this.gameDuration,
      isGameActive: false
    }

    // Initialize player scores
    this.room.players.forEach((player, playerId) => {
      this.room.gameState.playerScores[playerId] = {
        score: 0,
        foundWords: [] // Use array instead of Set for JSON serialization
      }
    })

    console.log(`Word Hunt game initialized in room ${this.room.code}`)
    return true
  }

  getPlayerGameState(playerId) {
    const playerData = this.room.gameState.playerScores[playerId] || { score: 0, foundWords: [] }
    
    return {
      board: this.room.gameState.board,
      playerScore: playerData.score,
      playerFoundWords: playerData.foundWords, // Already an array
      timeRemaining: this.room.gameState.timeRemaining,
      gameStartTime: this.room.gameState.gameStartTime, // Send start time for client-side calculation
      gameDuration: this.gameDuration, // Send duration so client knows total time
      isGameActive: this.room.gameState.isGameActive,
      allPlayerScores: this.getAllPlayerScores()
    }
  }

  getAllPlayerScores() {
    const scores = {}
    this.room.players.forEach((player, playerId) => {
      const playerData = this.room.gameState.playerScores[playerId] || { score: 0, foundWords: [] }
      scores[playerId] = {
        playerName: player.name,
        score: playerData.score,
        wordCount: playerData.foundWords.length,
        foundWords: playerData.foundWords // Include the actual words for results display
      }
    })
    return scores
  }

  handleGameMessage(playerId, message) {
    switch (message.type) {
      case 'startGameTimer':
        return this.handleStartGameTimer(playerId)
      case 'submitWord':
        return this.handleSubmitWord(playerId, message.word, message.path)
      default:
        return { success: false, error: `Unknown message type: ${message.type}` }
    }
  }

  handleStartGameTimer(playerId) {
    // Only host can start the timer
    if (!this.room.isHost(playerId)) {
      return { success: false, error: 'Only the host can start the game timer' }
    }

    // Check if game is already active
    if (this.room.gameState.isGameActive) {
      return { success: false, error: 'Game is already active' }
    }

    // Start the game timer
    this.room.gameState.gameStartTime = Date.now()
    this.room.gameState.isGameActive = true
    this.room.gameState.timeRemaining = this.gameDuration

    // Set up timer to end game after duration
    this.gameTimer = setTimeout(() => {
      this.endGame()
    }, this.gameDuration * 1000)

    // Update timer every second, but broadcast less frequently
    this.timerInterval = setInterval(() => {
      if (this.room.gameState.isGameActive) {
        const elapsed = Math.floor((Date.now() - this.room.gameState.gameStartTime) / 1000)
        const newTimeRemaining = Math.max(0, this.gameDuration - elapsed)
        
        // Broadcast every 10 seconds for sync, or when game is ending
        const shouldBroadcast = (
          Math.floor(newTimeRemaining / 10) !== Math.floor(this.room.gameState.timeRemaining / 10) || // Every 10 seconds
          newTimeRemaining === 0    // Game ending
        )
        
        this.room.gameState.timeRemaining = newTimeRemaining
        
        if (shouldBroadcast) {
          this.broadcastGameStateUpdate()
        }
        
        if (this.room.gameState.timeRemaining <= 0) {
          this.endGame()
        }
      }
    }, 1000)

    console.log(`Word Hunt game timer started in room ${this.room.code}`)
    return { success: true }
  }

  handleSubmitWord(playerId, word, path) {
    // Check if game is active
    if (!this.room.gameState.isGameActive) {
      return { success: false, error: 'Game is not active' }
    }

    // Validate word length (basic anti-cheat)
    if (!word || word.length < 3) {
      return { success: false, error: 'Word must be at least 3 letters' }
    }

    // Validate path (anti-cheat - ensure path is valid on server)
    if (!path || !Array.isArray(path) || path.length !== word.length) {
      return { success: false, error: 'Invalid word path' }
    }

    // Validate path is on the board and forms the word (critical anti-cheat)
    if (!this.validateWordPath(word, path)) {
      return { success: false, error: 'Invalid word path on board' }
    }

    const lowerWord = word.toLowerCase()
    const playerData = this.room.gameState.playerScores[playerId]

    // Check if player already found this word (server-side duplicate check)
    if (playerData.foundWords.includes(lowerWord)) {
      return { success: false, error: 'Word already found' }
    }

    // Server-side dictionary validation (anti-cheat fallback)
    // This is mainly to prevent cheating, client should have already validated
    if (!WORD_HUNT_DICTIONARY.has(lowerWord)) {
      return { success: false, error: 'Word not in dictionary' }
    }

    // Add word and calculate score
    const points = calculateScore(word.length)
    playerData.foundWords.push(lowerWord)
    playerData.score += points

    console.log(`Player ${playerId} found word "${word}" for ${points} points in room ${this.room.code}`)
    return { success: true, points, word: lowerWord }
  }

  validateWordPath(word, path) {
    const board = this.room.gameState.board
    
    // Check if all indices are valid
    if (path.some(index => index < 0 || index >= 16)) {
      return false
    }

    // Check if path forms the word
    const pathWord = path.map(index => board[index]).join('').toLowerCase()
    if (pathWord !== word.toLowerCase()) {
      return false
    }

    // Check if path is valid (adjacent tiles, no repeats)
    const usedIndices = new Set()
    for (let i = 0; i < path.length; i++) {
      const currentIndex = path[i]
      
      // Check for duplicates
      if (usedIndices.has(currentIndex)) {
        return false
      }
      usedIndices.add(currentIndex)

      // Check adjacency (except for first tile)
      if (i > 0) {
        const prevIndex = path[i - 1]
        if (!this.areAdjacent(prevIndex, currentIndex)) {
          return false
        }
      }
    }

    return true
  }

  areAdjacent(index1, index2) {
    const row1 = Math.floor(index1 / 4)
    const col1 = index1 % 4
    const row2 = Math.floor(index2 / 4)
    const col2 = index2 % 4

    const rowDiff = Math.abs(row1 - row2)
    const colDiff = Math.abs(col1 - col2)

    // Adjacent if within 1 row and 1 column (including diagonals)
    return rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff > 0)
  }

  endGame() {
    if (!this.room.gameState.isGameActive) return

    this.room.gameState.isGameActive = false
    this.room.gameState.gameEndTime = Date.now()
    this.room.gameState.timeRemaining = 0

    // Clear timers
    if (this.gameTimer) {
      clearTimeout(this.gameTimer)
      this.gameTimer = null
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }

    // Move to results phase
    this.room.gamePhase = 'results'

    // Broadcast the game end and phase change
    this.broadcastGameStateUpdate()

    console.log(`Word Hunt game ended in room ${this.room.code}`)
  }

  // Helper method to broadcast game state updates
  broadcastGameStateUpdate() {
    this.broadcastToRoom({
      type: 'gameStateUpdate',
      roomState: this.room.getRoomState()
    })
  }

  canAdvancePhase(newPhase) {
    switch (newPhase) {
      case 'playing':
        return { canAdvance: true }
      case 'results':
        return { canAdvance: true }
      default:
        return { canAdvance: true }
    }
  }

  onPhaseAdvanced(newPhase) {
    if (newPhase === 'playing') {
      // Game phase advanced to playing, but timer hasn't started yet
      // Host needs to start the timer manually
    }
  }

  resetGame() {
    // Clear any active timers
    if (this.gameTimer) {
      clearTimeout(this.gameTimer)
      this.gameTimer = null
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }

    // Reset game state
    this.room.gameState = {
      board: [],
      playerScores: {},
      gameStartTime: null,
      gameEndTime: null,
      timeRemaining: this.gameDuration,
      isGameActive: false
    }
  }
}