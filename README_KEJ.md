### 구현 기능

1. 회원가입
 - 아이디, 비밀번호, 이메일(형식 포함)의 넘어온 값에 이상이 없는지 확인 후 비밀번호는 bycript로 암호화 하여 DB에 저장.
2. 로그인
 - 클라이언트로 전달받은 아이디와 비밀번호를 DB에서 조회하여 확인 후 이상이 없는 경우 JWT토큰 생성 후 로그인 처리. (로그인 상태로 변경)
3. 중복 로그인 방지
 - 사용자가 로그인을 했을 경우 해당 DB에 로그인 상태 여부를 변경하여 관리. 접속중인 아이디로 로그인을 시도할 경우 불가능 하도록 구현.
 - 서버 시작 시 로그인 상태인 유저를 비로그인 처리. 
4. ErrorHandler
 - Response 패킷에 failCode를 반환해야 하는 경우 handleError() 호출 시 `packetType` 을 추가로 전달 처리.
    ````javascript
    export const handleError = (socket, error, packetType = null) => {
      // ...   
      if (packetType !== null) {
        const protoMessages = getProtoMessages();
        const response = protoMessages.towerDefense.GamePacket;
        let gamePacket;
        let responsePacketType;
        if (PACKET_TYPE.REGISTER_REQUEST === packetType) {
          //회원 가입
          gamePacket = response.create({
            registerResponse: {
              success: false,
              message: error.message,
              failCode: failCode,
            },
          });
          responsePacketType = PACKET_TYPE.REGISTER_RESPONSE;
        } else if (PACKET_TYPE.LOGIN_REQUEST === packetType) {
          //로그인
          //...
        }
        const responsePayload = response.encode(gamePacket).finish();
        const responsePacket = createResponse(responsePacketType, 0, responsePayload);
        socket.write(responsePacket);
      }
    }
    ````
5. 시퀀스 세션

사용자가 로그인 하기 전 클라이언트로 부터 전달 받은 시퀀스를 검증하기 위해 소켓 연결이되면 해당 세션 **Map**에 저장하여 관리한다.  
(로그인 후에는 유저 세션에서 관리한다.)

1. 임시 관리용 시퀀스 Map 생성
```javascript
export const sequenceTempSessions = new Map();
```

2. 클라이언트와 TCP 연결이 되면 해당 Map에 추가
    ```javascript
    export const onConnection = (socket) => {
      // 연결 시 임시Sequence 세션에 등록
      setSequenceSession(socket, 1);
      
      // ...
    };
    ```
3. 회원가입
   1. 시퀀스 세션에 해당 소켓의 시퀀스 정보가 있는지 체크를 한다.  
   2. `로그인/비로그인`에 따라 관리 포인트가 달라 각 상황에 맞게 해당 세션을 통해 검증을 진행한다. 
      - (비로그인) 시퀀스 세션의 값과 비교 하여 유효한 값인지 검증한다.
      - (로그인) 유저 세션에서 조회하여 검증을 진행한다. 

    ```javascript
    const singUpHandler = async (socket, payload, sequence) => {
    
      // 4. 임시 시퀀스 세션에서 시퀀스 유효여부 체크
      const tempSequence = getSequenceSession(socket);
      let nextSequence;
      if (tempSequence) {
        if (sequence !== tempSequence) {
          throw new CustomError(ErrorCodes.INVALID_SEQUENCE, '유효하지 않는 시퀀스 입니다.');
        }
        nextSequence = tempSequence + 1;
        // 임시 Sequnece세션에 업데이트
        setSequenceSession(socket, nextSequence);
      } else {
        const user = getUserBySocket(socket);
        if (!user) {
          throw new CustomError(ErrorCodes.USER_NOT_FOUND, '해당 유저를 찾을 수 없습니다.');
        }
        user.checkSequence(sequence);
        nextSequence = user.getNextSequence();
      }
    
    ```

4. 로그인
    1. 전달 받은 시퀀스의 값이 유효한지 검증을 한다.
    2. 이상이 없는 경우 유저 세션에 추가하고 시퀀스 번호를 기록한다.
    3. 로그인 후에는 유저 세션에서 시퀀스를 관리하기에 시퀀스 세션에서 해당 정보를 삭제한다.

    ```javascript
    // 회원가입 Handler
    const singInHandler = async (socket, payload, sequence) => {
      
        // 임시 시퀀스 세션에서 시퀀스 유효여부 체크
        const tempSequence = getSequenceSession(socket);
        if (sequence !== tempSequence) {
          throw new CustomError(ErrorCodes.INVALID_SEQUENCE, '유효하지 않는 시퀀스 입니다.');
        }
    };
   
    // 5. 유저 세션 추가 + DB에서 유저의 최고 기록 불러오기
    const userSession = addUser(socket, id, user.score, user.rating, sequence);

    // 임시 Sequnce세션에서 삭제
    removeSequenceSession(socket);
    ```
   
5. ErrorHandler(공통)
    - 서버 내에서 오류가 발생 했을 경우 시퀀스 번호를 강제적으로 검증 없이 현재 값에서 +1로 수정한다.

    ```javascript
    export const handleError = (socket, error, packetType = null) => {
      // 시퀀스 처리
      const tempSequence = getSequenceSession(socket);
      if (tempSequence) {
        // 임시 시퀀스 세션
        setSequenceSession(socket, tempSequence + 1);
      } else {
        // 유저 세션 시퀀스
        const user = getUserBySocket(socket);
        if (!user) {
        user.updateNextSequence();
        }
      }
    };
    ```

### 트러블 슈팅 
 - Oneof에 대한 이해도가 없었다보니 패킷을 역질렬화 하는 과정에서 고생을 했다. `payload` 부분만 잘라서 decode처리 시 proto파일에 정의된 모든 필드가 아닌 1개 필드와 값은 이상하게 출력되었다. 패킷 전체를 decode 처리를 하면 길이 초과 오류가 발생하였다.
