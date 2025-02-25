import { transaction, updateUserRating, updateUserScore } from '../../db/user/user.db.js';
import { getGameSession, removeGameSession } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import {
  gameOverNotification,
  updateBaseHPNotification,
} from '../../utils/notification/game.notification.js';

export const monsterAttackBaseHandler = async (socket, payload) => {
  // 패킷 파서(혹은 onData)에서 버전 검증
  const { damage } = payload;

  // 소켓을 통해 유저 객체 불러오기
  const user = getUserBySocket(socket);
  if (!user) {
    throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
  }

  // 유저를 통해 게임 세션 불러오기
  const gameId = user.getGameId();
  const session = getGameSession(gameId);
  if (!session) return;

  user.baseHp -= damage;
  if (user.baseHp <= 0) {
    user.baseHp = 0;
  }

  // S2CUpdateBaseHPNotification 패킷을 나와 상대방에게 전송하기
  const dataToMe = { isOpponent: false, baseHp: user.baseHp };
  const dataToOpponent = { isOpponent: true, baseHp: user.baseHp };

  const packetToMe = updateBaseHPNotification(dataToMe, socket);
  const packetToOpponent = updateBaseHPNotification(dataToOpponent, socket);

  socket.write(packetToMe);
  session.broadcast(packetToOpponent, socket);

  // 내 baseHp가 0보다 작아졌다면 상대방에게 승리 패킷 보내기
  if (user.baseHp === 0) {
    // 유저를 통해 상대방 객체 불러오기
    const opponent = user.getOpponent();

    // 유저의 DB 데이터와 최고 기록
    const userHighestScore = user.highScore;

    // 상대방의 DB 데이터와 최고 기록
    const opponentHighestScore = opponent.highScore;

    const loseToMe = { isWin: false };
    const winToOpponent = { isWin: true };

    const losePacketToMe = gameOverNotification(loseToMe, socket);
    const winPacketToOpponent = gameOverNotification(winToOpponent, socket);

    socket.write(losePacketToMe);
    session.broadcast(winPacketToOpponent, socket);

    gameEnd(userHighestScore, opponentHighestScore, user, opponent, gameId, session);
  }
};

export async function gameEnd(
  userHighestScore,
  opponentHighestScore,
  user,
  opponent,
  gameId,
  session,
) {
  // elo rating
  let myRate = user.rating;
  let opponentRate = opponent.rating;
  const ea = 1 / (1 + Math.pow(10, (opponentRate - myRate) / 400)); // 내 기대 승률
  const oa = 1 / (1 + Math.pow(10, (myRate - opponentRate) / 400)); // 상대 기대 승률
  myRate = myRate - 16 * ea;
  opponentRate = opponentRate + 16 * (1 - oa);
  try {
    // update elo rating
    await transaction(async () => {
      await updateUserRating(myRate, user.id);
      await updateUserRating(opponentRate, opponent.id);
    });
  } catch (error) {
    console.log(error);
  }

  user.rating = myRate;
  opponent.rating = opponentRate;

  // 게임 승패가 결정되는 동시에 게임 종료 작업
  // DB에 나와 상대방의 최고 기록 저장
  if (user.score > userHighestScore) {
    user.setHighScore(user.score);
    await updateUserScore(user.score, user.id);
  }
  if (opponent.score > opponentHighestScore) {
    opponent.setHighScore(opponent.score);
    await updateUserScore(opponent.score, opponent.id);
  }

  removeGameSession(gameId); // 게임 세션 삭제
  session.intervalManager.clearAll(); // 모든 인터벌 제거

  // 나와 상대 유저의 객체를 초기화
  user.resetUser();
  opponent.resetUser();
}
