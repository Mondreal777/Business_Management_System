// SERVICES
const service = require('../../services/products/products.service');

// HELPERS
const { handleSuccessResponse, handleErrorResponse } = require('../../util/helpers/handle-response');

// CONSTANTS
const { SUCCESS_MESSAGE } = require('../../util/constants/messages/success-messages');

async function getProductList(req, res) {
    try {
        
        const { body, query } = req;
        const result = await service.getProductList(body, query);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001009, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function getProductDetailsByProductId(req, res) {
    try {
        
        const { body, params } = req;
        const result = await service.getProductDetailsByProductId(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001010, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function saveProduct(req, res) {
    try {
        const { body } = req;
        const { productDetails } = body;
        const result = await service.saveProduct(body, productDetails);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001011, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function deleteProductItem(req, res) {
    try {
        
        const { body, params } = req;
        const result = await service.deleteProductItem(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001010, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

module.exports = { getProductList, getProductDetailsByProductId, saveProduct, deleteProductItem }