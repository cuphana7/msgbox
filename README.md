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
뒤로가기 닫기 !
설정 화면 이동 !
신청화면 보이기
- 인증실패( 기기정보 다름 )
- 식별자 없음( PUSH 기기등록 안됨 )
