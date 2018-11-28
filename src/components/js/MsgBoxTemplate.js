import React from 'react';
import '../css/push.css';

const MsgBoxTemplate = ({ children }) => {
  const moveSetting = () =>{
    window.location.href="CXHIAOPS0001.cms?newPushLibYn=Y";
  }
  const exitPush = () => {
    window.kbmobile.ui.clearTop("main");
  }
  return (
    <div>
      <div className="topHead">
        <h1 className="fs4">PUSH알림</h1>
        <div className="optionBtn" onClick={moveSetting} ><button type="button">설정</button></div>
        <div className="backBtn" onClick={exitPush}><button type="button">이전페이지</button></div>
      </div>
      {children}
    </div>
  );
};

export default MsgBoxTemplate;