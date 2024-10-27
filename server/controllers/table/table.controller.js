// SERVICES
const service = require('../../services/table/table.service');

// HELPERS
const { handleSuccessResponse, handleErrorResponse } = require('../../util/helpers/handle-response');

// CONSTANTS
const { SUCCESS_MESSAGE } = require('../../util/constants/messages/success-messages');

async function getTableList(req, res) {
    try {
        
        const { body, query } = req;
        
        const result = await service.getTableList(body, query);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001032, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function saveTable(req, res) {
    try {
        const { body } = req;
		const { tableDetails } = body;
        const result = await service.saveTable(tableDetails);

		handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001033, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function deleteTable(req, res) {
    try {
        const { body, params } = req;
        const result = await service.deleteTable(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001034, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function getTableById(req, res) {
    try {
        
        const { body, params } = req;
        const result = await service.getTableById(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001035, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function getTableByTableNo(req, res) {
    try {
        
        const { body, params } = req;
        const result = await service.getTableByTableNo(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001043, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

module.exports = { getTableList, saveTable, deleteTable, getTableById, getTableByTableNo }