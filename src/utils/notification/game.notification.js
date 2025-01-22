import { CLIENT_VERSION } from '../../constants/env.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import { createResponse } from '../response/createResponse.js';

// 패킷의 페이로드 부분을 바이트로 직렬화 하는 부분
export const enemyTowerAttackNotification = (data, socket) => {
  // 소켓을 통해 유저 객체 불러오기
  const user = getUserBySocket(socket);
  if (!user) {
    throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
  }

  const protoMessages = getProtoMessages();
  const enemyTowerAttack = protoMessages.towerDefense.S2CEnemyTowerAttackNotification;

  const payload = data;
  const message = enemyTowerAttack.create(payload);

  const enemyTowerAttackPacket = enemyTowerAttack.encode(message).finish();

  // return makeNotification(enemyTowerAttackPacket, PACKET_TYPE.ENEMY_TOWER_ATTACK_NOTIFICATION);
  return createResponse(
    PACKET_TYPE.ENEMY_TOWER_ATTACK_NOTIFICATION,
    user.sequence,
    enemyTowerAttackPacket,
  );
};
