import React, { Component } from 'react';
import MsgBoxTemplate from './components/js/MsgBoxTemplate';
import Content from './components/js/Content';
import axios from 'axios';
import $ from 'jquery'

/**
 * PUSH 알림함
 * 
 */
class App extends Component {

  constructor(props) {
    super(props)

    const initCategory = () => {
      var rslt = "1";
      if (window.location.hash !== "") rslt = window.location.hash.substr(1);
      else {
        var storageCategory = localStorage.getItem("pushCategory");
        if (storageCategory && storageCategory !== "") rslt = storageCategory;
      }
      return rslt;
    }
    this.unReadCountsReq = {
      AUTHKEY: "",
      MSG_ID: "",
      isPost: false,
      isData: true
    }
    this.messagesReq = {
      APP_ID: "com.kbcard.kbkookmincard",
      USER_ID: "",
      PAGE: 1,
      AUTHKEY: "",
      CATEGORY: initCategory(),
      isPost: false,
      isData: true,
    }
    this.authReq = {
      AUTHKEY: "",
      isPost: true,
      isData: true
    }
    this.api = {
      url_auth: "/api/authentication",
      url_messages: "/api/inbox/messages",
      url_delete: "/api/inbox/messages/remove.do",
      url_counts: "/api/inbox/messages/counts",
      url_delete_all: "/api/inbox/deleteAll",
      url_unread: "/api/inbox/messages/unread",
      url_events: "/CXHIAOPC0041.cms?responseContentType=json"
    }
    this.lastMsg = ""

    this.state = {
      authKey: "",
      category: initCategory(),
      deleteReq: {
        AUTHKEY: "",
        MSG_IDS: "",
        isPost: false,
        isData: false
      },
      list: [],
      unReads: { cate1: 0, cate2: 0, cate3: 0, cate4: 0 },
      counts: { cate1: 0, cate2: 0, cate3: 0, cate4: 0 }
    }

    this.handleScrollToTop = this.handleScrollToTop.bind(this)
    this.handleScrollToBottom = this.handleScrollToBottom.bind(this)
    this.reqMessages = this.reqMessages.bind(this)
    this.handleCategoryToChange = this.handleCategoryToChange.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
    this.handleCheckedAllClick = this.handleCheckedAllClick.bind(this)
    this.cordovaGetMsgId = this.cordovaGetMsgId.bind(this)
    this.cordovaSetMsgId = this.cordovaSetMsgId.bind(this)
    this.setLastMsgId = this.setLastMsgId.bind(this)
    this.cordovaUnReadCnt = this.cordovaUnReadCnt.bind(this)
    this.reqUnreadCount = this.reqUnreadCount.bind(this)
    this.reqMessagesAndSet = this.reqMessagesAndSet.bind(this)
    this.reqCounts = this.reqCounts.bind(this)
  }
  componentDidMount() {
    const self = this;
    // auth > messages && unread
    this.cordovaAuth().then((key) => {

      self.messagesReq.PAGE = 1;
      self.messagesReq.AUTHKEY = key;
      self.unReadCountsReq.AUTHKEY = key

      self.reqMessages(false).then((msgs) => {
        //self.setState({ list: msgs, authKey: key });

        self.setLastMsgIdPromise(self.messagesReq.PAGE, msgs).then((max) => {
          self.unReadCountsReq.MSG_ID = max;
          self.reqUnreadCount().then((unr) => {
            self.reqCounts().then((cnts) => {
              self.setState({ unReads: unr, list: msgs, authKey: key, counts: cnts });
            }).catch(reqCountsErr => {
              console.log("reqCountsErr=" + reqCountsErr);
              self.setState({ list: msgs, authKey: key, unReads: unr });
            })
          }).catch(reqUnreadCountErr => {
            console.log("reqUnreadCountErr=" + reqUnreadCountErr);
            self.setState({ list: msgs, authKey: key });
          })
        }).catch(res=>{
          self.setState({ list: msgs, authKey: key});
        })



        //self.setState({ unReads: unr, list: msgs, authKey: key });
      });
      /*
            Promise.all([
              self.reqMessages(false),
              self.reqUnreadCount()
            ]).then(([msgs, unr]) => {
              console.log("msgs=" + JSON.stringify(msgs) + " unReads" + JSON.stringify(unr))
              // Forces batching
              ReactDOM.unstable_batchedUpdates(() => {
                self.setState({ unReads: unr, list: msgs, authKey: key }); // Doesn't re-render yet
              });
            });*/

    }
    ).catch(err => {
      console.log("err: ", err);
      self.messagesReq.PAGE = 1;
      self.setState({ authKey: "AUTHFAIL" });
      self.setState({ list: [] });
    });

    const loadScript = (url, callback) => { var script = document.createElement("script"); script.type = "text/javascript"; script.onload = function () { callback(); }; script.src = url; document.getElementsByTagName('head')[0].appendChild(script); }
    loadScript("js/common.js", function () { console.log("./js/common.js load ok! "); });
  }

