room = game.createRoom("room", "배경-5.png") // 방 생성

room.door = room.createObject("door", "문2-좌-닫힘.png") // 문 생성
room.door.setWidth(136) // 크기 조절
room.locateObject(room.door, 200, 325) // 문 배치
room.door.lock() // door 상태를 locked로 변경

room.door.onClick = function() { // door를 클릭했을 때
	if(room.door.isClosed()){ // door가 closed 상태이면
		room.door.open() // door의 상태를 open으로 바꿈
	} else if (room.door.isOpened()){ // door가 opened 상태이면
		game.clear() // 게임 클리어
	} else if (room.door.isLocked()){ // door가 locked 상태이면
		printMessage("문이 잠겨 있다.") // 메시지 출력
	}
}

room.door.onOpen = function() { // door 상태가 open으로 변경되면 실행
	room.door.setSprite("문2-좌-열림.png") // 열린 문으로 변경
}

room.keypad = room.createObject("keypad", "숫자키-좌.png") // 오브젝트 생성
room.keypad.setWidth(60) // 크기 조절
room.locateObject(room.keypad, 310, 250) // 위치 변경

room.keypad.onClick = function() {
	printMessage("")
	showKeypad("number", "0300" , function(){ // 키패드 1 - 숫자 4자리
		room.door.unlock() // door의 잠금을 연다
		printMessage("잠금 장치가 열렸다.")
	 })
}

game.start(room) // 게임시작
printMessage("방탈출을 시작합니다!") // 환영 메시지 출력

room.wb = room.createObject("wb", "화이트보드-왼쪽.png")	// white board 생성
room.wb.setWidth(220)	// 크기 조절
room.locateObject(room.wb, 550, 200)	// 화이트보드 배치

room.wb.onClick = function() {
	showImageViewer("화이트보드.jpeg", "영화제목.txt"); // 이미지 출력
}

room.tv = room.createObject("tv", "TV-오른쪽.png")	// tv 생성
room.tv.setWidth(200)	// 크기 조절
room.locateObject(room.tv, 1030, 250)	// tv 배치
room.tv.lock() // tv 상태를 locked로 변경

room.table = room.createObject("table", "테이블2-2.png")	// table 생성
room.table.setWidth(300)	// 크기 조절
room.locateObject(room.table, 900, 450) 	// table 배치

room.rc = room.createObject("rc", "리모컨-우.png")		// remote control 생성
room.rc.setWidth(80)	// 크기 조절
room.locateObject(room.rc, 900, 390)	// remote control 배치

room.rc.onClick = function() {
	printMessage("TV가 켜졌다.")
	showVideoPlayer("300.webm")	// 비디오 재생
}