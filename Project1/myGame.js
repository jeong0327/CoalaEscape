//================================================================================
/*          room1            */
room = game.createRoom("room", "배경-4.png") // 방 생성

room.setRoomLight(0.1)    // 방 밝기 조절

/* 전등 스위치 */
room.light = room.createObject("light", "전등.png")
room.light.setWidth(65)
room.locateObject(room.light, 1240, 250)
room.light.lock()
room.light.onClick = function () {
    if (room.light.isLocked()) {
        room.setRoomLight(0.9)
        room.light.unlock()
        printMessage("어? 화이트 보드에 뭔가 적혀있다. 확인해보자.")
    }
    else {
        room.setRoomLight(0.15)
        room.light.lock()
    }
}

/* 화이트 보드 */
var timer = 0   // 타이머 제어 변수
room.wb = room.createObject("wb", "화이트보드-오른쪽.png")	// white board 생성
room.wb.setWidth(220)	// 크기 조절
room.locateObject(room.wb, 935, 190)	// 화이트보드 배치
room.wb.onClick = function () {
    showImageViewer("납치범의 기록.jpg") // 이미지 출력
    playSound("timer.wav")   // 타이머 소리
    if (!timer) {
        printMessage("이게 뭐지...? 납치? 폭탄?!")
        game.setTimer(1800, 1, "초")
        timer = 1   // 타이머 시작
    }
    else {
        printMessage("서두르자!!")
    }
}

/* 문 */
room.door = room.createObject("door", "문-오른쪽-닫힘.png") // 문 생성
room.door.setWidth(136) // 크기 조절
room.locateObject(room.door, 1130, 305) // 문 배치
room.door.lock() // door 상태를 locked로 변경
// 문 클릭시
room.door.onClick = function() { // door를 클릭했을 때
	if (room.door.isClosed()){ // door가 closed 상태이면
        room.door.open() // door의 상태를 open으로 바꿈
	} else if (room.door.isOpened()){ // door가 opened 상태이면
        game.move(room2) // room2로 이동
	} else if (room.door.isLocked()){ // door가 locked 상태이면
        printMessage("잠겨있군") // 메시지 출력
	}
}
// 문 상태 open
room.door.onOpen = function() { // door 상태가 open으로 변경되면 실행
    room.door.setSprite("문-오른쪽-열림.png") // 열린 문으로 변경
    printMessage("열렸다!!")
}

/* 키패드 */
room.keypad = room.createObject("keypad", "키패드-우.png") // 오브젝트 생성
room.keypad.setWidth(20) // 크기 조절
room.locateObject(room.keypad, 1040, 312) // 위치 변경
room.keypad.onClick = function () {
    showKeypad("telephone", "18769142", function () {
        room.door.unlock() // door의 잠금을 연다
        printMessage("잠금 장치가 열렸다!")
    })
}

/* 쪽지 */
room.memo = room.createObject("memo", "drop_memo.png")
room.memo.setWidth(20)
room.locateObject(room.memo, 350, 500)
room.memo.hide()
room.memo.onClick = function () {
    showImageViewer("pick_memo.png")
    printMessage("이게 무슨 뜻이지? 컴퓨터에 검색해볼까?")
}

/* 퍼즐 조각 */
room.puzzle1 = room.createObject("puzzle1", "puzzle1.png")
room.puzzle1.setWidth(50)
room.locateObject(room.puzzle1, 250, 550)
room.puzzle1.hide()
room.puzzle1.onClick = function () {
    printMessage("퍼즐 조각?")
    room.puzzle1.pick()
}
room.puzzle1.setItemDescription("퍼즐 조각이다.")

/* 풍선 */
// 풍선 생성자 함수
function Balloon(room, name, image, color, type, x, y) {
    this.room = room
    this.name = name
    this.image = image
    this.color = color
    this.type = type
    this.x = x
    this.y = y

    this.obj = room.createObject(name, image)
    this.obj.setWidth(56)
    this.room.locateObject(this.obj, x, y)
}

