import { HANDLER_IDS } from '../constants/handlerIds.js';
import { PACKET_TYPE } from '../constants/header.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import CustomError from '../utils/error/customError.js';
import spawnMonsterHandler from './spawnMonster.handler.js';

const handlers = {
  // 다른 핸들러들을 추가
  [PACKET_TYPE.SPAWN_MONSTER_REQUEST]: {
    handler: spawnMonsterHandler,
    protoType: 'towerDefense.C2SSpawnMonsterRequest',
  },
  [PACKET_TYPE.REGISTER_REQUEST]: {
    handler: spawnMonsterHandler, // 이거 테스트니깐 수정해야함
    protoType: 'towerDefense.C2SRegisterRequest',
  },
  [PACKET_TYPE.LOGIN_REQUEST]: {
    handler: spawnMonsterHandler, // 이거 테스트니깐 수정해야함
    protoType: 'towerDefense.C2SLoginRequest',
  }
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
