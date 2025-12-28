import { ImposterGame } from './ImposterGame.js'
import { GAME_TYPES } from '../utils/gameRegistry.js'

export class GameFactory {
  static createGame(gameType, room) {
    switch (gameType) {
      case GAME_TYPES.SECRET_WORD:
        return new ImposterGame(room)
      // Future games will be added here
      // case GAME_TYPES.WRONG_ANSWER:
      //   return new OutlierGame(room)
      // case GAME_TYPES.WORDLE:
      //   return new WordleGame(room)
      default:
        throw new Error(`Unknown game type: ${gameType}`)
    }
  }

  static getSupportedGameTypes() {
    return [GAME_TYPES.SECRET_WORD]
  }

  static isGameTypeSupported(gameType) {
    return this.getSupportedGameTypes().includes(gameType)
  }
}