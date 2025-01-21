export const enemyTowerAttackHandler = ({ socket, payload }) => {
  const { towerId, monsterId } = payload;

  // 상대 유저도 같은 게임 세션에 있을 테니, 소켓을 통해 유저 객체를 먼저 구해본다.
  const user = getUserBySocket(socket);
  if (!user) {
    throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
  }

  let gameSession = {
    towers: [
      { id: 1, x: 3, y: 10 },
      { id: 2, x: 5, y: 10 },
    ],
    monsters: [
      { id: 1, hp: 100 },
      { id: 2, hp: 150 },
    ],
  }; // 게임 세션을 구해왔다고 가정(대충 이런 형식을 취하고 있을 것이다.)

  // 1. 타워가 해당 게임 세션에 존재하는가?
  const tower = gameSession.towers.find((tower) => tower.id === towerId);
  if (!tower) {
    throw CustomError(ErrorCodes.INVALID_PACKET, '상대방이 보유한 타워가 아닙니다.');
  }

  // 2. 몬스터가 해당 게임 세션에 존재하는가?
  const monster = gameSession.monsters.find((monster) => monster.id === monsterId);

  if (!monster) {
    throw CustomError(ErrorCodes.INVALID_PACKET, '세션에 존재하지 않는 몬스터입니다.');
  }

  // 검증을 통과했다면 (상대방 화면 속) 몬스터의 체력 감소
  monster.hp -= config.ingame.towerPower;

  // 몬스터 체력이 닳는 건 클라이언트 쪽에서 이미 구현을 해놔서 브로드 캐스트가 필요가 없다.
};
