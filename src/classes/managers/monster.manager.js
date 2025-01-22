import Monster from '../models/monster.class.js';

export default class MonsterManager {
  constructor() {
    this.curId = 1;
    this.monsters = new Map();
  }

  addMonster(gameId, level) {
    const id = this.curId;
    this.curId += 1;
    const monsterNumber = Math.floor(Math.random() * 5) + 1; // 몬스터넘버 (1~5) 랜덤.
    const monster = new Monster(id, gameId, monsterNumber, level);
    this.monsters.set(id, monster);
  }

  getMonstersArr() {
    return Array.from(this.monsters.values()); // Map의 값들만 배열로 변환
  }

  getLastMonster() {
    const lastEntry = Array.from(this.monsters.entries()).pop();
    return lastEntry ? lastEntry[1] : null;  // 마지막 몬스터 객체만 반환
  }

  getMonstersMap() {
    return this.monsters; 
  }

  removeMonster(monsterId) {
    return this.monsters.delete(monsterId); // Map에서 해당 몬스터 삭제
  }

}