Balloon.prototype.onClick = function () {
    if (!room.needle.isPicked())
        printMessage(this.color + " 풍선이다. 왠 풍선이지?")
    else    // 바늘 주우면
        printMessage("한 번 터트려볼까? 근데 뭔가 불길한 예감이 든다. 신중히 하자.")

    // 바늘로 풍선 터트리기
    if (game.getHandItem() == room.needle) {
        balClickCount--    // 풍선 카운트 -1
        // 빈 풍선 터트리면
        if (this.type === 'penalty') {
            this.obj.hide()     // 풍선 터져서 없어짐
            if (balClickCount > 0) {
                playSound("warning.ogg")
                showImageViewer("warning sign.png")
                printMessage("*** WARNING ***\n[ 타이머의 시간이 줄어들었다! ]") // 잘못 터트림 -> 패널티
                game.addTime(-30)   // 풍선 하나 잘못 터트릴 때마다 30초씩 줄어듬
            }
            else {
                playSound("timerUp.wav")
                room.puzzle1.show() // 퍼즐 조각 나타남
                printMessage("[ 타이머의 시간이 늘어났다! ]\n'실패를 거듭할 수 있는 능력'..!")
                game.addTime(30 * 5)  // 줄어든 시간 복원해줌
            }
        }
        // 아이템 들어있는 풍선 터트리면
        else {
            playSound("balloon_pop.wav")
            printMessage("깜짝이야. 풍선에 뭔가 들어있었네??")
            this.obj.hide()
            if (this.type === 'memo') {
                room.memo.show() // 쪽지 나타남
                memo_mouse = 1
            }
            else {
                room.key.show()   // 열쇠 나타남 (this.type === 'key')
            }
        }
    }
}

var balClickCount = 8  // 풍선 클릭 횟수, 풍선 다 터트리면 퍼즐 나옴
var oddX = 150
var oddY = 300
var evenX = 200
var evenY = 200

room.bal1 = new Balloon(room, 'bal1', 'balloon1.png', '주황색', 'penalty', oddX, oddY)
room.bal2 = new Balloon(room, 'bal2', 'balloon2.png', '빨간색', 'penalty', evenX, evenY)
room.bal3 = new Balloon(room, 'bal3', 'balloon3.png', '파란색', 'penalty', oddX + 100, oddY)
room.bal4 = new Balloon(room, 'bal4', 'balloon4.png', '보라색', 'penalty', evenX + 100, evenY)
room.bal5 = new Balloon(room, 'bal5', 'balloon5.png', '초록색', 'memo', oddX + 200, oddY)
room.bal6 = new Balloon(room, 'bal6', 'balloon6.png', '하늘색', 'key', evenX + 200, evenY)
room.bal7 = new Balloon(room, 'bal7', 'balloon7.png', '분홍색', 'penalty', oddX + 300, oddY)
room.bal8 = new Balloon(room, 'bal8', 'balloon8.png', '노란색', 'penalty', evenX + 300, evenY)

/* 바늘 */
room.needle = room.createObject("needle", "바늘.png")
room.needle.setWidth(70)
room.locateObject(room.needle, 700, 530)
room.needle.onClick = function () {
    room.needle.pick()
    printMessage("바늘이잖아. 일단 보관해두자.")
}
room.needle.setItemDescription("뾰족한 바늘이다.")

/* 벽 스피커 */
room.speaker = room.createObject("speaker", "벽스피커-왼쪽.png")
room.speaker.setWidth(80)
room.locateObject(room.speaker, 95, 115)
room.speaker.onClick = function () {
    printMessage("아, 추억이다. 파란색 야광봉이랑...")
    playSound("Sky Blue Balloon.wav")
}

/* 카펫 */
room.carpet = room.createObject("carpet", "카펫-2.png")
room.carpet.setWidth(900)
room.locateObject(room.carpet, 630, 540)
room.carpet.move = 0
room.carpet.onClick = function () {
    printMessage("부드러운 카펫이네")
}
// 드래그 모션 direction - Up, Down, Left, Right
room.carpet.onDrag = function (direction) {
    if (direction == "Down" && room.carpet.move === 0) {
        printMessage("어? 카펫 아래에 뭔가가 있다")
        room.carpet.moveX(90)
        room.carpet.moveY(90)
        room.carpet.move = 1
    }
}

/* 테이블 */
room.table = room.createObject("table", "테이블-오른쪽.png")
room.table.setWidth(300)
room.locateObject(room.table, 700, 350)

/* 컴퓨터 */
room.com = room.createObject("com", "컴퓨터-오른쪽.png")
room.com.setWidth(150)
room.locateObject(room.com, 675, 215)
room.com.onClick = function () {
    showImageViewer("윈스턴처칠.JPG")
    printMessage("컴퓨터 바탕화면이다")
}

