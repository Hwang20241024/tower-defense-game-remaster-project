// 소켓 연결 통신 담당 (주로 영속적인 데이터)
class SocketSession {
  #socket; // private 속성을 선언
  constructor(socket) {
    this.#socket = socket;
    this.sequence = 0;
    this.id = null;
    this.rating = null;
  }

  // socket.write는 이곳에서만 사용
  createResponse() {}
}
export default SocketSession;
