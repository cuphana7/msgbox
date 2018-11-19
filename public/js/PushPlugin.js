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
                requestPushAlime: function(successCallback) {
                    exec(successCallback, null, "PushPlugin", "requestPushAlime", []);
                },
		    };
});
