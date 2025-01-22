import Monster from '../classes/monster.class.js';
import { getProtoMessages } from '../init/loadProtos.js';

const monsterDeathHandler = async (socket, payload) => {
  // 페이로드 직렬화.
  const protoMessages = getProtoMessages();
  const monster = Monster.getInstance().getMonster(payload.monsterId);

  const response = protoMessages.towerDefense.GamePacket;
  const gamePacket = response.create({
    enemyMonsterDeathNotification: {
      monsterId: monster.monsterId,
    },
  });

  const payloadData = response.encode(gamePacket).finish();

  Monster.getInstance().removeMonster(monster.monsterId); // 저장되어있는 몬스터 삭제

  // "헤더 + 페이로드" 직렬화.
  const initialResponse = createResponse(PACKET_TYPE.monsterDeathNotification, 0, payloadData);

  socket.write(initialResponse);
};

export default monsterDeathHandler;
