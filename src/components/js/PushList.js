import React, { Component } from 'react';
import '../css/push.css';
import PushMsg from '../js/PushMsg';

export default class PushList extends Component {

    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.dataSource !== nextProps.dataSource;
    }

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
            
            function dateFormat(dt) {
                return dt.substr(2,2)+"."+dt.substr(4,2)+"."+dt.substr(6,2)+" | "+dt.substr(8,2)+":"+dt.substr(10,2)+":"+dt.substr(12,2);
            }

            return <ul className={temperatureClassname(item.CATEGORY_CODE)} key={index}>
                <li>
                    <strong className="tit">{item.TITLE}</strong>
                    <span className="date">{dateFormat(item.DATE)}</span>
                    <PushMsg msg={item.MSG}
                        ext={item.EXT}
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