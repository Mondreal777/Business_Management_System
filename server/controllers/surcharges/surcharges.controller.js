// SERVICES
const service = require('../../services/surcharges/surcharges.service');

// HELPERS
const { handleSuccessResponse, handleErrorResponse } = require('../../util/helpers/handle-response');

// CONSTANTS
const { SUCCESS_MESSAGE } = require('../../util/constants/messages/success-messages');

async function getSurchargesList(req, res) {
    try {
        
        const { body, query } = req;
        const result = await service.getSurchargesList(body, query);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001044, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function getSurchargesById(req, res) {
    try {
        
        const { body, params } = req;
        const result = await service.getSurchargesById(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001045, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function getSurchargesByOrderingSystem(req, res) {
    try {
        
        const { body, query } = req;
        const result = await service.getSurchargesByOrderingSystem(body, query);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001045, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function saveSurcharges(req, res) {
    try {
        const { body } = req;
        const { surchargesDetails } = body;
        const result = await service.saveSurcharges(body, body);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001046, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function deleteSurcharges(req, res) {
    try {
        
        const { body, params } = req;
        const result = await service.deleteSurchargesById(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001047, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function updateSurchargeStatus(req, res) {
    try {
        
        const { body, params } = req;
        const result = await service.updateSurchargeStatus(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001061, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

module.exports = { getSurchargesList, getSurchargesById, saveSurcharges, deleteSurcharges, getSurchargesByOrderingSystem, updateSurchargeStatus }