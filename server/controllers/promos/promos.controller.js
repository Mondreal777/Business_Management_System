// SERVICES
const service = require('../../services/promos/promos-services');

// HELPERS
const { handleSuccessResponse, handleErrorResponse } = require('../../util/helpers/handle-response');

// CONSTANTS
const { SUCCESS_MESSAGE } = require('../../util/constants/messages/success-messages');

async function getPromosList(req, res) {
    try {
        
        const { body, query } = req;
        
        const result = await service.getPromosList(body, query);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001030, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function getPromoProductsList(req, res) {
    try {
        const { body, params } = req;
        
        const result = await service.getPromosProductsList(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001030, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}


async function savePromos(req, res) {
    try {
        const { body } = req;
        const result = await service.savePromos(body);

		handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001058, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function deletePromos(req, res) {
    try {
        const { body, params } = req;
        const result = await service.deletePromos(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001031, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function getPromosById(req, res) {
    try {
        
        const { body, params } = req;
        console.log("test ::> ", params)
        const result = await service.getPromosById(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001032, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function updatePromoStatus(req,res) {
	try {
        const { body, params } = req;
        const result = await service.updatePromoStatus(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001059, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

module.exports = { getPromosList, savePromos, deletePromos, getPromosById, getPromoProductsList, updatePromoStatus }