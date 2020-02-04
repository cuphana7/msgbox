import React, { Component } from 'react';
import Head from './components/js/Head';
import Content from './components/js/Content';
import axios from 'axios';
import $ from 'jquery';
import PushDelete from './components/js/PushDelete';
import PushEvent from './components/js/PushEvent';


/**
 * PUSH 알림함
 * 
 */
class App extends Component {

  constructor(props) {
    super(props)

    /**
     * 초기 카테고리 셋팅 함수
     */
    const initCategory = () => {
      var rslt = this.isAppcard === true ? "2":"1";
      if (window.location.hash !== "") rslt = window.location.hash.substr(1);
      else {
        var storageCategory = localStorage.getItem("pushCategory");
        if (storageCategory && storageCategory !== "") rslt = storageCategory;
      }
      return rslt;
    }
    /**
     * 안읽은 메시지 요청 전문
     */
    this.unReadCountsReq = {
      AUTHKEY: "",
      MSG_ID: "",
      isPost: false,
      isData: true
    }
    /**
     * API 인증 요청 전문
     */
    this.authReq = {
      AUTHKEY: "",
      isPost: true,
      isData: true
    }
    /**
     * 메시지 리스트 요청 전문
     */
    this.messagesReq = {
      APP_ID: "com.kbcard.kbkookmincard",
      USER_ID: "",
      PAGE: 1,
      AUTHKEY: "",
      CATEGORY: initCategory(),
      isPost: false,
      isData: true,
      isLast: false // 마지막 페이지일 경우 해당 값으로 요청 하지 않음.
    }
    /**
     * API URL 명세
     */
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

    /**
     * State React
     */
    this.state = {
      isLocal: true,
      isAppcard: false,
      shareContent: "",
      authKey: "",
      category: initCategory(),
      deleteReq: {
        AUTHKEY: "",
        MSG_IDS: "",
        isPost: false,
        isData: false
      },
      list: []
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
    this.reqMessagesAndSet = this.reqMessagesAndSet.bind(this)
    this.setShareContent = this.setShareContent.bind(this)
    this.handleShareContentsClick = this.handleShareContentsClick.bind(this)
  }

  componentDidMount() {
    const self = this;

    // 1. 인증키요청
    this.cordovaAuth().then((key) => {
      console.log("1. 인증키 요청 완료 key =>", key)
      self.messagesReq.PAGE = 1;
      self.messagesReq.AUTHKEY = key;
      self.unReadCountsReq.AUTHKEY = key;

      // 2. 리스트 요청
      self.reqMessages(false).then((msgs) => {
        console.log("2. 리스트 요청 완료", msgs);

        self.setLastMsgIdPromise(self.messagesReq.PAGE, msgs).then((max) => {
          console.log("3. 최근 키 확인 완료", max);
          self.unReadCountsReq.MSG_ID = max;
          self.setState({ list: msgs, authKey: key });
        }).catch(setLastMsgIdPromiseErr => {
          console.log("@setLastMsgIdPromiseErr", setLastMsgIdPromiseErr)
          self.setState({ list: msgs, authKey: key });
        })
      });

    }).catch(cordovaAuth => {
      console.log("cordovaAuth", cordovaAuth);
      self.messagesReq.PAGE = 1;
      self.setState({ authKey: "AUTHFAIL" });
      self.setState({ list: [] });
    });
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

    self.setState({ deleteReq: { "AUTHKEY": self.state.authKey, "MSG_IDS": msgs, "isPost": false, "isData": false } }, () => {
      self.cordovaDelete().then((res) => {
        console.log("cordovaDelete res=" + res.data);
        $("input[type=checkbox]").prop("checked", false);
        $('.pushArea').removeClass('delete');
        $('.pushDelete').removeClass('deleteFlag');
        self.reqMessagesAndSet(false);
      }).catch(err => {
        console.log("cordovaDelete err", err);
        // IOS에서 삭제성공이 되어도 내려와서 처리함.
        $("input[type=checkbox]").prop("checked", false);
        $('.pushArea').removeClass('delete');
        $('.pushDelete').removeClass('deleteFlag');
        self.reqMessagesAndSet(false);
      });

    });
  }
  /**
   * 스크롤 상단으로 이동시 목록 가져오기
   * @param {*} completed 
   */
  handleScrollToTop(completed) {
    this.messagesReq.PAGE = 1;
    this.messagesReq.isLast = false;
    this.reqMessagesAndSet(false).then(() => completed());
  }

  /**
   * 스크롤 하단으로 이동시 목록 가져오기
   */
  handleScrollToBottom(completed) {
    console.log("scrollToButtom!");
    const self = this;
    if (self.messagesReq.isLast === false) {
      self.messagesReq.PAGE = self.messagesReq.PAGE + 1;
      this.reqMessagesAndSet(true).then((res) => completed());
    } else {
      console.log("no more data! don`t request.");
      completed()
    }
  }

  /**
   * 스크롤 상단으로 이동시 새로운 목록을 가져온다.
   * @param {*} e 
   */
  handleCategoryToChange(e) {
    //$("#content").css({ height: '900px' });
    console.log("handleCategoryToChabge", e);
    $(".cont").css({ height: 120, transitionDuration: '0ms' });
    $(".toggleUI.up").removeClass("up");

    const self = this;
    const target = e.target;
    localStorage.setItem("pushCategory", target.value);
    console.log("setItem", target.value);

    this.setState({ category: target.value }); 
    this.messagesReq.PAGE = 1;
    this.messagesReq.isLast = false;
    this.messagesReq.CATEGORY = target.value;
    this.reqMessagesAndSet(false);
  }

  /**
   * 메시지 공유 하기
   */
  handleShareContentsClick() {
    // 로컬 테스트용
    if (this.state.isLocal) {
      console.log("local share test", this.state.shareContent);
    } else {
      console.log("#shareContents");
      window.kbmobile.app.shareContents(this.state.shareContent);
    }
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
      const suc = (res) => { resolve(res); };
      const fail = (res) => { reject(res); }
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
      self.cordovaCallApi(self.api.url_delete, self.state.deleteReq, succ, fail);
    });
  }

  /**
   * cordova get msgId
   */
  cordovaGetMsgId() {
    var self = this;
    return new Promise(function (resolve, reject) {
      const succ = (res) => { resolve(res.msgId); };
      const fail = (res) => { reject(res); }

      // 로컬 테스트용
      if (self.state.isLocal) {
        succ("");
      } else {
        console.log("#getLastMsgId");
        window.kbmobile.push.getLastMsgId(succ, fail);
      }
    });
  }

  /**
   * cordova set msgId
   */
  cordovaSetMsgId(mid) {
    var self = this;
    return new Promise(function (resolve, reject) {
      const succ = (res) => { resolve(res); };
      const fail = (res) => { reject(res); }

      // 로컬 테스트용
      if (self.state.isLocal) {
        succ("123");
      } else {
        console.log("#setLastMsgId", mid);
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
    // 첫페이지 일경우만
    if (page === 1 && list.length > 0) {
      self.cordovaGetMsgId().then(resMsgId => {
        var firstMsgId = list[0].MSG_ID;
        var appMsgId = (!resMsgId || resMsgId === "" || resMsgId === "NaN") ? "0" : resMsgId;
        if (appMsgId * 1 < firstMsgId * 1) {
          self.lastMsg = firstMsgId;
          self.cordovaSetMsgId(firstMsgId);
        }
      });
    }
  }

  setLastMsgIdPromise(page, list) {
    const self = this;
    return new Promise(function (resolve, reject) {
      // 첫페이지 일경우만
      self.cordovaGetMsgId().then(resMsgId => {
        if (page === 1 && list && list.length > 0) {
          var firstMsgId = list[0].MSG_ID;
          var appMsgId = (!resMsgId || resMsgId === "" || resMsgId === "NaN") ? "0" : resMsgId;
          if (appMsgId * 1 < firstMsgId * 1) {
            self.lastMsg = firstMsgId;
            resolve(firstMsgId);
            self.cordovaSetMsgId(firstMsgId);
          } else {
            resolve(resMsgId);
          }
        } else if (page === 1) {
          resolve(resMsgId);
        } else {
          reject(resMsgId);
        }
      }).catch(res => {
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
    if (this.state.isLocal) {
      axios.get("/sample-data" + url + ".json", { params: param })
        .then(response => {
          callbackSucc(response.data)
        })
        .catch(response => {
          callbackFail(response.data)
        });
    } else {
      console.log("#callApi ", url, param);
      window.kbmobile.push.callApi(url, param, callbackSucc, callbackFail);
    }
  }


  /**
   * PUSH 리스트를 가져온다.
   * 인증(1회) > messages API > state.LIST set
   */
  reqMessagesAndSet(isAdd) {

    var self = this;
    return new Promise((resolve, reject) => {
      self.reqMessages(isAdd).then((res) => {
        self.setState({ list: res }, (res) => resolve(res));
        console.log(">>setState list", res)
        // 최근 msgId 셋팅
        self.setLastMsgId(self.messagesReq.PAGE, res);
      });
    });


  }

  reqMessages(isAdd) {
    var self = this;
    return new Promise(function (resolve, reject) {
      self.cordovaMessages().then((res) => {
        //console.log("cordovaMessages res=", res)
        if (isAdd) resolve(self.state.list.concat(res.LIST));
        else resolve(res.LIST);
        if (res.LIST && res.LIST.length < 1) self.messagesReq.isLast = true; // 데이터가 없을 경우 마지막으로 요청 하지 않토록 함.
      });
    });
  }

  setShareContent(msg) {
    this.setState({ shareContent: msg });
  }

  render() {

    const moveSetting = () =>{
      window.location.href="CXHIAOPS0001.cms?newPushLibYn=Y";
    }
    const exitPush = () => {
      window.kbmobile.ui.clearTop("main");
    }

    return (
      <div className="pushWrap">

         {/* Head */}
        <Head isAppcard={this.state.isAppcard}/>

        {/* Content */}
        <Content list={this.state.list}
          onScrollToTop={this.handleScrollToTop}
          onScrollToBottom={this.handleScrollToBottom}
          handleCategoryToChange={this.handleCategoryToChange}
          category={this.state.category}
          handleDeleteClick={this.handleDeleteClick}
          handleCheckedAllClick={this.handleCheckedAllClick}
          authKey={this.state.authKey}
          reqMessages={this.reqMessages}
          isAppcard={this.state.isAppcard}
          isLocal={this.state.isLocal}
          setShareContent={this.setShareContent}
        />

        {/* 삭제 레이어 */}
        <PushDelete handleDeleteClick={this.handleDeleteClick} handleCheckedAllClick={this.handleCheckedAllClick} />

        {/* 이벤트 레이어 */}
        {this.state.isAppcard === true ? "" 
        : <PushEvent isLocal={this.state.isLocal}/>}

        {/* 옵션 레이어 */}
        <div id="listMenu" className="layerWrap newType">
            <div className="popTop">
                <strong >다른 작업 선택</strong>
            </div>
            <div className="popCont">
                <ul className="more_list">
                    <li><a href="javascript:" className="delete"><span className="img"><img src="https://img1.kbcard.com/LT/cxh/kbcard_img/common/ico/basic/24/ico_trash_24.png" alt="" /></span>삭제</a></li>
                    <li><a href="javascript:" className="shareImg" onClick={this.handleShareContentsClick} ><span className="img"><img src="https://img1.kbcard.com/LT/cxh/kbcard_img/common/ico/basic/24/ico_share_24.png" alt="" /></span>공유</a></li>
                </ul>
            </div>
            <span className="popClose"><a href="javascript:" role="button" aria-label="닫기">닫기</a></span>
        </div>
        <div className="dim disnone"></div>

      </div>
    );

  }

}

export default App;
