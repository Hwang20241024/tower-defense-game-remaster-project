import { PACKET_TYPE } from '../constants/header.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import CustomError from '../utils/error/customError.js';
import spawnMonsterHandler from './game/spawnMonster.handler.js';
import singUpHandler from './title/singUp.handler.js';
import singInHandler from './title/singIn.handler.js';
import { matchHandler } from './title/match.handler.js';
import { monsterAttackBaseHandler } from './game/monsterAttackBase.handler.js';
import { towerAttackHandler } from './game/towerAttack.handler.js';
import purchaseTowerHandler from './game/purchaseTower.handler.js';
import monsterDeathHandler from './game/monsterDeath.handler.js'

const handlers = {
  // 다른 핸들러들을 추가
  [PACKET_TYPE.SPAWN_MONSTER_REQUEST]: {
    handler: spawnMonsterHandler,
    protoType: 'towerDefense.C2SSpawnMonsterRequest',
  },
  [PACKET_TYPE.MONSTER_DEATH_NOTIFICATION]: {
    handler: monsterDeathHandler,
    protoType: 'towerDefense.C2SMonsterDeathNotification',
  },
  [PACKET_TYPE.REGISTER_REQUEST]: {
    handler: singUpHandler,
    protoType: 'towerDefense.C2SRegisterRequest',
  },
  [PACKET_TYPE.LOGIN_REQUEST]: {
    handler: singInHandler,
    protoType: 'towerDefense.C2SLoginRequest',
  },
  [PACKET_TYPE.MATCH_REQUEST]: {
    handler: matchHandler, // 이거 테스트니깐 수정해야함
    protoType: 'towerDefense.C2SMatchRequest',
  },
  [PACKET_TYPE.MONSTER_ATTACK_BASE_REQUEST]: {
    handler: monsterAttackBaseHandler,
    protoType: 'towerDefense.C2SMonsterAttackBaseRequest',
  },
  [PACKET_TYPE.TOWER_ATTACK_REQUEST]: {
    handler: towerAttackHandler,
    protoType: 'towerDefense.C2STowerAttackRequest',
  },
  [PACKET_TYPE.TOWER_PURCHASE_REQUEST]: {
    handler: purchaseTowerHandler,
    protoType: 'towerDefense.C2STowerPurchaseRequest',
  },
};

export const getHandlerById = (packetType) => {
  if (!handlers[packetType]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `패킷타입을 찾을 수 없습니다: ID ${packetType}`,
    );
  }
  return handlers[packetType].handler;
};

export const getProtoTypeNameByPacketType = (packetType) => {
  if (!handlers[packetType]) {
    // packetParser 체크하고 있지만 그냥 추가합니다.
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `패킷타입을 찾을 수 없습니다: ID ${handlerId}`,
    );
  }
  return handlers[packetType].protoType;
};
