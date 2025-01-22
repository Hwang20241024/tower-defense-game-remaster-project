import MonsterManager from '../classes/managers/monster.manager.js';
import { getProtoMessages } from '../init/loadProtos.js';


const monsterDeathHandler = async (socket, payload) => {
  // 게임Id 가져오기.
    let gameSessions = getAllGameSessions();
    let gameId;
    for (let value of gameSessions) {
      const user = value.getUser(socket);
      if (user) {
        gameId = value.id;
      }
    }

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

  MonsterManager.getInstance().removeMonster(gameId, monster.monsterId); // 저장되어있는 몬스터 삭제

  // "헤더 + 페이로드" 직렬화.
  const initialResponse = createResponse(PACKET_TYPE.monsterDeathNotification, 0, payloadData);

  socket.write(initialResponse);
};

export default monsterDeathHandler;
