import React from 'react';
import '../css/push.css';
import PushRadioSel from './PushRadioSel';
import PushResult from './PushResult';
import PushDelete from './PushDelete';
import PushList from './PushList';
import PushEvent from './PushEvent';
import ReactRefreshInfiniteTableView from '../../lib/ReactRefreshInfiniteTableView.js';

export default class Content extends ReactRefreshInfiniteTableView  {

    constructor(props) { super(props) }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.todos !== nextProps.todos;
    }

    render() {
        return (
            <div id="content" onScroll={this.viewDidScroll}>
                <section className="container" >
                    <div className="pushArea">
                        {/* 카테고리 선택 */}
                        <PushRadioSel />
                        {/* 갯수/삭제버튼 */}
                        <PushResult />
                        {/* 삭제 레이어 */}
                        <PushDelete />
                        {/* 목록 */}
                        <PushList dataSource={this.props.list}
                            onScrollToTop={this.props.handleScrollToTop}
                            onScrollToBottom={this.props.handleScrollToBottom}
                        />
                        {/* 이벤트 레이어 */}
                        <PushEvent />
                    </div>
                </section>
            </div>
        );
    }
}