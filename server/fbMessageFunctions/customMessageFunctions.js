const
	callSendAPI = require('../api/callFBSendAPI.js'),
	fbMes = require("./fbMessageFunctions.js"),
	dict = require('../data/dict.js'),
	states = require('../data/states.js'),
	random = require("../behaviours/random.js"),
	common = require("../behaviours/common.js"),
	log = require('../behaviours/logger.js'),
	config = require("../config.js"),
	os = require('os');

module.exports = {



	welcomeCall: function (recipientId, userName, usertype, isAlreadyDonor) {
		console.log("welcome call function" + recipientId + userName + usertype + isAlreadyDonor)
		
		let greet = random(dict.greeting);
		let greetFollow;
		if (usertype == "old") greetFollow = random(dict.welcomeReturningUser);
		else if (usertype == "new") greetFollow = random(dict.welcomeNewUser);
		else greetFollow = random(dict.welcomeUser);
		if (isAlreadyDonor == "yes") {
			var buttons = [{
				//type: "postback",
				"content_type": "text",
				"title": "Need blood",
				"payload": "WELCOME_CALL_REPLY_FOR_NEED"
            }]
		} else {

		var buttons = [{
				//type: "postback",
				"content_type": "text",
				"title": "Donate Blood",
				"payload": "WELCOME_CALL_REPLY_FOR_REGISTER"
            }, {
				//type: "postback",
				"content_type": "text",
				"title": "Need blood",
				"payload": "WELCOME_CALL_REPLY_FOR_NEED"
            }]
			}
		var messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: greet.message + " " + userName + ". " + greetFollow.message,
				metadata: "WELCOME_MESSAGE",
				quick_replies: buttons
					/*attachment: {
						type: "template",
						payload: {
							//template_type: "button",
							//text: greet.message + " " + userName + ". " + greetFollow.message,
							//buttons: buttons
							
						}
					}*/
			}
		};

		callSendAPI(messageData);
	},


	askBloodGroup: function (recipientId, type) {
		var messData;
		if (type == "donor") {
			messData = random(dict.askDonorBloodGroup);
		} else {
			messData = random(dict.askReqestBloodGroup);

		}
		/*let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "BLOOD_GROUP"
			}
		};*/
		var messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "BLOOD_GROUP",
				quick_replies: [{
					"content_type": "text",
					"title": "A+",
					"payload": "PICK_BLOODGROUP_A+"
		               }, {
					"content_type": "text",
					"title": "A-",
					"payload": "PICK_BLOODGROUP_A-"
		               }, {
					"content_type": "text",
					"title": "B+",
					"payload": "PICK_BLOODGROUP_B+"
		               }, {
					"content_type": "text",
					"title": "B-",
					"payload": "PICK_BLOODGROUP_B-"
		               }, {
					"content_type": "text",
					"title": "AB+",
					"payload": "PICK_BLOODGROUP_AB+"
		               }, {
					"content_type": "text",
					"title": "AB-",
					"payload": "PICK_BLOODGROUP_AB-"
		               }, {
					"content_type": "text",
					"title": "O+",
					"payload": "PICK_BLOODGROUP_O-"
		               }, {
					"content_type": "text",
					"title": "O-",
					"payload": "PICK_BLOODGROUP_O-"
		               }]
			}
		};

		callSendAPI(messageData);
	},

	pickUpLocationMessage: function (recipientId, type) {
		let messData;
		if (type == "donor") {
			messData = random(dict.askDonorPickup);
		} else {
			messData = random(dict.askReqestPickup);

		}

		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "PICKUP_LOCATION"
			}
		};
		callSendAPI(messageData);
	},

	locsListMessage: function (recipientId, locsList, locType) {
		if (locType == "pickup") locType = "PICKUP_LOCATION_";
		else if (locType == "drop") locType = "DROP_LOCATION_";
		else return;
		let elementsArray = [];
		for (let i = 0;
			(i < locsList.length) && (i < 10); i++) {
			elementsArray.push({
				title: common.trimTitle(locsList[i].title),
				//image_url: config.HOST_NAME+"images/share-location.jpg",
				image_url: "http://i.imgur.com/XsEs8yU.jpg",
				buttons: [
					{
						type: "postback",
						title: "Incorrect location",
						payload: "LIST_LOCATION_NOT_FOUND",
      		  },
					{
						type: "postback",
						title: "Pick this location",
						payload: locType + i,
            }
          ]
			});
		};
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "generic",
						elements: elementsArray
					}
				}
			}
		};
		callSendAPI(messageData);
	},

	askLocationFound: function (recipientId) {
		let messData = random(dict.askLocationFound);
		var messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "button",
						text: messData.message,
						buttons: [{
							type: "postback",
							title: "Found my location",
							payload: "LIST_LOCATION_FOUND"
            }, {
							type: "postback",
							title: "Didn't find",
							payload: "LIST_LOCATION_NOT_FOUND"
            }]
					}
				}
			}
		};

		callSendAPI(messageData);
	},
	matchesListMessage: function (recipientId, userMatchList) {
		let elementsArray = [];
		userMatchList.forEach(function (user) {
			elementsArray.push({
				title: user.name,
				subtitle: "Location: " + common.trimString(user.pickup) + os.EOL + "Blood Group: " + user.bloodGroup,
				image_url: user.profilePicture,
				buttons: [
					{
						type: "phone_number",
						title: "Call person",
						payload: user.mobileNumber,
            }
          ]
			});
		});
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "generic",
						elements: elementsArray
					}
				}
			}
		};
		callSendAPI(messageData);
	},
	locationFoundMessage: function (recipientId) {
		let messData = random(dict.locationFoundMessage);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "LIST_LOCATION_FOUND_REPLY"
			}
		};
		callSendAPI(messageData);
	},

	locationNotFoundMessage1: function (recipientId) {
		let messData = random(dict.locationNotFoundMessage);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "LOCATION_NOT_FOUND_REPLY"
			}
		};
		callSendAPI(messageData);
	},
	locationNotFoundMessage: function (recipientId) {
		let messData = random(dict.locationNotFoundMessageImage);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "LOCATION_NOT_FOUND_REPLY"
			}
		};
		callSendAPI(messageData);
	},
	notValidLocation: function (recipientId) {
		let confused = random(dict.confused);
		let messData = random(dict.notValidLocation);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: confused.message + " " + messData.message,
				metadata: "NOT_A_LOCATION"
			}
		};
		callSendAPI(messageData);
	},

	notValidLatLng: function (recipientId) {
		let confused = random(dict.confused);
		let messData = random(dict.notValidLatLng);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: confused.message + " " + messData.message,
				metadata: "LAT_LNG_PROB"
			}
		};
		callSendAPI(messageData);
	},

	locationMessageWrongReplyImage: function (recipientId) {
		var messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "image",
					payload: {
						//url: config.HOST_NAME+"images/locationButton.jpg"
						url: "http://i.imgur.com/2evfzUx.jpg"
					}
				}
			}
		};
		callSendAPI(messageData);
	},



	mobileVerified: function (recipientId) {
		let excited = random(dict.excited);
		let messData = random(dict.mobileVerified);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: excited.message + " " + messData.message,
				metadata: "RIDE_CONFIRMATION"
			}
		};
		callSendAPI(messageData);
	},

	askMobileNumber: function (recipientId, type) {
		let messData;

		if (type == "donor") {
			messData = random(dict.askDonorMobileNumber)
		} else {
			messData = random(dict.askRequestMobileNumber);

		}
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "ASK_MOBILE"
			}
		};
		callSendAPI(messageData);
	},

	askMobileNumberWrong: function (recipientId) {
		let messData = random(dict.askMobileNumberWrong);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "ASK_MOBILE_WRONG"
			}
		};
		callSendAPI(messageData);
	},
	askBloodGroupWrong: function (recipientId) {
		let messData = random(dict.askBloodGroupWrong);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "ASK_BLOOD_GROUP_WRONG"
			}
		};
		callSendAPI(messageData);
	},

	askOTP: function (recipientId) {
		let messData = random(dict.askOTP);
		let messageData = {
			recipient: {
				id: recipientId
			},
			/*message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "button",
						text: messData.message,
						buttons: [{
							type: "postback",
							title: "Resend code",
							payload: "OTP_RESEND"
            }, {
							type: "postback",
							title: "Change my number",
							payload: "OTP_CHANGE_MOBILE"
            }]
					}
				}
			}*/
			message: {
				text: messData.message,
				metadata: "ASK_OTP"
			}
		};
		callSendAPI(messageData);
	},
	ShareDonorCardMessage: function (recipientId, userName, messageType, pickup, bloodGroup) {
		let message;
		if (messageType == "donor") {
			//messData = random(dict.thankBefore);
			//message = "Thanks " + userName + "! " + messData.message;

		} else if (messageType == "requestMatchNotFound") {
			let angst = random(dict.angst);
			let messData = random(dict.matchNotFound);
			message = angst.message + " " + messData.message;


		} else {
			let messData = random(dict.matchFoundMessage);
			message = messData.message;

		}
		var messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "generic",
						elements: [{
							title: userName + " saved a life by giving blood",

							subtitle: "Location: " + common.trimString(pickup) + os.EOL + os.EOL + "Blood Group: " + bloodGroup,
							//image_url: config.HOST_NAME+"images/trip-details.jpg",
							image_url: "http://i.imgur.com/2ILxlnQ.jpg",
							buttons: [
								{
									type: "postback",
									title: "Share On Facebook",
									payload: "SHARE_ON_FACEBOOK",
                },
								{
									type: "postback",
									title: "Share on Whatsapp",
									payload: "SHARE_ON_WHATSAPP",

                }
              ]
            }]
					}
				}
			}
		};
		callSendAPI(messageData);
	},
	ShareRequesterCardMessage: function (recipientId, userName, pickup, bloodGroup, date, time) {
		console.log(recipientId + userName + pickup + bloodGroup + date + time);

		var messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "generic",
						elements: [{
							title: userName + " needs blood. Share to help!",
							//subtitle: "Location: " + common.trimString(pickup) + os.EOL + os.EOL + "Blood Group: " + bloodGroup,
							subtitle: "Location: " + common.trimString(pickup)  + os.EOL + "Blood Group: " + bloodGroup + os.EOL + "When: " + date.replace(", " + (new Date()).getFullYear(), "") + " @" + time,
							//image_url: config.HOST_NAME+"images/trip-details.jpg",
							image_url: "http://i.imgur.com/2ILxlnQ.jpg",
							buttons: [
								{
									type: "postback",
									title: "Share On Facebook",
									payload: "SHARE_ON_FACEBOOK",
                				},
								{
									type: "postback",
									title: "Share on Whatsapp",
									payload: "SHARE_ON_WHATSAPP",

                					}
              					]
            }]
					}
				}
			}
		};
		callSendAPI(messageData);
	},
	confirmedDonorMessage: function (recipientId, userName) {
		let messData = random(dict.confirmedDonorMessage);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message + userName + "!",
				metadata: "CONFIREMD_DONOR_MESSAGE"
			}
		};
		callSendAPI(messageData);
	},
	confirmedRequesterMessage: function (recipientId, userName) {
		let messData = random(dict.confirmedRequesterMessage);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message + userName + "!",
				metadata: "CONFIREMD_REQUESTER_MESSAGE"
			}
		};
		callSendAPI(messageData);
	},
	ShareDonorMessage: function (recipientId) {
		let messData = random(dict.ShareDonorMessage);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "SHARE_DONOR_MESSAGE"
			}
		};
		callSendAPI(messageData);
	},
	ShareRequesterMessage: function (recipientId) {
		let messData = random(dict.ShareRequesterMessage);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "SHARE_REQUESTER_MESSAGE"
			}
		};
		callSendAPI(messageData);
	},
	askDateTimeFreeForm: function (recipientId) {
		let messData = random(dict.askDateTimeFreeForm);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "CHOOSE_DATE_TIME_FREE_FORM"
					/*quick_replies: [
					  {
					    "content_type":"text",
					    "title":"in 30min",
					    "payload":"CHOOSE_DATE_TIME_FREE_FORM_30MIN"
					  },
					  {
					    "content_type":"text",
					    "title":"in 1hr",
					    "payload":"CHOOSE_DATE_TIME_FREE_FORM_1HOUR"
					  },
					  {
					    "content_type":"text",
					    "title":"in 90min",
					    "payload":"CHOOSE_DATE_TIME_FREE_FORM_90MIN"
					  },
					  {
					    "content_type":"text",
					    "title":"in 2hr",
					    "payload":"CHOOSE_DATE_TIME_FREE_FORM_2HOUR"
					  },
					  {
					    "content_type":"text",
					    "title":"in 3hr",
					    "payload":"CHOOSE_DATE_TIME_FREE_FORM_3HOUR"
					  },
					  {
					    "content_type":"text",
					    "title":"in 4hr",
					    "payload":"CHOOSE_DATE_TIME_FREE_FORM_4HOUR"
					  },
					  {
					    "content_type":"text",
					    "title":"in 6hr",
					    "payload":"CHOOSE_DATE_TIME_FREE_FORM_6HOUR"
					  }
					]*/
			}
		};
		callSendAPI(messageData);
	},

	askDateTimeFreeFormWrong: function (recipientId) {
		let messData = random(dict.askDateTimeFreeFormWrong);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "CHOOSE_DATE_TIME_FREE_FORM_WRONG"
					/*quick_replies: [
					  {
					    "content_type":"text",
					    "title":"in 30min",
					    "payload":"CHOOSE_DATE_TIME_FREE_FORM_30MIN"
					  },
					  {
					    "content_type":"text",
					    "title":"in 1hr",
					    "payload":"CHOOSE_DATE_TIME_FREE_FORM_1HOUR"
					  },
					  {
					    "content_type":"text",
					    "title":"in 90min",
					    "payload":"CHOOSE_DATE_TIME_FREE_FORM_90MIN"
					  },
					  {
					    "content_type":"text",
					    "title":"in 2hr",
					    "payload":"CHOOSE_DATE_TIME_FREE_FORM_2HOUR"
					  },
					  {
					    "content_type":"text",
					    "title":"in 3hr",
					    "payload":"CHOOSE_DATE_TIME_FREE_FORM_3HOUR"
					  },
					  {
					    "content_type":"text",
					    "title":"in 4hr",
					    "payload":"CHOOSE_DATE_TIME_FREE_FORM_4HOUR"
					  },
					  {
					    "content_type":"text",
					    "title":"in 6hr",
					    "payload":"CHOOSE_DATE_TIME_FREE_FORM_6HOUR"
					  }
					]*/
			}
		};
		callSendAPI(messageData);
	},

	askDateTimeFreeFormPast: function (recipientId) {
		let messData = random(dict.askDateTimeFreeFormPast);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "CHOOSE_DATE_TIME_FREE_FORM_WRONG",
				/*quick_replies: [
				  {
				    "content_type":"text",
				    "title":"in 30min",
				    "payload":"CHOOSE_DATE_TIME_FREE_FORM_30MIN"
				  },
				  {
				    "content_type":"text",
				    "title":"in 1hr",
				    "payload":"CHOOSE_DATE_TIME_FREE_FORM_1HOUR"
				  },
				  {
				    "content_type":"text",
				    "title":"in 90min",
				    "payload":"CHOOSE_DATE_TIME_FREE_FORM_90MIN"
				  },
				  {
				    "content_type":"text",
				    "title":"in 2hr",
				    "payload":"CHOOSE_DATE_TIME_FREE_FORM_2HOUR"
				  },
				  {
				    "content_type":"text",
				    "title":"in 3hr",
				    "payload":"CHOOSE_DATE_TIME_FREE_FORM_3HOUR"
				  },
				  {
				    "content_type":"text",
				    "title":"in 4hr",
				    "payload":"CHOOSE_DATE_TIME_FREE_FORM_4HOUR"
				  },
				  {
				    "content_type":"text",
				    "title":"in 6hr",
				    "payload":"CHOOSE_DATE_TIME_FREE_FORM_6HOUR"
				  }
				]*/
			}
		};
		callSendAPI(messageData);
	},

	askDateMessage: function (recipientId) {
		let messData = random(dict.askDate);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "CHOOSE_DATE",
				quick_replies: [
					{
						"content_type": "text",
						"title": "Today",
						"payload": "CHOOSE_DATE_REPLY_FOR_TODAY"
          },
					{
						"content_type": "text",
						"title": "Tomorrow",
						"payload": "CHOOSE_DATE_REPLY_FOR_TOMORROW"
          },
					{
						"content_type": "text",
						"title": "Other",
						"payload": "CHOOSE_DATE_REPLY_FOR_OTHER"
          }
        ]
			}
		};
		callSendAPI(messageData);
	},

	askDateWrongQuick: function (recipientId) {
		let messData = random(dict.askDateWrongReplyQuick);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "CHOOSE_DATE",
				quick_replies: [
					{
						"content_type": "text",
						"title": "Today",
						"payload": "CHOOSE_DATE_REPLY_FOR_TODAY"
          },
					{
						"content_type": "text",
						"title": "Tomorrow",
						"payload": "CHOOSE_DATE_REPLY_FOR_TOMORROW"
          },
					{
						"content_type": "text",
						"title": "Other",
						"payload": "CHOOSE_DATE_REPLY_FOR_OTHER"
          }
        ]
			}
		};
		callSendAPI(messageData);
	},

	askOtherDate: function (recipientId) {
		let messData = random(dict.dateRestrictions);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "ASK_OTHER_DATE"
			}
		};
		callSendAPI(messageData);
	},

	askDateWrongPast: function (recipientId) {
		let messData = random(dict.askDateWrongReplyPast);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "ASK_DATE_WRONG_PAST"
			}
		};
		callSendAPI(messageData);
	},

	askDateWrongPastQuick: function (recipientId) {
		let messData = random(dict.askDateWrongReplyPast);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "CHOOSE_DATE",
				quick_replies: [
					{
						"content_type": "text",
						"title": "Today",
						"payload": "CHOOSE_DATE_REPLY_FOR_TODAY"
          },
					{
						"content_type": "text",
						"title": "Tomorrow",
						"payload": "CHOOSE_DATE_REPLY_FOR_TOMORROW"
          },
					{
						"content_type": "text",
						"title": "Other",
						"payload": "CHOOSE_DATE_REPLY_FOR_OTHER"
          }
        ]
			}
		};
		callSendAPI(messageData);
	},

	askDateWrong: function (recipientId) {
		let messData = random(dict.askDateWrongReply);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "ASK_DATE_WRONG"
			}
		};
		callSendAPI(messageData);
	},

	askTime: function (recipientId) {
		let messData = random(dict.askTime);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "ASK_TIME"
			}
		};
		callSendAPI(messageData);
	},

	askTimeWrong: function (recipientId) {
		let messData = random(dict.askTimeWrongReply);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "ASK_TIME_WRONG"
			}
		};
		callSendAPI(messageData);
	},

	askTimeWrongPast: function (recipientId) {
		let messData = random(dict.askTimeWrongPast);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "ASK_TIME_WRONG_PAST"
			}
		};
		callSendAPI(messageData);
	},

	resendOTP: function (recipientId) {
		let messData = random(dict.resendOTP);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "RESEND_OTP"
			}
		};
		callSendAPI(messageData);
	},

	askOTPWrong: function (recipientId) {
		let messData = random(dict.askOTPWrong);
		let messageData = {
			recipient: {
				id: recipientId
			},
			/*message: {
				text: messData.message,
				metadata: "ASK_OTP_AGAIN"
			}*/
			message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "button",
						text: messData.message,
						buttons: [{
							type: "postback",
							title: "Resend code",
							payload: "OTP_RESEND"
            }, {
							type: "postback",
							title: "Change my number",
							payload: "OTP_CHANGE_MOBILE"
            }]
					}
				}
			}
		};
		callSendAPI(messageData);
	},
	finalDonorConfirmationMessage: function (recipientId, pickup, bloodGroup) {
		let currentDate = new Date();
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "generic",
						elements: [{
							title: "Your Details",
							subtitle: "Location: " + common.trimString(pickup) + os.EOL + os.EOL + "Blood Group: " + bloodGroup,
							//image_url: config.HOST_NAME+"images/trip-details.jpg",
							image_url: "http://i.imgur.com/2ILxlnQ.jpg",
							buttons: [
								{
									type: "postback",
									title: "Change Blood Group",
									payload: "FINAL_DONOR_CONFIRMATION_CHANGE_BLOODGROUP",
                },
								{
									type: "postback",
									title: "Change Location",
									payload: "FINAL_DONOR_CONFIRMATION_CHANGE_LOCATION",
                },
								{
									type: "postback",
									title: "Confirm",
									payload: "FINAL_DONOR_CONFIRM",
                }
              ]
            }]
					}
				}
			}
		};
		callSendAPI(messageData);
	},
	finalRequesterConfirmationMessage: function (recipientId, pickup, bloodGroup, date, time) {
		let currentDate = new Date();
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "generic",
						elements: [{
							title: "Your Request",
							subtitle: "Location: " + common.trimString(pickup) + os.EOL + os.EOL + "Blood Group: " + bloodGroup + os.EOL + "When: " + date.replace(", " + currentDate.getFullYear(), "") + " @" + time,
							//image_url: config.HOST_NAME+"images/trip-details.jpg",
							image_url: "http://i.imgur.com/2ILxlnQ.jpg",
							buttons: [
								{
									type: "postback",
									title: "Change Request",
									payload: "FINAL_REQUEST_CONFIRMATION_CHANGE",
                },
								{
									type: "postback",
									title: "Confirm",
									payload: "FINAL_REQUEST_CONFIRMATION_CONFIRM",
                }
              ]
            }]
					}
				}
			}
		};
		callSendAPI(messageData);
	},
	changeRequestCardMessage: function (recipientId, pickup, bloodGroup, date, time) {

		let currentDate = new Date();
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "generic",
						elements: [{
							title: "Your Request",
							subtitle: "Location: " + common.trimString(pickup) + os.EOL + os.EOL + "Blood Group: " + bloodGroup + os.EOL + "When: " + date.replace(", " + currentDate.getFullYear(), "") + " @" + time,
							//image_url: config.HOST_NAME+"images/trip-details.jpg",
							image_url: "http://i.imgur.com/2ILxlnQ.jpg",
							buttons: [
								{
									type: "postback",
									title: "Change Blood group",
									payload: "REQUEST_CHANGE_BLOODGROUP",
                				},
								{
									type: "postback",
									title: "Change Location",
									payload: "REQUEST_CHANGE_LOCATION",
									},
								{
									type: "postback",
									title: "Change Time",
									payload: "REQUEST_CHANGE_TIME",
                }
              ]
            }]
					}
				}
			}
		};
		callSendAPI(messageData);
	},

	alreadyRegisterdUser: function (recipientId) {
		let messData = random(dict.alreadyRegisterdUser);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "REGISTERED_ALREADY"
			}
		};
		callSendAPI(messageData);
	},

	askWhichCountry: function (recipientId, country) {
		let messData = random(dict.askPhoneCountry);
		var messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message + " " + country + "?",
				metadata: "ASK_COUNTRY",
				quick_replies: [
					{
						"content_type": "text",
						"title": "Yes",
						"payload": "COUNTRY_YES"
          },
					{
						"content_type": "text",
						"title": "No",
						"payload": "COUNTRY_NO"
          }
        ]
			}
		};
		callSendAPI(messageData);
	},
		askReadyToDonate: function (recipientId) {
		let messData = random(dict.askPhoneCountry);
		var messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				//text: messData.message + " " + country + "?",
				text : "Someone one looking for a donor Are you willing to donate?",
				metadata: "ASK_WILLING_TO_DONATE",
				quick_replies: [
					{
						"content_type": "text",
						"title": "Yes",
						"payload": "READY_TO_DONATE_YES"
          },
					{
						"content_type": "text",
						"title": "No",
						"payload": "READY_TO_DONATE_NO"
          }
        ]
			}
		};
		callSendAPI(messageData);
	},


	matchFoundMessage: function (recipientId, userName, bloodgroup) {
		let messData = random(dict.matchFound);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message + " " + bloodgroup + " bloodgroup",
				metadata: "MATCH_FOUND"
			}
		};
		callSendAPI(messageData);
	},

	matchFoundOthersMessage: function (recipientId, userName) {
		let messData = random(dict.matchFound);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.greet + userName + "! " + messData.message,
				metadata: "MATCH_FOUND_OTHERS"
			}
		};
		callSendAPI(messageData);
	},


	inappropriateButtonClick: function (recipientId) {
		let messData = random(dict.inappropriateButtonClick);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "INAPPROPRIATE"
			}
		};
		callSendAPI(messageData);
	},
	matchFoundMessage: function (recipientId, userName, bloodgroup) {
		let messData = random(dict.matchFound);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message + bloodgroup + " bloodgroup",
				metadata: "MATCH_FOUND"
			}
		};
		callSendAPI(messageData);
	},

	matchFoundOthersMessage: function (recipientId, userName) {
		//  let messData = random(dict.matchFound);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: "Match not found other",
				metadata: "MATCH_FOUND_OTHERS"
			}
		};
		callSendAPI(messageData);
	},

	requestConfirmed: function (recipientId) {
		let messData = random(dict.requestConfirmed);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "REQUEST_CONFIRMATION"
			}
		};
		callSendAPI(messageData);
	},

	errorCommonMessage: function (recipientId) {
		let angst = random(dict.angst);
		let messData = random(dict.errorCommon);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: angst.message + " " + messData.message + os.EOL + os.EOL + config.TUTORIAL_URL,
				metadata: "ERROR_MESSAGE_KILL"
			}
		};
		callSendAPI(messageData);
	},

	sendTypingOn: function (recipientId) {

		var messageData = {
			recipient: {
				id: recipientId
			},
			sender_action: "typing_on"
		};

		callSendAPI(messageData);
	},
	goodbye: function (recipientId) {
		let messData = random(dict.goodbye);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message + " :)",
				metadata: "GOOD_BYE"
			}
		};
		callSendAPI(messageData);
	},

	goodbyeConversion: function (recipientId) {
		let messData = random(dict.goodbye);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: "Thanks for dropping by. " + messData.message,
				metadata: "GOOD_BYE_CONVERSION"
			}
		};
		callSendAPI(messageData);
	},
	helpMessage: function (recipientId, state) {

		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: "HELP",
				metadata: "HELP"
			}
		};
		callSendAPI(messageData);
	},

	thanksStayInTouch: function (recipientId) {
		let messData = random(dict.thanksStayInTouch);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "GOOD_BYE_STAY"
			}
		};
		callSendAPI(messageData);
	}
};