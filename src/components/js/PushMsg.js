import React, { Component } from 'react';
import '../css/push.css';
import $ from 'jquery'

/**
 * 1. 메시지 개행 UI
 * 2. 확대 축소 UI
 * 3. 자세히 보기 UI
 */
export default class PushMsg extends Component  {

    constructor(props) {
        super(props)
        this.state = {
            openMsg: false
        }
        this.eleMsgOpen = React.createRef();
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
        const self = this;
        const imageUrl = (img) => {
            return "https://img2.kbcard.com/msg/cxv/template/system/"+img;
        }
        
        const msgToTag = this.props.msg.split("\n").map(function(item, index){
            return <React.Fragment>{item}<br/></React.Fragment>
        });

        const clickMsgOpen = (e) => {

            var thisEle = self.eleMsgOpen.current;
            //PUSH내용 초기 세팅
            var cont = $(thisEle).closest('.btnToggle').siblings('.cont'),
                contH = cont.children('p').outerHeight(),
                duration = contH > 500 ? contH : 500;

            if(!$(thisEle).hasClass('up')) {
                //PUSH내용 보임
                cont.css({display:'block',maxHeight:'none',height:60})
                
                contH = cont.children('p').outerHeight();
                duration = contH > 500 ? contH : 500;

                cont.css({height: contH, 'transition-duration':duration + 'ms'});	
            } else {
                //PUSH내용 닫힘
                cont.css({height: 60});
                setTimeout(function() {
                cont.css({display:'-webkit-box',maxHeight:60,height:'auto'});
                }, duration)
            }

            self.setState({ openMsg: !this.state.openMsg });
            e.preventDefault();
        }
        

        return (
            <div>
                
                {/* 이미지 배너 */}
                {this.props.ext[0].value !== "" ? 
                    <span className="banner">
                        <img src={imageUrl(this.props.ext[0].value)} alt="" />
                    </span>
                :""}
                {/* 메시지 내용 */}
                <div className="cont">
                    <p>{msgToTag}</p>
                </div>

                {/* 이미지 펼치기 버튼 */}
                { this.props.msg.split("\n").length > 3 ? 
                    <div className="btnToggle"><a href="#kbcard" ref={this.eleMsgOpen}  className={ this.state.openMsg ? "toggleUI up" : "toggleUI" } onClick={clickMsgOpen} ><span>이벤트 내용 펼쳐짐</span></a></div>
                : ""}

                {/*msgOpenBtn*/}
                
                {/* 링크 버튼 */}
                {this.props.ext.length === 3 && this.props.ext[2].value !== "" ? 
                <div className="eventBtn"><a href={this.props.ext[2].value} className="btnL btnWhite">자세히보기</a></div>
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