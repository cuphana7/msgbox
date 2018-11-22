import React, { Component } from 'react';
import '../css/push.css';

/**
 * 1. 메시지 개행 UI
 * 2. 확대 축소 UI
 * 3. 자세히 보기 UI
 */
export default class PushMsg extends Component  {

    constructor(props) {
        super(props)
    }

    /*
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.dataSource !== nextProps.dataSource;
    }
    */
   renderSwitch(param) {
    switch(param) {
        case '1':
        return 'payment';
        case '2':
        return 'notice';
        case '3':
        return 'info';
        case '4':
        return 'event';
        default:
        return 'payment';
        }
    }

    
    

    render() {

        const imageUrl = (img) => {
            return "https://img2.kbcard.com/msg/cxv/template/system/"+img;
        }
        const replaceMsg = (msg) => {
            return msg.replace(/\\n/gi,"<br/>");
        }
        const msgToTag = this.props.msg.split("\n").map(function(item, index){
            return <Fragment>{item}<br/></Fragment>
        });

        const msgOpenBtn = ()=>{ 
            const click = (e) => {
                this.setState({
                    openMsg: !this.state.openMsg
                  });
            }
            return this.props.msg.split("\n")>3? <div className="btnToggle"><a href="#kbcard" className={ this.state.openMsg ? "toggleUI up" : "toggleUI" } onClick={click} ><span>이벤트 내용 펼쳐짐</span></a></div>
            : ""
        }


        return (
            <div>
                
                {/* 이미지 배너 */}
                {this.props.ext[0].value !="" ? 
                    <span className="banner">
                        <img src={imageUrl(this.props.ext[0].value)} />
                    </span>
                :""}
                {/* 메시지 내용 */}
                <div className="cont">
                    {msgToTag}
                </div>

                {/* 이미지 펼치기 버튼 */}
                {msgOpenBtn}
                
                {/* 링크 버튼 */}
                {this.props.ext.length == 4 ? 
                <div className="eventBtn"><a href={this.props.ext[3]} className="btnL btnWhite">자세히보기</a></div>
                :""}
                
                {/* 삭제 클릭시 보이는 UI */}
                <div className="select">
                    <label htmlFor="sel1_1">해당 알림 삭제하기</label>
                    <input type="checkbox" id="sel1_1" name="" className="inp1" />
                </div>

            </div>
        );
    }
}