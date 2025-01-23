import { createResponse } from '../response/createResponse.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import { PACKET_TYPE } from '../../constants/header.js';

export const handleError = (socket, error, packetType = null) => {
  let failCode;

  if (error.code) {
    console.error(`에러 코드: ${error.code}, 메시지: ${error.message}`);
    failCode = 2;
  } else {
    failCode = 1;
    console.error(`일반 에러: ${error.message}`);
  }

  if (packetType !== null) {
    const protoMessages = getProtoMessages();
    const response = protoMessages.towerDefense.GamePacket;
    let gamePacket;
    let responsePacketType;
    if (PACKET_TYPE.REGISTER_REQUEST === packetType) {
      //회원 가입
      gamePacket = response.create({
        registerResponse: {
          success: false,
          message: error.message,
          failCode: failCode,
        },
      });
      responsePacketType = PACKET_TYPE.REGISTER_RESPONSE;
    } else if (PACKET_TYPE.LOGIN_REQUEST === packetType) {
      //로그인
      gamePacket = response.create({
        loginResponse: {
          success: false,
          message: error.message,
          token: null,
          failCode: failCode,
        },
      });
      responsePacketType = PACKET_TYPE.LOGIN_RESPONSE;
    }
    const responsePayload = response.encode(gamePacket).finish();
    const responsePacket = createResponse(responsePacketType, 0, responsePayload);
    socket.write(responsePacket);
  }
};
