import { sequenceTempSessions } from './session.js';

export const setSequenceSession = (socket, sequence) => {
  sequenceTempSessions.set(socket, sequence);
};

export const getSequenceSession = (socket) => {
  return sequenceTempSessions.get(socket);
};

export const removeSequenceSession = (socket) => {
  sequenceTempSessions.delete(socket);
};

export const getAllSequenceSessions = () => {
  return sequenceTempSessions;
};
