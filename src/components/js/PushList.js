import React, { Component } from 'react';
import '../css/push.css';
import PushMsg from '../js/PushMsg';


export default class PushList extends Component {


    shouldComponentUpdate(nextProps, nextState) {
        return this.props.dataSource !== nextProps.dataSource;
    }

    render() {

        const { dataSource, authKey } = this.props;
        function temperatureClassname(temp){
            const prefix = 'pushList '
          
            switch (temp) {
              case '1': return prefix + 'payment'
              case '2': return prefix + 'event'
              case '3': return prefix + 'info'
              case '4': return prefix + 'notice'
              default: return prefix + 'payment'
            }
        }
        
        function dateFormat(dt) {
            return dt.substr(2,2)+"."+dt.substr(4,2)+"."+dt.substr(6,2)+" | "+dt.substr(8,2)+":"+dt.substr(10,2)+":"+dt.substr(12,2);
        }
        function dateFormatYMD(dt) {
            return dt.substr(2,2)+"."+dt.substr(4,2)+"."+dt.substr(6,2);
        }

        const smsJoin = ( <div className="infoBox notImg">
                            <div className="pushInfo">
                                <img src="https://img1.kbcard.com/LT/cxh/kbcard_img/common/ico/visual/80/ico_push_80.png" width="80" alt="" />
                                <strong className="mb16">카드사용 PUSH알림(무료)</strong>
                                <p>아직도 300원 내세요?<br/>무료로 알려주는 PUSH알림으로<br/>카드사용내역 확인하세요!</p>
                            </div>
                            <div className="bottomArea">
                                <a href="" className="btnL btnGray">신청</a>
                            </div>
                          </div>);

        const eventJoin = ( <div className="infoBox notImg"><div className="pushInfo"><img src="https://img1.kbcard.com/LT/cxh/kbcard_img/common/ico/visual/80/ico_push_80.png" width="80" alt=""/><strong className="mb16">혜택 PUSH알림</strong><p>KB국민카드만의 다양한 이벤트를<br/>PUSH알림으로 받아보세요.</p></div><div className="bottomArea"><a href="" className="btnL btnGray">수신동의</a></div></div>);
        const empty = ( <div className="infoBox notImg"><p className="mt10">새로운 PUSH알림 내역이 없습니다.</p></div> );
        const setting = (<div className="pushInfo">
                            <img src="https://img1.kbcard.com/LT/cxh/kbcard_img/common/ico/visual/80/ico_push_80.png" width="80" alt="" />
                            <p>
                                PUSH알림 서비스를 신청하시면<br/>
                                다양한 이벤트, 중요 공지사항을<br/>
                                무료로 받아보실 수 있습니다.<br/>
                                <br/>
                                신청을 원하시면 오른쪽 상단의 <br/>
                                설정버튼[ <img src="https://img1.kbcard.com/LT/cxh/kbcard_img/common/ico/basic/24/ico_setting_24_000_b.png" width="24" alt="설정버튼 이미지" /> ]을 눌러주세요.<br/>
                            </p>
                        </div>);

        var preDt = "";
        var preDtJsx = (dt) => <li>{dateFormatYMD(dt)}</li>;
        var cells = (dataSource && dataSource.length > 0)? dataSource.map(function(item, index) {

            const jsx = <ul className={temperatureClassname(item.CATEGORY_CODE)} key={index}>
                            <li>
                                <strong className="tit">{item.TITLE}</strong>
                                <span className="date">{dateFormat(item.DATE)}</span>
                                <PushMsg msg={item.MSG} key={index}
                                    ext={item.EXT} msgid={item.MSG_ID}
                                />
                            </li>
                        </ul>
            preDt = dateFormatYMD(item.DATE);
            return jsx;
        }) : empty;

        
        return (
            <div className="pushWrap">
                {authKey === "" ? "" 
                : authKey === "AUTHFAIL" ? setting
                : cells}

            </div>
        );
    }
}