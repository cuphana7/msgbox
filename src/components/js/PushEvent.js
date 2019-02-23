import React, { Component } from 'react';
import '../css/push.css';
import axios from 'axios';
import $ from 'jquery'

class PushEvent extends Component {

    constructor(props) {
        super(props)
        this.api = { "url_events": "/CXHIAOPC0041.cms?responseContentType=json" }
        this.state = {
            el: []
        }
        this.requestEvent = this.requestEvent.bind(this)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.el !== nextProps.el;
    }

    componentDidMount() {
        this.requestEvent();
        //이벤트 리스트 토글 UI
        $('.pushEvent .toggleUI').on('click', function (e) {
            e.preventDefault();
            var $this = $(this);

            setTimeout(function () {
                $this.toggleClass('up');
            }, 400)

            var move_num = $('.pushEvent').outerHeight() - 56;

            if ($(this).hasClass('up')) {
                //하단 이벤트 영역 슬라이드업
                $('.pushEvent').css({ webkitTransform: 'translate3d(0, -' + move_num + 'px, 0)', transition: 'all 500ms cubic-bezier(0.250, 0.250, 0.540, 0.930)' })
                $('.dim').fadeIn().closest('body').css({ overflow: 'hidden' });
            } else {
                //하단 이벤트 영역 슬라이드다운
                $('.pushEvent').css({ webkitTransform: 'translate3d(0, 0, 0)', transition: 'all 500ms cubic-bezier(0.250, 0.250, 0.540, 0.930)' })
                $('.dim').fadeOut().closest('body').css({ overflow: 'auto' });;
            }
        });
        //하단 이벤트 영역 초기 세팅
        $('.puchEventCont .eventList').css({ height: $(window).outerHeight() - 281 }).closest('.pushEvent').css({ bottom: ($('.pushEvent').outerHeight() - 56) * -1 })
    }

    requestEvent() {
        let url = "";
        // 로컬 테스트용
        if (this.props.isLoacl) url = "/sample-data/CXHIAOPC0041.cms.json";
        else url = this.api.url_events;
        axios.get(url)
            .then(response => {
                //console.log(JSON.stringify(response.data));
                this.setState({ el: response.data[0].eventList });
            })
            .catch(response => {
                console.log("requestEvent catch:" + response);
                this.setState({ el: [] });
            });
    }

    render() {
        const { el } = this.state;

        var cells = (el && el.length > 0) ? el.map(function (item, index) {

            var eventImgPath = "https://img1.kbcard.com/ST/img/cxc" + item.eventImgPath;
            var detailViewUrl = "/CXHIABNC0026.cms?evntSerno=" + item.eventNo;

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
                    <ul className="eventList scrollArea">
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