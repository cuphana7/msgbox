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
        "url_auth" : "https://push.kbcard.com:1175/api/authentication",
        "url_messages" : "/sample-data/messages-res.json"
      },
      authReq : {
        "APP_ID" : "com.kbcard.kbkookmincard",
        "USER_ID" : "4046130823",
        "DEVICE_ID" : "86C2E8A7-A3AE-4B2F-B5AC-8D122BF88EBB"
      },
      authRes : {
        "RESULT_CODE" : "",
        "RESULT_MSG" : "",
        "SERVICE_URL" : "",
        "DATA" : {
            "AUTHKEY" : "",
            "EXPIRED_DATE" : ""
        }
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
    if (self.state.authRes.DATA.AUTHKEY != "") {
      return new Promise(function (resolve, reject) {
          resolve(self.state.authRes.DATA.AUTHKEY);
      });
    } else {
      console.log("req : "+self.state.api.url_auth);
      return axios.post(self.state.api.url_auth,
      self.state.authReq)
      .then((response) => {
          console.log('from checkAuth:' + response.data.DATA.AUTHKEY);
          self.setState({ authRes: response.data });
          return response.data.DATA.AUTHKEY;
      });
    }
  }

  cordovaAuth() {
    var self = this;
    return new Promise(function(resolve, reject) {
      if (self.state.authRes.DATA.AUTHKEY != "") {
        resolve(self.state.authRes.DATA.AUTHKEY);
      } else {
        kbmobile.push.callApi("/api/authentication",{},function(dt){
          resolve(d);
        });
      }
    });
    
  }

  reqMessages(reqJson, argData1) {
    var self = this;
    self.cordovaAuth().then((returnVal) => {
      console.log('from reqMessages:' + returnVal);
      axios.get(self.state.api.url_messages, {params:reqJson}).then(response => {
        console.log(response.data);
        self.setState({ data1: self.state.data1.concat(response.data.DATA) });
      });
   }).catch(err => console.log("Axios err: ", err))
    
  }


}

export default App;
