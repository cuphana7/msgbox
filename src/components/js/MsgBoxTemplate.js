import React from 'react';
import './css/push.css';

const MsgBoxTemplate = ({ children }) => {
  return (
    <div id="content">
      <section className="container" style="padding-top: 56px;padding-bottom:20px;" >
        <div className="pushArea">
          {children}
        </div>
      </section>
    </div>
  );
};

export default MsgBoxTemplate;