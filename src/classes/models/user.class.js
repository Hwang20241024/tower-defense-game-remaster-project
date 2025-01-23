import { ErrorCodes } from '../../utils/error/errorCodes.js';
import CustomError from '../../utils/error/customError.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { config } from '../../config/config.js';
import { createResponse } from '../../utils/response/createResponse.js';

class User {
  constructor(socket, id, highScore, sequence) {
    this.id = id; // string
    this.socket = socket;
    this.sequence = sequence;
    this.baseHp = config.ingame.baseHp;
    this.score = 0;
    this.gold = config.ingame.initialGold;
    this.towers = [];
    this.monsters = [];
    this.monsterLevel = 1;
    this.highScore = highScore;
    this.gameId = null;
    this.setCurrentRound();
  }

  setCurrentRound() {
    this.currentRound = config.rounds.find((round) => round.monsterLevel === this.monsterLevel);
  }

  getUserId() {
    return this.id;
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
    return this.monsterLevel;
  }

  addScore(value) {
    this.score += value;

    if (!this.currentRound) return;

    if (this.score >= this.currentRound.goal) {
      this.gold += this.currentRound.gold;
      this.monsterLevel += 1;
      this.setCurrentRound();
    }
  }

  getScore() {
    return this.score;
  }

  syncStateNotification() {
    const protoMessages = getProtoMessages();
    const notification = protoMessages.towerDefense.GamePacket;
    const notificationGamePacket = notification.create({
      stateSyncNotification: {
        userGold: this.gold,
        baseHp: this.baseHp,
        monsterLevel: this.monsterLevel,
        score: this.score,
        TowerData: this.towers,
        MonsterData: this.monsters,
        message: '상태 동기화 패킷입니다.',
      },
    });

    const notificationPayload = notification.encode(notificationGamePacket).finish();

    const syncStateNotification = createResponse(
      PACKET_TYPE.STATE_SYNC_NOTIFICATION,
      this.sequence,
      notificationPayload,
    );

    this.socket.write(syncStateNotification);
  }

  setHighScore(score) {
    this.highScore = score;
  }

  getHighScore() {
    return this.highScore;
  }

  resetUser() {
    this.baseHp = config.ingame.baseHp;
    this.score = 0;
    this.gold = config.ingame.initialGold;
    this.towers = [];
    this.monsters = [];
    this.monsterLevel = 1;
    this.gameId = null;
    this.setCurrentRound();
  }
}

export default User;
