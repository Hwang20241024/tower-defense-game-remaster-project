import { config } from '../../config/config.js';
import { enemyTowerAttackNotification } from '../../utils/notification/game.notification.js';
import { getUserBySocket } from '../../session/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { getGameSession } from '../../session/game.session.js';

// 에러 부분이 완료되기 전까지 주석처리 좀 해둘게요!
export const towerAttackHandler = (socket, payload) => {
  // 패킷 파서(혹은 onData)에서 버전 검증
  const { towerId, monsterId } = payload;

  // 소켓을 통해 유저 객체 불러오기
  const user = getUserBySocket(socket);
  if (!user) {
    throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
  }

  // 유저를 통해 게임 세션 불러오기
  const gameId = user.getGameId();
  const session = getGameSession(gameId);

  // towerId, monsterId가 유효한지 검증
  // 1. 해당 타워를 사용자가 소유 중인가?
  const tower = session.checkIsTowerOwner(socket, towerId);
  if (!tower) {
    throw new CustomError(ErrorCodes.INVALID_PACKET, '사용자가 보유 중인 타워가 아닙니다.');
  }

  // 2. 몬스터가 세션에 존재하는가?
  const monster = user.monsters.find((monster) => monster.monsterId === monsterId);
  if (!monster) {
    throw new CustomError(ErrorCodes.INVALID_PACKET, '세션에 존재하지 않는 몬스터입니다.');
  }

  // 검증을 통과했다면 몬스터의 체력 감소...타워의 데미지는 클라이언트 에셋 거를 config로 정의해둬야 할 듯(직접 확인해보니 40임)

  // monster.hp -= config.ingame.towerPower;

  const packet = enemyTowerAttackNotification(payload, socket);

  session.broadcast(packet, socket);
};

// !!! 시간이 남아돌면 해보기 !!!
// 2. 타워가 몬스터를 공격할 수 있는 위치가 맞는가?
// 궁금증 : json 파일이 아니라 유니티 에셋을 통해 타워의 power,range 등등이 정의되는 것 같던데 그럼 서버는 이 기본값에 대해 알 방법이 없는 건가? 클라이언트를 손대기 전까지는 타워의 공격력 혹은 범위 검증이 불가능한 것...??
