import React, { Component } from 'react';
import MsgBoxTemplate from './components/js/MsgBoxTemplate';
import Content from './components/js/Content';
import axios from 'axios';

/**
 * 
    ===  최초로딩시 ===
    msg_key_id 확인 후 20개 표출
    (웹)저장 데이터 20개 요청
    (웹)로딩시 최근 데이터 요청
    (앱)서버요청후 > 저장 > 20개 반환
    === 스크롤하단 ===
    (웹)스크롤하단 진입시 다음페이지 요청
    (앱)로컬 다음 20개 있으면 반환
    (앱)로컬 다음 20개 없으면 서버 요청후 > 저장 > 20개 반환
 * 
 */
class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      api: {
        "auth_key": "",
        "url_auth": "/api/authentication",
        "url_messages": "/api/inbox/messages",
        "url_delete": "/api/inbox/delete",
        "url_delete_all": "/api/inbox/deleteAll",
        "url_unread": "/api/inbox/unread",
        "url_events": "/CXHIA00000.cms"
      },
      authReq: {
        "isPost": true
      },
      messagesReq: {
        "APP_ID": "com.kbcard.kbkookmincard",
        "USER_ID": "",
        "PAGE": 1,
        "AUTHKEY": "",
        "isPost": false
      },
      localCache: {
        "msg_key_id": "", // 최근 저장 키
        "last_categroy": "1",
        "msg_key": "" // 메시지리스트 키
      },
      list: [],
      checkedItems: new Map()
    }

    this.handleScrollToTop = this.handleScrollToTop.bind(this)
    this.handleScrollToBottom = this.handleScrollToBottom.bind(this)
    this.reqMessages = this.reqMessages.bind(this)
    this.handleCategoryToChange = this.handleCategoryToChange.bind(this)
    this.handleCheckedChange = this.handleCheckedChange.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
    this.handleCheckedAllClick = this.handleCheckedAllClick.bind(this)
  }

  componentDidMount() {
    this.reqMessages();

    function loadScript(url, callback) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.onload = function () { callback(); };
      script.src = url;
      document.getElementsByTagName('head')[0].appendChild(script);
    }

    loadScript("js/common.js", function () { console.log("./js/common.js load ok! "); });
  }

  /**
  * 삭제를 위한 체크박스 선택시
  * @param {*} e 
  */
  handleCheckedChange(e) {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
  }

  /**
   * 전체 선택
   * @param {*} e 
   */
  handleCheckedAllClick(e) {
    const ch = this.state.checkedItems;
    this.state.list.map( value => {
      ch.set(value.MSG_ID,true);
    });
  }

  /**
   * 삭제 버튼 이벤트
   * @param {*} completed 
   */
  handleDeleteClick(e) { 
    const ch = this.state.checkedItems;
    this.state.list.map( value => {
      this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(value.MSG_ID, true) }));
    });

    const arrKeys = [];
    this.state.checkedItems.forEach((value, key) => {
      if (value == true) arrKeys.push(key);
    });
    console.log(arrKeys.join(","));
    this.cordovaDelete(arrKeys);
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
    this.state.messagesReq.PAGE = this.state.messagesReq.PAGE + 1;
    this.reqMessages();
    completed();
  }

  /**
   * 스크롤 상단으로 이동시 새로운 목록을 가져온다.
   * @param {*} e 
   */
  handleCategoryToChange(e) {
    this.state.messagesReq.CATEGORY = e.target.value;
    this.state.list = [];
    this.state.messagesReq.PAGE = 1;
    this.reqMessages();
  }

  /**
   * cordova 인증키를 셋팅 한다.
   */
  cordovaAuth() {
    var self = this;
    return new Promise(function (resolve, reject) {
      if (self.state.messagesReq.AUTHKEY != "") { resolve(); }
      else {
        const suc = (res) => { self.state.messagesReq.AUTHKEY = res.AUTHKEY; resolve(); }
        const fail = (res) => { reject(res); }
        self.cordovaCallApi(self.state.api.url_auth, self.state.authReq, suc, fail);
      }
    });
  }

  /**
   * cordova 메시지 리스트 API를 호출한다.
   */
  cordovaMessages() {
    var self = this;
    return new Promise(function (resolve, reject) {
      const suc = (res) => { console.log("messages called to page=" + self.state.messagesReq.PAGE); resolve(res); };
      const fail = (res) => { reject(res); }
      self.cordovaCallApi(self.state.api.url_messages, self.state.messagesReq, suc, fail);
    });
  }

  /**
   * cordova 메시지 삭제 API 요청
   */
  cordovaDelete(param) {
    var self = this;
    return new Promise(function (resolve, reject) {
      const succ = (res) => { console.log("res=" + JSON.stringify(res)); resolve(res); };
      const fail = (res) => { reject(res); }

      self.cordovaCallApi(self.state.api.url_delete, param, succ, fail);
    });
  }

  /**
   * cordova를 통해 데이터를 요청한다.
   * @param {*} url 
   * @param {*} param 
   * @param {*} callback 
   */
  cordovaCallApi(url, param, callbackSucc, callbackFail) {

    // 로컬 테스트용
    if (navigator.userAgent.indexOf("Windows") > -1 || navigator.userAgent.indexOf("Mac") > -1) {
      axios.get("/sample-data" + url + ".json", { params: param })
        .then(response => { callbackSucc(response.data) })
        .catch(response => { callbackFail(response.data) });
    } else {
      window.kbmobile.push.callApi(url, param, callbackSucc, callbackFail);
    }

  }

  /**
   * PUSH 리스트를 가져온다.
   * 인증(1회) > messages API > state.LIST set
   */
  reqMessages() {

    var self1 = this;

    self1.cordovaAuth().then(() => {
      self1.cordovaMessages().then((res) => {
        console.log(res.LIST);
        self1.setState({ list: self1.state.list.concat(res.LIST) });
      });

    }).catch(err => console.log("err: ", err));


  }

  render() {

    return (
      <MsgBoxTemplate>
        <Content list={this.state.list}
          onScrollToTop={this.handleScrollToTop}
          onScrollToBottom={this.handleScrollToBottom}
          handleCategoryToChange={this.handleCategoryToChange}
          category={this.state.messagesReq.CATEGORY}
          handleCheckedChange={this.handleCheckedChange}
          handleDeleteClick={this.handleDeleteClick}
          checkedItems={this.state.checkedItems}
          handleCheckedAllClick={this.state.handleCheckedAllClick}
        />
      </MsgBoxTemplate>
    );

  }

}

export default App;
