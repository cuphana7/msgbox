import React, { Component } from 'react';
import MsgBoxTemplate from './components/js/MsgBoxTemplate';
import Content from './components/js/Content';

class App extends Component {
  
  constructor(props) {
    super(props)

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
        "isPost" : false
      },
      list: []
    }

    this.handleScrollToTop = this.handleScrollToTop.bind(this)
    this.handleScrollToBottom = this.handleScrollToBottom.bind(this)
    this.reqMessages = this.reqMessages.bind(this)
  }

  componentDidMount() {
    this.reqMessages();
  }


  /**
   * 스크롤 상단으로 이동시 목록 가져오기
   * @param {*} completed 
   */
  handleScrollToTop(completed) {
    this.state.list = [];
    this.state.messagesReq.PAGE = 1;
    this.reqMessages();
    completed();
  }

  /**
   * 스크롤 하단으로 이동시 목록 가져오기
   */
  handleScrollToBottom(completed) {
    this.state.messagesReq.PAGE = this.state.messagesReq.PAGE+1;
    this.reqMessages();
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
   * cordova 메시지 리스트 API를 호출한다.
   */
  cordovaMessages() {
    var self = this;
    return new Promise(function(resolve, reject) {
      window.kbmobile.push.callApi( self.state.api.url_messages, self.state.messagesReq,function(res){
        console.log("messages called to page="+self.state.messagesReq.PAGE);
        resolve(res);
      });
    });  
  }

  /**
   * PUSH 리스트를 가져온다.
   * 인증(1회) > messages API > state.LIST set
   */
  reqMessages() {

    var self1 = this;
    self1.cordovaAuth().then(() => {

      var self2 = self1;
      self1.cordovaMessages().then((res) =>{
        console.log(res.LIST);
        self2.setState({ list: self2.state.list.concat(res.LIST) });
      });

   }).catch(err => console.log("err: ", err));

  }

  render() {

    return (
      <MsgBoxTemplate>
        <Content list={this.state.list}
          onScrollToTop={this.handleScrollToTop}
          onScrollToBottom={this.handleScrollToBottom}
          />
      </MsgBoxTemplate>
    );
    
  }

}

export default App;
