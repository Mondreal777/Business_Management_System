// Libraries
const Errors = require('http-errors');
const logger = require('~/util/loggers/logger');

// Constants
const { HTTP_STATUS } = require('../../util/constants/status/http-status-codes');
const { ERROR_MESSAGE } = require('../../util/constants/messages/error-messages');
const { ASCENDING } = require('../../util/constants/enums/sort');
// DB Queries
const getPurchasingListQuery = require('../../db-queries/purchase-request/get-purchase-request-list.query');
const savePurchaseRequestQuery = require('../../db-queries/purchase-request/save-purchase-request.query');
const savePurchaseRequestItemsQuery = require('../../db-queries/purchase-request/save-purchase-items.query');
const getPurchaseRequestItemsByPurchaseRequestIdQuery = require('../../db-queries/purchase-request/get-items-by-purchase-request-id.query');
const deletePurchaseRequestQuery = require('../../db-queries/purchase-request/delete-purchase-request-by-id.query');
const getPurchaseRequestByReferenceNoQuery = require('../../db-queries/purchase-request/get-purchase-request-by-reference-no.query');
const getPurchaseRequestByReferenceNoAndIdQuery = require('../../db-queries/purchase-request/get-purchase-request-by-reference-no-and-id.query');
const getPurchaseRequestByIdQuery = require('../../db-queries/purchase-request/get-purchase-request-by-id.query');
const updatePurchaseRequestByIdQuery = require('../../db-queries/purchase-request/update-purchase-request-by-id.query');
const updateStatusPurchaseRequestQuery = require('../../db-queries/purchase-request/update-status-purchase-request.query');
const updateReceivedPurchaseRequestQuery = require('../../db-queries/purchase-request/update-received-purchase-request.query');
const updatePurchaserRemarksPurchaseRequestQuery = require('../../db-queries/purchase-request/update-purchaser_remarks-purchase-request.query');
const updatePurchaseRequestItemsStatusQuery = require('../../db-queries/purchase-request/update-purchase-request-items-status.query');
const updateReceivedItemsStatusQuery = require('../../db-queries/purchase-request/update-received-items.query');
// Helpers
/**
 * 
 * @param {Object} payload
 * @param {*} body 
 */
 exports.getPurchaseRequestList = async (payload, queryDetails) => {
    try {
        logger.info(`[getPurchaseRequestList] services.purchase-request.service.getPurchaseRequestList - START`);
        const { userId, userRoleId } = payload;
        const { page, limit, searchKeyword, orderBy } = queryDetails;
        
        let sortBy = 'p.request_name';
        let sortOrder = ASCENDING.label;

        let limitQuery = '';
        let whereClause = '';
        let queryValuesARR = [];
        if (orderBy) {
            const orderParams = orderBy.split('_');
            // ADD CONDITIONS HERE WHEN THERE ARE OTHER FIELDS TO BE SORTED
            if (orderParams[0] === NAME_SORT.label) {
                sortBy = 'p.request_name';
            } else {
                sortOrder = orderParams[1];
            }
        }
        const orderByScript = ` ORDER BY ${sortBy} ${sortOrder}`;

        if (searchKeyword) {
            whereClause += ` AND (p.request_name LIKE ?)`;
            queryValuesARR.push(`%${searchKeyword.toLowerCase()}%`);
        }

        // Pagination
        if (page !== undefined && limit !== undefined && page !== '' && limit !== '') {
            // Check if page and limit is a valid number
            if (isNaN(parseInt(page)) || isNaN(parseInt(limit))) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001008);
            }

            limitQuery = ` LIMIT ?,? `;
            // Compute offset
            let offset = (page * limit) - limit;
            queryValuesARR.push(offset);
            queryValuesARR.push(parseInt(limit));
        }

        // Build get all inventory params
        const getPurchaseRequestListParams = {
            orderByScript,
            queryValues: queryValuesARR,
            whereClause,
            limitQuery,
            userId,
            userRoleId
        };

        const { count } = await getPurchasingListQuery.getPurchaseRequestList(getPurchaseRequestListParams);

        const purchaseRequestList = await getPurchasingListQuery.getPurchaseRequestList(getPurchaseRequestListParams);

        const pagination = {
            totalCount: count,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || count,
            pageCount: page !== undefined && limit !== undefined && page !== '' && limit !== '' ? Math.ceil(count / parseInt(limit)) : 1
        }

        logger.info(`[getPurchaseRequestList] services.purchase-request.service.getPurchaseRequestList - SUCCESS`);

        return { purchaseRequestList, pagination }
        
    } catch (err) {
        logger.error(`[getPurchaseRequestList] services.purchase-request.service.getPurchaseRequestList: Error in getting purchase request list. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getPurchaseRequestList] services.purchase-request.service.getPurchaseRequestList - END`);
    }
}

