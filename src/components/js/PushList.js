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

   renderSwitch(param) {
    switch(param) {
        case '1':
        return 'payment';
        case '2':
        return 'notice';
        case '3':
        return 'info';
        case '4':
        return 'event';
        default:
        return 'payment';
        }
    }

    render() {

        var renderSwitch = this.renderSwitch;
        var cells = (this.props.dataSource)?this.props.dataSource.map(function(item, index) {
            
            function temperatureClassname(temp){
                const prefix = 'pushList '
              
                switch (temp) {
                  case '1': return prefix + 'payment'
                  case '2': return prefix + 'event'
                  case '3': return prefix + 'info'
                  case '4': return prefix + 'notice'
                }
            }
            function imageUrl(val) {
                return "https://img2.kbcard.com/msg/cxv/template/system/"+val;
            }

            return <ul className={temperatureClassname(item.CATEGORY_CODE)} key={index}>
                <li>
                    <strong className="tit">{item.TITLE}</strong>
                    <span className="date">{item.DATE}</span>
                   
                    {item.EXT[0].value !="" ? 
                        <span className="banner">
                            <img src={imageUrl(item.EXT[0].value)} />
                        </span>
                    :""}

                    <div className="cont">
                        <p>
                        {item.MSG}
                        </p>
                    </div>

                    {(item.MSG.match(/<br\/>/g) || []).length > 3?
                        <div className="btnToggle"><a href="#kbcard" className="toggleUI" ><span>이벤트 내용 펼쳐짐</span></a></div>    
                    :""}

                    {item.EXT.length == 4 ? 
                    <div className="eventBtn"><a href={item.EXT[3]} className="btnL btnWhite">자세히보기</a></div>
                    :""}

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