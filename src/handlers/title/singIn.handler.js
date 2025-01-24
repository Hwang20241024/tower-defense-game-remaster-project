import { findUserById, updateUserLoginState } from '../../db/user/user.db.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import bcrypt from 'bcrypt';
import { createResponse } from '../../utils/response/createResponse.js';
import { PACKET_DATA, PACKET_TYPE } from '../../constants/header.js';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET_KEY } from '../../constants/env.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import { addUser, getUserBySocket } from '../../session/user.session.js';
import { getSequenceSession, removeSequenceSession } from '../../session/sequence.session.js';

const singInHandler = async (socket, payload, sequence) => {
  const { id, password } = payload;

  try {
    // 1. Paylaod 유효성 검사.
    if (!id) {
      throw new CustomError(ErrorCodes.INVALID_VALUE, '아이디는 필수 입력 입니다.');
    }

    if (!password) {
      throw new CustomError(ErrorCodes.INVALID_VALUE, '비밀번호는 필수 입력 입니다.');
    }

    // 2. 유저 정보 조회
    const user = await findUserById(id);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '해당 유저를 찾을 수 없습니다.');
    }

    // 3. 비밀번호 체크
    if (!(await bcrypt.compare(password, user.password))) {
      throw new CustomError(ErrorCodes.INVALID_PASSWORD, '비밀번호가 일치하지 않습니다.');
    }

    if (user.isLogin) {
      throw new CustomError(ErrorCodes.INVALID_REQUEST, '이미 로그인 상태 입니다.');
    }

    // 4. JWT 토큰 생성
    const token = jwt.sign(id, TOKEN_SECRET_KEY);
    // 임시 시퀀스 세션에서 시퀀스 유효여부 체크
    const tempSequence = getSequenceSession(socket);
    if (sequence !== tempSequence) {
      throw new CustomError(ErrorCodes.INVALID_SEQUENCE, '유효하지 않는 시퀀스 입니다.');
    }

    // 5. 유저 세션 추가 + DB에서 유저의 최고 기록 불러오기
    const userSession = addUser(socket, id, user.score, user.rating, sequence);

    // 임시 Sequnce세션에서 삭제
    removeSequenceSession(socket);

    // 6. 로그인 상태 변경
    await updateUserLoginState(id, true);

    // 7. Response
    const protoMessages = getProtoMessages();
    const response = protoMessages.towerDefense.GamePacket;
    const gamePacket = response.create({
      loginResponse: {
        success: true,
        message: '로그인 성공',
        token,
        failCode: 0,
      },
    });
    const responsePayload = response.encode(gamePacket).finish();

    const responsePacket = createResponse(
      PACKET_TYPE.LOGIN_RESPONSE,
      userSession.getNextSequence(),
      responsePayload,
    );
    socket.write(responsePacket);
  } catch (error) {
    handleError(socket, error, PACKET_TYPE.LOGIN_REQUEST);
  }
};

export default singInHandler;
