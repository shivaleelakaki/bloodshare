const
	custom = require("../fbMessageFunctions/customMessageFunctions.js"),
	users = require("../data/db.js"),
	dateTimeParser = require("../behaviours/dateTimeParser.js"),
	request = require('request'),
	log = require('../behaviours/logger.js'),
	config = require("./../config.js"),
	echoMessages = require("./echo.js"),
	textMessages = require("./messageText.js"),
	attachmentMessages = require("./messageAttachment.js"),
	postBackMessages = require("./postBack.js"),
	database = require("../database/dbPostgreSQL.js"),
	common = require("../behaviours/common.js"),
	quickReplyMessages = require("./quickReply.js"),
	states = require("../data/states.js");

const inFile = module.exports = {
	route: function (event) {
		database.messageDump(JSON.stringify(event));
		let
			message = event.message,
			isEcho = message.is_echo,
			messageText = message.text,
			messageAttachments = message.attachments,
			quickReply = message.quick_reply;


		if (isEcho) {
			let
				senderID = event.recipient.id;
			metadata = message.metadata,
				console.log('-----------'+metadata+"-------")
				if(metadata=="ASK_WILLING_TO_DONATE"){
					metadata="";
				}
				// allowed = [];//empty
				allowed = ["GREETINGS","CONFIREMD_DONOR_MESSAGE","SHARE_DONOR_MESSAGE","CONFIREMD_REQUESTER_MESSAGE","SHARE_REQUESTER_MESSAGE"];
			if (allowed.indexOf(metadata) > -1) {
				let
					user = users.getUsers(senderID)[0];
				echoMessages.handle(user, metadata);
				return;
			} else {
				user = users.getUsers(senderID)[0];
				if (user.state == states.ss11) {
					users.updateState(user.fpid, states.ss9a, function (id) {
						custom.ShareMessage(id, user.firstName, "requestMatchFound");
					});

				}
				return;
			}
			return;
		} else {
			let
				senderID = event.sender.id,
				user = users.getUsers(senderID);
			if (user.length == 0) {
				request({
					uri: 'https://graph.facebook.com/v2.6/' + senderID + '?access_token=' + config.PAGE_ACCESS_TOKEN,
					method: 'GET'
				}, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						let userAPI = JSON.parse(body);
						database.insertUsertoBOT(senderID, userAPI.first_name, userAPI.last_name, null, null, userAPI.profile_pic, userAPI.gender, null,null, common.uniquePicCode(userAPI.profile_pic), userAPI.timezone, function (dbUserDetails) {
							database.fetchDonorDetails(senderID, 0, function (fetchDonorDetails) {
								if (fetchDonorDetails.length == 0) {
									users.insertUser(dbUserDetails.fpid, userAPI.first_name, userAPI.last_name, userAPI.profile_pic, dbUserDetails.mobile, userAPI.gender, userAPI.timezone, dbUserDetails.verified, states.ss1, function (id) {
										if (dbUserDetails.verified) custom.welcomeCall(senderID, userAPI.first_name, "old", "no");
										else custom.welcomeCall(senderID, userAPI.first_name, "new", "no");
									});
								} else {
									users.insertUser(dbUserDetails.fpid, userAPI.first_name, userAPI.last_name, userAPI.profile_pic, dbUserDetails.mobile, userAPI.gender, userAPI.timezone, dbUserDetails.verified, states.ss1, function (id) {
										custom.welcomeCall(id, userAPI.first_name, "old", "yes"); //make it yes
									});
								}
							});
						});
						return;
					} else {
						//log.error("Unale to fetch user details in initjs.");
						return;
					}
					return;
				});
				return;
			} else if (user.length == 1) {

				user = user[0];
				if (user.errorCount < 5) {
					if (quickReply) {
						quickReplyMessages.handle(user, quickReply);
						return;
					} else if (messageText) {
						textMessages.handle(user, messageText);
						return;
					} else if (messageAttachments) {
						attachmentMessages.handle(user, messageAttachments);
						return;
					} else {
						return;
					}
					return;
				} else {
					users.removeUsers(user.fpid, function (id) {
						inFile.route(event);
					});
					return;
				}
				return;
			} else {
				users.removeUsers(senderID, function (id) {
					inFile.route(event);
				});
				return;
			}
			return;
		}
		return;
	},
	postBackRoute: function (event) {
		database.messageDump(JSON.stringify(event));
		postBackMessages.handle(event);
		return;
	}
}