exports.getPurchaseRequestByReferenceNoAndId = async (payload, params) => {
    try {
        logger.info(`[getPurchaseRequestByReferenceNoAndId] services.purchase-request.service.getPurchaseRequestByReferenceNoAndId - START`);
        const { id: userId } = payload;
        const { referenceNo, purchaseRequestId } = params

        const purchaseRequestList = await getPurchaseRequestByReferenceNoAndIdQuery.getPurchaseRequestByReferenceNoAndId(referenceNo, purchaseRequestId);

        if (!purchaseRequestList.length) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001029);
        }
        
        const purchaseRequestItemsList = await getPurchaseRequestItemsByPurchaseRequestIdQuery.getPurchaseRequestItemsByPurchaseRequestId(purchaseRequestId);

        logger.info(`[getPurchaseRequestByReferenceNoAndId] services.purchase-request.service.getPurchaseRequestByReferenceNoAndId - SUCCESS`);

        return { 
            purchaseRequestList: purchaseRequestList[0],
            purchaseRequestItemsList: purchaseRequestItemsList
        }
        
    } catch (err) {
        logger.error(`[getPurchaseRequestByReferenceNoAndId] services.purchase-request.service.getPurchaseRequestByReferenceNoAndId: Error in getting purchase request list. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getPurchaseRequestByReferenceNoAndId] services.purchase-request.service.getPurchaseRequestByReferenceNoAndId - END`);
    }
}


/**
 * 
 * @param {Object} payload
 * @param {Object} purchaseRequestDetails { requestName, requestType, requestorName, requestDate, itemName, quantity, unitOfMeasurement, unitPrice, remarks, requestBy }
 */
 exports.savePurchaseRequest = async (payload, purchaseRequestDetails, purchaseRequestItems) => {
    const { id: loggedInUserId } = payload;
    const { referenceNo, purchaseRequestId } = purchaseRequestDetails
    let result = null;
    try {
        logger.info(`[savePurchaseRequest] services.purchase-request.service.savePurchaseRequest - START`);

        // check if data is existing
        let purchaseRequestData = await getPurchaseRequestByReferenceNoAndIdQuery.getPurchaseRequestByReferenceNoAndId(referenceNo, purchaseRequestId);
        if (!purchaseRequestData.length) {
            // insert if data is not existing
            result = await savePurchaseRequestQuery.savePurchaseRequestDetails(purchaseRequestDetails);
            if(result){
                purchaseRequestItems.forEach(element => {
                    savePurchaseRequestItemsQuery.savePurchaseRequestItems(element, result);
                });
            }
        } else {
            result = await updatePurchaseRequestByIdQuery.updatePurchaseRequestById(purchaseRequestDetails);
        }

        logger.info(`[savePurchaseRequest] services.purchase-request.service.savePurchaseRequest - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[savePurchaseRequest] services.purchase-request.service.savePurchaseRequest: Error in saving purchase request. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[savePurchaseRequest] services.purchase-request.service.savePurchaseRequest - END`);
    }
}

exports.deletePurchaseRequest = async (payload, params) => {
    const { id: loggedInUserId } = payload;
    const { purchaseRequestId } = params
    let result = null;
    try {
        logger.info(`[deletePurchaseRequestItem] services.purchaseRequest.service.deletePurchaseRequestItem - START`);

        // check if data is existing
        let purchaseRequestData = await getPurchaseRequestByIdQuery.getPurchaseRequestById(purchaseRequestId);
        if (!purchaseRequestData.length) {
            // error if data is not existing
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001031)
        } else {
            // delete existing data to create new one later
           result = await deletePurchaseRequestQuery.deletePurchaseRequestById(purchaseRequestId);

            if (!result) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001030)
            }
        }

        logger.info(`[deletePurchaseRequestItem] services.purchaseRequest.service.deletePurchaseRequestItem - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[deletePurchaseRequestItem] services.purchaseRequest.service.deletePurchaseRequestItem: Error in deleting inventory item. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[deletePurchaseRequestItem] services.purchaseRequest.service.deletePurchaseRequestItem - END`);
    }
}

/**
 * 
 * @param {Object} payload
 * @param {Object} purchaseRequestDetails { status }
 */
 exports.updateStatusPurchaseRequest = async (payload, purchaseRequestDetails, userId, userRoleId) => {
    const { id: loggedInUserId } = payload;
    const { referenceNo, purchaseRequestId} = purchaseRequestDetails
    let result = null;
    try {
        logger.info(`[updateStatusPurchaseRequest] services.purchase-request.service.updateStatusPurchaseRequest - START`);

        result = await updateStatusPurchaseRequestQuery.updateStatusPurchaseRequest(purchaseRequestDetails, userId, userRoleId);
        
        logger.info(`[updateStatusPurchaseRequest] services.purchase-request.service.updateStatusPurchaseRequest - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[updateStatusPurchaseRequest] services.purchase-request.service.updateStatusPurchaseRequest: Error in updating purchase request. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[updateStatusPurchaseRequest] services.purchase-request.service.updateStatusPurchaseRequest - END`);
    }
}

