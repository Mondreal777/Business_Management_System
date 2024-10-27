// SERVICES
const service = require('../../services/reports/inventory-report.service');

// HELPERS
const { handleSuccessResponse, handleErrorResponse } = require('../../util/helpers/handle-response');

// CONSTANTS
const { SUCCESS_MESSAGE } = require('../../util/constants/messages/success-messages');

async function getInventoryReportList(req, res) {
    try {
        
        const { body, query } = req;
        const result = await service.getInventoryReportList(body, query);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001051, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

module.exports = { getInventoryReportList }