import bcrypt from 'bcrypt';
import { createUser } from '../../db/user/user.db.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { PACKET_TYPE } from '../../constants/header.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { setSequenceSession, getSequenceSession } from '../../session/sequence.session.js';
import { getUserBySocket } from '../../session/user.session.js';

/* 회원가입 핸들러 */
const singUpHandler = async (socket, payload, sequence) => {
  const { id, password, email } = payload;
  try {
    // 1. Payload 유효성 검사
    if (!id) {
      throw new CustomError(ErrorCodes.INVALID_VALUE, '아이디는 필수 입력 입니다.');
    }

    if (!password) {
      throw new CustomError(ErrorCodes.INVALID_VALUE, '비밀번호는 필수 입력 입니다.');
    }

    if (!email) {
      throw new CustomError(ErrorCodes.INVALID_VALUE, '이메일은 필수 입력 입니다.');
    }

    // 이메일 형식 체크
    const regEmail =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

    if (!regEmail.test(email)) {
      throw new CustomError(ErrorCodes.INVALID_VALUE, '이메일 형식이 아닙니다.');
    }

    // 2. 비밀번호 bcrypt로 암호화
    const hashPw = await bcrypt.hash(password, 10);

    // 3. 유저 정보 저장
    await createUser(id, hashPw, email);

    // 4. 임시 시퀀스 세션에서 시퀀스 유효여부 체크
    const tempSequence = getSequenceSession(socket);
    let nextSequence;
    if (tempSequence) {
      if (sequence !== tempSequence) {
        throw new CustomError(ErrorCodes.INVALID_SEQUENCE, '유효하지 않는 시퀀스 입니다.');
      }
      nextSequence = tempSequence + 1;
      // 임시 Sequnece세션에 업데이트
      setSequenceSession(socket, nextSequence);
    } else {
      const user = getUserBySocket(socket);
      if (!user) {
        throw new CustomError(ErrorCodes.USER_NOT_FOUND, '해당 유저를 찾을 수 없습니다.');
      }
      user.checkSequence(sequence);
      nextSequence = user.getNextSequence();
    }

    // 5. Response 처리
    const protoMessages = getProtoMessages();
    const response = protoMessages.towerDefense.GamePacket;
    const gamePacket = response.create({
      registerResponse: { success: true, message: '회원가입에 성공하셨습니다.', failCode: 0 },
    });

    const responsePayload = response.encode(gamePacket).finish();

    const responsePacket = await createResponse(
      PACKET_TYPE.REGISTER_RESPONSE,
      nextSequence,
      responsePayload,
    );

    socket.write(responsePacket);
  } catch (error) {
    handleError(socket, error, PACKET_TYPE.REGISTER_REQUEST);
  }
};

export default singUpHandler;
