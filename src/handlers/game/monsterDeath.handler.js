import { getProtoMessages } from '../../init/loadProtos.js';
import { getGameSession } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { updateUserScore, findUserById } from '../../db/user/user.db.js';
import { config } from '../../config/config.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';

const monsterDeathHandler = async (socket, payload) => {
  // 저장되어 있는 몬스터 삭제.
  const gameId = getUserBySocket(socket);
  const gameSession = getGameSession(gameId.getGameId());

  if (!gameId) {
    throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
  }
  if (!gameSession) return;

  // 몬스터 삭제하고 점수 갱신.
  gameSession.removeMonster(payload.monsterId);
  gameId.addScore(config.ingame.score * gameId.getMonsterLevel());

  const initialResponse = createResponse(
    PACKET_TYPE.ENEMY_MONSTER_DEATH_NOTIFICATION,
    gameId.sequence,
    { monsterId: payload.monsterId, },
    "enemyMonsterDeathNotification"
  );

  // 브로드 케스트 추가
  await gameSession.broadcast(initialResponse, socket);
};

export default monsterDeathHandler;
