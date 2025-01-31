import Tower from '../models/tower.class.js';

class TowerManager {
  constructor() {
    this.curId = 1; // 타워 고유번호
    this.towers = new Map();
  }

  // 타워 추가
  addTower(socket, x, y) {
    const id = this.curId;
    this.curId += 1;
    const tower = new Tower(id, socket, x, y);
    this.towers.set(id, tower); // 아이디를 key로 타워 추가

    return id;
  }

  getTowerById(id) {
    return this.towers.get(id);
  }
}

export default TowerManager;
