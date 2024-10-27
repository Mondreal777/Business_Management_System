// Libraries
const Errors = require('http-errors');
const logger = require('~/util/loggers/logger');

// Constants
const { HTTP_STATUS } = require('../../util/constants/status/http-status-codes');
const { ERROR_MESSAGE } = require('../../util/constants/messages/error-messages');
const { STATUS } = require('../../util/constants/status/status');
const { ASCENDING } = require('../../util/constants/enums/sort');

const saveAuditTrailQuery = require('../../db-queries/audit-trail/save-audit-trail.query');
const auditTrailListQuery = require('../../db-queries/audit-trail/audit-trail-list.query');
const auditTrailActionListQuery = require('../../db-queries/audit-trail/audit-trail-action-list.query');

/**
 * 
 * @param {Object} payload
 * @param {*} body 
 */
 exports.saveAuditTrail = async (payload, queryDetails) => {
    let result = null;
	try {
        logger.info(`[saveAuditTrail] services.saveAuditTrail - START`);
        // check if data is existing
        result = await saveAuditTrailQuery.saveAuditTrail(payload);
        
        logger.info(`[saveAuditTrail] services.saveAuditTrail - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[saveAuditTrail] services.saveAuditTrail: Error in saving audit trail. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[saveAuditTrail] services.saveAuditTrail - END`);
    }
}



exports.auditTrailList = async (payload) => {
    try {
        logger.info(`[auditTrailList] services.rolePermission.service.auditTrailList - START`);
        
        const auditTrailList = await auditTrailListQuery.auditTrailList();

        if (!auditTrailList.length) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001064);
        }

        logger.info(`[auditTrailList] services.rolePermission.service.auditTrailList - SUCCESS`);

        return { auditTrailList }
        
    } catch (err) {
        logger.error(`[auditTrailList] services.rolePermission.service.auditTrailList: Error in getting audit trail list. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[auditTrailList] services.rolePermission.service.auditTrailList - END`);
    }
}

exports.auditTrailActionList = async (payload) => {
    try {
        logger.info(`[auditTrailActionList] services.rolePermission.service.auditTrailActionList - START`);
        
        const auditTrailActionList = await auditTrailActionListQuery.auditTrailActionList();

        if (!auditTrailActionList.length) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001065);
        }

        logger.info(`[auditTrailActionList] services.rolePermission.service.auditTrailActionList - SUCCESS`);

        return { auditTrailActionList }
        
    } catch (err) {
        logger.error(`[auditTrailActionList] services.rolePermission.service.auditTrailActionList: Error in getting audit trail action list. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[auditTrailActionList] services.rolePermission.service.auditTrailActionList - END`);
    }
}
