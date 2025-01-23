import { ErrorCodes } from '../../utils/error/errorCodes.js';
import CustomError from '../../utils/error/customError.js';

class User {
  constructor(socket, userId, highScore, sequence) {
    this.userId = userId, // string
    this.socket = socket;
    this.sequence = sequence;
    this.baseHp = 100;
    this.score = 0;
    this.gold = 100;
    this.towers = [];
    this.monsters = [];
    this.monsterLevel = 0;
    this.highScore = highScore;
  }

  setGameId(gameId) {
    this.gameId = gameId;
  }

  getGameId() {
    return this.gameId;
  }

  getUserSocket() {
    return this.socket;
  }

  getSequence() {
    return this.sequence;
  }

  getNextSequence() {
    return ++this.sequence;
  }

  getMonsterLevel() {
    return this.monsterLevel
  }
}

export default User;
