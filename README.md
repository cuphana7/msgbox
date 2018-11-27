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
/**
	일반적인 닫기시 사용하는 뒤로 이동 기능
*/
function backToPrev() {
	if(hasStepURI && getHeaderType() == 3) {
		$.cxhia.confirm({
			message: '종료 시 입력하신 정보가 손실됩니다. 진행 중인 프로세스를 종료하시겠습니까?' 
		}, function(res) {
			if(res == 'ok') {
			    $(document).trigger('stepClose');
				// step이 시작되기 이전
				backToPrevBackMark();
			}
		});
	}
	else {
		try {
			var pageHistoryLength = pageHistory.count();
			if( !hasSkipRetain && pageHistoryLength > 0) {
				
				pageHistory.remove();
			}
			else if( hasSkipRetain == 2) {
				pageHistory.remove();
			}
			
			if( pageHistoryLength > 0 ) {
				backToPrevBackMark();
			}
			else {
				console.log('backToPrev: empty history. back to main...');
				backToNative();
			}
		}
		catch(e) {
			history.back();
		}
	}
}
