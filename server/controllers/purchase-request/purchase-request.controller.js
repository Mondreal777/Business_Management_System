// SERVICES
const service = require('../../services/purchase-request/purchase-request.services');

// HELPERS
const { handleSuccessResponse, handleErrorResponse } = require('../../util/helpers/handle-response');

// CONSTANTS
const { SUCCESS_MESSAGE } = require('../../util/constants/messages/success-messages');

async function getPurchaseRequestList(req, res) {
    try {
        
        const { body, query } = req;
        
        const result = await service.getPurchaseRequestList(body, query);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001025, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function getPurchaseRequesStatustCompleteList(req, res) {
    try {
        
        const { body, query } = req;
        
        const result = await service.getPurchaseRequesStatustCompleteList(body, query);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001025, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function savePurchaseRequest(req, res) {
    try {
        const { body } = req;
        const { purchaseRequestDetails , purchaseRequestItems} = body;
        const result = await service.savePurchaseRequest(body, purchaseRequestDetails, purchaseRequestItems);

    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function deletePurchaseRequest(req, res) {
    try {
        const { body, params } = req;
        const result = await service.deletePurchaseRequest(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001026, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function getPurchaseRequestByReferenceNo(req, res) {
    try {
        
        const { body, params } = req;
        console.log("test ::> ", params)
        const result = await service.getPurchaseRequestByReferenceNo(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001029, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function getPurchaseRequestByReferenceNoAndId(req, res) {
    try {
        
        const { body, params } = req;
        console.log("test ::> ", params)
        const result = await service.getPurchaseRequestByReferenceNoAndId(body, params);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001029, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function updatePurchaseRequest(req, res) {
    try {
        const { body } = req;
        const { purchaseRequestDetails } = body;
        const result = await service.updatePurchaseRequest(body, purchaseRequestDetails);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001027, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function updateStatusPurchaseRequest(req, res) {
    try {
        const { body } = req;
        const { purchaseRequestDetails, userId, userRoleId } = body;
        const result = await service.updateStatusPurchaseRequest(body, purchaseRequestDetails, userId, userRoleId);

        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001028, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function checkItemsOfPurchaseRequest(req, res) {
    try {
        const { body } = req;
        const {purchaserRemarks, purchaseRequestId } = body;

        const result = await service.checkItemsPurchaseRequest(purchaserRemarks, purchaseRequestId);
        
        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001062, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}

async function receivedItemsOfPurchaseRequest(req, res) {
    try {
        const { body } = req;
        const { items, purchaseRequestId, referenceNo } = body;

        const result = await service.receivedItemsPurchaseRequest(items, purchaseRequestId, referenceNo);
        
        handleSuccessResponse(res, SUCCESS_MESSAGE.BMS2001062, result);
    } catch (err) {
        handleErrorResponse(res, err);
    }
}


module.exports = { getPurchaseRequestList, savePurchaseRequest, deletePurchaseRequest, getPurchaseRequestByReferenceNoAndId, updatePurchaseRequest, updateStatusPurchaseRequest, checkItemsOfPurchaseRequest, getPurchaseRequesStatustCompleteList, receivedItemsOfPurchaseRequest}