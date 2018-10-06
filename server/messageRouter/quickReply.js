const
	custom = require("../fbMessageFunctions/customMessageFunctions.js"),
	fbmsg = require("../fbMessageFunctions/fbMessageFunctions.js"),
	users = require("../data/db.js"),
	states = require("../data/states.js"),
	database = require("../database/dbPostgreSQL.js"),
	// dateTimeParser = require("../behaviours/dateTimeParser.js"),
	common = require("../behaviours/common.js"),
	sms = require("../behaviours/sms.js"),
	log = require('../behaviours/logger.js'),
	config = require("./../config.js"),
	errorMessages = require("./errorMessages.js"),
	request = require('request'),
	messageRoute = require("./init.js");

const inFile = module.exports = {
	handle: function (user, quickReply) {
		let quickReplyPayload = quickReply.payload;
		let metadataArray, travelDateQuick;
		var payloadArr = quickReplyPayload.split("_");
		var match = payloadArr[0] + "_" + payloadArr[1];
		console.log("outer switch in quickreply" + quickReplyPayload);


		switch (quickReplyPayload) {
			case "READY_TO_DONATE_YES":
				console.log("ready to donate blood");
				break;
			case "READY_TO_DONATE_NO":
				console.log("not ready to donate blood");
				break;

		case "WELCOME_CALL_REPLY_FOR_REGISTER":
		case "PERSISTENT_MENU_REGISTER":
			console.log("outer case register in quickreply" + quickReplyPayload + user.fpid + "...");

			users.removeUsers(user.fpid, function (id) {
				console.log("function:" + id);
				request({
					uri: 'https://graph.facebook.com/v2.6/' + id + '?access_token=' + config.PAGE_ACCESS_TOKEN,
					method: 'GET'
				}, function (error, response, body) {
					console.log("function2");
					if (!error && response.statusCode == 200) {
						console.log("function3");
						let userAPI = JSON.parse(body);
						database.insertUsertoBOT(user.fpid, userAPI.first_name, userAPI.last_name, null, null, userAPI.profile_pic, userAPI.gender, null, null, common.uniquePicCode(userAPI.profile_pic), userAPI.timezone, function (dbUserDetails) {
							console.log("function4" + userAPI.first_name);
							database.fetchDonorDetails(user.fpid, 0, function (dbhDonorDetails) {
								if (dbhDonorDetails.length == 0) {
									console.log("function5" + dbhDonorDetails.length);
									users.insertUser(dbUserDetails.fpid, userAPI.first_name, userAPI.last_name, userAPI.profile_pic, dbUserDetails.mobile, userAPI.gender, userAPI.timezone, dbUserDetails.verified, states.ss2, function (id) {
										console.log("function6" + id + "fff" + dbUserDetails.mobile + "...");
										custom.askBloodGroup(id, "donor");

									});
								} else {
									custom.alreadyRegisterdUser(user.fpid);
									console.log("function7 len >0");
								}
							});

						});
						return;

					} else {
						//log.error("Unale to fetch user details on share ride.");
						return;
					}
					return;
				});
			});
			break;
		case "WELCOME_CALL_REPLY_FOR_NEED":
		case "PERSISTENT_MENU_NEED":
			users.removeUsers(user.fpid, function (id) {
				request({
					uri: 'https://graph.facebook.com/v2.6/' + id + '?access_token=' + config.PAGE_ACCESS_TOKEN,
					method: 'GET'
				}, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						let userAPI = JSON.parse(body);
						database.insertUsertoBOT(user.fpid, userAPI.first_name, userAPI.last_name, null, null, userAPI.profile_pic, userAPI.gender, null, null, common.uniquePicCode(userAPI.profile_pic), userAPI.timezone, function (dbUserDetails) {
							users.insertUser(dbUserDetails.fpid, userAPI.first_name, userAPI.last_name, userAPI.profile_pic, dbUserDetails.mobile, userAPI.gender, userAPI.timezone, dbUserDetails.verified, states.ss2a, function (id) {
								custom.askBloodGroup(id, "request");

							});
							return;
						});
					} else {
						//log.error("Unale to fetch user details on share ride.");
						return;
					}
					return;
				});
			});

			break;



		default:




			switch (quickReplyPayload + "|" + user.state) {



			case "COUNTRY_YES|" + states.ss6:
			case "COUNTRY_YES|" + states.ss6a:
				var setState;
				let otp = 4321;
				// sms.sendOTP(user.mobile,otp,function(status){
				if (user.state == states.ss6) {
					database.updateUserDetails(user.fpid, user.firstName, user.lastName, null, user.mobile, user.profilePic, user.gender, String(otp), user.mobileCountry, common.uniquePicCode(user.profilePic), function (dbUserDetails) {
						users.updateStatewithValue(user.fpid, states.ss7, "verified", otp, function (id) {
							custom.askOTP(id);
						});
					});
				} else if (user.state == states.ss6a) {

					users.updateStatewithValue(user.fpid, states.ss7a, "verified", otp, function (id) {
						custom.askOTP(id);
					});
				} else {
					console.log("set status" + user.state);
				}

				//}); close sendOTP 
				break;

			case "COUNTRY_NO|" + states.ss6:
			case "COUNTRY_NO|" + states.ss6a:
				var setState;
				if (user.state == states.ss6) setState = states.ss5;
				else if (user.state == states.ss6a) setState = states.ss5a;
				else {
					console.log("set status");
				}

				users.updateState(user.fpid, setState, function (id) {
					custom.askMobileNumberWrong(id);
				});
				break;
			default:

				var payloadArr = quickReplyPayload.split("_");
				var match = payloadArr[0] + "_" + payloadArr[1];
				var tempbgtype = payloadArr[2];
				switch (match + "|" + user.state) {
				case "PICK_BLOODGROUP|" + states.ss7c:
				
					users.updateStatewithValue(user.fpid, states.ss7b, "bgtype", tempbgtype, function (id) {
						//custom.askWhichCountry(id, countryName);
						custom.finalDonorConfirmationMessage(id,user.pickup.title,user.bgtype);

					});

					break;
			
				case "PICK_BLOODGROUP|" + states.ss7c1:
						console.log("pickup blood group ss7c1"+tempbgtype);
					users.updateStatewithValue(user.fpid, states.ss7b1, "bgtype", tempbgtype, function (id) {
						//custom.askWhichCountry(id, countryName);
						custom.finalRequesterConfirmationMessage(id,user.pickup.title,user.bgtype,user.date,user.time);

					});

					break;

				case "PICK_BLOODGROUP|" + states.ss2:
				case "PICK_BLOODGROUP|" + states.ss2a:

					// var setState=states.ss3;
					var setState, usertype;
					if (user.state == states.ss2) {
						setState = states.ss3;
						usertype = "donor";
					} else if (user.state == states.ss2a) {
						setState = states.ss3a;
						usertype = "request"
					} else {
						console.log("not valid state");
					}

					
					users.updateStatewithValue(user.fpid, setState, "bgtype", tempbgtype, function (id) {
						// custom.askTime(id);
						custom.pickUpLocationMessage(id, usertype);
					});

					break;
				default:
					errorMessages.handle(user, function (id) {
						custom.inappropriateButtonClick(user.fpid);
					});
					break;

				}


				break;
			}
		}
		return;
	}
}