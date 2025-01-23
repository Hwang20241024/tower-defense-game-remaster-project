import BaseManager from './base.manager.js';

// intervals의 구조
// { socket: { type1: setInterval1, type2: setInterval2, ... } }

class IntervalManager extends BaseManager {
  constructor() {
    super();
    this.intervals = new Map();
  }

  addPlayer(socket, callback, interval, type = 'user') {
    if (!this.intervals.has(socket)) {
      this.intervals.set(socket, new Map());
    }
    this.intervals.get(socket).set(type, setInterval(callback, interval));
  }

  stateSync(socket, callback, interval) {
    this.addPlayer(socket, callback, interval, 'stateSync');
  }

  removePlayer(socket) {
    if (this.intervals.has(socket)) {
      const userIntervals = this.intervals.get(socket);
      userIntervals.forEach((intervalId) => clearInterval(intervalId));
      this.intervals.delete(socket);
    }
  }

  removeInterval(socket, type) {
    if (this.intervals.has(socket)) {
      const userIntervals = this.intervals.get(socket);
      if (userIntervals.has(type)) {
        clearInterval(userIntervals.get(type));
        userIntervals.delete(type);
      }
    }
  }

  clearAll() {
    this.intervals.forEach((userIntervals) => {
      userIntervals.forEach((intervalId) => clearInterval(intervalId));
    });
    this.intervals.clear();
  }
}

export default IntervalManager;
