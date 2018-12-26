import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const startApp = () => {
    ReactDOM.render(<App />, document.getElementById('Wrap'));
    //registerServiceWorker();
};

if(window.cordova) {
    document.addEventListener('deviceready', startApp, false);
} else {
    startApp();
}
