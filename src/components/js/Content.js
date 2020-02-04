import React from 'react';
import '../css/push.css';
import PushRadioSel from './PushRadioSel';
import $ from 'jquery'
import PushList from './PushList';
import ReactRefreshInfiniteTableView from '../../lib/ReactRefreshInfiniteTableView.js';

export default class Content extends ReactRefreshInfiniteTableView {

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.list !== nextProps.list;
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

        //$("#content").scroll(this.viewDidScroll);
        console.log(document.getElementById("content"));
        console.log(this.viewDidScroll);
        document.addEventListener("scroll", this.viewDidScroll, { passive: true });

        /*
        function(){
            this.console.log($(window).scrollTop());
            if  ($(window).scrollTop() == $(document).height() - $(window).height()){
              this.console.log("dddd");
            }
        }
        */
    }

    render() {
        const { handleCategoryToChange, category, list, setShareContent, authKey, reqMessages, isAppcard } = this.props;

        return (
            
                <div id="content" className="content scrollArea" onScroll={this.viewDidScroll} >
                    <section className="container" >
                        <div className="pushArea">
                            {/* 카테고리 선택 */}
                            <PushRadioSel handleCategoryToChange={handleCategoryToChange}
                                category={category} isAppcard={isAppcard} />
                            {/* 목록 */}
                            <PushList dataSource={list} reqMessages={reqMessages} authKey={authKey} setShareContent={setShareContent}/>
                        </div>
                    </section>
                </div>
        );
    }
}