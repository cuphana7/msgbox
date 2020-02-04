import React, { Component } from 'react';
import '../css/push.css';
import PushMsg from '../js/PushMsg';
import PushListEmpty from '../js/PushListEmpty';
import PushListSetting from '../js/PushListSetting';


export default class PushList extends Component {


    constructor(props) {
        super(props);
        this.state = {isStopped: true, isPaused: false};
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.dataSource !== nextProps.dataSource;
    }
    componentDidMount() {
        //call the loadAnimation to start the animation
    }
    

    render() {

        const { dataSource, authKey, setShareContent } = this.props;
        function temperatureClassname(temp){
            const prefix = 'pushList '
          
            switch (temp) {
              case '1': return prefix + 'payment'
              case '4': return prefix + 'event'
              case '3': return prefix + 'info'
              case '2': return prefix + 'notice'
              default: return prefix + 'payment'
            }
        }
        
        function dateFormat(dt) {
            return dt.substr(2,2)+"."+dt.substr(4,2)+"."+dt.substr(6,2)+" | "+dt.substr(8,2)+":"+dt.substr(10,2)+":"+dt.substr(12,2);
        }
        function dateFormatYMD(dt) {
            return dt.substr(2,2)+"."+dt.substr(4,2)+"."+dt.substr(6,2);
        }


        

        let setting = (<div className="pushInfo">
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

        
        var cells = (dataSource && dataSource.length > 0)? dataSource.map(function(item, index) {

            const jsx = <ul className={temperatureClassname(item.CATEGORY_CODE)} key={index}>
                            <li>
                                <strong className="tit">{item.TITLE}</strong>
                                <span className="date">{dateFormat(item.DATE)}</span>
                                <PushMsg msg={item.MSG} key={index} setShareContent={setShareContent}
                                    ext={item.EXT} msgid={item.MSG_ID}
                                />
                            </li>
                        </ul>
            return jsx;

        }) : "";

        return (
            <div className="pushWrap">
                
                {authKey === "" ? "" 
                 : authKey === "AUTHFAIL" ? 
                    <PushListSetting/>
                    : dataSource && dataSource.length > 0 ?
                        dataSource.map(function(item, index) {
                            const jsx = <ul className={temperatureClassname(item.CATEGORY_CODE)} key={index}>
                                            <li>
                                                <strong className="tit">{item.TITLE}</strong>
                                                <span className="date">{dateFormat(item.DATE)}</span>
                                                <PushMsg msg={item.MSG} key={index} setShareContent={setShareContent}
                                                    ext={item.EXT} msgid={item.MSG_ID}
                                                />
                                            </li>
                                        </ul>
                            return jsx;
                
                        })
                 : <PushListEmpty/> 
                 }
                 
            </div>
        );
    }
}