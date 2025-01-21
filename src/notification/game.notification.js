import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../constants/header.js';
import { getProtoMessages } from '../init/loadProtos.js';

// 패킷 헤더 만들어주는 함수
const makeNotification = (message, type) => {
  // 패킷 타입 정보를 포함한 버퍼 생성
  const packetType = Buffer.alloc(0);
  packetType.writeUInt8(type, 0);

  // 길이 정보와 메시지를 함께 전송
  return Buffer.concat([packetType, message]);
};

export const enemyTowerAttackNotification = (data) => {
  const protoMessages = getProtoMessages();
  const enemyTowerAttack = protoMessages.towerDefense.S2CEnemyTowerAttackNotification;

  // const towerId = data.towerId;
  // const monsterId = data.monsterId;

  // const payload = { towerId, monsterId };

  const payload = data;
  const message = enemyTowerAttack.create(payload);

  const enemyTowerAttackPacket = enemyTowerAttack.encode(message).finish();

  return makeNotification(enemyTowerAttackPacket, PACKET_TYPE.enemyTowerAttackNotification);
};
