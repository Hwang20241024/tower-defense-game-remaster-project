import { getProtoMessages } from '../../init/loadProtos.js';
import { getGameSession } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { updateUserScore, findUserById } from '../../db/user/user.db.js';
import { config } from '../../config/config.js';

const monsterDeathHandler = async (socket, payload) => {
  // 저장되어 있는 몬스터 삭제.
  const gameId = getUserBySocket(socket);
  const gameSession = getGameSession(gameId.getGameId());

  // 몬스터 삭제하고 점수 갱신.
    gameSession.removeMonster(payload.monsterId);
    gameId.addScore(config.ingame.score * gameId.getMonsterLevel());

  const user = await findUserById(gameId.id); // 이건 데이터베이스에서의 user
  const highestScore = user.score;
  // console.log('user', user);
  // console.log('highestScore', highestScore);
  // console.log('score', gameId.score);

  if (gameId.score > highestScore) {
    await updateUserScore(gameId.score, gameId.id);
    gameId.setHighScore(gameId.score);
  }

    // 페이로드 직렬화.
    const protoMessages = getProtoMessages();

    const response = protoMessages.towerDefense.GamePacket;
    const gamePacket = response.create({
      enemyMonsterDeathNotification: {
        monsterId: payload.monsterId,
      },
    });

    const payloadData = response.encode(gamePacket).finish();

    // "헤더 + 페이로드" 직렬화.
    const initialResponse = createResponse(
      PACKET_TYPE.ENEMY_MONSTER_DEATH_NOTIFICATION,
      gameId.getNextSequence(),
      payloadData,
    );

    // 브로드 케스트 추가
    await gameSession.broadcast(initialResponse, socket);

};

export default monsterDeathHandler;
