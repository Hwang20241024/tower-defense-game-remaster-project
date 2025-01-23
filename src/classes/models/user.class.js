import { ErrorCodes } from '../../utils/error/errorCodes.js';
import CustomError from '../../utils/error/customError.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import { PACKET_TYPE } from '../../constants/header.js';

class User {
  constructor(socket, sequence) {
    this.socket = socket;
    this.sequence = sequence;
    this.baseHp = 100;
    this.score = 0;
    this.userGold = 10;
    this.monsterLevel = 1;
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

  syncStateNotification() {
    const protoMessages = getProtoMessages();
    const notification = protoMessages.towerDefense.GamePacket;
    const notificationGamePacket = notification.create({
      stateSyncNotification: {
        userGold: this.userGold,
        baseHp: this.baseHp,
        monsterLevel: this.monsterLevel,
        score: this.score,
        message: '타워가 생성되었습니다.',
      },
    });

    const notificationPayload = notification.encode(notificationGamePacket).finish();

    const towerPurchaseResponse = createResponse(
      PACKET_TYPE.STATE_SYNC_NOTIFICATION,
      this.sequence,
      notificationPayload,
    );

    this.socket.write(towerPurchaseResponse);
  }
}

export default User;
