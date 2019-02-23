import React from 'react';
import '../css/push.css';
import PushRadioSel from './PushRadioSel';
import PushResult from './PushResult';
import PushDelete from './PushDelete';
import PushList from './PushList';
import PushEvent from './PushEvent';
import ReactRefreshInfiniteTableView from '../../lib/ReactRefreshInfiniteTableView.js';

export default class Content extends ReactRefreshInfiniteTableView {

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.list !== nextProps.list;
    }

    render() {
        const { handleCategoryToChange, category, list, handleDeleteClick, handleCheckedAllClick, cnts, unReads, authKey, reqMessages, isAppcard, isLocal } = this.props;
        return (
            <React.Fragment>
                <div id="content" className="content scrollArea" onScroll={this.viewDidScroll} >
                    <section className="container" >
                        <div className="pushArea">
                            {/* 카테고리 선택 */}
                            <PushRadioSel handleCategoryToChange={handleCategoryToChange}
                                category={category} unReads={unReads} isAppcard={isAppcard} />
                            {/* 갯수/삭제버튼 
                            <PushResult cnts={cnts} category={category} />
                            */}

                            {/* 목록 */}
                            <PushList dataSource={list} reqMessages={reqMessages} authKey={authKey} />
                        </div>
                    </section>
                </div>
                {/* 삭제 레이어 */}
                <PushDelete handleDeleteClick={handleDeleteClick} handleCheckedAllClick={handleCheckedAllClick} />

                {/* 이벤트 레이어 */}
                {isAppcard === true ? "" 
                : <PushEvent isLocal={isLocal}/>}
                
                <div id="listMenu" className="layerWrap newType">
                    <div className="popTop">
                        <strong >다른 작업 선택</strong>
                    </div>
                    <div classNamelass="popCont">
                        <ul className="more_list">
                            <li><a href="javascript:" className="delete"><span className="img"><img src="https://img1.kbcard.com/LT/cxh/kbcard_img/common/ico/basic/24/ico_trash_24.png" alt="" /></span>삭제</a></li>
                            <li><a href="javascript:"><span className="img"><img src="https://img1.kbcard.com/LT/cxh/kbcard_img/common/ico/basic/24/ico_share_24.png" alt="" /></span>공유</a></li>
                        </ul>
                    </div>
                    <span className="popClose"><a href="javascript:" role="button" aria-label="닫기">닫기</a></span>
                </div>

                <div className="dim disnone"></div>
            </React.Fragment>
        );
    }
}