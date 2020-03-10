# Quick Start
git clone ...
cd msgbox
npm install
npm start

# ANOTHER REACT TODO LIST
com.kbcard.kbkookmincard

# 인증거래
인증키 발급 후 업무요청
 - 인증키는 24시간 유효함.

# git 브렌치 생성법( 개발 작업단위 생성 )
1. ctrl + shift + p
 - vscode 명령이 입력창 나타내기
2. Git: Create Branch 입력 및 선택
 - 브랜치 생성
3. Branch name 입력
 - 브랜치명 생성
4. Branch를 어떤것으로 부터 생성할지 결정( master 지정 )
 - 원본소스 가져오기
5. Git: Publish Branch 입력 및 선택
 - git 반영

위 작업시 브랜치가 추가되면, 작업 후 commit & push 진행

이후 master와 병합은 담당자가 진행


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

# 이슈 20181201
 - auth 중복 요청으로 promise 오류 발송
  . 키 발급이후 요청 되도록 수정해야함.
  . mount 후 키 발급 > 리스트  

# TO-DO 2018.12.04
 - 앱 뱃지
 - 탭별 뱃지
 - 자세히보기 URL

 # TO-DO 2020.01.31
  - 애니메이션 적용
   . https://dm.kbcard.com/cxh/html/park/test.html
   . https://dm.kbcard.com/cxh/html/park/test2.html
