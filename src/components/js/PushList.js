import React, { Component } from 'react';
import '../css/push.css';
import PushMsg from '../js/PushMsg';

export default class PushList extends Component {


    shouldComponentUpdate(nextProps, nextState) {
        return this.props.dataSource !== nextProps.dataSource;
    }


    render() {

        const { dataSource, handleCheckedChange, checkedItems, authKey } = this.props;
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
        const blank = ( <div className="infoBox notImg"><p className="mt10">새로운 PUSH알림 내역이 없습니다.</p></div> );
        const setting = (<div className="pushInfo"><img src="https://img1.kbcard.com/LT/cxh/kbcard_img/common/ico/visual/80/ico_push_80.png" width="80" alt=""/>
                        <p>
                            PUSH占싯몌옙 占쏙옙占쏟스몌옙 占쏙옙청占싹시몌옙<br/>
                            占쌕억옙占쏙옙 占싱븝옙트, 占쌩울옙 占쏙옙占쏙옙占쏙옙占쏙옙占쏙옙<br/>
                            占쏙옙占쏙옙占� 占쌨아븝옙占쏙옙 占쏙옙 占쌍쏙옙占싹댐옙.<br/>
                            <br/>
                            占쏙옙청占쏙옙 占쏙옙占싹시몌옙 占쏙옙占쏙옙占쏙옙 占쏙옙占쏙옙占� <br/>
                            占쏙옙占쏙옙占쏙옙튼[ <img src="https://img1.kbcard.com/LT/cxh/kbcard_img/common/ico/visual/80/ico_setting_24_000_b.png" width="24" alt="占쏙옙占쏙옙占쏙옙튼 占싱뱄옙占쏙옙"/> ]占쏙옙 占쏙옙占쏙옙占쌍쇽옙占쏙옙.<br/>
                        </p>
                    </div>);


        
        var cells = (dataSource && dataSource.length > 0)?dataSource.map(function(item, index) {

            return <ul className={temperatureClassname(item.CATEGORY_CODE)} key={index}>
                        <li>
                            <strong className="tit">{item.TITLE}</strong>
                            <span className="date">{dateFormat(item.DATE)}</span>
                            <PushMsg msg={item.MSG} key={index}
                                ext={item.EXT} msgid={item.MSG_ID} handleCheckedChange={handleCheckedChange}
                                checkedItems={checkedItems}
                            />
                        </li>
                    </ul>
        }) : blank;

        
        return (
            <div className="pushWrap">
                {authKey === "AUTHFAIL" || authKey === "" ? setting : cells}
            </div>
        );
    }
}