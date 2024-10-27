// SERVICES
const service = require('../../services/stocks/stocks.service');

// HELPERS
const { handleSuccessResponse, handleErrorResponse } = require('../../util/helpers/handle-response');

// CONSTANTS
const { SUCCESS_MESSAGE } = require('../../util/constants/messages/success-messages');

async function saveInventoryStocks(req, res) {
    try {
        const { body } = req;
        const { stocksDetails } = body;
        const result = await service.saveInventoryStocks(body, stocksDetails);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001008, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function reduceProductStocks(req, res) {
    try {
        const { body } = req;
        const result = await service.reduceProductStocks(body);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001064, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

module.exports = { saveInventoryStocks, reduceProductStocks }