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
        console.log(JSON.stringify(res));
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
    if (navigator.userAgent.indexOf("Chrome") > -1 ) {
      self1.setState({ list: self1.state.list.concat([{"MSG_ID":"284812430","TITLE":"아이위크 웨딩박람회","MSG":"(광고)[KB국민카드]\r\n아이웨딩과 함께 \r\n행복한 결혼 준비\r\n\r\n■행사: 아이위크 웨딩 박람회\r\n■기간: 2018.11.30(금)~12.9(일)\r\n■장소: 아이웨딩 논현동 사옥\r\n■대상: KB국민카드 전회원\r\n\r\n■KB국민카드 혜택\r\nⓛ행사 당일 스드메 계약금 결제 시 독일 엠버드 홈세트14P 증정(선착순 200명)\r\n②아이웨딩에서 100만원 이상 결제 시 1% 캐시백(결제 다음달 말 지급예정)  \r\n③ KB국민카드 금액대별 추가 캐시백(응모필수/1599-0666)\r\n\r\n■혜택보기\r\n☞http://ifam.kr/do/kb1812\r\n\r\n■플러스혜택\r\nⓛ신혼집에 카페만들기- 돌체구스토 조비아 블랙 커피머신 증정(스드메 계약금 결제 시)\r\n②방문 상담시 신혼 마스크팩+인생네컷 촬영권 증정 \r\n③영상앨범&폐백 당일결정 스페셜 할인\r\n④허니문 타올+캐리어 증정\r\n⑤한복 고급 디퓨저, 예복 고급 소가죽 수제화 제공\r\n⑥예물 원 포인트 다이아목걸이 증정\r\n⑦LG전자 방문&계약 사은품\r\n⑧현대백화점 100만원 마일리지 적립\r\n\r\n■문의\r\n-제휴사 아이웨딩(☎02-540-4112)\r\n-KB국민카드 고객센터(☎1588-1688)\r\n\r\n※본 행사는 KB국민카드의 영업정책 및 제휴업체의 사정으로 변경 또는 중단될 수 있습니다.\r\n\r\n※ 준법감시인 심의필\r\n     181121-03675-LMS\r\n\r\n\r\n----------------------------\n일시불 할부전환 이벤트\nhttp://m.kbcard.com/e/267465\n----------------------------\n※수신거부:설정>PUSH알림","CATEGORY_CODE":"4","ICON_IMG":"1484704104939.png","DATE":"20181123140838","EXT":[{"value":"","key":"img"},{"value":"없음","key":"btn"},{"value":"","key":"lu"}]},{"MSG_ID":"282292031","TITLE":"유튜브 프리미엄 100% 캐시백","MSG":"(광고)[KB국민카드] YouTube Premium 서비스 신규 가입하고 KB국민카드로 자동결제 시, 1개월 이용료 100% 캐시백 제공!\n※준법감시인심의필 : 181115-03621-PUH\n※수신거부:설정>PUSH알림","CATEGORY_CODE":"4","ICON_IMG":"1484704104939.png","DATE":"20181119133328","EXT":[{"value":"1542587109242.png","key":"img"},{"value":"자세히보기","key":"btn"},{"value":"kbcardmain://openUrl/CXHIABNC0026.cms?evntSerno=267791","key":"lu"}]},{"MSG_ID":"280494602","TITLE":"KB국민카드X현대백화점","MSG":"(광고)[KB국민카드] \n 박*훈님께 전하는 \n현대백화점의 기분좋은 쇼핑뉴스! \n\n■ 【혜택1】 문자 수신 고객만의 혜택! 현대백화점 Cafe-H음료 2잔 제공\n☞본 문자와 KB국민카드 제시시 기간중 1회에 한하여 증정 \n☞기간: 2018.11.16(금)~11.25(일)\n☞받는 곳 : 현대백화점 각 점 Cafe-H\n\n■ 【혜택2】 \n[전관] 당일 구매인정금액 20/40만원 이상시 1/2만원 현대백화점 상품권 증정 \n[해외패션/준보석/모피/리빙] 단일브랜드 당일 구매인정금액 1/2/3/5/10백만원 이상 구매시 10/20/30/50/100만원 현대백화점 상품권 증정 \n☞기간: 2018.11.16(금)~11.25(일)\n☞받는곳 : 현대백화점 각 점 사은데스크\n\n■ 【혜택3】 \nKB국민 개인신용카드로 5만원 이상 구매 시 6~2개월 무이자 할부 \n\n■ 대상 \n본 문자 수신 KB국민카드 회원 \n(KB국민 기업, 비씨, 선불카드 제외) \n\n■ 꼭 알아두세요! \n- 행사점: 현대백화점 15개 전점\n- [혜택1] 본 문자 제시 시 증정 가능, 문자 재발송 불가 \n- 당일 영수증에 한해 합산 가능, 타 점포와 합산 불가, 영수증 제시 필수 \n- 타 사은행사 중복 증정 불가(영수증 1개당 1 행사 참여 가능) \n- 영수증 분할 불가, 취소 시 상품권 반납 필수\n- 상품권 증정금액 합산 시 일부 품목 미적용 또는 50%만 적용  (현대백화점 사은지급율에 따름)\n- 상품권 증정기준 등 자세한 내용은 현대백화점 각 점포로 문의\n- 무이자 할부 이용시 카드사 포인트 및 마일리지 적립 불가\n\n■ 문의 \n-KB국민카드 고객센터 : ☎1588-1688 \n\n-현대백화점 각 점포\n\n※ 본 행사는 KB국민카드의 영업정책 및 제휴업체의 사정으로 변경 또는 중단될 수 있습니다. \n\n※ 준법감시인 심의필\n     181109-03574-LMS\n----------------------------\n일시불 할부전환 이벤트\nhttp://m.kbcard.com/e/267465\n----------------------------\n※수신거부:설정>PUSH알림","CATEGORY_CODE":"4","ICON_IMG":"1484704104939.png","DATE":"20181116101432","EXT":[{"value":"","key":"img"},{"value":"없음","key":"btn"},{"value":"","key":"lu"}]},{"MSG_ID":"279750932","TITLE":"VIP고객 다이닝스타 안내","MSG":"(광고)[KB국민카드] \n12번째 특별한 테이블, 다이닝스타\n\n서울/부산 프리미엄 레스토랑에서 50% 할인된 가격으로 즐기는 맛있는 1주일!\n\n■ 내용\n① 사전 예약 후 대상 카드로 결제 시 지정 메뉴 50% 현장 할인 (회원별 일 1회 4세트 한정)\n② 네이버웹툰 <밥 먹고갈래요?> * 다이닝스타 한정판 스티커 선착순 증정\n\n■ 참여 레스토랑/메뉴 및 예약방법 보러가기\nhttps://m.kbcard.com/e/267790\n\n\n■ 기간: 2018.11.23(금) ~ 11.29(목)\n* 예약 기간: 2018.11.19(월) 오전 10시 ~ 11.29(목)\n\n■ 예약: 예약 기간 중 [네이버 예약]을 통해  '다이닝스타 메뉴' 예약 필수 (유선예약 불가)\n\n■ 대상: TANTUM, TEZE, ROVL, BeV III·V·IX, 미르, 플래티늄 개인 신용카드 회원 (KB국민 비씨, 플래티늄S,L 제외)\n\n■ 꼭 알아두세요\n- 예약 기간 외 예약 불가\n- 레스토랑별 예약 마감 시 이용 불가\n- 대상카드 실물로 결제 시 50% 할인 적용(삼성페이, 앱카드, 알파원카드 이용 시 할인 불가)\n- 타 쿠폰, 프로모션과 중복 적용 불가\n- 예약취소는 최소 3일 전까지 부탁 드리며, 당일 노쇼의 경우 추후 행사 참여에 불이익을 받으실 수 있습니다.\n\n\n■ 문의\n- 다이닝스타 전용 고객센터 (1661-1496)\n- KB국민카드 고객센터 (1588-1688)\n\n※ 본 행사는 KB국민카드의 영업정책 및 제휴업체의 사정으로 변경 또는 중단될 수 있습니다.\n\n※ 준법감시인 심의필\n     181113-03598-LMS\n※수신거부:설정>PUSH알림","CATEGORY_CODE":"4","ICON_IMG":"1484704104939.png","DATE":"20181115113639","EXT":[{"value":"","key":"img"},{"value":"없음","key":"btn"},{"value":"","key":"lu"}]},{"MSG_ID":"278261821","TITLE":"KB국민카드 이벤트 안내","MSG":"(광고) [KB국민카드]\n이달의 혜택 모음!\n\n▶ 응모 + 더 많은 혜택 바로가기\nhttps://m.kbcard.com/e/267781\n\n■ Apple 제품 구매 시 8% 캐시백(응모필수)\n■ GS수퍼마켓 달콤한 빼빼로데이\n■ JMT를 찾아라~스타샵 5,000P 추가 적립\n■ 스피드메이트 타이어/정비 최대 25% 할인 \n■ 신나는 에버랜드 「월간 로☆라 코스타 축제」 신나는 할인!\n■ 서울랜드 자유이용권 너랑 나랑 더블 할인!\n▶ 나만의 브랜드 쇼핑!! 반짝반짝 이벤트!!\n바로가기 ☞\nhttps://m.kbcard.com/CXHIABNC0023.cms\n\n※ 꼭 알아두세요!\n혜택 제공 및 유의사항 등 세부내용은 각 행사별 모바일 페이지 또는 홈페이지 참조\n\n■ 문의\nKB국민카드 고객센터 (☎ 1588-1688)\n\n※ 본 행사는 KB국민카드의 영업정책 및 제휴업체의 사정으로 변경 또는 중단 될 수 있습니다.\n\n ※ 준법감시인 심의필\n181108-03569-PUH\n----------------------------\n일시불 할부전환 이벤트\nhttp://m.kbcard.com/e/267465\n----------------------------\n※수신거부:설정>PUSH알림","CATEGORY_CODE":"4","ICON_IMG":"1484704104939.png","DATE":"20181113114304","EXT":[{"value":"1541981126594.png","key":"img"},{"value":"없음","key":"btn"},{"value":"","key":"lu"}]},{"MSG_ID":"274611371","TITLE":"11월 해외이벤트","MSG":"(광고)[KB국민카드] 해외여행&해외직구 완전체 혜택  \n\n[행사①]------------------------\n해외직구도 해외여행도 최대 10만원 캐시백 [~'18.11.30] \n☞응모 바로가기\nhttps://m.kbcard.com/e/267639cn7000471477sn11046602300\n\n[행사②]--------------------------\n매월 최대 10만원! \n유니온페이와 함께하는 \n아마존, 아이허브, 샵밥, 익스피디아, 호텔스닷컴 등 9개 온라인 가맹점 10%캐시백! [~'18.12.31] \n☞응모 바로가기\nhttps://m.kbcard.com/e/266920cn7000471477sn11046602300\n\n[행사③]-------------------------\n지금 호텔스닷컴/익스피디아는 15% 할인 중[~'18.11.30] \n☞호텔스닷컴 행사 바로가기\nhttps://m.kbcard.com/e/267452\n☞익스피디아 행사 바로가기\nhttps://m.kbcard.com/e/267430\n\n[행사④]-------------------------\n해외수수료 전액 캐시백![~'18.11.30] \n☞비자카드 응모 바로가기\nhttps://m.kbcard.com/e/267647cn7000471477sn11046602300\n☞마스터카드 응모 바로가기\nhttps://m.kbcard.com/e/267646cn7000471477sn11046602300\n\n[행사⑤ ]-------------------------\n오플닷컴 최대 8% 오플포인트 적립대잔치 [~'18.11.30] \n☞자세히보기\nhttps://m.kbcard.com/e/267689\n\n[행사⑥ ]-------------------------\n해외에서도 같은 값이면, \n최대 12~2개월 무이자 할부 [~'18.11.30] \n☞행사 바로가기\nhttps://m.kbcard.com/e/267582\n\n■ 꼭 알아두세요\n- 반드시 이용 전 모바일 페이지 및 홈페이지 통해 이용조건 및 유의사항 확인 필수\n\n■ 문의\nKB국민카드 고객센터 (☎1588-1688)\n\n※ 본 행사는 KB국민카드의 영업정책 및 제휴업체의 사정으로 변경 또는 중단될 수 있습니다.\n\n※ 준법감시인 심의필\n     181102-03499-LMS\n※수신거부:설정>PUSH알림","CATEGORY_CODE":"4","ICON_IMG":"1484704104939.png","DATE":"20181109132505","EXT":[{"value":"","key":"img"},{"value":"없음","key":"btn"},{"value":"","key":"lu"}]},{"MSG_ID":"271739877","TITLE":"「Tasting+α」와인의향기에취하다","MSG":"(광고)[KB국민카드]\n알파원카드X와인클래스\n\n워커힐에서의 호텔식사, 와인클래스 그리고 기념품와인까지 챙겨가세요\n\n■ 기간 내 응모하고 KB국민 알파원카드로 합산 50만원 이상 이용 시\n 추첨을 통해 총 25명 선정 후 (동반1인 포함 50명) 와인 클래스 초청\n(이용금액 100만원이상 시 추첨 기회 1회 추가)\n■ 기간: 2018년10월15일(월) ~ 11월15일(목)\n■ <와인클래스>\n- 일정 : 2018년12월7일 (금)\n- 장소 : 워커힐 호텔 (서울 광진구 소재)\n- 주요일정\nㅇ 워커힐 호텔식사 [레몬 비네그레트로 맛을 낸 새우, 안심스테이크,그뤼에느 초콜렛, 와인 등]\nㅇ 와인클래스 [소믈리에 강연, 시향방법, 테이스팅 등]\nㅇ 기념품 증정 [와인1병]\n\n■응모 바로가기\nhttps://m.kbcard.com/e/267590cn7000461895sn11046592718\n\n■ 꼭 알아두세요\n- 당첨고객 및 동반1인 참여가능, 타인 양도 불가\n- 본인 참여 불가시 당첨 취소되며, 2순위 당첨자에게 참석 기회 제공됨\n- 2018.11월 27일(화)까지 연락 불가 시 자동 당첨 취소됨(이에 대한\n 대체 당첨 물품 제공 불가)\n- 제세공과금은 당사 부담\n- 당사 홍보자료 활용을 위한 사진과 영상 촬영 동의 필수\n- 이용금액은 2018. 11. 20(화)까지 매입된 전표를 반영하며, 취소 전표는 제외\n- 미성년자는 당첨자에서 제외\n- 클래스 일정 및 내용은 업체사정 및 KB국민카드 사정에 따라 변경 될수 있으며, 세부내용은 당첨자개별 통지\n\n■ 문의\nKB국민카드 고객센터 (☎1588-1688)\n\n※ 본 행사는 KB국민카드 영업정책 및 제휴업체의 사정으로 변경 또는 중단될 수 있습니다.\n※ 준법감시인 심의필 181011-03219-LMS\n※수신거부:설정>PUSH알림","CATEGORY_CODE":"4","ICON_IMG":"1484704104939.png","DATE":"20181106135207","EXT":[{"value":"","key":"img"},{"value":"없음","key":"btn"},{"value":"","key":"lu"}]},{"MSG_ID":"270821157","TITLE":"이랜드리테일 행사 안내","MSG":"(광고)[KB국민카드]\n이랜드리테일 창립 38주년기념\nKB국민카드 박*훈님께 드리는 혜택\n\n■ [혜택1] \n킴스클럽 돼지고기 반값\n(삼겹살/목심 1,190원, 뒷다리살/등심 490원)\n\n■ [혜택2]\n행사기간 중 합산 30만원/60만원이상 구매시 1만5천원/3만원 캐시백\n(기간중 1인1회)\n※ 캐시백입금일: 2018.11.30(금) 예정\n※ 일부 임대매장, 문화센터, 상품권가맹점 결제금액 제외\n※ 최종결제금액 기준이며, 캐시백 일자기준 유효회원에 한함\n\n■ [혜택3]\n① 38주년기념 38,000개의 행운을 드리는 경품 이벤트(사이판/괌 여행권/삼성UHD TV외)\n② 슈펜 30% / 인디고키즈, 멜본 20% 브랜드데이\n【이랜드리테일 창립행사 자세히 보기】\n☞https://bit.ly/2zjCzJU\n\n■ 기간: 2018.11.7(수)~11.11(일)\n■ 대상: KB국민카드 회원(KB국민 비씨, 선불카드 제외)\n■ 대상점: 이랜드리테일\n\n[+플러스혜택]\n- 5만원이상 구매시 2~6개월 무이자 할부(KB국민 체크, 기업, 비씨, 선불카드 제외)\n\n■ 꼭 알아두세요!\n- 자세한 내용은 현장에서 확인\n\n■ 문의\n- KB국민카드 고객센터 ☎1588-1688\n※ '보이는 ARS'\n☞ https://m.kbcard.com/i/CXHIAOPC0011\n\n※ 본 행사는 KB국민카드의 영업정책 및 제휴업체의 사정으로 변경 또는 중단될 수 있습니다.\n\n※ 준법감시인 심의필 181105-03512-LMS\n----------------------------\n일시불 할부전환 이벤트\nhttp://m.kbcard.com/e/267465\n----------------------------\n※수신거부:설정>PUSH알림","CATEGORY_CODE":"4","ICON_IMG":"1484704104939.png","DATE":"20181105144314","EXT":[{"value":"","key":"img"},{"value":"없음","key":"btn"},{"value":"","key":"lu"}]},{"MSG_ID":"270717857","TITLE":"전자랜드 KB국민카드 캐시백 행사","MSG":"(광고)[KB국민카드]\n전자랜드 창립 30주년 전국 동시세일!! KB국민카드로 혜택받고, 가전제품 장만하세요!!\n\n■ [혜택] \n①20만원 이상 포인트연계할부서비스 선약정하고 200/500/700/1,000만원 이상 결제시 10/20/30/40만원 캐시백\n②IPTV 통신상품 개통 및 행사품목 동시 구매시 최대 50만원 추가 캐시백\n - 행사품목 : TV/양문형냉장고/드럼세탁기/건조기/정수기 품목 각 행사모델 한정\n③삼성 초프리미엄 행사제품(TV/양문형냉장고/드럼세탁기) 동시 구매시 캐시백\n - 1품목/2품목/3품목 구매시 30/100/200만원 캐시백\n④김치냉장고 폐가전 반납하고, 새로 구매시 최대 5만원 추가 캐시백\n⑤5만원 이상 2~6개월/10개월, 100만원 이상 12개월 무이자할부\n\n■ 기간 : 2018.11.1(목)~11.30(금)\n■ 대상 : KB국민카드 회원(KB국민 체크, 기업, 비씨, 선불카드 제외)\n■ 행사점 : 전국 전자랜드 매장(단, 일부매장 제외)\n\n■ 꼭 알아두세요\n- 대상품목, 행사모델, 사은품, 행사조건 등 자세한 내용은 전자랜드 매장으로 문의\n- 캐시백은 해당물품 구입 후 승인 및 설치 다음달 말일 본인 카드 결제계좌로 입금예정\n- 취소 및 카드해지 시 캐시백 제외\n\n■ 문의\n- KB국민카드 고객센터(☎1588-1688)\n- 전자랜드 대표번호(☎1666-8000)\n\n※ 본 행사는 KB국민카드의 영업정책 및 제휴업체의 사정으로 변경 또는 중단될 수 있습니다.\n※ 준법감시인 심의필 181102-03500-LMS\n\n----------------------------\n일시불 할부전환 이벤트\nhttp://m.kbcard.com/e/267465\n----------------------------\n※수신거부:설정>PUSH알림","CATEGORY_CODE":"4","ICON_IMG":"1484704104939.png","DATE":"20181105135418","EXT":[{"value":"","key":"img"},{"value":"없음","key":"btn"},{"value":"","key":"lu"}]}]) });
    } else {
      self1.cordovaAuth().then(() => {

        var self2 = self1;
        self1.cordovaMessages().then((res) =>{
          console.log(res.LIST);
          self2.setState({ list: self2.state.list.concat(res.LIST) });
        });

      }).catch(err => console.log("err: ", err));
    }

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
