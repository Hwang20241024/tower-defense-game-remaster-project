import { CLIENT_VERSION } from '../../constants/env.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProtos.js';

// 패킷 헤더 만들어주는 함수
const makeNotification = (message, type) => {
  // 패킷 타입 정보를 포함한 버퍼 생성
  const packetType = Buffer.alloc(PACKET_DATA.PACKET_TYPE_LENGTH);
  packetType.writeUInt8(type, 0);

  const version = CLIENT_VERSION;
  const versionBuffer = Buffer.from(version, 'utf-8');
  const versionLength = versionBuffer.length;

  const payload = message;
  const payloadLength = payload.length;

  const packetBuffer = Buffer.concat([
    Buffer.alloc(2).writeUInt16BE(packetType, 0), // packetType (2바이트)
    Buffer.alloc(1).writeUInt8(versionLength, 0), // versionLength (1바이트)
    versionBuffer, // version (n바이트)
    Buffer.alloc(4).writeUInt32BE(sequence, 0), // sequence (4바이트)
    Buffer.alloc(4).writeUInt32BE(payloadLength, 0), // payloadLength (4바이트)
    payload, // payload (n바이트)
  ]);

  sequence++;

  // 길이 정보와 메시지를 함께 전송
  return packetBuffer;
};

// 패킷의 페이로드 부분을 바이트로 직렬화 하는 부분
export const enemyTowerAttackNotification = (data) => {
  const protoMessages = getProtoMessages();
  const enemyTowerAttack = protoMessages.towerDefense.S2CEnemyTowerAttackNotification;

  // const towerId = data.towerId;
  // const monsterId = data.monsterId;

  // const payload = { towerId, monsterId };

  const payload = data;
  const message = enemyTowerAttack.create(payload);

  const enemyTowerAttackPacket = enemyTowerAttack.encode(message).finish();

  return makeNotification(enemyTowerAttackPacket, PACKET_TYPE.ENEMY_TOWER_ATTACK_NOTIFICATION);
};