/* 마우스 */
var memo_mouse = 0;
room.mouse = room.createObject("mouse", "마우스.png")
room.mouse.setWidth(30)
room.locateObject(room.mouse, 765, 280)
room.mouse.onClick = function () {
    showImageViewer("그림판.JPG")
    if (!memo_mouse) printMessage("그림판이 실행되었다")
    else printMessage("무슨 컴퓨터가 그림판만 되냐.. 색 선택밖에 안 되네..")
}

/* 열쇠 */
room.key = room.createObject("key", "열쇠.png")
room.key.setWidth(50)
room.locateObject(room.key, 400, 500)
room.key.hide()
room.key.onClick = function () {
    printMessage("왠 열쇠지? 일단 챙겨두자")
    room.key.pick()
}
room.key.setItemDescription("어디에 쓸 수 있을까?")

/* 서랍 */
room.cupboard = room.createObject("cupboard", "찬장-2-닫힘.png")
room.cupboard.setWidth(130)
room.locateObject(room.cupboard, 940, 405)
room.cupboard.lock()
// 서랍 클릭시
room.cupboard.onClick = function () {
    if (room.cupboard.isLocked())
        printMessage("잠겨있네")

    if (game.getHandItem() == room.key) {
        printMessage("열렸다!")
        room.cupboard.open()
        room.cupboard.unlock()
    }
    else if (room.cupboard.isOpened()) { // Opened 상태인 경우
        room.cupboard.close() // close
    }
}
// 서랍 열림
room.cupboard.onOpen = function () {
    room.cupboard.setSprite("찬장-2-열림.png") // 열린 그림으로 변경
    room.flashLight_tail.show() // 손전등 손잡이 보이기
    room.postit.show()  // 포스트잇 보이기
}
// 서랍 닫힘
room.cupboard.onClose = function () {
    room.cupboard.setSprite("찬장-2-닫힘.png") // 닫힌 그림으로 변경
    room.flashLight_tail.hide() // 손전등 손잡이 숨기기
}

/* 손전등 손잡이 */
room.flashLight_tail = room.createObject("flashLight_tail", "Flashlight_tail.png")
room.flashLight_tail.setWidth(28)
room.locateObject(room.flashLight_tail, 910, 395)
room.flashLight_tail.hide()
room.flashLight_tail.onClick = function () {
    room.flashLight_tail.pick()
    printMessage("이게 뭐지? 일단 챙기자")
}
room.flashLight_tail.setItemDescription("뭔가의 손잡이처럼 생겼다.")

/* 포스트잇 */
room.postit = room.createObject("postit", "흰색 포스트잇.png")
room.postit.setWidth(18)
room.postit.hide()
room.locateObject(room.postit, 910, 365)
room.postit.onClick = function () {
    showImageViewer("초록색.png")
    printMessage("아이클레이? 색 조합?")
}


/* 책 */
room.book = room.createObject("book", "책1-1.png")
room.book.setWidth(100)
room.locateObject(room.book, 150, 600)
room.book.onClick = function () {
    showImageViewer("세로드립.JPG")
    printMessage("왕위를 물려주긴 무슨... 맥락이 중요해.. 맥락이")
}

//==================================================================================================
/*          room2            */
room2 = game.createRoom("room2", "배경-2.png") // 방 생성

/* 문1 */
room2.door1 = room2.createObject("door1", "문-오른쪽-열림.png") // 이전 방으로 되돌아감
room2.door1.setWidth(136)
room2.locateObject(room2.door1, 1130, 305)
room2.door1.onClick = function () {
    printMessage("이전 방으로 돌아가보자")
    game.move(room)
}

/* 문2 */
room2.door2 = room2.createObject("door2", "문2-좌-닫힘.png") // 문 생성
room2.door2.setWidth(136) // 크기 조절
room2.locateObject(room2.door2, 200, 325) // 문 배치
room2.door2.lock() // door 상태를 locked로 변경
room2.door2.onClick = function () { // door를 클릭했을 때
    if (room2.door2.isClosed()) { // door가 closed 상태이면
        room2.door2.open() // door의 상태를 open으로 바꿈
    } else if (room2.door2.isOpened()) { // door가 opened 상태이면
        game.move(room3)
    } else if (room2.door2.isLocked()) { // door가 locked 상태이면
        printMessage("잠겨 있네.") // 메시지 출력
    }
}
room2.door2.onOpen = function() { // door 상태가 open으로 변경되면 실행
    room2.door2.setSprite("문2-좌-열림.png") // 열린 문으로 변경
}

