import { CLIENT_VERSION } from '../../constants/env.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import { getUserBySocket } from '../../session/user.session.js';
import CustomError from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';
import { createResponse } from '../response/createResponse.js';

export const stateSyncNotification = (data, socket) => {
  // 소켓을 통해 유저 객체 불러오기
  const user = getUserBySocket(socket);
  if (!user) {
    throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
  }

  const protoMessages = getProtoMessages();

  const response = protoMessages.towerDefense.GamePacket;
  const gamePacket = response.create({
    stateSyncNotification: data,
  });

  const stateSyncPacket = response.encode(gamePacket).finish();

  // return makeNotification(enemyTowerAttackPacket, PACKET_TYPE.ENEMY_TOWER_ATTACK_NOTIFICATION);
  return createResponse(PACKET_TYPE.STATE_SYNC_NOTIFICATION, user.sequence, stateSyncPacket);
};

// 패킷의 페이로드 부분을 바이트로 직렬화 하는 부분
export const enemyTowerAttackNotification = (data, socket) => {
  // 소켓을 통해 유저 객체 불러오기
  const user = getUserBySocket(socket);
  if (!user) {
    throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
  }

  const protoMessages = getProtoMessages();

  const response = protoMessages.towerDefense.GamePacket;
  const gamePacket = response.create({
    enemyTowerAttackNotification: data,
  });

  const enemyTowerAttackPacket = response.encode(gamePacket).finish();

  // return makeNotification(enemyTowerAttackPacket, PACKET_TYPE.ENEMY_TOWER_ATTACK_NOTIFICATION);
  return createResponse(
    PACKET_TYPE.ENEMY_TOWER_ATTACK_NOTIFICATION,
    user.sequence,
    enemyTowerAttackPacket,
  );
};

export const updateBaseHPNotification = (data, socket) => {
  // 소켓을 통해 유저 객체 불러오기
  const user = getUserBySocket(socket);
  if (!user) {
    throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
  }

  const protoMessages = getProtoMessages();

  const response = protoMessages.towerDefense.GamePacket;
  const gamePacket = response.create({
    updateBaseHpNotification: data,
  });

  const updateBaseHPPacket = response.encode(gamePacket).finish();

  // return makeNotification(enemyTowerAttackPacket, PACKET_TYPE.ENEMY_TOWER_ATTACK_NOTIFICATION);
  return createResponse(PACKET_TYPE.UPDATE_BASE_HP_NOTIFICATION, user.sequence, updateBaseHPPacket);
};

export const gameOverNotification = (data, socket) => {
  // 소켓을 통해 유저 객체 불러오기
  const user = getUserBySocket(socket);
  if (!user) {
    throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
  }

  const protoMessages = getProtoMessages();

  const response = protoMessages.towerDefense.GamePacket;
  const gamePacket = response.create({
    gameOverNotification: data,
  });

  const gameOverPacket = response.encode(gamePacket).finish();

  // return makeNotification(enemyTowerAttackPacket, PACKET_TYPE.ENEMY_TOWER_ATTACK_NOTIFICATION);
  return createResponse(PACKET_TYPE.GAME_OVER_NOTIFICATION, user.sequence, gameOverPacket);
};
