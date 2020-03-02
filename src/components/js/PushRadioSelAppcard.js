import React, { Component } from 'react';
import '../css/push.css';
import $ from 'jquery'

class PushRadioSelAppcard extends Component {

    
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.category !== nextProps.category;
    }
    componentDidMount() {
        $('.pushRadioSelAppcard input').change(function () {
            $(this).prop('checked', true).parent('li').addClass('checked').siblings('.checked').removeClass('checked').find('input').prop('checked', false);
        });
    }
    
    

    render() {
        const { category, handleCategoryToChange } = this.props;

        return (
            <ul className="pushRadioSelAppcard">
                <li className={category === '4' ? "checked" : ""}>
                    <label htmlFor="pushSel2">이벤트</label>
                    <input type="radio" id="pushSel2" name="pushRadio" value="4" checked={category === '4'}
                        onChange={(e) => handleCategoryToChange(e)} />
                </li>
                <li className={category === '2' ? "checked" : ""}>
                    <label htmlFor="pushSel3">안내</label>
                    <input type="radio" id="pushSel3" name="pushRadio" value="2" checked={category === '2'}
                        onChange={(e) => handleCategoryToChange(e)} />
                </li>
                <li className={category === '3' ? "checked" : ""}>
                    <label htmlFor="pushSel4">공지</label>
                    <input type="radio" id="pushSel4" name="pushRadio" value="3" checked={category === '3'}
                        onChange={(e) => handleCategoryToChange(e)} />
                </li>
            </ul>

        );
    }
}

export default PushRadioSelAppcard;