const
	custom = require("../fbMessageFunctions/customMessageFunctions.js"),
	users = require("../data/db.js"),
	database = require("../database/dbPostgreSQL.js"),
	common = require("../behaviours/common.js"),
	log = require('../behaviours/logger.js'),
	config = require("./../config.js"),
	states = require("../data/states.js"),

	graphAPI = require("../api/graphapiFB.js");

const inFile = module.exports = {
	handle: function (user, metadata) {
		switch (metadata) {

		case "GREETINGS":
			graphAPI.call(senderID, function (userAPI) {
				custom.welcomeCall(senderID, userAPI.first_name);
			});
			break;
		case "LOCATION_NOT_FOUND_REPLY":
			//console.log("LOCATION_NOT_FOUND_REPLY");
			

			break;
			case "CONFIREMD_DONOR_MESSAGE":
				custom.ShareDonorMessage(user.fpid,user.firstName);
				break;
			case "CONFIREMD_REQUESTER_MESSAGE":
				custom.ShareRequesterMessage(user.fpid,user.firstName);
				
				
				break;
			case "SHARE_DONOR_MESSAGE":
				custom.ShareDonorCardMessage(user.fpid,user.firstName,"donor",user.pickup.title,user.bgtype);
				break;
				
			case "SHARE_REQUESTER_MESSAGE":
				console.log("SHARE_REQUESTER_MESSAGE in echo.js");
			
				custom.ShareRequesterCardMessage(user.fpid,user.firstName,user.pickup.title,user.bgtype,user.date,user.time);
					
				break;
		default:
			//console.log("default in echo.js");
			errorMessages.handle(user, function (id) {
				custom.inappropriateButtonClick(user.fpid);
			});
			break;
		}
		return;
	}
}