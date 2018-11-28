import React, { Component } from 'react';
import '../css/push.css';

class PushEvent extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.eventList !== nextProps.eventList;
    }

    render() {
        const { eventList } = this.props;
        var cells = (eventList)?eventList.map(function(item, index) {

            var eventImgPath = "https://img1.kbcard.com/ST/img/"+item.eventImgPath;
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