import { ErrorCodes } from '../../utils/error/errorCodes.js';
import CustomError from '../../utils/error/customError.js';
import { stateSyncNotification } from '../../utils/notification/game.notification.js';

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

  getNextSequence() {
    return ++this.sequence;
  }

  syncState(socket) {
    const payload = {
      userGold: this.gold,
      baseHp: this.baseHp,
      monsterLevel: this.monsterLevel,
      score: this.score,
      towerData: this.towers,
      mosterData: this.monsters,
    };

    const packet = stateSyncNotification(payload, this.socket);
    socket.write(packet);
  }
}

export default User;
