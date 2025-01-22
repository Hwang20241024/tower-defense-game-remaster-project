import Monster from '../models/monster.class';

export default class MonsterManager {
  static instance = null;

  constructor() {
    if (MonsterManager.instance) {
      throw new Error('MonsterManager는 싱글턴 클래스입니다. getInstance()를 사용하세요.');
    }
    this.monsters = {};
    MonsterManager.instance = this; // 인스턴스를 static 변수에 저장
  }

  static getInstance() {
    if (!MonsterManager.instance) {
      MonsterManager.instance = new MonsterManager();
    }

    return MonsterManager.instance;
  }

  // 몬스터 세션 생성.
  addSessionMonster(gameId) {
    if (!this.monsters[gameId]) {
      this.monsters[gameId] = new Map();
    }
  }

  // 몬스터 세션에 몬스터 추가.
  addMonsterToSession(gameId, monsterId, monsterNumber, level) {
    if (this.#validateSessionKey(gameId)) {
      const newMonster = new Monster(monsterId, gameId, monsterNumber, level);
      this.monsters[gameId].set(lower32Bits, newMonster); // Map에 추가
    }
  }

  // 몬스터 삭제.
  removeMonster(gameId, monsterId) {
    if (this.#validateSessionKey(gameId)) {
      if(this.#validateMonsterKey(gameId, monsterId)){
        this.monsters[gameId].delete(monsterId); // Map에서 삭제
      }
    }
  }

  // 특정 몬스터 찾기.
  getMonster(gameId, monsterId) {
    if (this.#validateSessionKey(gameId)) {
      if(this.#validateMonsterKey(gameId, monsterId)){
        return this.monsters[gameId].get(monsterId); // 특정 몬스터 반환
      }
    }
    return null; // 없으면 null 반환
  }

  // 세션 몬스터들 찾기.
  getMonsters(gameId) {
    if (this.#validateSessionKey(gameId)) {
      return Array.from(this.monsters[gameId].values()); // Map의 값을 배열로 변환
    }

    return []; // 세션이 없으면 빈 배열 반환
  }

  // Private: 세션 키 검증
  #validateSessionKey(sessionKey) {
    if (!this.monsters[sessionKey]) {
      console.error(`해당 세션을 찾을 수 없습니다: ${sessionKey}`);
      return false; // 검증 실패
    }
    return true; // 검증 성공
  }

  // Private: 몬스터 키 검증
  #validateMonsterKey(sessionKey, monsterKey) {
    if (!this.monsters[sessionKey].get(monsterKey)) {
      console.error(`해당 몬스터를 찾을 수 없습니다: ${monsterKey}`);
      return false; // 검증 실패
    }
    return true; // 검증 성공
  }

}