/* 키패드 */
room2.keypad = room2.createObject("keypad", "키패드-좌.png") // 오브젝트 생성
room2.keypad.setWidth(20) // 크기 조절
room2.locateObject(room2.keypad, 300, 245) // 위치 변경
room2.keypad.onClick = function () {
    printMessage("[ 작은 수와 큰 수. 조각과 수수께끼 ]\n 뭔 소리야..")
    showKeypad("telephone", "5117", function () {
        room2.door2.unlock() // door의 잠금을 연다
        printMessage("열렸다!")
    })
}

/* 탁자 */
room2.table = room2.createObject("table", "테이블2-2.png")	// table 생성
room2.table.setWidth(300)	// 크기 조절
room2.locateObject(room2.table, 850, 435) 	// table 배치

/* 리모컨 */
room2.rc = room2.createObject("rc", "리모컨-우.png")	// remote control 생성
room2.rc.setWidth(70)	// 크기 조절
room2.locateObject(room2.rc, 900, 390)	// remote control 배치
room2.rc.onClick = function () {
    room2.rc.pick()
    printMessage("옛날 리모컨이다.")
}

/* tv */
room2.tv = room2.createObject("tv", "TV-오른쪽.png")	// tv 생성
room2.tv.setWidth(200)	// 크기 조절
room2.locateObject(room2.tv, 900, 200)	// tv 배치
room2.tv.onClick = function () {
    if (game.getHandItem() == room2.rc) {
        printMessage("전쟁 포로...?")
        showVideoPlayer("MorseCode_blinking.mp4")	// 비디오 재생
    }
    else
        printMessage("안 켜지네")
}

/* 쿠키 */
room2.cookie = room2.createObject("cookie", "쿠키.png")
room2.cookie.setWidth(63)
room2.locateObject(room2.cookie, 800, 370)
room2.cookie.onClick = function () {
    printMessage("쿠키잖아! 일단 챙겨두자")
    room2.cookie.pick()
}
room2.cookie.setItemDescription("이걸로 유인해보나..?")

/* 불독 */
var dog = 1
room2.dog = room2.createObject("dog", "barking_dog.png")
room2.dog.setWidth(100)
room2.locateObject(room2.dog, 350, 452)
room2.dog.onClick = function () {
    if (game.getHandItem() == room2.cookie) {
        dog = 0
        playSound("dog eating.wav")
        room2.dog.setSprite("eating_dog.png")
        printMessage("오! 먹는다!!")
        room2.puzzle2.unlock() // 퍼즐 조각에 접근할 수 있도록
    }
    else if (dog) {
        playSound("dog_bark.wav")
        printMessage("사나운 개네. 다가가면 물 것 같다.")
    }
}

/* 퍼즐 조각 */
room2.puzzle2 = room2.createObject("puzzle2", "puzzle3.png")
room2.puzzle2.setWidth(50)
room2.locateObject(room2.puzzle2, 344, 512)
room2.puzzle2.lock()
room2.puzzle2.onClick = function () {
    if (room2.puzzle2.isLocked()) {
        printMessage("퍼즐인가? 개 때문에 다가가질 못하겠네\n 방법이 없나??")
    }
    else {
        printMessage("조심... 얼른 챙기자..!")
        room2.puzzle2.pick()
    }
}
room2.puzzle2.setItemDescription("두번째 퍼즐 조각이다.")

/* 퍼즐 완성 */
room2.puzzle = room2.createObject("puzzle", "puzzle.png")
room2.puzzle.hide()
game.makeCombination(room.puzzle1, room2.puzzle2, room2.puzzle) // 조합분해식 생성
room2.puzzle.setItemDescription("5? 어떤 의미가 있나? 혹시...")

/* 선반 */
room2.shelf = room2.createObject("shelf", "선반-좌.png")
room2.shelf.setWidth(310)
room2.locateObject(room2.shelf, 550, 130)

/* 책 */
room2.book = room2.createObject("book", "책3-1.png")
room2.book.setWidth(70)
room2.locateObject(room2.book, 450, 115)
room2.book.onClick = function () {
    showImageViewer("MorseCode.jpg")
    printMessage("모스부호?")
}

