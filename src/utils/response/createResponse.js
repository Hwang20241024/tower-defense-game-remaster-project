import { PACKET_DATA } from '../../constants/header';
import { CLIENT_VERSION } from '../../constants/env';

// 패킷 명세 
// 1. packetType (ushort)     패킷 타입(2바이트)
// 2. versionLength (ubyte)   버전 길이 (1바이트)
// 3. version (string)        버전 (문자열)
// 4. sequence (uint32)       시퀀스 (4바이트)
// 5. payloadLength (uint32)  데이터 길이 (4바이트)
// 6. payload (bytes)         실제 데이터

/*

export const PACKET_DATA = {
  PACKET_TYPE_LENGTH: 2,
  VERSION_LENGTH: 1,
  SEQUENCE_LENGTH: 4,
  PAYLOAD_LENGTH: 4,
}
 */

export const createResponse = (packetType, sequence, payload) => {
  // 패킷 타입 (ushort - 2바이트)
  const packetTypeBuffer = Buffer.alloc(PACKET_DATA.PACKET_TYPE_LENGTH);
  packetTypeBuffer.writeUInt16BE(packetType, 0);

  // 버전 ( 1 바이트)
  const versionLengthBuffer = Buffer.alloc(PACKET_DATA.VERSION_LENGTH);
  const versionStringBuffer = Buffer.from(CLIENT_VERSION, 'utf-8'); // 버전 문자열
  versionLengthBuffer.writeUInt8(versionStringBuffer.length, 0); // 버전 길이 (1바이트)

  // 시퀀스 (4 바이트)
  const sequenceBuffer = Buffer.alloc(PACKET_DATA.SEQUENCE_LENGTH);
  sequenceBuffer.writeUInt32BE(sequence, 0);

  // 페이로드 (4 바이트)
  const payloadLengthBuffer = Buffer.alloc(PACKET_DATA.PAYLOAD_LENGTH); // 데이터 길이를 4바이트로 설정
  payloadLengthBuffer.writeUInt32BE(payload.length, 0); // 페이로드 길이 기록

  // 모든 버퍼를 결합하여 최종 패킷 생성
  const completePacket = Buffer.concat([
    packetTypeBuffer, // 패킷 타입
    versionLengthBuffer, // 버전 길이
    versionStringBuffer, // 버전 문자열
    sequenceBuffer, // 시권스 
    payloadLengthBuffer, // 페이로드 길이
    payload, // 실제 데이터
  ]);

  return completePacket;
};
