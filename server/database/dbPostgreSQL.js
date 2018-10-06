const
	Sequelize = require('sequelize');
//log = require('../behaviours/logger.js');
//const sequelize = new Sequelize('postgres://chintakr:@localhost:5432/chintakr', {logging:function logging(msg){log.info('[DATABASE] ' + msg);}});
//const sequelize = new Sequelize('postgres://xportapp:xP0rT0pp20!6@localhost:5432/xportapp', {logging:function logging(msg){log.info('[DATABASE] ' + msg);}});
const sequelize = new Sequelize('postgres://uesndonefexzbt:DMVcI5t35viN5dsl9DJNvfrw0Z@ec2-54-243-204-74.compute-1.amazonaws.com:5432/d4cc8m66rq7u1t', {
	logging: false
});
sequelize
	.authenticate()
	.then(function (err) {
		// log.info('Connected to PostgreSQL');
		console.log("Connected to PS" + err);
	})
	.catch(function (err) {
		//log.error('Unable to connect to the database:', err);
		console.log("error Connected to PS" + err);
	});

const inFile = module.exports = {
	insertUsertoBOT: function (_fpid, _firstName, _lastName, _emailID, _mobile, _profilePicture, _gender, _verified,_mobileCounty, _profileUniqueCode, _timezone, _callback) {
		sequelize.query('SELECT * FROM insert_bloodshare_bot_users(:param1,:param2,:param3, :param4, :param5, :param6, :param7, :param8, :param9, :param10,:param11 )', {
			replacements: {
				param1: _fpid,
				param2: _firstName,
				param3: _lastName,
				param4: _emailID,
				param5: _mobile,
				param6: _profilePicture,
				param7: _gender,
				param8: _verified,
				param9:_mobileCounty,
				param10: _profileUniqueCode,
				param11: _timezone
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function (userDetails) {
			_callback(userDetails[0]);
		});
	},
	updateUserDetails: function (_fpid, _firstName, _lastName, _emailID, _mobile, _profilePicture, _gender, _verified,_mobileCountry, _profileUniqueCode, _callback) {
		
		sequelize.query('SELECT * FROM update_bloodshare_bot_user(:param1,:param2,:param3, :param4, :param5, :param6, :param7, :param8, :param9, :param10 )', {
			replacements: {
				param1: _fpid,
				param2: _firstName,
				param3: _lastName,
				param4: _emailID,
				param5: _mobile,
				param6: _profilePicture,
				param7: _gender,
				param8: _verified,
				param9: _mobileCountry,
				param10: _profileUniqueCode
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function (userDetails) {
			_callback(userDetails[0]);
		}).catch(function (err) {
			console.log('Unable to connect to the database: updateUserDetails', err);
		});
	},
	insertDonorDetails: function (_fpid, _BGTYPE, _location, _locPoint, _SRID, _callback) {
		sequelize.query('SELECT * FROM insert_bloodgroup_details(:param1,:param2,:param3,:param4,:param5)', {
			replacements: {
				param1: _fpid,
				param2: _BGTYPE,
				param3: _location,
				param4: _locPoint,
				param5: _SRID
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function (insertedDonor) {
			_callback(insertedDonor[0].insert_bloodgroup_details);
		});
	},
	insertRequestDetails: function (_fpid, _BGTYPE, _location, _locPoint, _requestTime,_mobile, _verified, _mobileCountry,_SRID, _callback) {
		console.log("insertRequestDetails database");
		sequelize.query('SELECT * FROM insert_request_details(:param1,:param2,:param3,:param4,:param5,:param6,:param7,:param8,:param9)', {
		
			replacements: {
				param1: _fpid,
				param2: _BGTYPE,
				param3: _location,
				param4: _locPoint,
				param5:_requestTime,
				param6: _mobile,
				param7: String(_verified),
				param8:_mobileCountry,
				param9: _SRID
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function (insertedReqest) {
			_callback(insertedReqest[0].insert_request_details);
		}).catch(function (err) {
			console.log('Unable to connect to the database: insertRequestDetails', err);
		});
	},

	updateDonorDetails: function (_donorID, _BGTYPE, _location, _locPoint, _SRID, _callback) {
		sequelize.query('SELECT * FROM update_bloodgroup_details(:param1,:param2,:param3,:param4,:param5)', {
			replacements: {
				param1: _donorID,
				param2: _BGTYPE,
				param3: _location,
				param4: _locPoint,
				param5: _SRID
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function () {
			_callback();
		});
	},
	updateRequestDetails: function (_reqestID, _BGTYPE, _location, _locPoint,_requestTime , _mobile, _verified,_mobileCountry, _SRID, _callback) {
		console.log("updateRequestDetails database");
		sequelize.query('SELECT * FROM update_request_details(:param1,:param2,:param3,:param4,:param5,:param6,:param7,:param8,:param9)', {
			replacements: {
				param1: _reqestID,
				param2: _BGTYPE,
				param3: _location,
				param4: _locPoint,
				param5:_requestTime,
				param6: _mobile,
				param7: String(_verified),
				param8:_mobileCountry,
				param9: _SRID
				
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function () {
			_callback();
		}).catch(function (err) {
			console.log('Unable to connect to the database: updateRequestDetails', err);
		});
	},
	fetchDonorDetails: function (_fpid, _buffer, _callback) {
		sequelize.query('SELECT * FROM fetch_donor_details(:param1,:param2)', {
			replacements: {
				param1: _fpid,
				param2: _buffer
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function (userDonorDetails) {
			_callback(userDonorDetails);
		});
	},

	fetchDonorMatches: function (_reqFpid, _bloodgrouptype, _locPoint, _srid, _callback) {
		sequelize.query('SELECT * FROM fetch_donor_matches(:param1, :param2, :param3, :param4,:param5)', {
			replacements: {
				param1: _reqFpid,
				param2: _bloodgrouptype,
				param3: _locPoint,
				param4: _srid,
				param5: 2000
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function (matchesDonorDetails) {
			_callback(matchesDonorDetails);
		}).catch(function (err) {
			console.log('Unable to connect to the database: matchesDonorDetails', err);
		});

	},


	messageDump: function (_messageEvent) {
		sequelize.query('SELECT * FROM insert_message(:param1)', {
			replacements: {
				param1: _messageEvent
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function (matchesDetails) {
			//log.info(matchesDetails)
		});
	},
	errorDump: function (_sessionData) {
		sequelize.query('SELECT * FROM insert_error_instances(:param1)', {
			replacements: {
				param1: _sessionData
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function (matchesDetails1) {
			//log.info(matchesDetails)
		});
	}
}