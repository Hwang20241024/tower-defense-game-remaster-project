import Tower from '../models/tower.class.js';

class TowerManager {
  constructor() {
    this.curId = 1;
    this.towers = new Map();
  }

  addTower(socket, x, y) {
    const id = this.curId;
    this.curId += 1;
    const tower = new Tower(id, socket, x, y);
    this.towers.set(id, tower);

    return id;
  }

  getTowerById(id) {
    return this.towers.get(id);
  }
}

export default TowerManager;
