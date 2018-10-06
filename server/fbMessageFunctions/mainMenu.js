const request = require('request'),
	config = require("../config.js"),
	PAGE_ACCESS_TOKEN = config.PAGE_ACCESS_TOKEN;

module.exports = {

	setThreadSetting: function (messageData) {
		request({
			uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
			qs: {
				access_token: PAGE_ACCESS_TOKEN
			},
			method: 'POST',
			json: messageData

		}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body);
			} else {
				console.error("Error while Thread settings");
				console.error(error);
			}
		});
	},
	deleteGettingStarted: function (deleteReq) {
		request({
			uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
			qs: {
				access_token: PAGE_ACCESS_TOKEN
			},
			method: 'DELETE',
			json: deleteReq

		}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body);
			} else {
				console.error("Unable to delete Getting Started Button.");
				console.error(error);
			}
		});
	},

	/*
	 * Delete the Persistent Menu List.
	 * If successful, we'll get a success message in the response.
	 *
	 */
	deletePersistentMenu: function (deleteReq) {
		request({
			uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
			qs: {
				access_token: PAGE_ACCESS_TOKEN
			},
			method: 'DELETE',
			json: deleteReq

		}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body);
			} else {
				console.error("Unable to delete Getting Started Button.");
				console.error(error);
			}
		});
	}

};