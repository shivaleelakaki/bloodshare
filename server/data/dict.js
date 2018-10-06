const os = require('os');
const dict = {
	greeting: {
		0: {
			message: "Hi"
		},
		1: {
			message: "Hello"
		},
		2: {
			message: "Aloha"
		},
		3: {
			message: "Yo"
		},
		4: {
			message: "Hey"
		}
	},
	cuss: {
		0: {
			message: "Damn!"
		},
		1: {
			message: "Daaaaaaamn!"
		},
		2: {
			message: "Whoops!"
		},
		3: {
			message: "Crap!"
		}
	},
	goodbye: {
		0: {
			message: "Bye"
		},
		1: {
			message: "Goodbye"
		}
	},
	excited: {
		0: {
			message: "Yay!"
		},
		1: {
			message: "Woot!"
		},
		2: {
			message: "Hooray!"
		},
		3: {
			message: "Excellent!"
		},
		4: {
			message: "Yippie!"
		},
	},
	angst: {
		0: {
			message: "Whoa!"
		},
		1: {
			message: "Ruh!"
		},
		2: {
			message: "Gah!"
		},
		3: {
			message: "Shoot!"
		},
		4: {
			message: "Heck!"
		},
		5: {
			message: "Whoops!"
		},
		6: {
			message: "Dang!"
		},
	},
	confused: {
		0: {
			message: "Um..."
		},
		1: {
			message: "Uh?"
		},
		2: {
			message: "Erm."
		},
		3: {
			message: "Huh."
		},
		4: {
			message: "Sigh!"
		},
		5: {
			message: "Ugh!"
		},
	},
	niceday: {
		0: {
			message: "Have a great day"
		},
		1: {
			message: "Have an awesome day"
		},
		2: {
			message: "Have a super day"
		},
		3: {
			message: "Have a nice day"
		},
		4: {
			message: "Have a wicked day"
		}
	},
	welcomeUser: {
		0: {
			message: "How can I help you today?"
		}
	},
	welcomeReturningUser: {
		0: {
			message: "It's good to see you again"
		},
	},
	welcomeNewUser: {
		0: {
			message: "I'll help you some person who has required blood group "
		},
	},
	alreadyRegisterdUser: {
		0: {
			message: "You have already registered"
		},
	},
	welcomeUser_WrongReply: {
		0: {
			message: "Pick one of the buttons to continue"
		},
	},
	askDonorPickup: {
		0: {
			message: "What location is most convenient location for you to donate blood ? Type the name of the location, or just share the location using the map pin"
		},

	},
	askReqestPickup: {
		0: {
			message: "At which location do you need the blood? Type the name of the location, or share the location using the map pin"
		},
	},
	notValidLocation: {
		0: {
			message: "This doesn't seem to be a valid location. Type the location, or tap on the pushpin icon in the keyboard to continue"
		}
	},
	notValidLatLng: {
		0: {
			message: "I wasn't able to identify this location. Try picking a location close your area of interest instead"
		}
	},
	askLocationFound: {
		0: {
			message: "Didn't find your location in the list?"
		}
	},
	locationNotFoundMessageImage: {
		0: {
			message: "Share the location by tapping the pushpin/location icon"
		}
	},
		confirmedDonorMessage: {
		0: {
			message: "Fantastic! We have your details and will notify you when someone is in need of your blood type. Your act of kindness will go a long way in saving many lives-I’m proud of you, "
		}
	},
			confirmedRequesterMessage: {
		0: {
			message: "Fantastic! I’ll contact all donors in your area and will notify you as soon as I find a matching donor "
		}
	},
	ShareDonorMessage:{
		0:{
			message:"Share your blood deed and inspire others to save a life by donating blood too"		
		}
	},
	ShareRequesterMessage:{
		0:{
			message:"Share this message to increase the chances of finding a blood donor. The more you share, the more likely you’ll help someone in need"		
		}
	},
	locationFoundMessage: {
		0: {
			message: "Pick the closest location from the list above to continue"
		}
	},
	askDonorBloodGroup: {
		0: {
			message: "Tap to pick your blood group type"
		}
	},
	askReqestBloodGroup: {
		0: {
			message: "Tap to pick the blood group type you’re in need of"
		}
	},
	matchNotFound: {
		0: {
			message: "I didn't find any one for now,Don't worry though I'll inform you as soon as find some one"
		},
	},
	askBloodGroupWrong: {
		0: {
			message: "Oops, I didn’t recognize that blood group type? Tap on the appropriate blue bubble to pick  blood group type"
		},
	},
	 askDateTimeFreeForm:
      {
        0:{message:"What date & time do you wanna start this trip? Try entering something like Aug 30 9:30pm"},
      },
    askDateTimeFreeFormWrong:
      {
        0:{message:"I wasn't able to understand that. What date & time do you want to start this trip on? Eg. Aug 30 9:30pm"},
      },
    askDateTimeFreeFormPast:
      {
        0:{message:"You picked a date & time in the past. Pick a date & time in the foreseeable future"},
      },
    askDate:
      {
        0:{message:"What date do you wanna make this trip on? Eg. enter 30/8 for August 30"},
      },
    dateRestrictions:
      {
        0:{message:"Try entering something like 30/8 for August 30 (DD/MM format)"},
      },
    askDateWrongReplyPast:
      {
        0:{message:"You picked a date in the past. Pick a date in the foreseeable future"}
      },
    askDateWrongReplyQuick:
      {
        0:{message:"Pick the date on which you want to make this trip"}
      },
    askDateWrongReply:
      {
        0:{message:"I didn't understand that. Please enter the date in DD/MM format. Eg. type 30/8 for August 30 (DD/MM format)"}
      },
    askTime:
      {
        0:{message:"What time do you wanna start this trip? Enter something like 10:30PM, or 22:30"}
      },
    askTimeWrongReply:
      {
        0:{message:"Shoot! I wasn’t able to understand that. Enter something like 10:30PM, or 22:30 (HH:MM format)"},
      },
    askTimeWrongPast:
      {
        0:{message:"You picked a time in the past. Pick a time in the foreseeable future"}
      },
	matchFound: {
		0: {
			message: "Here are the donor for "
		},
	},
	matchFoundMessage: {
		0: {
			message: "Share this to reach more people"
		},
	},
	askDonorMobileNumber: {
		0: {
			message: "Enter your mobile number with the country code. For instance if you use an India number then type 91XXXXXXXXXX"
		},
	},
	askRequestMobileNumber: {
		0: {
			message: "Type your mobile number with the country code. For instance if you use an India number then type 91XXXXXXXXXX"
		},
	},
	askOTP: {
		0: {
			message: "Enter the code I sent you in the text message to proceed"
		},
	},
	resendOTP: {
		0: {
			message: "Sent you a code again; enter the code to proceed"
		},
	},
	askOTPWrong: {
		0: {
			message: "The code you entered is incorrect. Try entering it again"
		},
	},
	askPhoneCountry: {
		0: {
			message: "Is your number from "
		},
	},
	askMobileNumberWrong: {
		0: {
			message: "Whoops! Try entering your mobile number with the country code again"
		},
	},
	mobileVerified: {
		0: {
			message: "your number has been verified! Finding matches now..."
		},
	},
	requestConfirmed: {
		0: {
			message: "Looking for donor for you........"
		},
	},
	errorCommon: {
		0: {
			message: "I wasn't able to understand that. Try this quick tutorial"
		},
		1: {
			message: "I tried hard but wasn’t able to understand what you entered.Perhaps quick tutorial might help"
		}
	},
	inappropriateButtonClick: {
		0: {
			message: "I need the information asked in the previous message in order to proceed"
		},
	},
	thankBefore: {
		0: {
			message: "For registering for a social service.I'll keep you posted on blood requirements in your locality"
		}
	},
	thanksStayInTouch: {
		0: {
			message: "Thanks! I'll stay in touch "
		}
	}
};

module.exports = dict;