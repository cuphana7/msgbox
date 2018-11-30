import React, { Component } from 'react';
import MsgBoxTemplate from './components/js/MsgBoxTemplate';
import Content from './components/js/Content';
import axios from 'axios';
import $ from 'jquery'

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

    const initCategory = () => {
      var rslt = "1";
      if (window.location.hash !== "" ) rslt = window.location.hash.substr(1);
      else {
        var storageCategory = localStorage.getItem("pushCategory");
        if (storageCategory && storageCategory != "") rslt = storageCategory;
      }
      return rslt;
    }

    this.state = {
      api: {
        "url_auth": "/api/authentication",
        "url_messages": "/api/inbox/messages",
        "url_delete": "/api/inbox/messages/remove.do",
        "url_counts": "/api/inbox/messages/counts",
        "url_delete_all": "/api/inbox/deleteAll",
        "url_unread": "/api/inbox/unread",
        "url_events": "/CXHIAOPC0041.cms?responseContentType=json"
      },
      authReq: {
        "isPost": true,
        "isData": true
      },
      messagesReq: {
        "APP_ID": "com.kbcard.kbkookmincard",
        "USER_ID": "",
        "PAGE": 1,
        "AUTHKEY": "",
        "CATEGORY": initCategory(),
        "isPost": false,
        "isData": true,
      },
      deleteReq: {
        "AUTHKEY": "",
        "MSG_IDS": "",
        "isPost": false,
        "isData": false
      },
      unReadCountsReq: {
        "AUTHKEY": "",
        "MSG_IDS": "",
        "isPost": false,
        "isData": true
      },
      localCache: {
        "msg_key_id": "", // 최근 저장 키
        "last_categroy": "1",
        "msg_key": "" // 메시지리스트 키
      },
      list: [],
      unReads: [{"category":"1", "count":0},{"category":"2", "count":0},{"category":"3", "count":0},{"category":"4", "count":0}]
    }

    this.handleScrollToTop = this.handleScrollToTop.bind(this)
    this.handleScrollToBottom = this.handleScrollToBottom.bind(this)
    this.reqMessages = this.reqMessages.bind(this)
    this.handleCategoryToChange = this.handleCategoryToChange.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
    this.handleCheckedAllClick = this.handleCheckedAllClick.bind(this)
    this.setMessageReq = this.setMessageReq.bind(this)
    this.cordovaGetMsgId = this.cordovaGetMsgId.bind(this)
    this.cordovaSetMsgId = this.cordovaSetMsgId.bind(this)
    this.lastMsgId = this.lastMsgId.bind(this)
    this.cordovaUnReadCnt = this.cordovaUnReadCnt.bind(this)
    this.requestCount = this.requestCount.bind(this)

  }
  componentDidMount() {

    this.reqMessages(false);
    const loadScript = (url, callback) => {
      var script = document.createElement("script");script.type = "text/javascript";script.onload = function () { callback(); };script.src = url;document.getElementsByTagName('head')[0].appendChild(script);
    }
    loadScript("js/common.js", function () { console.log("./js/common.js load ok! "); });
  }

  setMessageReq(prevState, page, category, authkey) {
    return {
      "APP_ID": prevState.messagesReq.APP_ID,
      "USER_ID": "",
      "PAGE": page === 0 ? prevState.messagesReq.PAGE : page,
      "AUTHKEY": authkey !== "" ? authkey : prevState.messagesReq.AUTHKEY,
      "CATEGORY": category === "" ? prevState.messagesReq.CATEGORY : category,
      "isPost": false,
      "isData": true
    }
  }

  /**
   * 전체 선택
   * @param {*} e 
   */
  handleCheckedAllClick(e) {
    $("input[type=checkbox]").prop("checked",true);
  }

  /**
   * 삭제 버튼 이벤트
   * @param {*} completed 
   */
  handleDeleteClick(e) {
    const self = this;
    var arrKeys = [];
    $('#checkboxes input:checked').each(function() {
      arrKeys.push($(this).attr('name'));
    });

    const msgs = arrKeys.join(";");
    console.log(msgs);

    self.setState({ deleteReq: { "AUTHKEY":self.state.messagesReq.AUTHKEY, "MSG_IDS": msgs, "isPost": false, "isData": false } }, ()=>{
      self.cordovaDelete().then((res) => {
        console.log("cordovaDelete res="+res.data);
        $('.pushArea').removeClass('delete');
        $("input[type=checkbox]").prop("checked",false);
        self.reqMessages(false);
      }).catch(err => {
        console.log("cordovaDelete err="+err);
      });

    });
    

  }
  /**
   * 스크롤 상단으로 이동시 목록 가져오기
   * @param {*} completed 
   */
  handleScrollToTop(completed) {
    const self = this;
    this.setState(prevState => ({ messagesReq: self.setMessageReq(prevState, 1, "", "") }));
    this.reqMessages(false);
    completed();
  }

  /**
   * 스크롤 하단으로 이동시 목록 가져오기
   */
  handleScrollToBottom(completed) {
    const self = this;
    const nextPage = this.state.messagesReq.PAGE + 1;
    this.setState(prevState => ({ messagesReq: self.setMessageReq(prevState, nextPage, "", "") }));
    this.reqMessages(true);
    completed();
  }

  /**
   * 스크롤 상단으로 이동시 새로운 목록을 가져온다.
   * @param {*} e 
   */
  handleCategoryToChange(e) {
    const self = this;
    const target = e.target;
    localStorage.setItem("pushCategory", target.value); 
    this.setState(prevState => ({ messagesReq: self.setMessageReq(prevState, 1, target.value, "") }));
    this.reqMessages(false);
  }

  /**
   * cordova 인증키를 셋팅 한다.
   */
  cordovaAuth() {
    var self = this;
    return new Promise(function (resolve, reject) {
      if (self.state.messagesReq.AUTHKEY === "AUTHFAIL") {
        reject("");
      }
      else if (self.state.messagesReq.AUTHKEY !== "") {
        resolve();
      }
      else {
        const suc = (res) => {
          self.setState(prevState => ({ messagesReq: self.setMessageReq(prevState, 0, "", res.AUTHKEY) }));
          resolve();
        }
        const fail = (res) => {
          reject(res);
        }
        console.log("cordovaCallApi: url=" + self.state.api.url_auth + " data=" + JSON.stringify(self.state.authReq));
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
      const suc = (res) => { console.log("messages called success page=" + self.state.messagesReq.PAGE); resolve(res); };
      const fail = (res) => { reject(res); }
      console.log("cordovaCallApi: url=" + self.state.api.url_messages + " data=" + JSON.stringify(self.state.messagesReq));
      self.cordovaCallApi(self.state.api.url_messages, self.state.messagesReq, suc, fail);
    });
  }

  /**
   * cordova 메시지 삭제 API 요청
   */
  cordovaDelete() {
    var self = this;
    return new Promise(function (resolve, reject) {
      const succ = (res) => { console.log("res=" + JSON.stringify(res)); resolve(res); };
      const fail = (res) => { reject(res); }
      console.log("cordovaCallApi: url=" + (self.state.api.url_delete + " data=" + JSON.stringify(self.state.deleteReq)));
      self.cordovaCallApi(self.state.api.url_delete, self.state.deleteReq, succ, fail);
    });
  }

  /**
   * cordova get msgId
   */
  cordovaGetMsgId() {

    return new Promise(function (resolve, reject) {
      const succ = (res) => { console.log("cordovaGetMsgId res=" + JSON.stringify(res)); resolve(res.msgId); };
      const fail = (res) => { reject(res); }
      console.log("cordovaGetMsgId start");

      // 로컬 테스트용
      if (navigator.userAgent.indexOf("Windows") > -1 || navigator.userAgent.indexOf("Mac") > -1) {
        succ("");
      } else {
        window.kbmobile.push.getLastMsgId(succ, fail);
      }
    });
  }

  /**
   * cordova set msgId
   */
  cordovaSetMsgId(mid) {

    return new Promise(function (resolve, reject) {
      const succ = (res) => { console.log("cordovaSetMsgId res=" + JSON.stringify(res)); resolve(res); };
      const fail = (res) => { reject(res); }
      console.log("cordovaSetMsgId start");

      // 로컬 테스트용
      if (navigator.userAgent.indexOf("Windows") > -1 || navigator.userAgent.indexOf("Mac") > -1) {
        succ("123");
      } else {
        window.kbmobile.push.setLastMsgId(mid, succ, fail);
      }
    });
  }

  /**
   * cordova unReadCnt
   */
  cordovaUnReadCnt() {
    var self = this;
    return new Promise(function (resolve, reject) {
      const succ = (res) => { console.log("res=" + JSON.stringify(res)); resolve(res); };
      const fail = (res) => { reject(res); }
      console.log("cordovaCallApi: url=" + (self.state.api.url_unread + " data=" + JSON.stringify(self.state.unReadCountsReq)));
      self.cordovaCallApi(self.state.api.url_unread, self.state.unReadCountsReq, succ, fail);
    });
  }



  /**
   * 조회된 메시지 최근 ID와 앱의 최근 ID를 비교하여 마지막 값으로 업데이트 한다.
   */
  lastMsgId() {
    const self = this;
    
    console.log("lastMsgId " + self.state.messagesReq.PAGE +"=== 1 &&"+ self.state.list.length );
    // 첫페이지 일경우만
    if (self.state.messagesReq.PAGE === 1 && self.state.list.length > 0) {
      self.cordovaGetMsgId().then(resMsgId =>{
        var firstMsgId = self.state.list[0].MSG_ID;
        var appMsgId = (resMsgId === "" || resMsgId === "NaN")? "0" : resMsgId;
        console.log("lastMsgId " + appMsgId*1 +"<"+ firstMsgId*1 );
        if (appMsgId*1 < firstMsgId*1) self.cordovaSetMsgId(firstMsgId);
      });
    }
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
        .then(response => {
          callbackSucc(response.data)
        })
        .catch(response => {
          callbackFail(response.data)
        });
    } else {
      window.kbmobile.push.callApi(url, param, callbackSucc, callbackFail);
    }
  }


  /**
   * PUSH 리스트를 가져온다.
   * 인증(1회) > messages API > state.LIST set
   */
  reqMessages(isAdd) {

    var self = this;
    self.cordovaAuth().then(() => {
      self.cordovaMessages().then((res) => {
        console.log("res.LIST=" + JSON.stringify(res.LIST));
        //console.log("this.state.list="+JSON.stringify(self.state.list));
        if (isAdd) self.setState({ list: self.state.list.concat(res.LIST) });
        else self.setState({ list: res.LIST });

        // 최근 msgId 셋팅
        self.lastMsgId();
      });
    }).catch(err => {
      console.log("err: ", err);
      self.setState(prevState => ({ messagesReq: self.setMessageReq(prevState, 0, "", "AUTHFAIL") }));
      self.setState({ list: [] });
    });
  }

  requestCount() {
    var self = this;
    self.cordovaAuth().then(() => {
      self.cordovaUnReadCnt().then((res) => {
        console.log("res.LIST=" + JSON.stringify(res.LIST));
        //console.log("this.state.list="+JSON.stringify(self.state.list));
        self.setState({ unReads: res.LIST });
      });
    }).catch(err => {
      console.log("err: ", err);
      self.setState(prevState => ({ messagesReq: self.setMessageReq(prevState, 0, "", "AUTHFAIL") }));
    });
    
  }

  render() {

    return (
      <MsgBoxTemplate>
        <Content list={this.state.list}
          onScrollToTop={this.handleScrollToTop}
          onScrollToBottom={this.handleScrollToBottom}
          handleCategoryToChange={this.handleCategoryToChange}
          category={this.state.messagesReq.CATEGORY}
          handleDeleteClick={this.handleDeleteClick}
          handleCheckedAllClick={this.handleCheckedAllClick}
          authKey={this.state.messagesReq.AUTHKEY}
          messageReq={this.state.messagesReq}
          unReads={this.state.unReads}
          requestCount={this.requestCount}
        />
      </MsgBoxTemplate>
    );

  }

}

export default App;
