// SERVICES
const service = require('../../services/inventory/inventory.service');

// HELPERS
const { handleSuccessResponse, handleErrorResponse } = require('../../util/helpers/handle-response');

// CONSTANTS
const { SUCCESS_MESSAGE } = require('../../util/constants/messages/success-messages');

async function getInventoryList(req, res) {
    try {
        
        const { body, query } = req;
        const result = await service.getInventoryList(body, query);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001004, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function getInventoryListNotOnProduct(req, res) {
    try {
        
        const { body, query } = req;
        const result = await service.getInventoryListNotOnProduct(body, query);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001004, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function getInventoryById(req, res) {
    try {
        
        const { body, params } = req;
        console.log("test ::> ", params)
        const result = await service.getInventoryById(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001004, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function saveInventory(req, res) {
    try {
        const { body } = req;
        const { inventoryDetails } = body;
        const result = await service.saveInventory(body, inventoryDetails);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001005, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function deleteInventoryItem(req, res) {
    try {
        const { body, params } = req;
        const result = await service.deleteInventoryItem(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001006, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function updateInventoryOnProductStatus(req, res) {
    try {
        const { body, params } = req;
        const result = await service.updateInventoryOnProductStatus(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001005, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

module.exports = { getInventoryList, getInventoryById, saveInventory, deleteInventoryItem, getInventoryListNotOnProduct, updateInventoryOnProductStatus }