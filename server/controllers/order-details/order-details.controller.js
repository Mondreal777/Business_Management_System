// SERVICES
const service = require('../../services/order-details/order-details.service');

// HELPERS
const { handleSuccessResponse, handleErrorResponse } = require('../../util/helpers/handle-response');

// CONSTANTS
const { SUCCESS_MESSAGE } = require('../../util/constants/messages/success-messages');

async function saveOrderDetails(req, res) {
    try {
        const { body } = req;
		const { orderItemDetails } = body;
        const result = await service.saveOrderDetails(orderItemDetails);

		handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001040, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function updateOrderDetailsStatus(req, res) {
    try {
        const { body, params } = req;
        const result = await service.updateOrderDetailsStatus(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001041, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function getOrderDetailsByTableId(req, res) {
    try {
        
        const { body, params } = req;
        const result = await service.getOrderDetailsByTableId(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001042, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function getOrderDetailsListByTransactionId(req, res) {
    try {
        
        const { body, params } = req;
        
        const result = await service.getOrderDetailsListByTransactionId(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001048, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function getOrderDetailsListById(req, res) {
    try {
        
        const { body, params } = req;
        
        const result = await service.getOrderDetailsListById(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001048, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function updateOrderDetailsStatusByOrderId(req, res) {
    try {
        const { body, params } = req;
        const result = await service.updateOrderDetailsStatusByOrderId(body);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001041, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

module.exports = { saveOrderDetails, updateOrderDetailsStatus, getOrderDetailsByTableId, getOrderDetailsListById, getOrderDetailsListByTransactionId, updateOrderDetailsStatusByOrderId }