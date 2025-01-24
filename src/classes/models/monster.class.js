// 몬스터데이터 패킷은 아래와 같다. 
// 1. monsterId
// 2. monsterNumber
// 3. level 
// 서버에 스폰된 몬스터의 정보는 monsterId , monsterNumber , level 을 가지고 있는다.
// 객체로 키값은 monsterId(uuid)로 맵핑한다.

export default class Monster {
  constructor(monsterId, gameId, monsterNumber, level, hp) {
    this.monsterId = monsterId;
    this.gameId = gameId;
    this.monsterNumber = monsterNumber;
    this.level = level;
    this.Hp = hp;
  }
  
  getMonsterId() {
    return this.monsterId;
  }

  getMonsterGameId() {
    return this.monsterNumber;
  }

  getMonsteNumber() {
    return this.monsterNumber;
  }

  getMonsterLevel() {
    return this.level;
  }

  getMonsterHp() {
    return this.Hp;
  }
  
}

