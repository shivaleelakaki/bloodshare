const
	custom = require("../fbMessageFunctions/customMessageFunctions.js"),
	fbmessage = require("../fbMessageFunctions/fbMessageFunctions.js"),
	users = require("../data/db.js"),
	states = require("../data/states.js"),
	database = require("../database/dbPostgreSQL.js"),
	common = require("../behaviours/common.js"),
	request = require('request'),
	sms = require("../behaviours/sms.js"),
	log = require('../behaviours/logger.js'),
	config = require("./../config.js"),
	errorMessages = require("./errorMessages.js"),
	messageRoute = require("./init.js");

const inFileP = module.exports = {
	handle: function (event) {
		let
			postbackPayload = event.postback.payload;
		senderID = event.sender.id;

		if (postbackPayload.indexOf("_") > -1) {
			let postbArr = postbackPayload.split("_");

			//Dynamic Postbacks
			switch (postbArr[0] + "|" + postbArr[1]) {
			case "MATCH|CONVERSION":
				database.updateTransitConversion(postbArr[3], ((postbArr[2] == "YES") ? true : false), function () {
					custom.goodbyeConversion(senderID);
					return;
				});
				break;


			default:
				//Static Postbacks
				switch (postbackPayload) {
				case "WELCOME_CALL_REPLY_FOR_REGISTER":
				case "PERSISTENT_MENU_REGISTER":
					users.removeUsers(senderID, function (id) {
						request({
							uri: 'https://graph.facebook.com/v2.6/' + id + '?access_token=' + config.PAGE_ACCESS_TOKEN,
							method: 'GET'
						}, function (error, response, body) {
							if (!error && response.statusCode == 200) {
								let userAPI = JSON.parse(body);
								database.insertUsertoBOT(senderID, userAPI.first_name, userAPI.last_name, null, null, userAPI.profile_pic, userAPI.gender, null, null, common.uniquePicCode(userAPI.profile_pic), userAPI.timezone, function (dbUserDetails) {
									database.fetchDonorDetails(senderID, 0, function (dbhDonorDetails) {
										//if (dbhDonorDetails.length == 0) {
										users.insertUser(dbUserDetails.fpid, userAPI.first_name, userAPI.last_name, userAPI.profile_pic, dbUserDetails.mobile, userAPI.gender, userAPI.timezone, dbUserDetails.verified, states.ss2, function (id) {
											custom.askBloodGroup(id, "donor");

										});
										/*	} else {
												custom.alreadyRegisterdUser(senderID);
											}*/
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
				case "GET_STARTED_BUTTON_CLICKED":
				case "PERSISTENT_GETTING_STARTED":
					console.log("PERSISTENT_GETTING_STARTED");
					users.removeUsers(senderID, function (id) {
						request({
							uri: 'https://graph.facebook.com/v2.6/' + senderID + '?access_token=' + config.PAGE_ACCESS_TOKEN,
							method: 'GET'
						}, function (error, response, body) {
							if (!error && response.statusCode == 200) {
								let userAPI = JSON.parse(body);
								database.insertUsertoBOT(senderID, userAPI.first_name, userAPI.last_name, null, null, userAPI.profile_pic, userAPI.gender, null, null, common.uniquePicCode(userAPI.profile_pic), userAPI.timezone, function (dbUserDetails) {
									database.fetchDonorDetails(senderID, 0, function (dbhDonorDetails) {
										if (dbhDonorDetails.length == 0) {
											users.insertUser(dbUserDetails.fpid, userAPI.first_name, userAPI.last_name, userAPI.profile_pic, dbUserDetails.mobile, userAPI.gender, userAPI.timezone, dbUserDetails.verified, states.ss1, function (id) {
												if (dbUserDetails.verified) {
													custom.welcomeCall(senderID, userAPI.first_name, "old", "no");
												} else {
													custom.welcomeCall(senderID, userAPI.first_name, "new", "no");
												}
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
								//log.error("Unale to fetch user details.");
								return;
							}
							return;
						});
					});
					break;
				case "WELCOME_CALL_REPLY_FOR_NEED":
				case "PERSISTENT_MENU_NEED":
					users.removeUsers(senderID, function (id) {
						request({
							uri: 'https://graph.facebook.com/v2.6/' + id + '?access_token=' + config.PAGE_ACCESS_TOKEN,
							method: 'GET'
						}, function (error, response, body) {
							if (!error && response.statusCode == 200) {
								let userAPI = JSON.parse(body);
								database.insertUsertoBOT(senderID, userAPI.first_name, userAPI.last_name, null, null, userAPI.profile_pic, userAPI.gender, null, null, common.uniquePicCode(userAPI.profile_pic), userAPI.timezone, function (dbUserDetails) {
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

				case "PERSISTENT_MENU_CHANGE":
					fbmessage.sendTextMessage(senderID, "Change button clicked");
					break;
				case "PERSISTENT_MENU_EXIT":
					fbmessage.sendTextMessage(senderID, "Exit button clicked");
					break;
				case "PERSISTENT_MENU_HELP":
					//fbmessage.sendTextMessage(senderID, "Help  button clicked");
					custom.helpMessage(senderID, user.state);
					break;
				default:
					let user = users.getUsers(senderID)[0];
					if ((typeof (user) !== 'undefined') && (typeof (user.state) !== 'undefined')) {

						//Dynamic state defined switch
						switch (postbArr[0] + "|" + postbArr[1] + "|" + user.state) {
						case "PICKUP|LOCATION|" + states.ss4:
						case "PICKUP|LOCATION|" + states.ss4a:

							var setState, usertype;

							if ((isNaN(user.pickupLocs[postbArr[2]].location.lat)) || (isNaN(user.pickupLocs[postbArr[2]].location.long)) || (user.pickupLocs[postbArr[2]].location.lat == '') || (user.pickupLocs[postbArr[2]].location.long == '')) {
								errorMessages.handle(user, function (id) {
									custom.notValidLatLng(id);
								});
							} else {
								if (user.state == states.ss4) {
									setState = states.ss5;
									usertype = "donor";
									users.updateStatewithValueErrorCount(user.fpid, setState, 0, "pickup", {
										title: user.pickupLocs[postbArr[2]].title,
										location: user.pickupLocs[postbArr[2]].location
									}, function (id) {
										custom.askMobileNumber(id, usertype);
									});

								} else if (user.state == states.ss4a) {
									setState = states.ss12;
									usertype = "request";
									users.updateStatewithValueErrorCount(user.fpid, setState, 0, "pickup", {
										title: user.pickupLocs[postbArr[2]].title,
										location: user.pickupLocs[postbArr[2]].location
									}, function (id) {
										custom.askDateTimeFreeForm(id);
									});


								} else {
									console.log("set status");
								}


							}
							break;
						case "PICKUP|LOCATION|" + states.ss7e1:
						case "PICKUP|LOCATION|" + states.ss7e:
							console.log("pickup location" + user.state);


							if ((isNaN(user.pickupLocs[postbArr[2]].location.lat)) || (isNaN(user.pickupLocs[postbArr[2]].location.long)) || (user.pickupLocs[postbArr[2]].location.lat == '') || (user.pickupLocs[postbArr[2]].location.long == '')) {
								errorMessages.handle(user, function (id) {
									custom.notValidLatLng(id);
								});
							} else {
								users.updateStatewithValueErrorCount(user.fpid, user.state, 0, "pickup", {
									title: user.pickupLocs[postbArr[2]].title,
									location: user.pickupLocs[postbArr[2]].location
								}, function (id) {
									var setState, usertype;
									if (user.state == states.ss7e) {
										setState = states.ss7b;
										usertype = "donor";
										users.updateState(senderID, states.ss7b, function (id) {
											//console.log("user otp state6");
											custom.finalDonorConfirmationMessage(id, user.pickup.title, user.bgtype);
										});

									} else if (user.state == states.ss7e1) {
										setState = states.ss7b1;
										usertype = "request";
										users.updateState(senderID, states.ss7b1, function (id) {
											//console.log("user otp state6");
											custom.finalRequesterConfirmationMessage(id, user.pickup.title, user.bgtype, user.date, user.time);
										});
									} else {
										console.log("set status");
									}

									//custom.askMobileNumber(id, usertype);

								});
							}

							break;
						default:

							//Static state defined switch
							switch (postbackPayload + "|" + user.state) {


							case "OTP_RESEND|" + states.ss7:
							case "OTP_RESEND|" + states.ss7a:
								// let otp = Math.floor(1000 + Math.random() * 9000);
								let otp = 4321;
								// sms.sendOTP(user.mobile,otp,function(status){
								if (user.state == states.ss7) {
									database.updateUserDetails(user.fpid, user.firstName, user.lastName, null, user.mobile, user.profilePic, user.gender, String(otp), user.mobileCountry, common.uniquePicCode(user.profilePic), function (dbUserDetails) {
										users.updateStatewithValue(user.fpid, states.ss7, "verified", otp, function (id) {
											custom.resendOTP(id);
										});
									});
								} else {
									users.updateStatewithValue(user.fpid, states.ss7a, "verified", otp, function (id) {
										custom.resendOTP(id);
									});
								}


								//});
								break;

							case "OTP_CHANGE_MOBILE|" + states.ss7:
							case "OTP_CHANGE_MOBILE|" + states.ss7a:
								var setState, usertype;
								if (user.state == states.ss7) {
									setState = states.ss5;
									usertype = "donor";
								} else if (user.state == states.ss7a) {
									setState = states.ss5a;
									usertype = "request";
								} else {
									console.log("set status");
								}

								users.updateState(user.fpid, setState, function (id) {
									custom.askMobileNumber(id);
								});
								break;
							case "FINAL_DONOR_CONFIRMATION_CHANGE_BLOODGROUP|" + states.ss7b:
							case "FINAL_DONOR_CONFIRMATION_CHANGE_BLOODGROUP|" + states.ss7b1:
								console.log("FINAL_CONFIRMATION_CHANGE_BLOODGROUP ss7b");
								users.updateState(senderID, states.ss7c, function (id) {
									//console.log("user otp state6");
									custom.askBloodGroup(id, "donor");
								});
								break;

							case "FINAL_DONOR_CONFIRMATION_CHANGE_LOCATION|" + states.ss7b:
							case "FINAL_DONOR_CONFIRMATION_CHANGE_LOCATION|" + states.ss7b1:
								console.log(" FINAL_CONFIRMATION_CHANGE_LOCATION ss7b");
								users.updateState(senderID, states.ss7d, function (id) {
									//console.log("user otp state6");
									//custom.askBloodGroup(id, "donor");
									custom.pickUpLocationMessage(id, "donor");
								});
								break;
							case "FINAL_DONOR_CONFIRM|" + states.ss7b:

								console.log("donor confirm stage ss7b or ss7b1");



								if (user.tid) {
									database.updateDonorDetails(user.tid, user.bgtype, user.pickup.title, common.LatLngtoPoint(user.pickup.location), 4326, function () {
										users.updateState(senderID, states.ss9, function (id) {});

									});
								} else {
									database.insertDonorDetails(user.fpid, user.bgtype, user.pickup.title, common.LatLngtoPoint(user.pickup.location), 4326, function (tid) {
										users.updateStatewithValue(senderID, states.ss9, "tid", tid, function (id) {});


									});
								}

								custom.confirmedDonorMessage(senderID, user.firstName);


								break;
							case "FINAL_REQUEST_CONFIRMATION_CONFIRM|" + states.ss7b1:
								console.log("FINAL_REQUEST_CONFIRMATION_CONFIRM state ss7b1  .." + states.ss7b1);


								if (user.tid) {

									database.updateRequestDetails(user.tid, user.bgtype, user.pickup.title, common.LatLngtoPoint(user.pickup.location), common.makeDateTime(user.date, user.time, user.timezone), user.mobile, user.verified, user.mobileCountry, 4326, function () {
										users.updateState(senderID, states.ss8a, function (id) {});
									});
								} else {
									database.insertRequestDetails(user.fpid, user.bgtype, user.pickup.title, common.LatLngtoPoint(user.pickup.location), common.makeDateTime(user.date, user.time, user.timezone), user.mobile, user.verified, user.mobileCountry, 4326, function (tid) {
										//_tid = tid;
										users.updateStatewithValue(senderID, states.ss8a, "tid", tid, function (id) {});

									});
								}
								

								database.fetchDonorMatches(user.fpid, user.bgtype, common.LatLngtoPoint(user.pickup.location), 4326, function (matches) {
									console.log("fetchDonorMatches");
									if (matches.length >= 1) {
										console.log("fetchdDonorMatches>=1");
										users.updateStatewithValue(senderID, states.ss11, "tid", user.tid, function (id) {
											console.log("state updated1");
											//custom.matchFoundMessage(id, user.firstName, user.bgtype);
										});
										let matchList = [];
										console.log("after state update");
										for (let person = 0; person < matches.length; person++) {
											console.log("for loop person");

											matchList.push({
												fpid: matches[person].fpid_,
												name: matches[person].firstname_ + " " + matches[person].lastname_,
												pickup: matches[person].location_,
												profilePicture: matches[person].profilepicture_,
												mobileNumber: matches[person].mobile_,
												bloodGroup: matches[person].bloodgroup_
											});
										}
										console.log("after matchlist");
										matchList.forEach(function (donor) {												console.log(donor.name+" donor1 details in final stage   "+donor.mobileNumber);
											custom.askReadyToDonate(donor.fpid);
										});
										console.log("after1 for each");
									} else {
										console.log("fetchDonorMatches=0");
										users.updateState(user.fpid, states.ss9b, function (id) {
											//custom.ShareMessage(id, user.firstName, "requestMatchNotFound");
											console.log("update sta1te at final confirmation stage for requester", matchList);
										});
									}

								});
								//console.log("Date time Updated successfully");
								custom.confirmedRequesterMessage(senderID, user.firstName);

								break;
							case "FINAL_REQUEST_CONFIRMATION_CHANGE|" + states.ss7b1:
								console.log("change request");
								users.updateState(user.fpid, states.ss7b1x, function (id) {
									custom.changeRequestCardMessage(id, user.pickup.title, user.bgtype, user.date, user.time);
									//custom.ShareMessage(id, user.firstName, "requestMatchNotFound");
								});
								break;
							case "REQUEST_CHANGE_BLOODGROUP|" + states.ss7b1x:
								console.log("change requester blood group ss7b1x");
								users.updateState(user.fpid, states.ss7c1, function (id) {
									custom.askBloodGroup(id, "request")
										//custom.ShareMessage(id, user.firstName, "requestMatchNotFound");
								});
								break;
							case "REQUEST_CHANGE_LOCATION|" + states.ss7b1x:
								users.updateState(user.fpid, states.ss7d1, function (id) {
									custom.pickUpLocationMessage(id, "request")
										//custom.ShareMessage(id, user.firstName, "requestMatchNotFound");
								});
								break;
							case "REQUEST_CHANGE_TIME|" + states.ss7b1x:
								users.updateState(user.fpid, states.ss7f, function (id) {
									custom.askDateTimeFreeForm(id);
									//custom.ShareMessage(id, user.firstName, "requestMatchNotFound");
								});
								break;


							case "LIST_LOCATION_FOUND|" + states.ss4:
							case "LIST_LOCATION_FOUND|" + states.ss4a:
							case "LIST_LOCATION_FOUND|" + states.ss7e:
							case "LIST_LOCATION_FOUND|" + states.ss7e1:
								errorMessages.handle(user, function (id) {
									custom.locationFoundMessage(id);
								});
								break;

							case "LIST_LOCATION_NOT_FOUND|" + states.ss4:
							case "LIST_LOCATION_NOT_FOUND|" + states.ss4a:
							case "LIST_LOCATION_NOT_FOUND|" + states.ss7e:
							case "LIST_LOCATION_NOT_FOUND|" + states.ss7e1:

								var setState, usertype;
								if (user.state == states.ss4) {
									setState = states.ss3;
									usertype = "donor";
								} else if (user.state == states.ss4a) {
									setState = states.ss3a;
									usertype = "request";
								} else {
									console.log("set status");
								}


								users.updateStatewithValue(user.fpid, setState, "errorCount", user.errorCount, function (id) {
									errorMessages.handle(user, function (id) {
										custom.locationNotFoundMessage(id);
									});
								});
								break;

							default:
								errorMessages.handle(user, function (id) {
									custom.inappropriateButtonClick(user.fpid);
								});
								break;
							}
						}
					} else {
						custom.inappropriateButtonClick(senderID);
						console.log(postbackPayload + ".." + user.state);
						break;
					}
				}
				return;
			}
			return;
		}
	}
}