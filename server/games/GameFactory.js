import { ImposterGame } from './ImposterGame.js'
import { WordHuntGame } from './WordHuntGame.js'
import { GAME_TYPES } from '../utils/gameRegistry.js'

export class GameFactory {
  static createGame(gameType, room, broadcastCallback = null) {
    switch (gameType) {
      case GAME_TYPES.SECRET_WORD:
        return new ImposterGame(room, broadcastCallback)
      case GAME_TYPES.WORD_HUNT:
        return new WordHuntGame(room, broadcastCallback)
      // Future games will be added here
      // case GAME_TYPES.WRONG_ANSWER:
      //   return new OutlierGame(room, broadcastCallback)
      // case GAME_TYPES.WORDLE:
      //   return new WordleGame(room, broadcastCallback)
      default:
        throw new Error(`Unknown game type: ${gameType}`)
    }
  }

  static getSupportedGameTypes() {
    return [GAME_TYPES.SECRET_WORD, GAME_TYPES.WORD_HUNT]
  }

  static isGameTypeSupported(gameType) {
    return this.getSupportedGameTypes().includes(gameType)
  }
}