/* 손전등 head */
room2.flashLight_head = room2.createObject("flashLight_head", "Flashlight_head.png")
room2.flashLight_head.setWidth(28)
room2.locateObject(room2.flashLight_head, 620, 250)
room2.flashLight_head.onClick = function () {
    printMessage("이게 뭐지? 이런 비슷한 게 있었던 것 같은데...")
    room2.flashLight_head.pick()
}

/* 손전등 완성 */
room2.flashLight = room2.createObject("flashLight", "Flashlight.png")
room2.flashLight.hide()
game.makeCombination(room.flashLight_tail, room2.flashLight_head, room2.flashLight) // 조합분해식 생성
room2.flashLight.setItemDescription("손전등이다")

/* 칠판 */
room2.blackBoard = room2.createObject("blackBoard", "초록색칠판-왼쪽.png")
room2.blackBoard.setWidth(170)
room2.locateObject(room2.blackBoard, 565, 250)
room2.blackBoard.onClick = function () {
    showImageViewer("칠판.png")
    printMessage("무슨 원리지?")
}
room2.blackBoard.move = 0
// 드래그 모션 direction - Up, Down, Left, Right
room2.blackBoard.onDrag = function (direction) {
    if (direction == "Left" && room2.blackBoard.move === 0) {
        printMessage("어? 뒤에 뭔가 있네??")  // 손전등 head 나타남
        room2.blackBoard.moveX(-35)
        room2.blackBoard.moveY(25)
        room2.blackBoard.move = 1
    }
}

//==================================================================================================
/*          room3            */
room3 = game.createRoom("room3", "배경-6.png") // 방 생성

room3.setRoomLight(0.85)    // 방 밝기 조절

/* 문1 */
room3.door1 = room3.createObject("door1", "문2-우-열림.png") // 이전 방으로 되돌아감
room3.door1.setWidth(136)
room3.locateObject(room3.door1, 1130, 318)
room3.door1.onClick = function () {
    printMessage("이전 방으로 돌아가보자")
    game.move(room2)
}

/* 문2 */
room3.door2 = room3.createObject("door2", "문3-좌-닫힘.png") // 문 생성
room3.door2.setWidth(136) // 크기 조절
room3.locateObject(room3.door2, 115, 350) // 문 배치
room3.door2.lock() // door 상태를 locked로 변경
room3.door2.onClick = function () { // door를 클릭했을 때
    if (room3.door2.isClosed()) { // door가 closed 상태이면
        room3.door2.open() // door의 상태를 open으로 바꿈
    } else if (room3.door2.isOpened()) { // door가 opened 상태이면
        game.setClearMessage("탈출에 성공했다!!!")
        game.clear()
    } else if (room3.door2.isLocked()) { // door가 locked 상태이면
        printMessage("잠겨 있네....") // 메시지 출력
    }
}
room3.door2.onOpen = function () { // door 상태가 open으로 변경되면 실행
    room3.door2.setSprite("문3-좌-열림.png") // 열린 문으로 변경
}

/* 키패드 */
room3.keypad1 = room3.createObject("keypad1", "keypad2-se.png");
room3.keypad1.setWidth(20);
room3.locateObject(room3.keypad1, 30, 278);
room3.keypad1.onClick = function () {
    printMessage("[ What's My Name? ]\n 아... 내가 납치범의 이름까지 알아야 하나...");
    showKeypad("alphabet", "PERRY", function () { // 키패드 2 - 알파벳 5자리
        room3.door2.unlock();
        printMessage("잠금장치가 열렸다!!");
    });
}

/* 옷장 */
room3.wardrobe = room3.createObject("wardrobe", "옷장-1-닫힘.png")
room3.wardrobe.setWidth(250)
room3.locateObject(room3.wardrobe, 145, 358)
room3.wardrobe.lock()
// 옷장 클릭시
room3.wardrobe.onClick = function () {
    if (room3.wardrobe.isLocked()) {    // 옷장 잠겨있음
        printMessage("튼튼한 옷장이다. 안쪽에서 잠겨있는 것 같네.")
    }
    else if (room3.wardrobe.isClosed()) {
        room3.wardrobe.open()
    }
    else if (room3.wardrobe.isOpened()) { // Opened 상태인 경우
        room3.wardrobe.close() // close
    }
}
room3.wardrobe.move = 0
// 옷장 열림
room3.wardrobe.onOpen = function () {
    room3.wardrobe.setSprite("옷장-1-열림.png") // 열린 그림으로 변경
    printMessage("열렸다! 옷은 없는데... 나니아 연대기???")
    // 드래그 모션 direction - Up, Down, Left, Right
    room3.wardrobe.onDrag = function (direction) {
        if (direction == "Right" && room3.wardrobe.move === 0) {
            printMessage("옷장 뒤에 문이 숨겨져 있었다니!\n드디어 탈출인가?!")  // 손전등 head 나타남
            room3.wardrobe.moveX(200)
            room3.wardrobe.moveY(-40)
            room3.wardrobe.move = 1
        }
    }
}
// 옷장 닫힘
room3.wardrobe.onClose = function () {
    room3.wardrobe.setSprite("옷장-1-닫힘.png") // 닫힌 그림으로 변경
}

