import { config } from '../../config/config.js';
import { getGameSession, removeGameSession } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import {
  gameOverNotification,
  updateBaseHPNotification,
} from '../../utils/notification/game.notification.js';

// 나와 상대를 가리지 않고 몬스터가 베이스를 공격하면 도착하는 패킷
export const monsterAttackBaseHandler = (socket, payload) => {
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

  // 1. damage가 유효한지 검증
  // 클라이언트에서 에셋파일로 몬스터의 데미지를 정의하고 있기 때문에 config에 하드코딩해둔 값으로 검증하거나 json 파일을 만들어야 함

  // 2. 몬스터의 위치가 정말로 endPoint에 다다랐는가?(최소한의 검증)
  // let monsterPos; // 이걸 서버에서 상태 동기화 중인 몬스터 좌표라고 가정
  // // 근데 payload에 몬스터 ID가 없어서...가장 오른쪽에 도달한 몬스터의 좌표를 가져와야할 것 같음
  // let endPoint; // 서버에서 생성한 monsterPath의 마지막 좌표라고 가정

  // const distance = Math.sqrt(
  //   Math.pow(monsterPos.x - endPoint.x, 2) + Math.pow(gate.position.y - user.y, 2),
  // ); // 서버에서 업데이트 중인 몬스터의 좌표와 실제 엔드 포인트의 좌표 사이의 거리

  // // 거리 distance가 오차범위를 넘어서면 에러라고 판단
  // if (distance > config.ingame.offset) {
  //   // throw new CustomError(
  //   //   ErrorCodes.INVALID_POSITON,
  //   //   '몬스터가 아직 베이스에 도착하지 않았습니다.',
  //   // );
  // }

  user.baseHp -= damage;
  if (user.baseHp <= 0) {
    user.baseHp = 0;
  }

  console.log('baseHp : ', user.baseHp);

  // S2CUpdateBaseHPNotification 패킷을 나와 상대방에게 전송하기
  const dataToMe = { isOpponent: false, baseHp: user.baseHp };
  const dataToOpponent = { isOpponent: true, baseHp: user.baseHp };

  const packetToMe = updateBaseHPNotification(dataToMe, socket);
  const packetToOpponent = updateBaseHPNotification(dataToOpponent, socket);

  socket.write(packetToMe);
  session.broadcast(packetToOpponent, socket);

  // 내 baseHp가 0보다 작아졌다면 상대방에게 승리 패킷 보내기
  if (user.baseHp === 0) {
    const loseToMe = { isWin: false };
    const winToOpponent = { isWin: true };

    const losePacketToMe = gameOverNotification(loseToMe, socket);
    const winPacketToOpponent = gameOverNotification(winToOpponent, socket);

    socket.write(losePacketToMe);
    session.broadcast(winPacketToOpponent, socket);

    // 게임 승패가 결정되는 동시에 게임 종료 작업
    removeGameSession(gameId);
    session.intervalManager.clearAll();
    // user.setGameId(null);
  }
};
