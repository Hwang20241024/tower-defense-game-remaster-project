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

  while (socket.buffer.length > 0) {
    try {
      const { packetType, sequence, payload, offset } = packetParser(socket, data);

      socket.buffer = socket.buffer.slice(offset);

      // 예시 입니다.
      const handler =  getHandlerById(packetType);
      await handler(socket);

    } catch (error) {
      // 처리할 수 없는 경우, 남은 데이터를 유지하고 종료
      break;
    }
  }
  console.log("패킷 읽기 끝.");
};



