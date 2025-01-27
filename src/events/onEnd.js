import { getAllUserSessions, getUserBySocket, removeUser } from '../session/user.session.js';
import { getGameSession } from '../session/game.session.js';
import { updateUserLoginState } from '../db/user/user.db.js';
import { getSequenceSession, removeSequenceSession } from '../session/sequence.session.js';

export const onEnd = (socket) => async () => {
  console.log('클라이언트 연결이 종료되었습니다. (END)');
  // 로그인 상태인지 체크(유저 세션)
  const user = getUserBySocket(socket);
  if (user) {
    // 게임 진행중이면 게임 세션에서 해당 유저 삭제
    const gameSession = getGameSession(user.getGameId());
    if (gameSession) {
      gameSession.removeUser(socket);
    }

    // 유저 세션에서 삭제
    removeUser(socket);

    await updateUserLoginState(user.getUserId(), false);
  } else {
    // 임시 Sequence 세션 확인 후 삭제
    const sequenceSession = getSequenceSession(socket);
    if (sequenceSession) {
      removeSequenceSession(socket);
    }
  }
};
