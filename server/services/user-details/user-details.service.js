// Libraries
const Errors = require('http-errors');
const logger = require('../../util/loggers/logger');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Constants
const { HTTP_STATUS } = require('../../util/constants/status/http-status-codes');
const { ERROR_MESSAGE } = require('../../util/constants/messages/error-messages');
const { STATUS } = require('../../util/constants/status/status');
const { ASCENDING } = require('../../util/constants/enums/sort');

// Database
const getUserListQuery = require('../../db-queries/user-details/get-user-list.query');
const getUserDetailsByUserIdQuery = require('../../db-queries/user-details/get-user-details-by-user-id.query');
const getUserDetailsByIdQuery = require('../../db-queries/user-details/get-user-details-by-id.query');
const saveUserDetailsQuery = require('../../db-queries/user-details/save-user-details.query');
const deleteUserDetailsByIdQuery = require('../../db-queries/user-details/delete-user-details-by-id.query');
const getUserByIdQuery = require('../../db-queries/user/get-user-by-id.query');

// Helpers
/**
 * 
 * @param {Object} payload
 * @param {*} body 
 */
 exports.getUserList = async (payload, queryDetails) => {
    try {
        logger.info(`[getUserList] services.user-details.service.getUserList - START`);
        const { id: userId } = payload;
        const { page, limit, searchKeyword, orderBy } = queryDetails;

        let queryValuesARR = [];

        let sortBy = 'u.username';
        let sortOrder = ASCENDING.label;

        let limitQuery = '';
        let whereClause = '';

        if (orderBy) {
            const orderParams = orderBy.split('_');
            // ADD CONDITIONS HERE WHEN THERE ARE OTHER FIELDS TO BE SORTED
            if (orderParams[0] === NAME_SORT.label) {
                sortBy = 'u.username';
            } else {
                sortOrder = orderParams[1];
            }
        }
        const orderByScript = ` ORDER BY ${sortBy} ${sortOrder}`;

        if (searchKeyword) {
            whereClause += ` AND (u.username LIKE ?)`;
            queryValuesARR.push(`%${searchKeyword.toLowerCase()}%`);
        }

        // Pagination
        if (page !== undefined && limit !== undefined && page !== '' && limit !== '') {
            // Check if page and limit is a valid number
            if (isNaN(parseInt(page)) || isNaN(parseInt(limit))) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001008);
            }

            limitQuery = ` LIMIT ?,? `;
            // Compute offset
            let offset = (page * limit) - limit;
            queryValuesARR.push(offset);
            queryValuesARR.push(parseInt(limit));
        }

        // Build get all user params
        const getUserListParams = {
            orderByScript,
            queryValues: queryValuesARR,
            whereClause,
            limitQuery
        };

        const { count } = await getUserListQuery.getUserListCount(getUserListParams);

        const userList = await getUserListQuery.getUserList(getUserListParams);

        const pagination = {
            totalCount: count,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || count,
            pageCount: page !== undefined && limit !== undefined && page !== '' && limit !== '' ? Math.ceil(count / parseInt(limit)) : 1
        }

        logger.info(`[getUserList] services.user-details.service.getUserList - SUCCESS`);

        return { userList, pagination }
        
    } catch (err) {
        logger.error(`[getUserList] services.user-details.service.getUserList: Error in getting user list. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getUserList] services.user-details.service.getUserList - END`);
    }
}

exports.getUserDetailsByUserId = async (payload, params) => {
    const userId = parseInt(params.userId);
    const { id: loggedInUserId } = payload;

    try {
        logger.info(`[getUserDetailsByUserId] services.user.service.getUserDetailsByUserId - START`);
        let userData = await getUserDetailsByUserIdQuery.getUserDetailsByUserId(userId);

        if (!userData.length) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001021)
        }

        logger.info(`[getUserDetailsByUserId] services.user.service.getUserDetailsByUserId - SUCCESS`);

        return { userData: userData[0] }

    } catch (err) {
        logger.error(`[getUserDetailsByUserId] services.user.service.getUserDetailsByUserId: Error in getting user details by user id. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getUserDetailsByUserId] services.user.service.getUserDetailsByUserId - END`);
    }
}

exports.saveUserDetails = async (payload, userDetails) => {
    const { id: loggedInUserId } = payload;
    const { userId } = userDetails
    let result = null;
    try {
        logger.info(`[saveUserDetails] services.user.service.saveUserDetails - START`);

        let userData = await getUserByIdQuery.getUserById(userId);

        if (userData.length === 0) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001024)
        } else {
            // check if data is existing
            let userDetailsData = await getUserDetailsByUserIdQuery.getUserDetailsByUserId(userId);
            if (!userDetailsData.length) {
                // insert if data is not existing
                result = await saveUserDetailsQuery.saveUserDetails(userDetailsData);
            } else {
                // delete existing data to create new one later
                const deletedInventory = await deleteUserDetailsByIdQuery.deleteUserDetailsById(userDetailsData[0].user_details_id);
    
                if (!deletedInventory) {
                    throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001022)
                }
    
                result = await saveUserDetailsQuery.saveUserDetails(userDetailsData);
            }
        }

        logger.info(`[saveUserDetails] services.user.service.saveUserDetails - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[saveUserDetails] services.user.service.saveUserDetails: Error in saving user details. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[saveUserDetails] services.user.service.saveUserDetails - END`);
    }
}

exports.deleteUserDetail = async (payload, params) => {
    const { id: loggedInUserId } = payload;
    const { id } = params
    let result = null;
    try {
        logger.info(`[deleteUserDetail] services.user.service.deleteUserDetail - START`);

        // check if data is existing
        let userData = await getUserDetailsByIdQuery.getUserDetailsById(id);
        if (!userData.length) {
            // error if data is not existing
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001023)
        } else {
            // delete existing data to create new one later
           result = await deleteUserDetailsByIdQuery.deleteUserDetailsById(id);

            if (!result) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001022)
            }
        }

        logger.info(`[deleteUserDetail] services.user.service.deleteUserDetail - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[deleteUserDetail] services.user.service.deleteUserDetail: Error in deleting user detail. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[deleteUserDetail] services.user.service.deleteUserDetail - END`);
    }
}