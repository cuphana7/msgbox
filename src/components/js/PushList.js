import React from 'react';
import '../css/push.css';
// use default loading spinners
import ReactRefreshInfiniteTableView from '../../lib/ReactRefreshInfiniteTableView.js'

export default class PushList extends ReactRefreshInfiniteTableView  {

    constructor(props) {
        super(props)
    }

    /*
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.dataSource !== nextProps.dataSource;
    }
    */

    render() {
        var cells = (this.props.dataSource)?this.props.dataSource.map(function(item, index) {
            return <ul className="pushList payment" key={index}>
                <li>
                    <strong className="tit">알파원카드 알림</strong>
                    <span className="date">18.08.29 | 18:26:32</span>

                    <div className="cont">
                            {item.MSG}
                    </div>

                    <div className="select">
                        <label htmlFor="sel1_1">해당 알림 삭제하기</label>
                        <input type="checkbox" id="sel1_1" name="" className="inp1" />
                    </div>
                </li>
            </ul>
        }) : [];

        return (
            <div className="pushWrap" onScroll={this.viewDidScroll}>
                {cells}
            </div>
        );
    }
}