import { config } from '../../config/config.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';

export const monsterAttackBaseHandler = ({ socket, payload }) => {
  // 패킷 파서(혹은 onData)에서 버전 검증
  const { damage } = payload;

  // 1. damage가 유효한지 검증
  // -> 안타깝지만 못한다. 왜냐하면 클라이언트에서 에셋파일로 몬스터의 데미지를 정의하고 있기 때문에
  // 서버는 relational하게 구현할 수밖에 없다.

  // 2. 몬스터의 위치가 정말로 endPoint에 다다랐는가?(최소한의 검증)
  let monsterPos; // 이걸 서버에서 상태 동기화 중인 몬스터 좌표라고 가정
  // 근데 payload에 몬스터 ID가 없어서...가장 오른쪽에 도달한 몬스터의 좌표를 가져와야할 것 같음
  let endPoint; // 서버에서 생성한 monsterPath의 마지막 좌표라고 가정
  let baseHp; // 서버에서 상태 동기화 중인 베이스의 hp라고 가정

  const distance = Math.sqrt(
    Math.pow(monsterPos.x - endPoint.x, 2) + Math.pow(gate.position.y - user.y, 2),
  ); // 서버에서 업데이트 중인 몬스터의 좌표와 실제 엔드 포인트의 좌표 사이의 거리

  // 거리 distance가 오차범위를 넘어서면 에러라고 판단
  if (distance > config.ingame.offset) {
    throw new CustomError(
      ErrorCodes.INVALID_POSITON,
      '몬스터가 아직 베이스에 도착하지 않았습니다.',
    );
  }

  baseHp -= damage;
};
