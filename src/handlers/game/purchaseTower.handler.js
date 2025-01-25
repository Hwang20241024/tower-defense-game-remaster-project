import { handleError } from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getUserBySocket } from '../../session/user.session.js';
import { getGameSession } from '../../session/game.session.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import { config } from '../../config/config.js';

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

    if (user.gold < config.ingame.towerCost) {
      throw new CustomError(ErrorCodes.NOT_ENOUGH_MONEY, '금액이 충분하지 않습니다.');
    }

    user.gold -= config.ingame.towerCost;

    // 타워 생성
    const towerId = game.towerManager.addTower(socket, x, y);
    user.towers.push(game.towerManager.getTowerById(towerId));

    const towerPurchaseResponse = createResponse(
      PACKET_TYPE.TOWER_PURCHASE_RESPONSE,
      user.sequence,
      { towerId: towerId, message: '타워가 생성되었습니다.' },
      "towerPurchaseResponse"
    );
  
    socket.write(towerPurchaseResponse);

    const addEnemyTowerNotification = createResponse(
      PACKET_TYPE.ADD_ENEMY_TOWER_NOTIFICATION,
      user.sequence,
      { towerId, x, y },
      "addEnemyTowerNotification"
    );
  

    game.broadcast(addEnemyTowerNotification, socket);
  } catch (error) {
    handleError(socket, error);
  }
};

export default purchaseTowerHandler;
