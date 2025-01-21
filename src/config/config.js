import { PORT, HOST, CLIENT_VERSION } from '../constants/env.js';
import { PACKET_DATA } from '../constants/header.js';

export const config = {
  server: {
    port: PORT,
    host: HOST,
  },
  packetLength: {
    packetType: PACKET_DATA.PACKET_TYPE_LENGTH,
    versionLength: PACKET_DATA.VERSION_LENGTH,
    sequenceLength: PACKET_DATA.SEQUENCE_LENGTH,
    payloadLength: PACKET_DATA.PAYLOAD_LENGTH,
  },
  // 필요한 만큼 추가
  gameSession: {
    MAX_PLAYERS: 4,
  },
  ingame: {
    offset: 2,
    towerPower: 40,
  },
};
