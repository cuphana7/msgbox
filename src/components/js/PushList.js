import React, { Component } from 'react';
import '../css/push.css';

class PushList extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.todos !== nextProps.todos;
    }

    render() {

        return (
            <ul className="pushList payment">
                <li>
                    <strong className="tit">알파원카드 알림</strong>
                    <span className="date">18.08.29 | 18:26:32</span>

                    <div className="cont">
                        올리브영 광화문점(#뷰티) 12,300원<br />사용카드는 KB국민 FineTech카드입니다.
							</div>

                    <div className="select">
                        <label htmlFor="sel1_1">해당 알림 삭제하기</label>
                        <input type="checkbox" id="sel1_1" name="" className="inp1" />
                    </div>
                </li>
                <li>
                    <span className="date">18.08.29 | 18:26:32</span>

                    <div className="cont">
                        <p>
                            KB국민카드5*1* 승인<br />
                            김*민<br />
                            12,300원 일시불<br />
                            08/29 18:26<br />
                            올리브영 광화문점<br />
                            누적 827,940원
								</p>
                    </div>

                    <div className="select">
                        <label htmlFor="sel1_2">해당 알림 삭제하기</label>
                        <input type="checkbox" id="sel1_2" name="" className="inp1" />
                    </div>
                </li>
                <li>
                    <span className="date">18.08.29 | 18:26:32</span>

                    <div className="cont">
                        <p>
                            KB국민체크 2*3*<br />
                            김*민님<br />
                            08/29 14:32<br />
                            4,000원<br />
                            미니스톱<br />
                            잔여 523,480원
								</p>
                    </div>

                    <div className="select">
                        <label htmlFor="sel1_3">해당 알림 삭제하기</label>
                        <input type="checkbox" id="sel1_3" name="" className="inp1" />
                    </div>
                </li>
            </ul>
        );
    }
}

export default PushList;