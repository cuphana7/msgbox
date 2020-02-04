import React, { Component } from 'react';
import '../css/push.css';
import lottie from 'lottie-web';
import pushNo_json from '../json/pushNo.json';

let animObj = null;
export default class PushListEmpty extends Component {

    constructor(props) { super(props); }

    componentDidMount() {
        animObj = lottie.loadAnimation({
            container: this.animBox, // the dom element that will contain the animation
            renderer: 'svg',
            loop: false,
            autoplay: false,
            animationData: pushNo_json // the path to the animation json
        });

        animObj.onComplete = function(){ animObj.goToAndPlay(40, true) }

        setTimeout(
            function() { console.log("run!!",animObj);animObj.play(); },
            500
        );
    }
    
    render() {
        return (
            <div className="infoBox lottieImg">
                 <div id="mainVisual" style={{width: 120, height: 120, margin: '0 auto 16px'}} ref={ ref => this.animBox = ref}></div>
                 <p className="mt10">새로운 PUSH알림 내역이 없습니다.</p>
             </div>
        );
    }
}