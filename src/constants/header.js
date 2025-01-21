import dotenv from 'dotenv';

dotenv.config();

export const PACKET_DATA = {
  PACKET_TYPE_LENGTH: 2,
  VERSION_LENGTH: 1,
  SEQUENCE_LENGTH: 4,
  PAYLOAD_LENGTH: 4,
};

export const PACKET_TYPE = {
  test: 0,
  enemyTowerAttackNotification: 14,
};
