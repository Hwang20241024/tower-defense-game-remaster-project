import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const purchaseTowerHandler = async ({ socket, userId, payload }) => {
  try {
    const { x, y } = payload;

    // TODO 유저 검사

    // const user = getUserBySocket(Socket);
    // if (!user) {
    //   throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    // }

    // TODO 가격 검사

    /** TODO 위치 검사 */

    // TODO 타워 위치 검사

    // TODO 길 위치 검사?

    /** endof 위치 검사 */

    // TODO 타워 생성

    // const towerId = game.towermanager.addTower(x,y);

    const towerPurchaseResponse = createResponse(
      HANDLER_IDS.CREATE_GAME,
      RESPONSE_SUCCESS_CODE,
      { towerId, message: '타워가 생성되었습니다.' },
      userId,
    );

    // socket.write(createGameResponse);
  } catch (error) {
    handleError(socket, error);
  }
};

export default createGameHandler;