/**
 * 
 * @param {Object} payload
 * @param {Object} purchaseRequestDetails { status }
 */
 exports.checkItemsPurchaseRequest = async (purchaserRemarks, purchaseRequestId) => {
    let result = null;
    try {
        logger.info(`[checkItemsPurchaseRequest] services.purchase-request.service.checkItemsPurchaseRequest - START`);

        result = await updatePurchaserRemarksPurchaseRequestQuery.updatePurchaserRemarksPurchaseRequest(purchaserRemarks, purchaseRequestId);
        
        logger.info(`[checkItemsPurchaseRequest] services.purchase-request.service.checkItemsPurchaseRequest - SUCCESS`);
        return { result }

    } catch (err) {
        logger.error(`[checkItemsPurchaseRequest] services.purchase-request.service.checkItemsPurchaseRequest: Error in updating purchase request items. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[checkItemsPurchaseRequest] services.purchase-request.service.checkItemsPurchaseRequest - END`);
    }
}

// Helpers
/**
 * 
 * @param {Object} payload
 * @param {*} body 
 */
 exports.getPurchaseRequesStatustCompleteList = async (payload, queryDetails) => {
    try {
        logger.info(`[getReceivingList] services.purchase-request.service.getReceivingList - START`);
        const { userId, userRoleId } = payload;
        const { page, limit, searchKeyword, orderBy } = queryDetails;
        
        let sortBy = 'p.request_name';
        let sortOrder = ASCENDING.label;

        let limitQuery = '';
        let whereClause = '';
        let queryValuesARR = [];
        if (orderBy) {
            const orderParams = orderBy.split('_');
            // ADD CONDITIONS HERE WHEN THERE ARE OTHER FIELDS TO BE SORTED
            if (orderParams[0] === NAME_SORT.label) {
                sortBy = 'p.request_name';
            } else {
                sortOrder = orderParams[1];
            }
        }
        const orderByScript = ` ORDER BY ${sortBy} ${sortOrder}`;

        if (searchKeyword) {
            whereClause += ` AND (p.request_name LIKE ?)`;
            queryValuesARR.push(`%${searchKeyword.toLowerCase()}%`);
        }

        // Pagination
        if (page !== undefined && limit !== undefined && page !== '' && limit !== '') {
            // Check if page and limit is a valid number
            if (isNaN(parseInt(page)) || isNaN(parseInt(limit))) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001008);
            }

            limitQuery = ` LIMIT ?,? `;
            // Compute offset
            let offset = (page * limit) - limit;
            queryValuesARR.push(offset);
            queryValuesARR.push(parseInt(limit));
        }

        // Build get all inventory params
        const getPurchaseRequestListParams = {
            orderByScript,
            queryValues: queryValuesARR,
            whereClause,
            limitQuery,
            userId,
            userRoleId
        };

        const { count } = await getPurchasingListQuery.getPurchaseRequestStatusCompleteList(getPurchaseRequestListParams);

        const purchaseRequestList = await getPurchasingListQuery.getPurchaseRequestStatusCompleteList(getPurchaseRequestListParams);

        const pagination = {
            totalCount: count,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || count,
            pageCount: page !== undefined && limit !== undefined && page !== '' && limit !== '' ? Math.ceil(count / parseInt(limit)) : 1
        }

        logger.info(`[getReceivingList] services.purchase-request.service.getReceivingList - SUCCESS`);

        return { purchaseRequestList, pagination }
        
    } catch (err) {
        logger.error(`[getReceivingList] services.purchase-request.service.getReceivingList: Error in getting purchase request status complete list. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getReceivingList] services.purchase-request.service.getReceivingList - END`);
    }
}

/**
 * 
 * @param {Object} payload
 * @param {Object} purchaseRequestDetails { status }
 */
 exports.receivedItemsPurchaseRequest = async (items, purchaseRequestId, referenceNo) => {
    let result = null;
    try {
        logger.info(`[receivedItemsPurchaseRequest] services.purchase-request.service.receivedItemsPurchaseRequest - START`);

        items.forEach(element => {
            updateReceivedItemsStatusQuery.updateReceivedItemsStatus(element);
        });
        
        result = await updateReceivedPurchaseRequestQuery.updateReceivedPurchaseRequest(purchaseRequestId, referenceNo);
            
        logger.info(`[receivedItemsPurchaseRequest] services.purchase-request.service.receivedItemsPurchaseRequest - SUCCESS`);
        return { result }

    } catch (err) {
        logger.error(`[receivedItemsPurchaseRequest] services.purchase-request.service.receivedItemsPurchaseRequest: Error in updating purchase request received items. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[receivedItemsPurchaseRequest] services.purchase-request.service.receivedItemsPurchaseRequest - END`);
    }
}