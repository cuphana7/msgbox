import React, { Component } from 'react';
import '../css/push.css';
import PushMsg from './PushMsg';
import lottie from 'lottie-web';
import pushYes_json from '../json/pushYes.json';

let animObj = null;
export default class PushListSetting extends Component {


    constructor(props) { super(props); }
    
    componentDidMount() {
        //call the loadAnimation to start the animation
        animObj = lottie.loadAnimation({
            container: this.animBox, // the dom element that will contain the animation
            renderer: 'svg',
            loop: false,
            autoplay: false,
            animationData: pushYes_json // the path to the animation json
        });

        animObj.onComplete = ()=>{ animObj.goToAndPlay(40, true) }

        setTimeout(
            () => { console.log("run!!",animObj);animObj.play(); },
            100
        );
    }
    

    render() {
        return (
            <div class="infoBox lottieImg">
                <div id="mainVisual" style={{width: 120, height: 120, margin: '0 auto 16px'}} ref={ ref => this.animBox = ref}></div>
                <strong class="fs2">카드사용 PUSH알림(무료)</strong>
                <p class="mt10">아직도 300원 내세요?<br/>무료로 알려주는 PUSH알림으로<br/>카드사용 내역을 확인하세요.</p>
            </div>
        );
    }
}