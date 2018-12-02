import React, { Component } from 'react';
import '../css/push.css';

class PushResult extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.cnts !== nextProps.cnts || this.props.category !== nextProps.category;
    }

    render() {
        const {category, cnts} = this.props;
        return (
            <div className="pushResult">
                <span className="all">전체 <em className="fc8">{cnts["cate"+category]}</em>개</span>
                <button className="delete">삭제</button>
            </div>
        );
    }
}

export default PushResult;