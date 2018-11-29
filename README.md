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
 - 삭제 확인
 - 푸시 수신시 자동 알림함 뷰
 - 미설정 페이지 재확인

