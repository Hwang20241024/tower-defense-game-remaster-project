import { createResponse } from '../response/createResponse.js';

export const handleError = (socket, error) => {
  let responseCode;
  let message;

  if (error.code) {
    responseCode = error.code;
    message = error.message;
    console.error(`에러 코드: ${error.code}, 메시지: ${error.message}`);
  } else {
    responseCode = 10000; // 일반 에러 코드
    message = error.message;
    console.error(`일반 에러: ${error.message}`);
  }
  
  const errorResponse = createResponse(-1, responseCode, { message }, null);
  socket.write(errorResponse);
};
