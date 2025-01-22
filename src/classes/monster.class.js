// 몬스터데이터 패킷은 아래와 같다. 
// 1. monsterId
// 2. monsterNumber
// 3. level 
// 서버에 스폰된 몬스터의 정보는 monsterId , monsterNumber , level 을 가지고 있는다.
// 객체로 키값은 monsterId(uuid)로 맵핑한다.

export default class Monster {
  static instance = null;

  constructor() {
    if (Monster.instance) {
      throw new Error('UserManager는 싱글턴 클래스입니다. getInstance()를 사용하세요.');
    }
    this.monsters = {};
    Monster.instance = this; // 인스턴스를 static 변수에 저장
  }

  static getInstance() {
    if (!Monster.instance) {
      Monster.instance = new Monster();
    }

    return Monster.instance;
  }

  // 몬스터 생성.
  addMonster(monsterId, monsterNumber, level) {
    const lower32Bits = parseInt(monsterId.replace(/-/g, '').slice(-8), 16);
    // 몬스터 정보.
    const monsterInfo = {
      monsterId: lower32Bits,
      monsterNumber: monsterNumber,
      level: level,
    }

    // 몬스터 맵핑
    this.monsters[monsterId] = monsterInfo;
  };

  // 몬스터 삭제.
  removeMonster(monsterId) {
    if (!this.validateKey(monsterId)) {
      return;
    }

    delete this.monsters[monsterId];
  };

  // 몬스터 찾기.
  getMonster(monsterId) {
    if (!this.validateKey(monsterId)) {
      return;
    }
    
    return this.monsters[monsterId];
  }

  // 몬스터들 찾기.
  getMonsters() {
    return Object.values(this.monsters);
  }

  // 키 검증
  validateKey(monsterId) {
    if (!this.monsters[monsterId]) {
      console.error(`해당 ID로 몬스터를 찾을 수 없습니다: ${monsterId}`);
      return false;  // 검증 실패
    }
    return true;  // 검증 성공
  }
}

