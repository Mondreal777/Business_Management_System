// SERVICES
const service = require('../../services/audit-trail/audit-trail.services');

// HELPERS
const { handleSuccessResponse, handleErrorResponse } = require('../../util/helpers/handle-response');

// CONSTANTS
const { SUCCESS_MESSAGE } = require('../../util/constants/messages/success-messages');

async function saveAuditTrail(req, res) {
    try {
        
        const { body, query } = req;
        const result = await service.saveAuditTrail(body, query);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001065, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function auditTrailList(req, res) {
    try {
        
        const { body } = req;
        const result = await service.auditTrailList(body);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001066, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function auditTrailActionList(req, res) {
    try {
        
        const { body } = req;
        const result = await service.auditTrailActionList(body);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001067, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

module.exports = { saveAuditTrail, auditTrailList, auditTrailActionList }