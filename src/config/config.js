import {
  PORT,
  HOST,
  CLIENT_VERSION,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
} from '../constants/env.js';
import { PACKET_DATA } from '../constants/header.js';

export const config = {
  server: {
    port: PORT,
    host: HOST,
  },
  client: {
    version: CLIENT_VERSION,
  },
  packet: {
    typeLength: PACKET_DATA.PACKET_TYPE_LENGTH,
    versionLength: PACKET_DATA.VERSION_LENGTH,
    sequenceLength: PACKET_DATA.SEQUENCE_LENGTH,
    payLoadLength: PACKET_DATA.PAYLOAD_LENGTH,
  },
  // 필요한 만큼 추가
  gameSession: {
    MAX_PLAYERS: 2,
  },
  ingame: {
    offset: 2,
    towerPower: 40,
    baseHp: 100,
    initialGold: 100,
    towerCost: 100,
    monsterInterval: 1,
  },
  rounds: [
    { monsterLevel: 1, goal: 1000, gold: 2000 },
    { monsterLevel: 2, goal: 3000, gold: 5000 },
    { monsterLevel: 3, goal: 5000, gold: 7000 },
    { monsterLevel: 4, goal: 7000, gold: 10000 },
    { monsterLevel: 5, goal: 10000, gold: 15000 },
    { monsterLevel: 6, goal: 15000, gold: 20000 },
    { monsterLevel: 7, goal: 20000, gold: 30000 },
  ],
  databases: {
    CH5_TEAM: {
      name: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD,
      host: DB_HOST,
      port: DB_PORT,
    },
  },
};
