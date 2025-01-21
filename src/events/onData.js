import { config } from '../config/config.js';
import { PACKET_TYPE } from '../constants/header.js';
import { getHandlerById } from '../handlers/index.js';
import { packetParser } from '../utils/parser/packetParser.js';

export const onData = (socket) => async (data) => {
  
  if (!data) {
    console.log('Data is undefined or null');
    return;
  }

  socket.buffer = Buffer.concat([socket.buffer, data]);
  
  const {
    packetType,
    sequence,
    payload,
    offset
  } = packetParser(socket, data);

  console.log(packetType);
  console.log(sequence);
  console.log(payload);
  console.log(offset);

  socket.buffer = socket.buffer.slice(offset);

};
