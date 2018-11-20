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
        "url_auth" : "/api/authentication",
        "url_messages" : "/api/inbox/messages"
      },
      authReq : {
        "isPost" : true
      },
      messagesReq : {
        "APP_ID" : "com.kbcard.kbkookmincard",
        "USER_ID" : "",
        "PAGE" : 1,
        "AUTHKEY" : "",
        "CATEGORY" : null,
        "isPost" : false
      },
      data1: data1
    }

    this.handleScrollToTop1 = this.handleScrollToTop1.bind(this)
    this.handleScrollToBottom1 = this.handleScrollToBottom1.bind(this)
    this.reqMessages = this.reqMessages.bind(this)
  }

  componentDidMount() {
    this.reqMessages();
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
    this.state.messagesReq.PAGE = 1;
    this.reqMessages();
    completed();
  }

  handleScrollToBottom1(completed) {
    this.state.messagesReq.PAGE = this.state.messagesReq.PAGE+1;
    this.reqMessages(this.state.messagesReq, this.state.data1);
    completed();
  }

  /**
   * cordova 인증키를 셋팅 한다.
   */
  cordovaAuth() {
    var self = this;
    return new Promise(function(resolve, reject) {
      if (self.state.messagesReq.AUTHKEY != "") {
        resolve();
      } else {
        window.kbmobile.push.callApi("/api/authentication",self.state.authReq,function(res){
          self.state.messagesReq.AUTHKEY = res.AUTHKEY;
          resolve();
        });
      }
    });  
  }

  /**
   * cordova 메시지 리스트를 가져온다.
   */
  cordovaMessages() {
    var self = this;
    return new Promise(function(resolve, reject) {
      window.kbmobile.push.callApi( self.state.api.url_messages, self.state.messagesReq,function(dt){
        resolve(dt);
      });
    });  
  }

  
  reqMessages() {

    var self1 = this;
    self1.cordovaAuth().then(() => {

      var self2 = self1;
      self1.cordovaMessages().then((res) =>{
        console.log(res.data.DATA);
        self2.setState({ data1: self2.state.data1.concat(res.data.DATA) });
      });

   }).catch(err => console.log("err: ", err));

  }

}

export default App;
