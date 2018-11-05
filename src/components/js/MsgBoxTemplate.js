import React from 'react';
import '../css/push.css';

const MsgBoxTemplate = ({ children }) => {
  return (
    <div>
      <div className="topHead">
        <h1 className="fs4">PUSH알림</h1>
        <div className="optionBtn"><button type="button">설정</button></div>
        <div className="backBtn"><button type="button">이전페이지</button></div>
      </div>
      <div id="content">
        <section classNameName="container" >
          <div classNameName="pushArea">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MsgBoxTemplate;