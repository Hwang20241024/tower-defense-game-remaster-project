import { getEnableGameSession } from "../session/game.session.js";
import { getUserBySocket } from "../session/user.session.js";

// 매치메이킹에 등록하는 핸들러
export const matchHandler = (socket, payload) => {
    // 참여 가능한 게임을 찾는다
    const game = getEnableGameSession();
    // 게임에 유저 추가
    const user = getUserBySocket(socket);
    
    game.addUser(user);
    user.setGameId(game.getGameId());
}