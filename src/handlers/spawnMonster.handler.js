import Monster from '../classes/monster.class.js';
import { createResponse } from '../utils/response/createResponse.js';
import { PACKET_TYPE } from '../constants/header.js';
import { getProtoMessages } from '../init/loadProtos.js';
import { v4 as uuidv4 } from 'uuid';

const spawnMonsterHandler = async (socket) => {
  // 몬스터 생성.
  const monsterId = uuidv4(); // 몬스터id 생성.
  const monsterNumber = Math.floor(Math.random() * 5) + 1; // 몬스터넘버 (1~5) 랜덤.
  Monster.getInstance().addMonster(monsterId, monsterNumber, 1); // 몬스터 저장.

  // 페이로드 직렬화.
  const protoMessages = getProtoMessages();
  const monster = Monster.getInstance().getMonster(monsterId);

  const response = protoMessages.towerDefense.GamePacket;
  const gamePacket = response.create({
    spawnMonsterResponse: {
      monsterId: monster.monsterId,
      monsterNumber: monster.monsterNumber,
    },
  });

  const payload = response.encode(gamePacket).finish();

  // "헤더 + 페이로드" 직렬화.
  const initialResponse = createResponse(PACKET_TYPE.SPAWN_MONSTER_RESPONSE, 0, payload);

  socket.write(initialResponse);
};

export default spawnMonsterHandler;
