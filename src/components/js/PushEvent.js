import React, { Component } from 'react';
import '../css/push.css';
import axios from 'axios';

class PushEvent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            api: {
                "url_events": "/CXHIAOPC0041.cms?responseContentType=json"
              },
            el : []
        }
        this.requestEvent = this.requestEvent.bind(this)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.el !== nextProps.el;
    }

    componentDidMount() {
        //this.props.requestEvent();
        console.log(1111);
        this.requestEvent();
    }

    requestEvent() {
        let url = "";
        // 로컬 테스트용
        if (navigator.userAgent.indexOf("Windows") > -1 || navigator.userAgent.indexOf("Mac") > -1) url = "/sample-data/CXHIAOPC0041.cms.json";
        else url = this.state.api.url_events;
        axios.get(url)
          .then(response => {
            console.log(JSON.stringify(response.data));
            this.setState({ el: response.data[0].eventList });
          })
          .catch(response => {
            console.log("requestEvent catch:"+response);
            this.setState({ el: [] });
          });
      }

    render() {
        const { eventList, requestEvent } = this.props;
        const { el } = this.state;
        if(el) console.log("eventList.length="+el.length);
        var cells = (el && el.length > 0)?el.map(function(item, index) {

            var eventImgPath = "https://img1.kbcard.com/ST/img/cxc"+item.eventImgPath;
            var detailViewUrl = "/CXHIABNC0026.cms?evntSerno="+item.eventNo;

            return <li id={item.eventNo} key={index}>
                        <a href={detailViewUrl}>
                            <span className="txt">
                                <strong className="tit">{item.eventName}</strong>
                                <span className="date">{item.eventDate}</span>
                            </span>
                            <span className="thum"><img src={eventImgPath} alt="" /></span>
                        </a>
                    </li>
        }) : [];
        


        return (
            <div className="pushEvent">
                <div className="title">
                    <h2>고객님을 위한 이벤트 콕!</h2>
                    <div className="btnToggle"><a href="#kbcard" className="toggleUI white up" title="고객님을 위한 이벤트 리스트 보여짐"><span>이벤트 보기</span></a></div>
                </div>

                <div className="puchEventCont">
                    <ul className="eventList">
                        {cells}
                    </ul>
                    <div className="btn">
                        <a href="/CXHIABNC0022.cms" className="btnL btnWhite">더 많은 혜택보기</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default PushEvent;