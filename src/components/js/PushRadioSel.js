import React, { Component } from 'react';
import '../css/push.css';
import $ from 'jquery'

class PushRadioSel extends Component {

    
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.unReads !== nextProps.unReads || this.props.category !== nextProps.category;
    }
    componentDidMount() {
        $('.pushRadioSel input').change(function () {
            $(this).prop('checked', true).parent('li').addClass('checked').siblings('.checked').removeClass('checked').find('input').prop('checked', false);
        });
    }
    
    

    render() {
        const { category, handleCategoryToChange, unReads } = this.props;

        return (
            <ul className="pushRadioSel">
                <li className={category === '1' ? "checked" : ""}>
                    <label htmlFor="pushSel1">승인</label>
                    <input type="radio" id="pushSel1" name="pushRadio" value="1" checked={category === '1'}
                        onChange={handleCategoryToChange} />
                    <span className={unReads.cate1*1 > 0 ? "num":"skip num"}>{unReads.cate1}</span>
                </li>
                <li className={category === '4' ? "checked" : ""}>
                    <label htmlFor="pushSel2">이벤트</label>
                    <input type="radio" id="pushSel2" name="pushRadio" value="4" checked={category === '4'}
                        onChange={handleCategoryToChange} />
                    <span className={unReads.cate4*1 > 0 ? "num":"skip num"}>{unReads.cate4}</span>
                </li>
                <li className={category === '2' ? "checked" : ""}>
                    <label htmlFor="pushSel3">안내</label>
                    <input type="radio" id="pushSel3" name="pushRadio" value="2" checked={category === '2'}
                        onChange={handleCategoryToChange} />
                    <span className={unReads.cate2*1 > 0 ? "num":"skip num"}>{unReads.cate2}</span>
                </li>
                <li className={category === '3' ? "checked" : ""}>
                    <label htmlFor="pushSel4">공지</label>
                    <input type="radio" id="pushSel4" name="pushRadio" value="3" checked={category === '3'}
                        onChange={handleCategoryToChange} />
                    <span className={unReads.cate3*1 > 0 ? "num":"skip num"}>{unReads.cate3}</span>
                </li>
            </ul>

        );
    }
}

export default PushRadioSel;