// Libraries
const Errors = require('http-errors');
const logger = require('~/util/loggers/logger');

// Constants
const { HTTP_STATUS } = require('../../util/constants/status/http-status-codes');
const { ERROR_MESSAGE } = require('../../util/constants/messages/error-messages');
const { STATUS } = require('../../util/constants/status/status');

// DB Queries
const getPermissionListQuery = require('../../db-queries/permission/get-permission-list.query');

exports.getPermissionList = async (payload) => {
    try {
        logger.info(`[getPermissionList] services.permission.service.getPermissionList - START`);
        const { id: userId } = payload;

        const permissionList = await getPermissionListQuery.getPermissionList();

        if (!permissionList.length) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001049);
        }

        logger.info(`[getPermissionList] services.permission.service.getPermissionList - SUCCESS`);

        return { permissionList }
        
    } catch (err) {
        logger.error(`[getPermissionList] services.permission.service.getPermissionList: Error in getting permission list. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getPermissionList] services.permission.service.getPermissionList - END`);
    }
}