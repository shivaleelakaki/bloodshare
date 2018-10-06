const
	custom = require("../fbMessageFunctions/customMessageFunctions.js"),
	fbmsg = require("../fbMessageFunctions/fbMessageFunctions.js"),
	users = require("../data/db.js"),
	states = require("../data/states.js"),
	dateTimeParser = require("../behaviours/dateTimeParser.js"),
	common = require("../behaviours/common.js"),
	errorMessages = require("./errorMessages.js"),
	database = require("../database/dbPostgreSQL.js"),
	log = require('../behaviours/logger.js'),
	phone = require("phone"),
	geocode = require('../api/geocode.js'),
	lookup = require('country-data').lookup;

const inFile = module.exports = {
	handle: function (user, messageText) {
		let travelTime, travelDate;
		switch (user.state) {
		case states.ss12:
		case states.ss7f:

			console.log("date time state in messageText");
			let parsedDateTime = dateTimeParser.dateTimeFreeForm(messageText, user.timezone);
			if (parsedDateTime == "past") {
				errorMessages.handle(user, function (id) {
					custom.askDateTimeFreeFormPast(id);
				});
			} else if (parsedDateTime != null) {
				if(user.state==states.ss12){
				users.updateStatewithValue(user.fpid, states.ss5a, "date", parsedDateTime.date, function (id) {
					users.updateStatewithValue(user.fpid, states.ss5a, "time", parsedDateTime.time, function (id) {

						custom.askMobileNumber(id, "request");
					});
				});}
				else{

				users.updateStatewithValue(user.fpid, states.ss7b1, "date", parsedDateTime.date, function (id) {
					users.updateStatewithValue(user.fpid, states.ss7b1, "time", parsedDateTime.time, function (id) {
						
						custom.finalRequesterConfirmationMessage(id, user.pickup.title, user.bgtype, user.date, user.time);
					});
				});
				}

			} else {
				errorMessages.handle(user, function (id) {
					custom.askDateTimeFreeFormWrong(id);
				});
			}
			break;

		case states.ss2:
		case states.ss2a:
		case states.ss7c:
		case states.ss7c1:


			var setState, usertype;
			var tempbgtype = messageText.replace(/\s/g, "").toUpperCase();
			bloodGroupArray = ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"];
			if (bloodGroupArray.indexOf(tempbgtype) > -1) {
				if (user.state == states.ss2) {
					setState = states.ss3;
					usertype = "donor";
					users.updateStatewithValue(user.fpid, setState, "bgtype", tempbgtype, function (id) {
						custom.pickUpLocationMessage(id, usertype);
					});
				} else if (user.state == states.ss2a) {
					setState = states.ss3a;
					usertype = "request";
					users.updateStatewithValue(user.fpid, setState, "bgtype", tempbgtype, function (id) {
						custom.pickUpLocationMessage(id, usertype);
					});
				} else if (user.state == states.ss7c) {
					users.updateStatewithValue(user.fpid, states.ss7b, "bgtype", tempbgtype, function (id) {
						//custom.askWhichCountry(id, countryName);
						custom.finalDonorConfirmationMessage(id, user.pickup.title, user.bgtype);

					});


				} else if (user.state == states.ss7c1) {
					users.updateStatewithValue(user.fpid, states.ss7b1x, "bgtype", states.ss7b1, function (id) {
						//custom.askWhichCountry(id, countryName);
						custom.finalRequesterConfirmationMessage(id, user.pickup.title, user.bgtype);

					});
				}


			} else {
				errorMessages.handle(user, function (id) {
					custom.askBloodGroupWrong(id);
				});

			}

			break;

		case states.ss3:
		case states.ss3a:
			var setState;
			if (user.state == states.ss3) setState = states.ss4;
			else if (user.state == states.ss3a) setState = states.ss4a;
			else {
				console.log("not valid state");
			}
			geocode.getLocations(messageText, function (locs) {
				if ((locs.length == 0) || (locs == 404)) {
					errorMessages.handle(user, function (id) {
						custom.notValidLatLng(id);
					});
				} else {
					users.updateStatewithValue(user.fpid, setState, "errorCount", user.errorCount, function (id) {
						users.updateStatewithValue(user.fpid, setState, "pickupLocs", locs, function (id) {
							custom.locsListMessage(id, locs, "pickup");
						});
					});
				}
			});
			break;
		case states.ss7d:
		case states.ss7d1:
			var setState;
			if (user.state == states.ss7d) setState = states.ss7e;
			else if (user.state == states.ss7d1) setState = states.ss7e1;
			else {
				console.log("not valid state");
			}
			geocode.getLocations(messageText, function (locs) {
				if ((locs.length == 0) || (locs == 404)) {
					errorMessages.handle(user, function (id) {
						custom.notValidLatLng(id);
					});
				} else {
					users.updateStatewithValue(user.fpid, setState, "errorCount", user.errorCount, function (id) {
						users.updateStatewithValue(user.fpid, setState, "pickupLocs", locs, function (id) {
							custom.locsListMessage(id, locs, "pickup");
						});
					});
				}
			});
			break;
		case states.ss5:
		case states.ss5a:
			var setState;
			console.log("State:" + user.state);

			let internationalNumber = new RegExp(/^\d{1,5}\d{6,11}$/);
			if (internationalNumber.test(messageText)) {
				let countryCode = phone("+" + String(messageText));
				if (countryCode.length != 0) {
					let countryName = lookup.countries({
						alpha3: countryCode[1]
					})[0].name;
					if (!countryName) {
						countryName = countryCode[1];
					}
					if (user.state == states.ss5) {
						database.updateUserDetails(user.fpid, user.firstName, user.lastName, null, messageText, user.profilePic, user.gender, null, null, common.uniquePicCode(user.profilePic), function (dbUserDetails) {
							users.updateStatewithValue(senderID, states.ss6, "mobileCountry", countryName, function (id) {});
							users.updateStatewithValue(user.fpid, states.ss6, "mobile", messageText, function (id) {
								custom.askWhichCountry(id, countryName);
							});

						});
					} else if (user.state == states.ss5a) {
						users.updateStatewithValue(senderID, states.ss6a, "mobileCountry", countryName, function (id) {});
						users.updateStatewithValue(user.fpid, states.ss6a, "mobile", messageText, function (id) {
							custom.askWhichCountry(id, countryName);

						});
					} else {
						console.log("invalid state" + user.state);
					}


				}
			} else {
				errorMessages.handle(user, function (id) {
					custom.askMobileNumberWrong(id);
				});
			}
			break;
		case states.ss7:
		case states.ss7a:
			console.log("user otp state");
			let shareUsertype;
			if (user.verified == messageText) {
				console.log("user otp state1");

				if (user.state == states.ss7) {
					//console.log("user otp state2");
					users.updateState(senderID, states.ss7b, function (id) {
						//console.log("user otp state3");
						custom.finalDonorConfirmationMessage(id, user.pickup.title, user.bgtype);
					});
					//console.log("user otp state4");
				} else if (user.state == states.ss7a) {
					//console.log("user otp state5");
					users.updateState(senderID, states.ss7b1, function (id) {
						//console.log("user otp state6");
						custom.finalRequesterConfirmationMessage(id, user.pickup.title, user.bgtype, user.date, user.time);
					});
					//console.log("user otp state7");
				} else {
					console.log("Inavalid state");
				}

			} else {
				custom.askOTPWrong(senderID);
			}
			break;
		case states.ss9a:
		case states.ss9:
		case states.ss9b:
			users.removeUsers(user.fpid, function (id) {
				custom.thanksStayInTouch(id);
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