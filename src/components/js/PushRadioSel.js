import React, { Component } from 'react';
import '../css/push.css';

class PushRadioSel extends Component {

    render() {
        const { category, handleCategoryToChange } = this.props;
        return (
        <ul className="pushRadioSel">
            <li className={category === '1' ? "checked" : ""}>
                <label htmlFor="pushSel1">승인</label>
                <input type="radio" id="pushSel1" name="pushRadio" value="1" checked={category === '1'} 
                      onChange={handleCategoryToChange}  />
            </li>
            <li className={category === '4' ? "checked" : ""}>
                <label htmlFor="pushSel2">이벤트</label>
                <input type="radio" id="pushSel2" name="pushRadio" value="4" checked={category === '4'} 
                      onChange={handleCategoryToChange} />
                {/*<span className="num">99</span>*/}
            </li>
            <li className={category === '2' ? "checked" : ""}>
                <label htmlFor="pushSel3">안내</label>
                <input type="radio" id="pushSel3" name="pushRadio" value="2" checked={category === '2'} 
                      onChange={handleCategoryToChange} />
            </li>
            <li className={category === '3' ? "checked" : ""}>
                <label htmlFor="pushSel4">공지</label>
                <input type="radio" id="pushSel4" name="pushRadio" value="3" checked={category === '3'} 
                      onChange={handleCategoryToChange} />
            </li>
        </ul>
            
        );
    }
}

export default PushRadioSel;