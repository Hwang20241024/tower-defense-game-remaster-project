import { getProtoMessages } from '../../init/loadProtos.js';
import { getProtoTypeNameByPacketType } from '../../handlers/index.js';
import { config } from '../../config/config.js';
import CustomError from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';

// MSS(Maximum Segment Size)는 TCP 연결에서 한 번에 전송할 수 있는 최대 데이터 크기
// 보통은 1460바이트로 설정되며, 네트워크의 MTU(Maximum Transmission Unit)에 따라 결정
const MSS = 1460; // MSS를 설정 (예: 1460바이트)

export const packetParser = (socket, data) => {
  let offset = 0;
  // 패킷 타입 (2바이트)
  const packetType = socket.buffer.readUInt16BE(offset);
  offset += config.packet.typeLength; // 2

  // 버전 길이 (1바이트)
  const versionLength = socket.buffer.readUInt8(offset);
  offset += config.packet.versionLength; // 1

  // 버전 (문자열)
  const versionBytes = new Uint8Array(
    socket.buffer.buffer,
    socket.buffer.byteOffset + offset,
    versionLength,
  );
  const version = new TextDecoder().decode(versionBytes);
  offset += versionLength; // 가변

  // 시퀀스 (4바이트)
  const sequence = socket.buffer.readUInt32BE(offset);
  offset += config.packet.sequenceLength; // 4

  // 데이터 길이 (4바이트)
  const payloadLength = socket.buffer.readUInt32BE(offset);
  offset += config.packet.payLoadLength; // 4

  // payloadLength와 MSS를 비교 (페이로드 길이 검증.)
  if (payloadLength > MSS) {
    console.log('페이로드 사이즈가 넘었습니다. ');
  }

  // 실제 데이터.
  const payloadData = socket.buffer.slice(offset, offset + payloadLength);
  offset += payloadLength; // 가변

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

  const PayloadType = protoMessages.towerDefense.GamePacket;

  let payload;
  try {
    payload = PayloadType.decode(payloadData);
  } catch (error) {
    throw new CustomError(ErrorCodes.PACKET_STRUCTURE_MISMATCH, '패킷 구조가 일치하지 않습니다.');
  }

  for (let key in payload) {
    if (payload.hasOwnProperty(key) && typeof payload[key] === 'object') {
      return { packetType, sequence, payload: payload[key], offset: offset };
    }
  }
};
