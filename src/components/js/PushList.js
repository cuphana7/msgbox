import React, { Component } from 'react';
import '../css/push.css';
import PushMsg from '../js/PushMsg';

export default class PushList extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.dataSource !== nextProps.dataSource;
    }

    render() {

        const { dataSource, handleCheckedChange, checkedItems } = this.props;
        function temperatureClassname(temp){
            const prefix = 'pushList '
          
            switch (temp) {
              case '1': return prefix + 'payment'
              case '2': return prefix + 'event'
              case '3': return prefix + 'info'
              case '4': return prefix + 'notice'
              default: return prefix + 'payment'
            }
        }
        
        function dateFormat(dt) {
            return dt.substr(2,2)+"."+dt.substr(4,2)+"."+dt.substr(6,2)+" | "+dt.substr(8,2)+":"+dt.substr(10,2)+":"+dt.substr(12,2);
        }
        
        var cells = (dataSource)?dataSource.map(function(item, index) {

            return <ul className={temperatureClassname(item.CATEGORY_CODE)} key={index}>
                        <li>
                            <strong className="tit">{item.TITLE}</strong>
                            <span className="date">{dateFormat(item.DATE)}</span>
                            <PushMsg msg={item.MSG} key={index}
                                ext={item.EXT} msgid={item.MSG_ID} handleCheckedChange={handleCheckedChange}
                                checkedItems={checkedItems}
                            />
                        </li>
                    </ul>
        }) : [];

        return (
            <div className="pushWrap">
                {cells}
            </div>
        );
    }
}