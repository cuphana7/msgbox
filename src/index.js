import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const startApp = () => {
    ReactDOM.render(<App />, document.getElementById('Wrap'));
    //registerServiceWorker();
};

if(window.cordova) {
    document.addEventListener('deviceready', startApp, false);
} else {
    startApp();
}
