import { createResponse } from '../../utils/response/createResponse.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getGameSession } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import CustomError from '../../utils/error/customError.js';

const spawnMonsterHandler = async (socket, payload) => {
  // 게임Id 가져오기.
  const gameId = getUserBySocket(socket);
  const gameSession = getGameSession(gameId.getGameId());

  if (!gameId) {
    throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
  }
  if (!gameSession) return;

  // 몬스터 추가
  gameSession.addMonster(gameId.getMonsterLevel());
  // 갱신후 마지막 몬스터를 가져오기
  const monster = gameSession.getLastMonster();

  gameId.monsters.push(monster);

  // 페이로드 데이터.
  const payloadData = {
    monsterId: monster.monsterId,
    monsterNumber: monster.monsterNumber,
  }
  
  // "헤더 + 페이로드" 직렬화.
  const initialResponse = createResponse(
    PACKET_TYPE.SPAWN_MONSTER_RESPONSE,
    gameId.getNextSequence(),
    payloadData,
    "spawnMonsterResponse"
  );

  await socket.write(initialResponse);


  // 브로드 캐스트 (동기화)
  const initialResponse2 = createResponse(
    PACKET_TYPE.SPAWN_ENEMY_MONSTER_NOTIFICATION,
    gameId.getNextSequence(),
    payloadData,
    "spawnEnemyMonsterNotification"
  );
  await gameSession.broadcast(initialResponse2, socket);
};

export default spawnMonsterHandler;
