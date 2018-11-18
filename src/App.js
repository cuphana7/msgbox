import React, { Component } from 'react';
import MsgBoxTemplate from './components/js/MsgBoxTemplate';
import PushRadioSel from './components/js/PushRadioSel';
import PushResult from './components/js/PushResult';
import PushDelete from './components/js/PushDelete';
import PushList from './components/js/PushList';
import PushEvent from './components/js/PushEvent';
import axios from 'axios';

const API = {
  "auth_key" : "/sample-data/messages-req.json",
  "url_auth" : "/sample-data/authentication-res.json",
  "url_messages" : "/sample-data/messages-res.json"
};

class App extends Component {

  
  constructor(props) {
    super(props)
    var data1 = [];

    this.state = {
      api: {
        "auth_key" : "/sample-data/messages-req.json",
        "url_auth" : "/sample-data/messages-req.json",
        "url_messages" : "/sample-data/messages-res.json"
      },
      data1: data1
    }

    this.handleScrollToTop1 = this.handleScrollToTop1.bind(this)
    this.handleScrollToBottom1 = this.handleScrollToBottom1.bind(this)
    this.reqMessages = this.reqMessages.bind(this)
  }

  componentDidMount() {
    this.reqMessages(null);
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
        />
        {/* 이벤트 레이어 */}
        <PushEvent />
      </MsgBoxTemplate>
    );
  }


  handleScrollToTop1(completed) {
    this.reqMessages();
    completed();
    /*
    // refresh
    setTimeout(function () {
      var data = this.reqMessages()
      console.log(data)

      // completed is a callback to tell infinite table to hide loading indicator
      // must invcke completed before setState
      completed()
      this.setState({ data1: data })

    }.bind(this), 100)
    */
  }

  handleScrollToBottom1(completed) {
    // load more
    setTimeout(function () {
      var newData = this.moreData(this.state.data1)
      console.log(newData)

      completed()
      this.setState({ data1: newData })

    }.bind(this), 200)
  }



  moreData(oldData) {
    var newData = Object.assign([], oldData)
    for (var i = 0; i <= 20; i++) {
      newData.push({
        "MSG_ID" : "",
         "TITLE" : "",
         "MSG" : "메시지 입니다.",
         "EXT" : [],
         "CATEGORY_CODE" : "",
         "ICON_IMG" : "",
         "DATE" : ""
     })
    }
    return newData
  }

  initData() {
    var data = []
    for (var i = 0; i < 20; i++) {
      data.push(i)
    }
    return data
  }

  checkAuth () {
    return axios.get("/sample-data/authentication-res.json",
    {params:{dd:"dd"}}
    )
    .then((response) => {
        console.log('2. server response:' + response.data.DATA.AUTHKEY);
    });
  }

  reqMessages(reqJson) {
    this.checkAuth().then((returnVal) => {
      axios.get("/sample-data/messages-res.json").then(response => {
        console.log(response.data);
        //this.completed();
        this.setState({ data1: response.data.DATA });
      });
   }).catch(err => console.log("Axios err: ", err))
    
  }


}

export default App;
