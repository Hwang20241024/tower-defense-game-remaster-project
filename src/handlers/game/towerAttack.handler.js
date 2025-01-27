import { config } from '../../config/config.js';
import { enemyTowerAttackNotification } from '../../utils/notification/game.notification.js';
import { getUserBySocket } from '../../session/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { getGameSession } from '../../session/game.session.js';

export const towerAttackHandler = (socket, payload) => {
  const { towerId, monsterId } = payload;

  // 소켓을 통해 유저 객체 불러오기
  const user = getUserBySocket(socket);
  if (!user) {
    throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
  }

  // 유저를 통해 게임 세션 불러오기
  const gameId = user.getGameId();
  const session = getGameSession(gameId);
  if (!session) return;

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
  if (monster.getMonsterHp() <= 0) return;

  // 검증을 통과했다면 몬스터의 체력 감소
  // 일반 타워의 데미지는 40
  monster.setMonsterHp(-config.ingame.towerPower);
  // console.log('몬스터 체력 : ', monster.getMonsterHp());

  const packet = enemyTowerAttackNotification(payload, socket);

  session.broadcast(packet, socket);
};