/* 카펫 */
room3.carpet = room3.createObject("carpet", "카펫.png")
room3.carpet.setWidth(350)
room3.locateObject(room3.carpet, 650, 585)
room3.carpet.onClick = function () {
    printMessage("포근하다")
}

/* 쪽지 */
room3.letter = room3.createObject("letter", "쪽지.png")
room3.letter.setWidth(20)
room3.locateObject(room3.letter, 498, 180)
room3.letter.hide()
room3.letter.onClick = function () {
    printMessage("쪽지? 근데 아무것도 안 적혀있네..")
    showImageViewer("종이.png")
    room3.letter.pick()
}
room3.letter.setItemDescription("쪽지에서 시큼한 레몬 냄새가 난다.")

/* 액자 */
room3.frame = room3.createObject("frame", "액자2-2_서명.png")
room3.frame.setWidth(80)
room3.locateObject(room3.frame, 540, 160)
room3.frame.move = 0
room3.frame.onClick = function () {
    if (room3.wardrobe.move) {
        printMessage("어? 작가 서명? 혹시...")
        showImageViewer("액자2-1_서명.png")
    }
    else
        printMessage("뭔가 우울해 보인다")
}
// 드래그 모션 direction - Up, Down, Left, Right
room3.frame.onDrag = function (direction) {
    if (direction == "Right" && room3.frame.move === 0) {
        room3.frame.setSprite("액자2-1_서명.png")
        printMessage("액자 뒤에 뭔가 있다!")  // 손전등 head 나타남
        room3.letter.show()
    }
}

/* 벽난로 */
room3.fireplace = room3.createObject("fireplace", "fire.png")
room3.fireplace.setWidth(200)
room3.locateObject(room3.fireplace, 640, 370)
room3.fireplace.onClick = function () {
    if (game.getHandItem() == room3.letter) {
        printMessage("어? 글씨가 나타났다? 비밀 편지?!")
        showImageViewer("비밀편지.png")
    }
    else {
        printMessage("따뜻하다")
    }
}

/* 탁자 */
room3.table = room3.createObject("table", "테이블3-1.png")
room3.table.setWidth(220)
room3.locateObject(room3.table, 635, 560)

/* 성경 */
room3.bible = room3.createObject("bible", "책.png")
room3.bible.setWidth(55)
room3.locateObject(room3.bible, 625, 520)
room3.bible.onClick = function () {
    printMessage("성경이잖아?")
    showImageViewer("bible.png")
}

/* 금고 */
var safe_open = 0
room3.safe = room3.createObject("safe", "safe_close.png")
room3.safe.setWidth(160)
room3.locateObject(room3.safe, 950, 425)
room3.safe.lock()
room3.safe.onClick = function () {
    if (!safe_open) {
        printMessage("이 안에 폭탄이 들어있군! 서두르자")
        playSound("timer.wav")   // 타이머 소리
        showKeypad("number", "0316", function () {    // 잠금 장치
            safe_open = 1
            printMessage("잠금 장치가 열렸다!")
        })
    }
    else {
        room3.safe.setSprite("safe_open.png")
        room3.vase.unlock()
        room3.timeBomb.show()
        if (game.getHandItem() == room2.flashLight) {
            printMessage("보인다!")
            showImageViewer("bomb_hint.png")
        }
        else
            printMessage("금고 안쪽에 뭔가 쓰여있네. 근데 어두워서 안 보인다...")
    }
}

/* 폭탄 전선 */
// 전선 생성자 함수
function Line(room, name, image, boom, x, y) {
    this.room = room
    this.name = name
    this.image = image
    this.boom = boom
    this.x = x
    this.y = y

    this.obj = room.createObject(name, image)
    this.obj.setWidth(6)
    this.room.locateObject(this.obj, x, y)
    this.obj.hide()

    this.show = function () {
        this.obj.show()
    }

    this.hide = function () {
        this.obj.hide()
    }
}

