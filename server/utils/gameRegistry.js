// Game registry for managing different online game types

export const GAME_TYPES = {
  SECRET_WORD: 'secret-word',
  WRONG_ANSWER: 'wrong-answer',
  WORDLE: 'wordle',
  WORD_HUNT: 'word-hunt'
}

export const GAME_CONFIG = {
  [GAME_TYPES.SECRET_WORD]: {
    name: 'Secret Word',
    minPlayers: 3,
    maxPlayers: 10,
    phases: ['lobby', 'roleReveal', 'discussion', 'voting', 'results'],
    requiresHost: true,
    turnBased: true
  },
  [GAME_TYPES.WRONG_ANSWER]: {
    name: 'Wrong Answer',
    minPlayers: 3,
    maxPlayers: 8,
    phases: ['lobby', 'questionReveal', 'answering', 'discussion', 'voting', 'results'],
    requiresHost: true,
    turnBased: false
  },
  [GAME_TYPES.WORD_HUNT]: {
    name: 'Word Hunt',
    minPlayers: 2,
    maxPlayers: 8,
    phases: ['lobby', 'playing', 'results'],
    requiresHost: true,
    turnBased: false
  }
  // Future games will be added here
}

export function getGameConfig(gameType) {
  return GAME_CONFIG[gameType] || null
}

export function isValidGameType(gameType) {
  return Object.values(GAME_TYPES).includes(gameType)
}

export function getValidPhases(gameType) {
  const config = getGameConfig(gameType)
  return config ? config.phases : []
}

export function validatePlayerCount(gameType, playerCount) {
  const config = getGameConfig(gameType)
  if (!config) return false
  
  return playerCount >= config.minPlayers && playerCount <= config.maxPlayers
}