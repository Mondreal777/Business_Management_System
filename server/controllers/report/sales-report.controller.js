// SERVICES
const service = require('../../services/reports/sales-report.service');

// HELPERS
const { handleSuccessResponse, handleErrorResponse } = require('../../util/helpers/handle-response');

// CONSTANTS
const { SUCCESS_MESSAGE } = require('../../util/constants/messages/success-messages');

async function getSalesReportList(req, res) {
    try {
        
        const { body, query } = req;
        const result = await service.getSalesReportList(body, query);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001050, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

module.exports = { getSalesReportList }