import { getProtoMessages } from '../init/loadProtos.js';
import { getGameSession } from '../session/game.session.js';
import { getUserBySocket } from '../session/user.session.js';
import { PACKET_TYPE } from '../constants/header.js';

const monsterDeathHandler = async (socket, payload) => {
  // 저장되어 있는 몬스터 삭제.
  const gameId = getUserBySocket(socket);
  const gameSession = getGameSession(gameId.getGameId());
  gameSession.removeMonster(payload.monsterId);

  // 페이로드 직렬화.
  const protoMessages = getProtoMessages();
  const monster = MonsterManager.getInstance().getMonster(gameId, payload.monsterId);

  const response = protoMessages.towerDefense.GamePacket;
  const gamePacket = response.create({
    enemyMonsterDeathNotification: {
      monsterId: monster.monsterId,
    },
  });

  const payloadData = response.encode(gamePacket).finish();

  // "헤더 + 페이로드" 직렬화.
  const initialResponse = createResponse(PACKET_TYPE.ENEMY_MONSTER_DEATH_NOTIFICATION, gameId.sequence, payloadData);

  socket.write(initialResponse);
};

export default monsterDeathHandler;
