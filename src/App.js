import React, { Component } from 'react';
import MsgBoxTemplate from './components/js/MsgBoxTemplate';
import PushRadioSel from './components/js/PushRadioSel';
import PushResult from './components/js/PushResult';
import PushDelete from './components/js/PushDelete';
import PushList from './components/js/PushList';
import PushEvent from './components/js/PushEvent';

class App extends Component {

  id = 3 // 이미 0,1,2 가 존재하므로 3으로 설정

  state = {
    input: '',
    todos: [
      { id: 0, text: ' 리액트 소개', checked: false },
      { id: 1, text: 'JSX 사용해보기', checked: true },
      { id: 2, text: '라이프 사이클 이해하기', checked: false },
    ]
  }

  render() {
    
    return (
      <MsgBoxTemplate>
          {/* 카테고리 선택 */}
          <PushRadioSel />
          {/* 갯수/삭제버튼 */}
          <PushResult />
          {/* 삭제 레이어 */}
          <PushDelete />
          {/* 목록 */}
          <PushList />
          {/* 이벤트 레이어 */}
          <PushEvent />
      </MsgBoxTemplate>
    );
  }
}

export default App;
