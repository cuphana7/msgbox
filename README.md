# ANOTHER REACT TODO LIST
com.kbcard.kbkookmincard

# 인증거래
인증키 발급 후 업무요청
 - 인증키는 24시간 유효함.


# axios 통신 방법
<pre>
<code>
axios.get('/user?id=velopert')
    .then( response => { console.log(response); } ) // SUCCESS
    .catch( response => { console.log(response); } ); // ERROR
</code>
</pre>
<pre>
<code>
axios.get('/user', {
        params: { id: 'velopert' }
    })
    .then( response => { console.log(response) } );
    .catch( response => { console.log(response) } );
</code>
</pre>
<pre>
<code>
axios.post('/msg', {
        user: 'velopert',
        message: 'hi'
    })
    .then( response => { console.log(response) } )
    .catch( response => { console.log(response) } );
</code>
</pre>

프론트엔드 개발 공부를 할 때 흔히 만들게 되는 투두리스트. [[미리보기]](https://fc3-basic.surge.sh)
checkBox sample https://stackoverflow.com/questions/32641541/react-input-checkbox-select-all-component

# TO-DO 2018.11.28
목표 : 내일 현업 테스트 요청

# TO-DO 2018.11.29
목표 : 내일 운영 테스트
 - 노티 알림이동시 탭 선택
 - 최근 접근 탭 이동 ok
 - 전체 갯수
 - 탭별 신규 알림 뱃지
 - 삭제 확인 ok
 - 푸시 수신시 자동 알림함 뷰
 - 미설정 페이지 재확인

# TO-DO 2018.11.30
 - 안읽은 메시지 가져오기
  . state 에 안읽은 메시지 건수 UI와 bind
  . api 정보를 설정한다.
  . 메시지 로딩이 완료된후 앱내 최종 아이디 셋팅 후 요청 작업 시작
  . 서버로 최종아이디를 cordova로 요청 한다.
  . 앱은 서버로 전달 하여 해당 최종아이디 보다 큰 메시지를 카테고리별로 count후 배열을 반환한다.
  . 앱은 해당 배열을 웹으로 전달(DATA)
  . state 에 입력 한다.
 - 취소누를 경우 전체 해제
 - 날짜별 그룹핑
 - 메시지 펼치기 화살표 반대로
 - 6라인 이후로 확장 아이콘 보이기