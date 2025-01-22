import MonsterManager from '../classes/managers/monster.manager.js';
import { createResponse } from '../utils/response/createResponse.js';
import { PACKET_TYPE } from '../constants/header.js';
import { getProtoMessages } from '../init/loadProtos.js';
import { v4 as uuidv4 } from 'uuid';
import { getAllGameSessions, getGameSession } from '../session/game.session.js';

const spawnMonsterHandler = async (socket, payload) => {
  // 몬스터 생성.
  const monsterId = uuidv4(); // 몬스터id 생성.
  const lower32Bits = parseInt(monsterId.replace(/-/g, '').slice(-8), 16);
  const monsterNumber = Math.floor(Math.random() * 5) + 1; // 몬스터넘버 (1~5) 랜덤.

  // 게임Id 가져오기.
  let gameSessions = getAllGameSessions();
  let gameId;
  for (let value of gameSessions) {
    const user = value.getUser(socket);
    if (user) {
      gameId = value.id;
    }
  }

  // 몬스터가 저장될 세션이 없다면추가 있으면 생략.
  MonsterManager.getInstance().addSessionMonster(gameId);

  // 몬스터 추가.
  MonsterManager.getInstance().addMonsterToSession(gameId, lower32Bits, monsterNumber, 1);


  const protoMessages = getProtoMessages();
  const monster = MonsterManager.getInstance().getMonster(gameId, lower32Bits);

  const response = protoMessages.towerDefense.GamePacket;
  const gamePacket = response.create({
    spawnMonsterResponse: {
      monsterId: monster.monsterId,
      monsterNumber: monster.monsterNumber,
    },
  });

  const payloadData = response.encode(gamePacket).finish();

  // "헤더 + 페이로드" 직렬화.
  const initialResponse = createResponse(PACKET_TYPE.SPAWN_MONSTER_RESPONSE, 0, payloadData);

  socket.write(initialResponse);

  // 브로드 캐스트 (동기화)
  const gameSession = getGameSession(gameId);
  const initialResponse2 = createResponse(
    PACKET_TYPE.SPAWN_ENEMY_MONSTER_NOTIFICATION,
    0,
    payloadData,
  );
  gameSession.broadcast(initialResponse2, socket);
};

export default spawnMonsterHandler;
