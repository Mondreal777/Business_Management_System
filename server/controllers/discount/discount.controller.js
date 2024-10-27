// SERVICES
const service = require('../../services/discount/discount.service');

// HELPERS
const { handleSuccessResponse, handleErrorResponse } = require('../../util/helpers/handle-response');

// CONSTANTS
const { SUCCESS_MESSAGE } = require('../../util/constants/messages/success-messages');

async function getDiscountList(req, res) {
    try {
        
        const { body, query } = req;
        const result = await service.getDiscountList(body, query);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001013, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}



async function getDiscountById(req, res) {
    try {
        
        const { body, params } = req;
        const result = await service.getDiscountById(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001014, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function saveDiscount(req, res) {
    try {
        const { body } = req;
        const { discountDetails } = body;
        const result = await service.saveDiscount(body, body);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001015, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function deleteDiscountItem(req, res) {
    try {
        
        const { body, params } = req;
        const result = await service.deleteDiscountById(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001016, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function updateDiscountStatus(req, res) {
    try {
        
        const { body, params } = req;
        const result = await service.updateDiscountStatus(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001060, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

module.exports = { getDiscountList, getDiscountById, saveDiscount, deleteDiscountItem, updateDiscountStatus }