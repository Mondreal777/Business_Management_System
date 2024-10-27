// SERVICES
const service = require('../../services/payment-method/payment-method.services');

// HELPERS
const { handleSuccessResponse, handleErrorResponse } = require('../../util/helpers/handle-response');

// CONSTANTS
const { SUCCESS_MESSAGE } = require('../../util/constants/messages/success-messages');

async function getPaymentMethodList(req, res) {
    try {
        
        const { body } = req;
        const result = await service.getPaymentMethodList(body);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001049, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

module.exports = { getPaymentMethodList }