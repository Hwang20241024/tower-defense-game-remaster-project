import { handleError } from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getUserBySocket } from '../../session/user.session.js';
import { getGameSession } from '../../session/game.session.js';
import { getProtoMessages } from '../../init/loadProtos.js';

const purchaseTowerHandler = async (socket, payload) => {
  try {
    const { x, y } = payload;

    // 유저 검사
    const user = getUserBySocket(socket);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }

    // 게임 검사
    const game = getGameSession(user.gameId);
    if (!game) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임을 찾을 수 없습니다.');
    }

    // 타워 생성
    const towerId = game.towerManager.addTower(socket, x, y);
    user.towers.push(towerId);

    const protoMessages = getProtoMessages();
    const response = protoMessages.towerDefense.GamePacket;
    const responseGamePacket = response.create({
      // towerPurchaseResponse: { towerId, message: '타워가 생성되었습니다.' },
      towerPurchaseResponse: { towerId },
    });

    const responsePayLoad = response.encode(responseGamePacket).finish();

    const towerPurchaseResponse = createResponse(
      PACKET_TYPE.TOWER_PURCHASE_RESPONSE,
      user.sequence,
      responsePayLoad,
    );

    socket.write(towerPurchaseResponse);

    const notificationGamePacket = response.create({
      addEnemyTowerNotification: { towerId, x, y, message: '적이 타워를 생성했습니다.' },
    });

    const notificationPayLoad = response.encode(notificationGamePacket).finish();

    const addEnemyTowerNotificationResponse = createResponse(
      PACKET_TYPE.ADD_ENEMY_TOWER_NOTIFICATION,
      user.sequence,
      notificationPayLoad,
    );

    game.broadcast(addEnemyTowerNotificationResponse, socket);
  } catch (error) {
    handleError(socket, error);
  }
};

export default purchaseTowerHandler;
