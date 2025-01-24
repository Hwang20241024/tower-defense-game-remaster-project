import { getHandlerById } from '../handlers/index.js';
import { packetParser } from '../utils/parser/packetParser.js';
import { PACKET_TYPE } from '../constants/header.js';
import { handleError } from '../utils/error/errorHandler.js';

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
      const handler = getHandlerById(packetType);

      if (PACKET_TYPE.REGISTER_REQUEST === packetType || PACKET_TYPE.LOGIN_REQUEST === packetType) {
        await handler(socket, payload, sequence);
      } else {
        await handler(socket, payload);
      }
    } catch (error) {
      handleError(socket, error);
      // 처리할 수 없는 경우, 남은 데이터를 유지하고 종료
      break;
    }
  }
};
