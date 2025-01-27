### 상태 동기화

1. 게임 클래스는 인터벌 매니저를 가지고 있습니다.

    ```js
    class Game {
    constructor() {
        this.intervalManager = new IntervalManager();
    }

    // ...
    }
    ```

2. 방의 정원이 다 차서 게임을 시작할 때 게임 내의 모든 유저에게 상태 동기화 인터벌을 추가합니다. 클라이언트가 로드 된 후 동기화를 하기 위해 1초의 시간 텀을 두고 인터벌을 시작합니다.

    ```js
    matchStartNotification() {
        for (var [socket, user] of this.users) {
        try {

            // ...

            setTimeout(
            (user, socket) => {
                console.log('timeout :', user.id);
                this.intervalManager.addPlayer(socket, user.syncStateNotification.bind(user), 100);
            },
            1000,
            user,
            socket,
            );
        } catch (error) {
            console.log(error);
        }
        }
        // ...
    }
    ```

3. 게임을 끝낼 때 인터벌 매니저의 모든 인터벌을 삭제합니다.


    ``` js
    removeUser(socket) {
        // ...
        if (this.users.size === 1) {
        // ...
        removeGameSession(this.id); // 게임 세션 삭제
        this.intervalManager.clearAll(); // 모든 인터벌 제거
        // ...
        }
        // ...
    }
    ```

    ```js
    checkGameEnd() {
        // ...
        this.users.forEach(async (user, socket, map) => {
        // ...
        if (elapsedTime >= 80000) {
            // ...
            removeGameSession(this.id); // 게임 세션 삭제
            this.intervalManager.clearAll(); // 모든 인터벌 제거
            // ...
        }
        });
    }
    ```


### 트러블 슈팅

상태 동기화 구현 중 인터벌 추가에서 문제가 생겼습니다.

1. 인터벌 추가 시기 문제
    - 문제
        -  클라이언트가 게임 에셋을 로드하고 게임을 시작하기 전에 이미 상태 동기화를 시작해서 에러가 나는 현상이 나타났습니다.
    - 해결
        - 1초 뒤 인터벌 추가를 해서 에러가 나지 않도록 방지했습니다.
2. setTimeOut 화살표 함수 문제
    - 문제
        -  for문으로 유저를 순회해서 인터벌을 추가하는데, 화살표 함수의 경우 이전 user와 socket 값을 저장하지 않아서 가장 마지막에 추가한 user와 socket을 중복해서 저장했습니다. 이 때문에 두 유저 중 한 명의 점수만 오르는 문제가 발생했습니다.
    - 해결
        - 따라서 함수의 매개변수에 user와 socket을 담아 각 변수의 값을 저장할 수 있도록 했습니다.


### 이번 프로젝트에서 느낀 점

이번 프로젝트는 클라이언트 주도로 게임 로직이 진행되는 구조였고, 이에 따라 서버는 클라이언트에 의존하여 상황을 중계하는 역할만을 담당했습니다.

클라이언트가 몬스터의 이동, 현재 위치, 베이스를 공격하는 몬스터 등의 정보를 서버에 전송하지 않았기 때문에 서버는 클라이언트의 정보를 검증할 수 없었습니다. 심지어 클라이언트가 비정상적인 값을 보내도 서버는 이를 그대로 중계해야 했습니다.

이전 웹소켓 프로젝트에서 타워 디펜스를 개발하며 서버 검증을 구현했던 경험이 있었기에 처음에는 클라이언트 코드가 어색하게 느껴졌습니다. 하지만 서버 검증이 크게 필요하지 않은 게임이라면, 클라이언트 주도적인 방식을 사용하는 것도 충분히 합리적일 것 같습니다.
