import { config } from '../config/config.js';
import { PACKET_TYPE } from '../constants/header.js';
import { getHandlerById } from '../handlers/index.js';
import { packetParser } from '../utils/parser/packetParser.js';

export const onData = (socket) => async (data) => {
  
  if (!data) {
    console.log('Data is undefined or null');
    return;
  }
  
  // console.log('클라이언트가 데이터를 보냈습니다.');
  // socket.buffer = Buffer.concat([socket.buffer, data]);

  // const totalHeaderLength =
  //   config.packet.versionLength +
  //   config.packet.typeLength +
  //   config.packet.sequenceLength +
  //   config.packet.payLoadLength;

  // while (socket.buffer.length >= totalHeaderLength) {
  //   let offset = 0;
  //   // 패킷 타입 (2바이트)
  //   const packetType = socket.buffer.readUInt16BE(offset);
  //   offset += config.packet.typeLength;

  //   // 버전 길이 (1바이트)
  //   const versionLength = socket.buffer.readUInt8(offset);
  //   offset += config.packet.versionLength;

  //   // 버전 (문자열)
  //   if (socket.buffer.length < offset + versionLength) break;
  //   const versionBytes = new Uint8Array(
  //     socket.buffer.buffer,
  //     socket.buffer.byteOffset + offset,
  //     versionLength,
  //   );
  //   const version = new TextDecoder().decode(versionBytes);
  //   offset += versionLength;

  //   // 시퀀스 (4바이트)
  //   const sequence = socket.buffer.readUInt32BE(offset);
  //   offset += config.packet.sequenceLength;

  //   // 데이터 길이 (4바이트)
  //   const payloadLength = socket.buffer.readUInt32BE(offset);
  //   offset += config.packet.payLoadLength;

  //   // 실제 데이터.
  //   if (socket.buffer.length < offset + payloadLength) break; // 데이터가 부족하면 루프 종료
  //   const payload = socket.buffer.slice(offset, offset + payloadLength);


  const {
    packetType,
    versionLength,
    version,
    sequence,
    payloadLength,
    payload,
    offset
  } = packetParser(socket, data);

  console.log(packetType);
  console.log(versionLength);
  console.log(version);
  console.log(sequence);
  console.log(payloadLength);
  console.log(payload);
  console.log(offset);

  // switch (packetType) {
  //   case PACKET_TYPE.NONE:
  //     console.log('test');
  //     break;
  //   case PACKET_TYPE.REGISTER_REQUEST:
  //     console.log('회원가입');
  //     break;
  //   case PACKET_TYPE.LOGIN_REQUEST:
  //     console.log('로그인');
  //     break;
  //   case PACKET_TYPE.SPAWN_MONSTER_REQUEST:
  //     break;
  //   default:
  //     break;
  

  socket.buffer = socket.buffer.slice(offset + payloadLength);

  // 데이터가 남지 않으면 루프 종료
  //if (socket.buffer.length < totalHeaderLength) break;
  
};
