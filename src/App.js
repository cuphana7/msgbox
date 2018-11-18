import React, { Component } from 'react';
import MsgBoxTemplate from './components/js/MsgBoxTemplate';
import PushRadioSel from './components/js/PushRadioSel';
import PushResult from './components/js/PushResult';
import PushDelete from './components/js/PushDelete';
import PushList from './components/js/PushList';
import PushEvent from './components/js/PushEvent';
import axios from 'axios';

class App extends Component {

  
  constructor(props) {
    super(props)
    var data1 = [];
    this.state = {
      api: {
        "auth_key" : "",
        "url_auth" : "/sample-data/messages-res.json",
        "url_messages" : "/sample-data/messages-res.json"
      },
      authReq : {
        "APP_ID" : "com.kbcard.kbkookmincard",
        "USER_ID" : "111111111",
        "DEVICE_ID" : ""
      },
      messagesReq : {
        "APP_ID" : "com.kbcard.kbkookmincard",
        "USER_ID" : "111111111",
        "PAGE" : 1,
        "AUTHKEY" : "",
        "CATEGORY" : ""
      },
      data1: data1
    }

    this.handleScrollToTop1 = this.handleScrollToTop1.bind(this)
    this.handleScrollToBottom1 = this.handleScrollToBottom1.bind(this)
    this.reqMessages = this.reqMessages.bind(this)
  }

  componentDidMount() {
    this.reqMessages(this.state.messagesReq, this.state.data1);
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
          reqData={this.reqMessages}
          checkAuth={this.checkAuth}
        />
        {/* 이벤트 레이어 */}
        <PushEvent />
      </MsgBoxTemplate>
    );
  }


  handleScrollToTop1(completed) {
    this.state.data1 = [];
    this.reqMessages();
    completed();
  }

  handleScrollToBottom1(completed) {
    this.state.messagesReq.PAGE = this.state.messagesReq.PAGE+1;
    this.reqMessages(this.state.messagesReq, this.state.data1);
    completed();
  }

  checkAuth () {
    var self = this;
    return axios.get(this.state.api.url_auth,
    {params:this.state.authReq}
    )
    .then((response) => {
        console.log('2. server response:' + response.data.DATA.AUTHKEY);
    });
  }

  reqMessages(reqJson, argData1) {
    var self = this;
    this.checkAuth().then((returnVal) => {
      axios.get(self.state.api.url_messages, {params:reqJson}).then(response => {
        console.log(response.data);
        self.setState({ data1: self.state.data1.concat(response.data.DATA) });
      });
   }).catch(err => console.log("Axios err: ", err))
    
  }


}

export default App;
