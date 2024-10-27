// SERVICES
const service = require('../../services/order/order.service');

// HELPERS
const { handleSuccessResponse, handleErrorResponse } = require('../../util/helpers/handle-response');

// CONSTANTS
const { SUCCESS_MESSAGE } = require('../../util/constants/messages/success-messages');

async function getOrderList(req, res) {
    try {
        
        const { body, query } = req;
        
        const result = await service.getOrderList(body, query);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001036, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function saveOrder(req, res) {
    try {
        const { body } = req;
		const { orderDetails } = body;
        const result = await service.saveOrder(orderDetails);

		handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001037, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function updateOrderStatus(req, res) {
    try {
        const { body, params } = req;
        const result = await service.updateOrderStatus(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001038, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function updateOrderDiscount(req, res) {
    try {
        const { body, params } = req;
        const result = await service.updateOrderDiscount(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001038, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function updateRequestedOrderDiscount(req, res) {
    try {
        const { body, params } = req;
        const result = await service.updateRequestedOrderDiscount(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001038, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function updateOrderSurcharges(req, res) {
    try {
        const { body, params } = req;
        const result = await service.updateOrderSurcharges(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001038, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function updateOrderPaymentMethod(req, res) {
    try {
        const { body, params } = req;
        const result = await service.updateOrderPaymentMethod(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001057, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function updateOrderPaymentDetails(req, res) {
    try {
        const { body, params } = req;
        const result = await service.updateOrderPaymentDetails(body, params);

		handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001063, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function getOrderById(req, res) {
    try {
        
        const { body, params } = req;
        const result = await service.getOrderById(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001039, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

module.exports = { getOrderList, saveOrder, updateOrderStatus, getOrderById, updateOrderSurcharges, updateOrderDiscount, updateRequestedOrderDiscount, updateOrderPaymentMethod, updateOrderPaymentDetails }