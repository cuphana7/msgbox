import React, { Component } from 'react';
import '../css/push.css';
import $ from 'jquery'

/**
 * 1. 메시지 개행 UI
 * 2. 확대 축소 UI
 * 3. 자세히 보기 UI
 */
export default class PushMsg extends Component {

    constructor(props) {
        super(props)
        this.eleMsgOpen = React.createRef();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.msgid !== nextProps.msgid;
    }

    render() {
        const self = this;
        const { msg, ext, msgid } = this.props;
        const imageUrl = (img) => { return "https://img2.kbcard.com/msg/cxv/template/system/" + img; }

        const msgToTag = msg.split("\n").map(function (item, index) {
            var rUrlRegex = /(http(s)?:\/\/|www.)([a-z0-9\w]+\.*)+[a-z0-9]{2,4}([\/a-z0-9-%#?&=\w])+(\.[a-z0-9]{2,4}(\?[\/a-z0-9-%#?&=\w]+)*)*/gi;
            var arrUrls = item.match(rUrlRegex);

            var eles = [];
            if (arrUrls != null && arrUrls.length > 0) {
                var startIndexOf = 0 ;
                for (var i = 0; i < arrUrls.length; i++) {
                    eles.push(item.substring(startIndexOf, item.indexOf(arrUrls[i])));
                    eles.push(<a href={arrUrls[i]} key={"jsxUrl"+i} className="linkStyle"> {arrUrls[i]} </a>);
                    startIndexOf = item.indexOf(arrUrls[i]) + arrUrls[i].length;
                }
                if (item.length > startIndexOf) eles.push(item.substring(startIndexOf, item.length));
            }

            if (eles.length > 1)
                return <React.Fragment key={index}>{eles}<br /></React.Fragment>
            else
                return <React.Fragment key={index}>{item}<br /></React.Fragment>
        });

        const replaceUrl = (url) => {
            return url.replace("kbcardmain://openUrl", "");
        }

        const clickMsgOpen = (e) => {

            var thisEle = self.eleMsgOpen.current;
            $(thisEle).toggleClass('up');
            //PUSH내용 초기 세팅
            var cont = $(thisEle).closest('.btnToggle').siblings('.cont'),
                contH = cont.children('p').outerHeight(),
                duration = contH > 500 ? contH : 500;

            if ($(thisEle).hasClass('up')) {
                //PUSH내용 보임
                cont.css({ display: 'block', maxHeight: 'none', height: 60 })
                contH = cont.children('p').outerHeight();
                duration = contH > 500 ? contH : 500;
                cont.css({ height: contH, 'transition-duration': duration + 'ms' });
            } else {
                //PUSH내용 닫힘
                cont.css({ height: 60 });
                setTimeout(function () {
                    cont.css({ display: '-webkit-box', maxHeight: 60, height: 'auto' });
                }, duration)
            }
            e.preventDefault();
        }

        return (
            <div id="checkboxes">

                {/* 이미지 배너 */}
                {ext[0].value !== "" ?
                    <span className="banner">
                        <img src={imageUrl(ext[0].value)} alt="" />
                    </span>
                    : ""}
                {/* 메시지 내용 */}
                <div className="cont">
                    <p className="shortMsg">{msgToTag}</p>
                </div>

                {/* 이미지 펼치기 버튼 */}
                {msg.split("\n").length > 6 ?
                    <div className="btnToggle"><a href="#kbcard" ref={this.eleMsgOpen} className="toggleUI" onClick={clickMsgOpen} ><span>이벤트 내용 펼쳐짐</span></a></div>
                    : ""}

                {/*msgOpenBtn*/}

                {/* 링크 버튼 */}
                {ext.length === 3 && ext[2].value !== "" ?
                    <div className="eventBtn"><a href={replaceUrl(ext[2].value)} className="btnL btnWhite">자세히보기</a></div>
                    : ""}

                {/* 삭제 클릭시 보이는 UI */}
                <div className="select">
                    <label htmlFor={"push" + msgid}>해당 알림 삭제하기</label>
                    <input type="checkbox" id={"push" + msgid} name={msgid} className="inp1" value={msgid} />
                </div>

            </div>
        );
    }
}