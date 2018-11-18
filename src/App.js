import React, { Component } from 'react';
import MsgBoxTemplate from './components/js/MsgBoxTemplate';
import PushRadioSel from './components/js/PushRadioSel';
import PushResult from './components/js/PushResult';
import PushDelete from './components/js/PushDelete';
import PushList from './components/js/PushList';
import PushEvent from './components/js/PushEvent';

class App extends Component {

  constructor(props) {
    super(props)
    var data1 = this.initData();
    
    this.state = {
        input: '',
        data1:data1
    }

    this.handleScrollToTop1 = this.handleScrollToTop1.bind(this)
    this.handleScrollToBottom1 = this.handleScrollToBottom1.bind(this)
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
          <PushList dataSource={this.state.data1}
            onScrollToTop={this.handleScrollToTop1}
            onScrollToBottom={this.handleScrollToBottom1}
            />
          {/* 이벤트 레이어 */}
          <PushEvent />
      </MsgBoxTemplate>
    );
  }


  handleScrollToTop1(completed) {
    var th = this;
    this.setState({data1: []});
    // refresh
    setTimeout(function() {
      var data = this.initData()
      console.log(data)

      // completed is a callback to tell infinite table to hide loading indicator
      // must invcke completed before setState
      completed()
      this.setState({data1: data})

    }.bind(this), 100)
  }

  handleScrollToBottom1(completed) {
    // load more
    setTimeout(function() {
      var newData = this.moreData(this.state.data1)
      console.log(newData)

      completed()
      this.setState({data1: newData})

    }.bind(this), 200)
  }

 

  moreData(oldData) {
    var newData = Object.assign([], oldData)
    var base = newData[newData.length-1]
    for (var i=base+1; i<=base+20; i++) {
      newData.push(i)
    }
    return newData
  }

  initData() {
    var data = []
    for (var i=0; i<20; i++) {
      data.push(i)
    }
    return data
  }


}

export default App;
