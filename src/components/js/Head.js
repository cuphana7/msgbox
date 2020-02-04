import React, { Component } from 'react';

export default class Head extends Component {

    render() {
        const moveSetting = () =>{ window.location.href="CXHIAOPS0001.cms?newPushLibYn=Y"; }
        const exitPush = () => { window.kbmobile.ui.clearTop("main"); }

        return (
            <div className="topHead">
                <h1 className="fs4">PUSH알림</h1>
                {this.props.isAppcard === true ? "" :<div className="optionBtn" onClick={moveSetting} ><button type="button">설정</button></div>}
                <div className="backBtn" onClick={exitPush}><button type="button">이전페이지</button></div>
            </div>
        );
    }
}