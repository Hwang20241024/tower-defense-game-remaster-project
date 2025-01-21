import { getProtoMessages } from '../../init/loadProtos.js';
import { getProtoTypeNameByPacketType } from '../../handlers/index.js';
import { config } from '../../config/config.js';
import CustomError from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';

export const packetParser = (socket, data) => {
  let offset = 0;
  // 패킷 타입 (2바이트)
  const packetType = socket.buffer.readUInt16BE(offset);
  offset += config.packet.typeLength;

  // 버전 길이 (1바이트)
  const versionLength = socket.buffer.readUInt8(offset);
  offset += config.packet.versionLength;

  // 버전 (문자열)
  const versionBytes = new Uint8Array(
    socket.buffer.buffer,
    socket.buffer.byteOffset + offset,
    versionLength,
  );
  const version = new TextDecoder().decode(versionBytes);
  offset += versionLength;

  // 시퀀스 (4바이트)
  const sequence = socket.buffer.readUInt32BE(offset);
  offset += config.packet.sequenceLength;

  // 데이터 길이 (4바이트)
  const payloadLength = socket.buffer.readUInt32BE(offset);
  offset += config.packet.payLoadLength;

  // 실제 데이터.
  const payloadData = socket.buffer.slice(offset, offset + payloadLength);
  offset += payloadLength;

  // 클라이언트 검증
  if (version !== config.client.version) {
    throw new CustomError(
      ErrorCodes.CLIENT_VERSION_MISMATCH,
      '클라이언트 버전이 일치하지 않습니다.',
    );
  }

  // 패킷 타입에 따라 적절한 payload 구조를 디코딩
  const protoMessages = getProtoMessages();
  const protoTypeName = getProtoTypeNameByPacketType(packetType);
  if (!protoTypeName) {
    throw new CustomError(ErrorCodes.UNKNOWN_HANDLER_ID, `알 수 없는 패킷 타입 ID: ${handlerId}`);
  }

  const [namespace, typeName] = protoTypeName.split('.');
  const PayloadType = protoMessages.towerDefense.GamePacket;

  let payload;
  try {
    console.log(typeName);
    payload = PayloadType.decode(payloadData);
  } catch (error) {
    throw new CustomError(ErrorCodes.PACKET_STRUCTURE_MISMATCH, '패킷 구조가 일치하지 않습니다.');
  }

  for (let key in payload) {
    if (payload.hasOwnProperty(key) && typeof payload[key] === 'object') {
      return { packetType, sequence, payload: payload[key], offset: offset + payloadLength };
    }
  }

};
