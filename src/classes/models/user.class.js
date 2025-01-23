import { ErrorCodes } from '../../utils/error/errorCodes.js';
import CustomError from '../../utils/error/customError.js';

class User {
  constructor(socket, sequence) {
    this.socket = socket;
    this.sequence = sequence;
    this.baseHp = 100;
    this.score = 0;
    this.gold = 100;
    this.towers = [];
    this.monsters = [];
    this.monsterLevel = 0;
    this.highScore = 0;
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

  getNextSequence(sequence) {
    console.log(sequence, this.sequence);
    if (this.sequence !== sequence) {
      throw new CustomError(ErrorCodes.INVALID_SEQUENCE, '유효하지 않는 Sequence 입니다.');
    }
    return ++this.sequence;
  }
}

export default User;
