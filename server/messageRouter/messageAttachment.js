const
	custom = require("../fbMessageFunctions/customMessageFunctions.js"),
	users = require("../data/db.js"),
	states = require("../data/states.js"),
	log = require('../behaviours/logger.js'),
	errorMessages = require("./errorMessages.js");

const inFile = module.exports = {
	handle: function (user, messageAttachments) {

		switch (user.state) {

		case states.s1:
			errorMessages.handle(user, function (id) {
				custom.welcomeCallWrongReply(id);
			});
			break;

		default:
			errorMessages.handle(user, function (id) {
				custom.inappropriateButtonClick(user.fpid);
			});
			break;
		}
		return;
	}
}