import { createResponse } from '../response/createResponse.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { setSequenceSession, getSequenceSession } from '../../session/sequence.session.js';
import { getUserBySocket } from '../../session/user.session.js';

export const handleError = (socket, error, packetType = null) => {
  let failCode;

  if (error.code) {
    console.log(error);
    console.error(`에러 코드: ${error.code}, 메시지: ${error.message}`);
    failCode = 2;
  } else {
    console.log(error);
    failCode = 1;
    console.error(`일반 에러: ${error.message}`);
  }

  // 시퀀스 처리
  const tempSequence = getSequenceSession(socket);
  if (tempSequence) {
    // 임시 시퀀스 세션
    setSequenceSession(socket, tempSequence + 1);
  } else {
    // 유저 세션 시퀀스
    const user = getUserBySocket(socket);
    if (!user) {
      user.updateNextSequence();
    }
  }

  /**
   * 회원가입, 로그인의 오류 패킷
   */
  if (packetType !== null) {
    let responsePacket;
    if (PACKET_TYPE.REGISTER_REQUEST === packetType) {
      //회원 가입
      responsePacket = createResponse(
        PACKET_TYPE.REGISTER_RESPONSE,
        0,
        {
          success: false,
          message: error.message,
          failCode: failCode,
        },
        'registerResponse',
      );

      socket.write(responsePacket);
    } else if (PACKET_TYPE.LOGIN_REQUEST === packetType) {
      //로그인
      responsePacket = createResponse(
        PACKET_TYPE.LOGIN_RESPONSE,
        0,
        {
          success: false,
          message: error.message,
          token: null,
          failCode: failCode,
        },
        'loginResponse',
      );

      socket.write(responsePacket);
    }
  }
};
