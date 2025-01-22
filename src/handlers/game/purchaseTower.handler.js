import { handleError } from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getUserBySocket } from '../../session/user.session.js';
import { getGameSession } from '../../session/game.session.js';

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

    const towerPurchaseResponse = createResponse(
      PACKET_TYPE.TOWER_PURCHASE_RESPONSE,
      user.sequence,
      { towerId, message: '타워가 생성되었습니다.' },
    );

    socket.write(towerPurchaseResponse);

    const addEnemyTowerNotificationResponse = createResponse(
      PACKET_TYPE.ADD_ENEMY_TOWER_NOTIFICATION,
      user.sequence,
      { towerId, x, y, message: '적이 타워를 생성했습니다.' },
    );

    game.broadcast(addEnemyTowerNotificationResponse, socket);
  } catch (error) {
    handleError(socket, error);
  }
};

export default purchaseTowerHandler;
