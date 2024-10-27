
// Libraries
const Errors = require('http-errors');
const logger = require('~/util/loggers/logger');

// Constants
const { HTTP_STATUS } = require('~/util/constants/status/http-status-codes');
const { ERROR_MESSAGE } = require('~/util/constants/messages/error-messages');

// Database Queries
const healthCheckQuery = require('~/db-queries/health-check/health-check.query');

const healthCheck = async () => {
    try {
        // Gets the current status of the database
        const dbStatus = await healthCheckQuery.healthCheck();

		if (dbStatus.length === 0) {
			throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.EX4005001);
		}

        logger.info(`[Health Check Service]: health-check.service.healthCheck - SUCCESS`);
        return { database: dbStatus };
    } catch (err) {
        logger.error(`[Health Check Service]: health-check.service.healthCheck - Error in health check. \n ${err.stack}`);
        throw err;
    }
};

module.exports = { healthCheck };