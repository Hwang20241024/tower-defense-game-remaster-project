import { ErrorCodes } from '../../utils/error/errorCodes.js';
import CustomError from '../../utils/error/customError.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { config } from '../../config/config.js';
import { createResponse } from '../../utils/response/createResponse.js';

class User {
  constructor(socket, id, sequence) {
    this.id = id;
    this.socket = socket;
    this.sequence = sequence;
    this.baseHp = 100;
    this.score = 0;
    this.gold = 100;
    this.towers = [];
    this.monsters = [];
    this.monsterLevel = 0;
    this.highScore = 0;
    this.gameId = null;
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

    const currentRound = config.rounds((round) => round.monsterLevel === this.monsterLevel);
    if (!currentRound) return;

    if (this.score >= currentRound.goal) {
      this.gold += currentRound.gold;
      this.monsterLevel += 1;
    }
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
}

export default User;