  /**
   * 전체 선택
   * @param {*} e 
   */
  handleCheckedAllClick(e) {
    $("input[type=checkbox]").prop("checked", true);
  }

  /**
   * 삭제 버튼 이벤트
   * @param {*} completed 
   */
  handleDeleteClick(e) {
    const self = this;
    var arrKeys = [];
    $('#checkboxes input:checked').each(function () {
      arrKeys.push($(this).attr('name'));
    });

    const msgs = arrKeys.join(";");
    console.log(msgs);

    self.setState({ deleteReq: { "AUTHKEY": self.state.authKey, "MSG_IDS": msgs, "isPost": false, "isData": false } }, () => {
      self.cordovaDelete().then((res) => {
        console.log("cordovaDelete res=" + res.data);
        $('.pushArea').removeClass('delete');
        $("input[type=checkbox]").prop("checked", false);
        self.reqMessagesAndSet(false);
        self.reqCountsAndSet();
      }).catch(err => {
        console.log("cordovaDelete err=" + err);
      });

    });
  }
  /**
   * 스크롤 상단으로 이동시 목록 가져오기
   * @param {*} completed 
   */
  handleScrollToTop(completed) {
    //this.setState(prevState => ({ messagesReq: self.setMessageReq(prevState, 1, "", "") }));
    this.messagesReq.PAGE = 1;
    this.reqMessagesAndSet(false);
    completed();
  }

  /**
   * 스크롤 하단으로 이동시 목록 가져오기
   */
  handleScrollToBottom(completed) {
    //this.setState(prevState => ({ messagesReq: self.setMessageReq(prevState, nextPage, "", "") }));
    this.messagesReq.PAGE = this.messagesReq.PAGE + 1;
    this.reqMessagesAndSet(true);
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

    this.setState({ category: target.value }); //,unReads:{cate1:0,cate2:10,cate3:30,cate4:420}});
    this.messagesReq.PAGE = 1;
    this.messagesReq.CATEGORY = target.value;
    //this.setState(prevState => ({ messagesReq: self.setMessageReq(prevState, 1, target.value, "") }));
    this.setState(prevState => ({ unReads: self.setUnReadsCnt(prevState.unReads, target.value) }));
    this.reqMessagesAndSet(false);
    //this.reqUnreadCountAndSet();
  }

  setUnReadsCnt(pre, cate) {
    var rslt = { cate1: 0, cate2: 0, cate3: 0, cate4: 0 };
    for (var key in pre) {
      if (key === "cate" + cate) rslt[key] = 0;
      else rslt[key] = pre[key]
    }
    return rslt;
  }

  /**
   * cordova 인증키를 셋팅 한다.
   */
  cordovaAuth() {
    var self = this;
    return new Promise(function (resolve, reject) {
      if (self.state.authKey === "AUTHFAIL") {
        reject("");
      }
      else if (self.state.authKey !== "") {
        resolve();
      }
      else {
        const suc = (res) => {
          self.authReq = {
            "AUTHKEY": res.AUTHKEY,
            "isPost": true,
            "isData": true
          }
          resolve(res.AUTHKEY);
        }
        const fail = (res) => {
          reject(res);
        }
        console.log("cordovaCallApi: url=" + self.api.url_auth + " data=" + JSON.stringify(self.authReq));
        self.cordovaCallApi(self.api.url_auth, self.authReq, suc, fail);
      }
    });
  }

  /**
   * cordova 메시지 리스트 API를 호출한다.
   */
  cordovaMessages() {
    var self = this;
    return new Promise(function (resolve, reject) {
      const suc = (res) => { console.log("messages called success page=" + self.messagesReq.PAGE); resolve(res); };
      const fail = (res) => { reject(res); }
      console.log("cordovaCallApi: url=" + self.api.url_messages + " data=" + JSON.stringify(self.messagesReq));
      self.cordovaCallApi(self.api.url_messages, self.messagesReq, suc, fail);
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
      console.log("cordovaCallApi: url=" + (self.api.url_delete + " data=" + JSON.stringify(self.state.deleteReq)));
      self.cordovaCallApi(self.api.url_delete, self.state.deleteReq, succ, fail);
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
      const changeJson = (res) => {
        var rslt = { cate1: 0, cate2: 0, cate3: 0, cate4: 0 };
        var dt = res.LIST;
        if (dt && dt.length > 0) {
          for (var i = 0; i < dt.length; i++) {
            if (dt[i].CATEGORY == "1") rslt.cate1 = dt[i].CNT;
            else if (dt[i].CATEGORY === "2") rslt.cate2 = dt[i].CNT;
            else if (dt[i].CATEGORY === "3") rslt.cate3 = dt[i].CNT;
            else if (dt[i].CATEGORY === "4") rslt.cate4 = dt[i].CNT;
          }
        }
        return rslt;
      }
      const succ = (res) => { 
        console.log("cordovaUnReadCnt res=" + JSON.stringify(res)); 
        resolve(changeJson(res)); 
      };
      const fail = (res) => { reject(res); }
      console.log("cordovaCallApi: url=" + (self.api.url_unread + " data=" + JSON.stringify(self.unReadCountsReq)));
      self.cordovaCallApi(self.api.url_unread, self.unReadCountsReq, succ, fail);
    });
  }

