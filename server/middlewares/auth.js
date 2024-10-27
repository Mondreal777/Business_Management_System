// Libraries
const Errors = require('http-errors');
const _ = require('lodash');

// Helpers
const jwtIO = require('../util/helpers/jwt-io');

// Constants
const { HTTP_STATUS } = require('../util/constants/status/http-status-codes');
const { ERROR_MESSAGE } = require('../util/constants/messages/error-messages');

const auth = () => {
	return async function (req, res, next) {
		try {
			// const userAgent = {
			// 	...req.useragent,
			// 	ipAddress: req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : req.connection.remoteAddress
			// };

			const authorization = req.header('authorization');
			if (!_.isEmpty(authorization)) {
				const token = jwtIO.getJWTFromAuthorization(authorization);
				// Decode access token to get the user details from aws cognito
				await jwtIO.validateJWT(token);
				
			} else {
				throw new Errors(HTTP_STATUS.UnauthorizedError, ERROR_MESSAGE.ERR4001001);
			}

			next();
		} catch (err) {
			return next(err);
		}
	}
};

module.exports = { auth };