// SERVICES
const service = require('../../services/category/category.services');

// HELPERS
const { handleSuccessResponse, handleErrorResponse } = require('../../util/helpers/handle-response');

// CONSTANTS
const { SUCCESS_MESSAGE } = require('../../util/constants/messages/success-messages');

async function getCategoryList(req, res) {
    try {
        
        const { body } = req;
        const result = await service.getCategoryList(body);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001004, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

module.exports = { getCategoryList }