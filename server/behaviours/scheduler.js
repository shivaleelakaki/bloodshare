const
	schedule = require('node-schedule'),
	custom = require("../fbMessageFunctions/customMessageFunctions.js"),
	database = require("../database/dbPostgreSQL.js"),
	log = require('./logger.js'),
	common = require("./common.js"),
	users = require("../data/db.js"),
	_ = require('lodash');

//var rule = new schedule.RecurrenceRule();
//rule.second = [0, 10, 20, 30, 40, 50];
//var j = schedule.scheduleJob(rule, function(){
var j = schedule.scheduleJob('*/10 * * * *', function () {
	//log.info(new Date().getTime() + " Scheduler Running");
	users.removeTimedOutUsers(10, function (id) {
		//log.info(new Date().getTime()+" Deleted - id");
	});
});