  cordovaCnts() {
    var self = this;
    return new Promise(function (resolve, reject) {
      const changeJson = (res) => {
        var rslt = { cate1: 0, cate2: 0, cate3: 0, cate4: 0 };
        var dt = res.LIST;
        if (dt && dt.length > 0) {
          for (var i = 0; i < dt.length; i++) {
            if (dt[i].CATEGORY == "1") rslt.cate1 = dt[i].CNT;
            else if (dt[i].CATEGORY === "2") rslt.cate2 = dt[i].CNT;
            else if (dt[i].CATEGORY === "3") rslt.cate3 = dt[i].CNT;
            else if (dt[i].CATEGORY === "4") rslt.cate4 = dt[i].CNT;
          }
        }
        return rslt;
      }
      const succ = (res) => { console.log("cordovaCnts res=" + JSON.stringify(res)); resolve(changeJson(res)); };
      const fail = (res) => { reject(res); }
      //console.log("cordovaCallApi: url=" + (self.api.url_unread + " data=" + JSON.stringify(self.unReadCountsReq)));
      self.cordovaCallApi(self.api.url_counts, self.unReadCountsReq, succ, fail);
    });
  }



  /**
   * 조회된 메시지 최근 ID와 앱의 최근 ID를 비교하여 마지막 값으로 업데이트 한다.
   */
  setLastMsgId(page, list) {
    const self = this;
    console.log("setLastMsgId " + page + "=== 1 &&" + list.length);
    // 첫페이지 일경우만
    if (page === 1 && list.length > 0) {
      self.cordovaGetMsgId().then(resMsgId => {
        var firstMsgId = list[0].MSG_ID;
        var appMsgId = (!resMsgId || resMsgId === "" || resMsgId === "NaN") ? "0" : resMsgId;
        console.log("setLastMsgId " + appMsgId * 1 + "<" + firstMsgId * 1);
        if (appMsgId * 1 < firstMsgId * 1) {
          self.lastMsg = firstMsgId;
          self.cordovaSetMsgId(firstMsgId);
        }
      });
    }
  }

  setLastMsgIdPromise(page, list) {
    const self = this;
    console.log("setLastMsgId " + page + "=== 1 && " + list.length);

    return new Promise(function (resolve, reject) {
      // 첫페이지 일경우만
      self.cordovaGetMsgId().then(resMsgId => {
        if (page === 1 && list && list.length > 0) {
          var firstMsgId = list[0].MSG_ID;
          var appMsgId = (!resMsgId || resMsgId === "" || resMsgId === "NaN") ? "0" : resMsgId;
          console.log("setLastMsgId " + appMsgId * 1 + "<" + firstMsgId * 1);
          if (appMsgId * 1 < firstMsgId * 1) {
            self.lastMsg = firstMsgId;
            resolve(firstMsgId);
            self.cordovaSetMsgId(firstMsgId);
          } else {
            resolve(resMsgId);
          }
        } else if(page === 1) {
          resolve(resMsgId);
        } else {
          reject(resMsgId);
        }
      }).catch(res=> {
        console.log(res);
        reject(res);
      });

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
      console.log("/sample-data" + url + ".json  params=" + JSON.stringify(param));
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
  reqMessagesAndSet(isAdd) {

    var self = this;
    self.reqMessages(isAdd).then((res) => {
      if (isAdd) self.setState({ list: res });
      else self.setState({ list: res });
      // 최근 msgId 셋팅
      self.setLastMsgId(self.messagesReq.PAGE, res);
    });
  }

  reqMessages(isAdd) {
    var self = this;
    return new Promise(function (resolve, reject) {
      self.cordovaMessages().then((res) => {
        if (isAdd) resolve(self.state.list.concat(res.LIST));
        else resolve(res.LIST);
      });
    });
  }

  reqUnreadCount() {
    var self = this;
    return self.cordovaUnReadCnt();
  }

  reqCounts() {
    var self = this;
    return self.cordovaCnts();
  }

  reqCountsAndSet() {
    var self = this;
    return self.cordovaCnts().then((res) => {
      this.setState({ counts: res })
    });;
  }

  reqUnreadCountAndSet() {
    var self = this;
    self.cordovaUnReadCnt().then((res) => {
      this.setState({ unReads: res })
    });
  }

  render() {

    return (
      <MsgBoxTemplate>
        <Content list={this.state.list}
          onScrollToTop={this.handleScrollToTop}
          onScrollToBottom={this.handleScrollToBottom}
          handleCategoryToChange={this.handleCategoryToChange}
          category={this.state.category}
          handleDeleteClick={this.handleDeleteClick}
          handleCheckedAllClick={this.handleCheckedAllClick}
          unReads={this.state.unReads}
          reqUnreadCount={this.reqUnreadCount}
          authKey={this.state.authKey}
          cnts={this.state.counts}
        />
      </MsgBoxTemplate>
    );

  }

}

export default App;
