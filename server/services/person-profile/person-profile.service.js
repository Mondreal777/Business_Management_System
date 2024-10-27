// Libraries
const Errors = require('http-errors');

// Database Queries
const getAllPersonInformationQuery = require('~/db-queries/person-profile/person-profile.query');

// Constants
const { HTTP_STATUS } = require('~/util/constants/status/http-status-codes');
const { ERROR_MESSAGE } = require('~/util/constants/messages/error-messages');


// Loggers
const logger = require('~/util/loggers/logger');

/**
 * @param {Object}  payload
 * 
 */
exports.getAllPersonProfileInformation = async (payload) => {
    try {
        // Get all person information 
        const result = await getAllPersonInformationQuery.getAllPersonInformation();

        logger.info(`[Get All Person Information Service]: person-profile.service.getAllPersonProfileInformation - SUCCESS`);

        return result;
    } catch (err) {
        logger.error(`[Get All Person Information Service]: person-profile.service.getAllPersonProfileInformation - Error in getting all person information. \n ${err.stack}`);
        // you can add audit log if you want
        throw err;
    }
};