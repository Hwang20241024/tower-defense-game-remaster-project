class IntervalManager {
  constructor() {
    this.intervals = new Map();
  }

  addPlayer(playerId, callback, interval, type = 'user') {
    if (!this.intervals.has(playerId)) {
      this.intervals.set(playerId, new Map());
    }

    // 이전 인터벌 삭제 처리
    this.removeInterval(playerId, type);

    // 인터벌 추가
    this.intervals.get(playerId).set(type, setInterval(callback, interval));
  }

  checkTime(gameId, callback, interval) {
    this.addPlayer(gameId, callback, interval, 'checkTime');
  }

  addGame(gameId, callback, interval) {
    this.addPlayer(gameId, callback, interval, 'game');
  }

  removePlayer(playerId) {
    if (this.intervals.has(playerId)) {
      const userIntervals = this.intervals.get(playerId);
      userIntervals.forEach((intervalId) => clearInterval(intervalId));
      this.intervals.delete(playerId);
    }
  }

  removeInterval(playerId, type) {
    if (this.intervals.has(playerId)) {
      const userIntervals = this.intervals.get(playerId);
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
