import React, { Component } from 'react';
import '../css/push.css';

class PushRadioSel extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.todos !== nextProps.todos;
    }

    render() {

        return (
        <ul className="pushRadioSel">
            <li className="checked">
                <label htmlFor="pushSel1">승인</label>
                <input type="radio" id="pushSel1" name="pushRadio" />
            </li>
            <li>
                <label htmlFor="pushSel2">이벤트</label>
                <input type="radio" id="pushSel2" name="pushRadio" />
                <span className="num">99</span>
            </li>
            <li>
                <label htmlFor="pushSel3">안내</label>
                <input type="radio" id="pushSel3" name="pushRadio" />
            </li>
            <li>
                <label htmlFor="pushSel4">공지</label>
                <input type="radio" id="pushSel4" name="pushRadio" />
                <span className="num">1</span>
            </li>
        </ul>
            
        );
    }
}

export default PushRadioSel;