import Tower from '../models/tower.class.js';

class TowerManager {
  constructor(socket) {
    this.socket = socket;
    this.curId = 1;
    this.towers = new Map();
  }

  addTower(x, y) {
    const id = this.curId;
    this.curId += 1;
    const tower = new Tower(id, x, y);
    this.towers.set(id, tower);
  }

  getTowerById(id) {
    return this.towers.get(id);
  }
}

export default TowerManager;
