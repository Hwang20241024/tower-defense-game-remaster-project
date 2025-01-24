import Monster from '../models/monster.class.js';

const MONSTER_HP = 100;
const monsterHpPerLv = {
  mon00001: 10,
  mon00002: 15,
  mon00003: 10,
  mon00004: 20,
  mon00005: 10,
};

export default class MonsterManager {
  constructor() {
    this.curId = 1;
    this.monsters = new Map();
  }

  addMonster(gameId, level) {
    const id = this.curId;
    this.curId += 1;
    const monsterNumber = Math.floor(Math.random() * 5) + 1; // 몬스터넘버 (1~5) 랜덤.

    let monsterHp;
    switch (monsterNumber) {
      case 1:
        monsterHp = MONSTER_HP + monsterHpPerLv.mon00001 * (level - 1);
        break;

      case 2:
        monsterHp = MONSTER_HP + monsterHpPerLv.mon00002 * (level - 1);
        break;

      case 3:
        monsterHp = MONSTER_HP + monsterHpPerLv.mon00003 * (level - 1);
        break;

      case 4:
        monsterHp = MONSTER_HP + monsterHpPerLv.mon00004 * (level - 1);
        break;

      case 5:
        monsterHp = MONSTER_HP + monsterHpPerLv.mon00005 * (level - 1);
        break;
    }

    const monster = new Monster(id, gameId, monsterNumber, level, monsterHp);
    this.monsters.set(id, monster);
  }

  getMonstersArr() {
    return Array.from(this.monsters.values()); // Map의 값들만 배열로 변환
  }

  getLastMonster() {
    const lastEntry = Array.from(this.monsters.entries()).pop();
    return lastEntry ? lastEntry[1] : null; // 마지막 몬스터 객체만 반환
  }

  getMonstersMap() {
    return this.monsters;
  }

  removeMonster(monsterId) {
    return this.monsters.delete(monsterId); // Map에서 해당 몬스터 삭제
  }
}