var line_cut = 0    // 전선 잘렸는지

Line.prototype.onClick = function () {
    if (!line_cut) {
        if (game.getHandItem() == room3.brokenVase) {
            // 하늘색, 노란색, 주황색 자름
            if (this.boom) {
                game.setGameoverMessage("BOOOOOOOOOM!!!!!!!!!")
                game.gameover()
            }
            // 보라색 자름
            else {
                playSound("countdown.wav")      // 폭탄 타이머 멈추는 소리
                line_cut = 1    // 전선 잘림
                this.obj.setSprite("전선_보라_잘림.png")
                showImageViewer("time bomb_stop.png")
                game.stopTimer()    // 타이머 멈춤
                printMessage("폭탄의 타이머가 멈췄다!!")
            }
        }
        else {
            printMessage("뭘로 자르지?? 가위가 있나?")
        }
    }
}

var line_x = 605
var line_y = 130
var line_interval = 20;

room3.line1 = new Line(room3, 'line1', '전선_파랑.png', 1, line_x + line_interval * 0, line_y)
room3.line2 = new Line(room3, 'line2', '전선_노랑.png', 1, line_x + line_interval * 1, line_y)
room3.line3 = new Line(room3, 'line3', '전선_주황.png', 1, line_x + line_interval * 2, line_y)
room3.line4 = new Line(room3, 'line4', '전선_보라.png', 0, line_x + line_interval * 3, line_y)

/* 시한 폭탄 */
room3.timeBomb = room3.createObject("timeBomb", "time bomb.png")
room3.timeBomb.setWidth(45)
room3.locateObject(room3.timeBomb, 940, 405)
room3.timeBomb.hide()
room3.timeBomb.onClick = function () {
    if (!line_cut) {
        playSound("timer.wav")   // 타이머 소리
        showImageViewer("time bomb.png")
        room3.line1.show()
        room3.line2.show()
        room3.line3.show()
        room3.line4.show()
        if (!line_cut)
            printMessage("폭탄 위에 전선이 나타났다! 어떤 걸 잘라야 하지?\n 잘못 자르면 터질텐데...")
    }
    else {
        showImageViewer("time bomb_stop.png")
        printMessage("찰칵 소리가 들렸는데.. 옷장인가?")
        room3.wardrobe.unlock() // 옷장 열 준비
        room3.line1.hide()
        room3.line2.hide()
        room3.line3.hide()
        room3.line4.hide()
    }
}


/* 선반 */
room3.shelf = room3.createObject("shelf", "선반-우.png")
room3.shelf.setWidth(310)
room3.locateObject(room3.shelf, 850, 153)

/* 책 */
room3.book = room3.createObject("book", "책3-2.png")
room3.book.setWidth(70)
room3.locateObject(room3.book, 940, 140)
room3.book.onClick = function () {
    showImageViewer("화학.png")
    printMessage("화학 실험.. 시트르산, 셀룰로오스, 탈수 작용, 탄소?")
}

/* 유리조각 */
room3.brokenVase = room3.createObject("brokenVase", "유리조각.png")
room3.brokenVase.setWidth(80)
room3.locateObject(room3.brokenVase, 830, 480)
room3.brokenVase.hide()
room3.brokenVase.onClick = function () {
    room3.brokenVase.pick()
}
room3.brokenVase.setItemDescription("날카롭다. 뭐든 자를 수 있을 것 같다.")

/* 꽃병 */
room3.vase = room3.createObject("vase", "vase.png")
room3.vase.setWidth(80)
room3.locateObject(room3.vase, 830, 123)
room3.vase.lock()
room3.vase.onClick = function () {
    if (room3.vase.isLocked())
        printMessage("빈 꽃병이네")
    else
        printMessage("유리... 차라리 이걸 깨트릴까?")
}
room3.vase.move = 0
// 드래그 모션 direction - Up, Down, Left, Right
room3.vase.onDrag = function (direction) {
    if (direction == "Down" && room3.vase.move === 0) {
        playSound("glass smashing.wav")
        room3.vase.hide()
        room3.brokenVase.show()
        printMessage("깨졌다!")
    }
}

//==================================================================================================
/*          게임 시작            */
game.start(room)
printMessage("으윽... 머리야... 여기가 어디지..?\n 일단 불부터 켜자") // 시작 메시지 출력