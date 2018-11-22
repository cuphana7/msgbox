cordova.define("cordova-plugin-push.PushPlugin", function(require, exports, module) {
    var exec = require('cordova/exec');
               
    module.exports = {
        getBadgeCount: function(successCallback) {
            exec(successCallback, null, "PushPlugin", "getBadgeCount", []);
        },
        pushLicence: function(regFlag, clientIdentifier, clientMngNum, appDivCode, successCallback) {
            exec(successCallback, null, "PushPlugin", "pushLicence", [{
            	"regFlag":regFlag,
            	"clientIdentifier":clientIdentifier,
            	"clientMngNum":clientMngNum,
            	"appDivCode":appDivCode
            }]);
        },
        setPushFlag: function(setbadge, setnoti, successCallback) {
            exec(successCallback, null, "PushPlugin", "setPushFlag", [{
                "setbadge":setbadge,
                "setnoti":setnoti
            }]);
        },
        getPushFlag: function(successCallback) {
            exec(successCallback, null, "PushPlugin", "getPushFlag", []);
        },
        getMessageList: function(successCallback) {
            exec(successCallback, null, "PushPlugin", "getMessageList", []);
        },
        moveSetting: function(successCallback) {
            exec(successCallback, null, "PushPlugin", "moveSetting", [{}]);
        },
        callApi: function(url, params, successCallback, failCallback) {
            exec(successCallback, failCallback, "PushPlugin", "callApi", [{
                "url": url,
                "params":params
            }]);
        },
	};
});


cordova.define('cordova/plugin_list', function(require, exports, module) {
    module.exports = [
        {
            "id": "cordova-plugin-push.PushPlugin",
            "clobbers": [
                "window.kbmobile.push"
            ]
        }
    ];
    module.exports.metadata = 
    // TOP OF METADATA
    {
        // for whitelist
        "cordova-plugin-whitelist": "1.2.2",
        // for KB
        "cordova-plugin-application": "0.0.1",
        "cordova-plugin-cert": "0.0.1",
        "cordova-plugin-crypt": "0.0.1",
        "cordova-plugin-device": "0.0.1",
        "cordova-plugin-eventhandler": "0.0.1",
        "cordova-plugin-geolocation": "0.0.1",
        "cordova-plugin-network": "0.0.1",
        "cordova-plugin-nfc": "0.0.1",
        "cordova-plugin-preferences": "0.0.1",
        "cordova-plugin-push": "0.0.1",
        "cordova-plugin-ui-dialog": "0.0.1",
        "cordova-plugin-ui-navigator": "0.0.1",
        "cordova-plugin-ui-securekeypad": "0.0.1",
        "cordova-plugin-login": "0.0.1",
        "cordova-plugin-fido": "0.0.1",
        "cordova-plugin-locknumber": "0.0.1",
        "cordova-plugin-appcard": "0.0.1",
        "cordova-plugin-ars": "0.0.1",
        "cordova-plugin-espider": "0.0.1",
        "cordova-plugin-ocr": "0.0.1"
    };
    // BOTTOM OF METADATA
    });
    