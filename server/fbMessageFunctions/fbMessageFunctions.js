/*
 * Send an image using the Send API.
 *
 */
const
	callSendAPI = require('../api/callFBSendAPI.js');

module.exports = {
	sendImageMessage: function (recipientId) {
		var messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "image",
					payload: {
						url: "http://messengerdemo.parseapp.com/img/rift.png"
					}
				}
			}
		};

		callSendAPI(messageData);
	},

	/*
	 * Send a Gif using the Send API.
	 *
	 */
	sendGifMessage: function (recipientId) {
		var messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "image",
					payload: {
						url: "http://messengerdemo.parseapp.com/img/instagram_logo.gif"
					}
				}
			}
		};

		callSendAPI(messageData);
	},

	/*
	 * Send audio using the Send API.
	 *
	 */
	sendAudioMessage: function (recipientId) {
		var messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "audio",
					payload: {
						url: "http://messengerdemo.parseapp.com/audio/sample.mp3"
					}
				}
			}
		};

		callSendAPI(messageData);
	},

	/*
	 * Send a video using the Send API.
	 *
	 */
	sendVideoMessage: function (recipientId) {
		var messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "video",
					payload: {
						url: "http://messengerdemo.parseapp.com/video/allofus480.mov"
					}
				}
			}
		};

		callSendAPI(messageData);
	},

	/*
	 * Send a video using the Send API.
	 *
	 */
	sendFileMessage: function (recipientId) {
		var messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "file",
					payload: {
						url: "http://messengerdemo.parseapp.com/files/test.txt"
					}
				}
			}
		};

		callSendAPI(messageData);
	},

	/*
	 * Send a text message using the Send API.
	 *
	 */
	sendTextMessage: function (recipientId, messageText) {
		var messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messageText,
				metadata: "FB_TEXT_MESSAGE_META_DATA"
			}
		};

		callSendAPI(messageData);
	},

	/*
	 * Send a button message using the Send API.
	 *
	 */
	sendButtonMessage: function (recipientId) {
		var messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "button",
						text: "This is test text",
						buttons: [{
							type: "web_url",
							url: "https://www.oculus.com/en-us/rift/",
							title: "Open Web URL"
            }, {
							type: "postback",
							title: "Trigger Postback",
							payload: "DEVELOPED_DEFINED_PAYLOAD"
            }, {
							type: "phone_number",
							title: "Call Phone Number",
							payload: "+16505551234"
            }]
					}
				}
			}
		};

		callSendAPI(messageData);
	},

	/*
	 * Send a Structured Message (Generic Message type) using the Send API.
	 *
	 */
	sendGenericMessage: function (recipientId) {
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
							title: "touch",
							subtitle: "Your Hands, Now in VR",
							item_url: "https://www.oculus.com/en-us/touch/",
							image_url: "http://messengerdemo.parseapp.com/img/touch.png",
							buttons: [{
								type: "postback",
								title: "#find",
								payload: "KRISH_PAYLOAD",
              }]
            }]
					}
				}
			}
		};

		callSendAPI(messageData);
	},

	/*
	 * Send a receipt message using the Send API.
	 *
	 */
	sendReceiptMessage: function (recipientId) {
		// Generate a random receipt ID as the API requires a unique ID
		var receiptId = "order" + Math.floor(Math.random() * 1000);

		var messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "receipt",
						recipient_name: "Peter Chang",
						order_number: receiptId,
						currency: "USD",
						payment_method: "Visa 1234",
						timestamp: "1428444852",
						elements: [{
							title: "Oculus Rift",
							subtitle: "Includes: headset, sensor, remote",
							quantity: 1,
							price: 599.00,
							currency: "USD",
							image_url: "http://messengerdemo.parseapp.com/img/riftsq.png"
            }, {
							title: "Samsung Gear VR",
							subtitle: "Frost White",
							quantity: 1,
							price: 99.99,
							currency: "USD",
							image_url: "http://messengerdemo.parseapp.com/img/gearvrsq.png"
            }],
						address: {
							street_1: "1 Hacker Way",
							street_2: "",
							city: "Menlo Park",
							postal_code: "94025",
							state: "CA",
							country: "US"
						},
						summary: {
							subtotal: 698.99,
							shipping_cost: 20.00,
							total_tax: 57.67,
							total_cost: 626.66
						},
						adjustments: [{
							name: "New Customer Discount",
							amount: -50
            }, {
							name: "$100 Off Coupon",
							amount: -100
            }]
					}
				}
			}
		};

		callSendAPI(messageData);
	},

	/*
	 * Send a message with Quick Reply buttons.
	 *
	 */
	sendQuickReply: function (recipientId) {
		var messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: "What's your favorite movie genre?",
				metadata: "DEVELOPER_DEFINED_METADATA",
				quick_replies: [
					{
						"content_type": "text",
						"title": "Action",
						"payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"
          },
					{
						"content_type": "text",
						"title": "Comedy",
						"payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
          },
					{
						"content_type": "text",
						"title": "Drama",
						"payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
          }
        ]
			}
		};

		callSendAPI(messageData);
	},

	/*
	 * Send a read receipt to indicate the message has been read
	 *
	 */
	sendReadReceipt: function (recipientId) {
		console.log("Sending a read receipt to mark message as seen");

		var messageData = {
			recipient: {
				id: recipientId
			},
			sender_action: "mark_seen"
		};

		callSendAPI(messageData);
	},

	/*
	 * Turn typing indicator on
	 *
	 */
	sendTypingOn: function (recipientId) {
		console.log("Turning typing indicator on");

		var messageData = {
			recipient: {
				id: recipientId
			},
			sender_action: "typing_on"
		};

		callSendAPI(messageData);
	},

	/*
	 * Turn typing indicator off
	 *
	 */
	sendTypingOff: function (recipientId) {
		console.log("Turning typing indicator off");

		var messageData = {
			recipient: {
				id: recipientId
			},
			sender_action: "typing_off"
		};

		callSendAPI(messageData);
	}
};