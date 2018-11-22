import React, { Component } from 'react';
import '../css/push.css';

class PushRadioSel extends Component {

    constructor(props) { super(props) }
    render() {

        return (
        <ul className="pushRadioSel">
            <li className="checked">
                <label htmlFor="pushSel1">승인</label>
                <input type="radio" id="pushSel1" name="pushRadio" value="1" checked={this.props.category === '2'} 
                      onChange={this.props.handleCategoryToChange}  />
            </li>
            <li>
                <label htmlFor="pushSel2">이벤트</label>
                <input type="radio" id="pushSel2" name="pushRadio" value="4" checked={this.props.category === '4'} 
                      onChange={this.props.handleCategoryToChange} />
                {/*<span className="num">99</span>*/}
            </li>
            <li>
                <label htmlFor="pushSel3">안내</label>
                <input type="radio" id="pushSel3" name="pushRadio" value="2" checked={this.props.category === '2'} 
                      onChange={this.props.handleCategoryToChange} />
            </li>
            <li>
                <label htmlFor="pushSel4">공지</label>
                <input type="radio" id="pushSel4" name="pushRadio" value="3" checked={this.props.category === '1'} 
                      onChange={this.props.handleCategoryToChange} />
            </li>
        </ul>
            
        );
    }
}

export default PushRadioSel;