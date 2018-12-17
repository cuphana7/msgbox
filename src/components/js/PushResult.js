import React, { Component } from 'react';
import '../css/push.css';
import $ from 'jquery'

class PushResult extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.cnts !== nextProps.cnts || this.props.category !== nextProps.category;
    }

    componentDidMount() {
        //삭제버튼 클릭 시 UI
        $('.delete').on('click', function () {
            $('.pushArea').addClass('delete');
            $('.pushDelete').addClass('deleteFlag');
        });

        //상단 삭제 탭 닫을 때 UI
        $('.pushDelete .close').on('click', function () {
            $("input[type=checkbox]").prop("checked", false);
            $('.pushArea').removeClass('delete');
            $('.pushDelete').removeClass('deleteFlag');
        });
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