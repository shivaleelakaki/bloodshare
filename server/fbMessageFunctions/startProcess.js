const
	config = require("../config.js"),
	menu = require('./mainMenu.js'),
	PAGE_ACCESS_TOKEN = config.PAGE_ACCESS_TOKEN;
console.log("Started Processed");

var gettingStarted = {
	"setting_type": "call_to_actions",
	"thread_state": "new_thread",
	"call_to_actions": [{
		"payload": "PERSISTENT_GETTING_STARTED"
    }]
};

var menuList = {
	"setting_type": "call_to_actions",
	"thread_state": "existing_thread",
	"call_to_actions": [

		{
			"type": "postback",
			"title": "Register to Donate",
			"payload": "PERSISTENT_MENU_REGISTER"
        }, {
			"type": "postback",
			"title": "Need Blood",
			"payload": "PERSISTENT_MENU_NEED"
       /* },
		{
			"type": "postback",
			"title": "Change Details",
			"payload": "PERSISTENT_MENU_CHANGE"
        },
		{
			"type": "postback",
			"title": "Exit",
			"payload": "PERSISTENT_MENU_EXIT"
        },
		{
			"type": "postback",
			"title": "Help",
			"payload": "PERSISTENT_MENU_HELP"*/
        }

    ]
};
var greetingText = {
	"setting_type": "greeting",
	"greeting": {
		"text": "I'm your personal do-good assistant. I'll help you share stuff with people & change their lives (and yours) in a good way."
	}
};
var deleteReq = {
	"setting_type": "call_to_actions",
	"thread_state": "existing_thread"
};

module.exports = {

	start: function () {
		//console.log(" 1"+process.env.INIT);
		//console.log(" 2"+process.env.DELETE);
		//console.log(" 3"+process.env);

		if (process.env.INIT) {
			
			menu.setThreadSetting(greetingText);
			menu.setThreadSetting(gettingStarted);
			menu.setThreadSetting(menuList);
		} else if (process.env.DELETE) {
			console.log("Process Deleted");


		} else {
			//  menu.deleteGettingStarted(deleteReq);
			//menu.deletePersistentMenu(deleteReq);
			//console.log("Existing process");
			 menu.setThreadSetting(greetingText);
			//console.log("greeting");
			menu.setThreadSetting(gettingStarted);
			//console.log("getting started");
			menu.setThreadSetting(menuList);
			//console.log("menulist");
		}
	}
};