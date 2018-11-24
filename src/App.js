import React, { Component } from 'react';
import MsgBoxTemplate from './components/js/MsgBoxTemplate';
import Content from './components/js/Content';
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
      localCache : {
        "msg_key_id" : "", // 최근 저장 키
        "last_categroy" : "1",
        "msg_key" : "" // 메시지리스트 키
      },
      list: []
    }

    this.handleScrollToTop = this.handleScrollToTop.bind(this)
    this.handleScrollToBottom = this.handleScrollToBottom.bind(this)
    this.reqMessages = this.reqMessages.bind(this)
    this.handleCategoryToChange = this.handleCategoryToChange.bind(this)
  }

  componentDidMount() {
    this.reqMessages();

    function loadScript(url, callback) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.onload = function(){callback();};
      script.src = url;
      document.getElementsByTagName('head')[0].appendChild(script);
    }

    loadScript("/js/common.js", function(){ console.log("./js/common.js load ok! "); });
    //푸시 리스트 토글 UI
    $('.pushList .toggleUI').on('click',function(e) {
      e.preventDefault();
      $(this).toggleClass('up');

      //PUSH내용 초기 세팅
      var cont = $(this).closest('.btnToggle').siblings('.cont'),
        contH = cont.children('p').outerHeight(),
        duration = contH > 500 ? contH : 500;

      if($(this).hasClass('up')) {
        //PUSH내용 보임
        cont.css({display:'block',maxHeight:'none',height:60})
        
        contH = cont.children('p').outerHeight();
        duration = contH > 500 ? contH : 500;

        cont.css({height: contH, 'transition-duration':duration + 'ms'});	
      } else {
        //PUSH내용 닫힘
        cont.css({height: 60});
        setTimeout(function() {
          cont.css({display:'-webkit-box',maxHeight:60,height:'auto'});
        }, duration)
      }
    });

    //이벤트 리스트 토글 UI
    $('.pushEvent .toggleUI').on('click',function(e) {
      e.preventDefault();
      var $this = $(this);
      
      setTimeout(function() {
        $this.toggleClass('up');
      }, 400)

      var move_num = $('.pushEvent').outerHeight() - 56;

      if($(this).hasClass('up')) {
        //하단 이벤트 영역 슬라이드업
        $('.pushEvent').css({webkitTransform: 'translate3d(0, -' + move_num + 'px, 0)',transition: 'all 500ms cubic-bezier(0.250, 0.250, 0.540, 0.930)'})
        $('.dim').fadeIn().closest('body').css({overflow:'hidden'});
      } else {
        //하단 이벤트 영역 슬라이드다운
        $('.pushEvent').css({webkitTransform: 'translate3d(0, 0, 0)',transition: 'all 500ms cubic-bezier(0.250, 0.250, 0.540, 0.930)'})
        $('.dim').fadeOut().closest('body').css({overflow:'auto'});;
      }
    });
    
    //하단 이벤트 영역 초기 세팅
    $('.puchEventCont .eventList').css({height: $(window).outerHeight() - 281}).closest('.pushEvent').css({bottom: ($('.pushEvent').outerHeight() - 56) * -1})

    //삭제버튼 클릭 시 UI
    $('.delete').on('click', function() {
      $('.pushArea').addClass('delete');
    });

    //상단 삭제 탭 닫을 때 UI
    $('.pushDelete .close').on('click', function() {
      $('.pushArea').removeClass('delete');
    });
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
    return new Promise(function(resolve, reject) {
      if (self.state.messagesReq.AUTHKEY != "") {
        resolve();
      } else {

        const suc = (res) => {
          self.state.messagesReq.AUTHKEY = res.AUTHKEY;
          resolve();
        }
        const fail = (res) => {
          reject(res);
        }
        window.kbmobile.push.callApi("/api/authentication", self.state.authReq, suc, fail);
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
        console.log(res.toString());
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
          handleCategoryToChange={this.handleCategoryToChange}
          category={this.state.messagesReq.CATEGORY}
          />
      </MsgBoxTemplate>
    );
    
  }

}

export default App;
