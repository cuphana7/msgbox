import React, { Component } from 'react';
import '../css/push.css';

class PushRadioSel extends Component {

    constructor(props) {
        super(props)
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.authReq.AUTHKEY !== nextProps.authReq.AUTHKEY) {
          this.props.requestCount(nextProps.authReq.AUTHKEY);
        }
      }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.authReq != "" && nextProps.authReq != "AUTHFAIL") {
            
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.unReads !== nextProps.unReads;
    }

    render() {
        const { category, handleCategoryToChange, unReads } = this.props;
        const getCnt = (no) => {
            const arrNo = no - 1
            if (unReads && unReads.length > arrNo && unReads[arrNo].count) return unReads[arrNo].count
            else "";
        }

        const getCntView = (no) => {
            const arrNo = no - 1
            if (unReads && unReads.length > arrNo && unReads[arrNo].count) return "num";
            else return "skip num";
        }


        return (
            <ul className="pushRadioSel">
                <li className={category === '1' ? "checked" : ""}>
                    <label htmlFor="pushSel1">승인</label>
                    <input type="radio" id="pushSel1" name="pushRadio" value="1" checked={category === '1'}
                        onChange={handleCategoryToChange} />
                    <span className={getCntView(1)}>{getCnt(1)}</span>
                </li>
                <li className={category === '4' ? "checked" : ""}>
                    <label htmlFor="pushSel2">이벤트</label>
                    <input type="radio" id="pushSel2" name="pushRadio" value="4" checked={category === '4'}
                        onChange={handleCategoryToChange} />
                    <span className={getCntView(4)}>{getCnt(4)}</span>
                </li>
                <li className={category === '2' ? "checked" : ""}>
                    <label htmlFor="pushSel3">안내</label>
                    <input type="radio" id="pushSel3" name="pushRadio" value="2" checked={category === '2'}
                        onChange={handleCategoryToChange} />
                    <span className={getCntView(3)}>{getCnt(2)}</span>
                </li>
                <li className={category === '3' ? "checked" : ""}>
                    <label htmlFor="pushSel4">공지</label>
                    <input type="radio" id="pushSel4" name="pushRadio" value="3" checked={category === '3'}
                        onChange={handleCategoryToChange} />
                    <span className={getCntView(3)}>{getCnt(3)}</span>
                </li>
            </ul>

        );
    }
}

export default PushRadioSel;