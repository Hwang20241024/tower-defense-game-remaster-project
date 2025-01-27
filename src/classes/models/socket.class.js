import { config } from '../../config/config.js';

// 소켓 연결 통신 담당 (주로 영속적인 데이터)
class SocketSession {
  #socket; // private 속성을 선언
  constructor(socket) {
    this.#socket = socket;
    this.sequence = 0;
    this.id = null;
    this.rating = null;
    this.highScore = null;
  }

  // socket.write는 이곳에서만 사용
  createResponse(packetType, sequence, payload, payloadType) {
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

    // 페이로드 직렬화
    const protoMessages = getProtoMessages();
    const response = protoMessages.towerDefense.GamePacket;
    const data = response.create({
      [payloadType]: payload, // 동적으로 oneof 필드 설정
    });

    const payloadData = response.encode(data).finish();

    // 페이로드 (4 바이트)
    const payloadLengthBuffer = Buffer.alloc(PACKET_DATA.PAYLOAD_LENGTH); // 데이터 길이를 4바이트로 설정
    payloadLengthBuffer.writeUInt32BE(payloadData.length, 0); // 페이로드 길이 기록

    // 모든 버퍼를 결합하여 최종 패킷 생성
    const completePacket = Buffer.concat([
      packetTypeBuffer, // 패킷 타입
      versionLengthBuffer, // 버전 길이
      versionStringBuffer, // 버전 문자열
      sequenceBuffer, // 시퀀스
      payloadLengthBuffer, // 페이로드 길이
      payloadData, // 실제 데이터
    ]);

    return completePacket;
  }

  sendPacketToMe(response) {
    this.#socket.write(response);
  }

  sendPacketToBroadcast(response, session) {
    session.users.forEach((user) => {
      if (user.getUserSocket() !== this.#socket) {
        user.getUserSocket().write(response);
      }
    });
  }

  // getSequence() {
  //   return this.sequence;
  // }

  // getNextSequence() {
  //   this.updateNextSequence();
  //   return this.sequence;
  // }

  // updateNextSequence() {
  //   ++this.sequence;
  // }

  // setUserId(id) {
  //   this.id = id;
  // }

  // getUserId() {
  //   return this.id;
  // }

  // setRating(rating) {
  //   this.rating = rating;
  // }

  // getRating() {
  //   return this.rating;
  // }

  // setHighScore(highscore) {
  //   this.highScore = highscore;
  // }

  // getHighScore() {
  //   return this.highScore;
  // }
}
export default SocketSession;
