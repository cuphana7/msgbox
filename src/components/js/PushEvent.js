import React, { Component } from 'react';
import '../css/push.css';

class PushEvent extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.eventList !== nextProps.eventList;
    }

    render() {
        const dataSource = this.props.eventList;
        var cells = (dataSource)?dataSource.map(function(item, index) {

            return <li id="evt267435">
                        <a href='className'>
                            <span className="txt">
                                <strong className="tit">‘결혼하기 좋은 날’ 아이위크 웨딩 박람회</strong>
                                <span className="date">18.09.28 ~ 18.10.09</span>
                            </span>
                            <span className="thum"><img src="https://img1.kbcard.com/ST/img/cxc/event/mgr/banner/180913_iwork_Bnr_b.png" alt="" /></span>
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
                        <li id="evt267435">
                            <a href='className'>
                                <span className="txt">
                                    <strong className="tit">‘결혼하기 좋은 날’ 아이위크 웨딩 박람회</strong>
                                    <span className="date">18.09.28 ~ 18.10.09</span>
                                </span>
                                <span className="thum"><img src="https://img1.kbcard.com/ST/img/cxc/event/mgr/banner/180913_iwork_Bnr_b.png" alt="" /></span>
                            </a>
                        </li>
                        <li id="evt267434">
                            <a href='#kbcard'>
                                <span className="txt">
                                    <strong className="tit">공항라운지 무료입장권으로 해외공항에서 즐기는 여유</strong>
                                    <span className="date">18.09.21 ~ 18.10.14</span>
                                </span>
                                <span className="thum"><img src="https://img1.kbcard.com/ST/img/cxc/event/mgr/banner/180919_flightvip_Bnr_b.png" alt="" /></span>
                            </a>
                        </li>
                        <li id="evt267430">
                            <a href='#kbcard'>
                                <span className="txt">
                                    <strong className="tit">익스피디아는 15% 할인중</strong>
                                    <span className="date">18.09.19 ~ 18.11.30</span>
                                </span>
                                <span className="thum"><img src="https://img1.kbcard.com/ST/img/cxc/event/mgr/banner/180913_expedia_Bnr_b.png" alt="" /></span>
                            </a>
                        </li>
                        <li id="evt267419">
                            <a href='#kbcard'>
                                <span className="txt">
                                    <strong className="tit">Fall In Check! 5대 업종 캐시백</strong>
                                    <span className="date">18.09.18 ~ 18.10.18</span>
                                </span>
                                <span className="thum"><img src="https://img1.kbcard.com/ST/img/cxc/event/mgr/banner/basic/event_cashback_b.png" alt="" /></span>
                            </a>
                        </li>
                        <li id="evt267418">
                            <a href="#kbcard">
                                <span className="txt">
                                    <strong className="tit">VIP고객대상! 롯데호텔 『Autumn Days』 패키지 프로모션</strong>
                                    <span className="date">18.09.20 ~ 18.10.31</span>
                                </span>
                                <span className="thum"><img src="https://img1.kbcard.com/ST/img/cxc/event/mgr/banner/____180911_lottehotel_Bnr_b.png" alt="" /></span>
                            </a>
                        </li>
                        <li id="evt267414">
                            <a href='#kbcard'>
                                <span className="txt">
                                    <strong className="tit">풍성한 한가위! 풍성한 온라인 쇼핑!</strong>
                                    <span className="date">18.09.18 ~ 18.09.30</span>
                                </span>
                                <span className="thum"><img src="https://img1.kbcard.com/ST/img/cxc/event/mgr/banner/180912_hangawi_Bnr_b.png" alt="" /></span>
                            </a>
                        </li>
                        <li id="evt267412">
                            <a href='#kbcard'>
                                <span className="txt">
                                    <strong className="tit">내가 아는 해외온라인가맹점에선 최대 5만원 캐시백!</strong>
                                    <span className="date">18.09.17 ~ 18.10.31</span>
                                </span>
                                <span className="thum"><img src="https://img1.kbcard.com/ST/img/cxc/event/mgr/banner/180911_overseas_affiliate_Bnr_b.png" alt="" /></span>
                            </a>
                        </li>
                        <li id="evt267411">
                            <a href='#kbcard'>
                                <span className="txt">
                                    <strong className="tit">해외직구X비타트라 가을맞이 즉시할인! Vitatra 추천상품 특가!</strong>
                                    <span className="date">18.09.14 ~ 18.10.19</span>
                                </span>
                                <span className="thum"><img src="https://img1.kbcard.com/ST/img/cxc/event/mgr/banner/180911_vitatra_Bnr_b.png" alt="" /></span>
                            </a>
                        </li>
                        <li id="evt267410">
                            <a href='#kbcard'>
                                <span className="txt">
                                    <strong className="tit">여행하기 좋은 계절 秋캉스를 위한 최대 10만원 캐시백</strong>
                                    <span className="date">18.09.14 ~ 18.10.14</span>
                                </span>
                                <span className="thum"><img src="https://img1.kbcard.com/ST/img/cxc/event/mgr/banner/180906_cashback_Bnr_b.png" alt="" /></span>
                            </a>
                        </li>
                        <li id="evt267408">
                            <a href='#kbcard'>
                                <span className="txt">
                                    <strong className="tit">반려견 동반 프로그램 가을앤 休</strong>
                                    <span className="date">18.09.14 ~ 18.10.04</span>
                                </span>
                                <span className="thum"><img src="https://img1.kbcard.com/ST/img/cxc/event/mgr/banner/180911_withDog_Bnr_b.png" alt="" /></span>
                            </a>
                        </li>
                    </ul>
                    <div className="btn">
                        <a href="" className="btnL btnWhite">더 많은 혜택보기</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default PushEvent;