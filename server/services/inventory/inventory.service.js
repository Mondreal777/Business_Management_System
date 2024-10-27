// Libraries
const Errors = require('http-errors');
const logger = require('~/util/loggers/logger');

// Constants
const { HTTP_STATUS } = require('../../util/constants/status/http-status-codes');
const { ERROR_MESSAGE } = require('../../util/constants/messages/error-messages');
const { STATUS } = require('../../util/constants/status/status');
const { ASCENDING } = require('../../util/constants/enums/sort');

// Database
const getInventoryListQuery = require('../../db-queries/inventory/get-inventory-list.query');
const getInventoryByIdQuery = require('../../db-queries/inventory/get-inventory-by-id.query');
const getInventoryByProductNoQuery = require('../../db-queries/inventory/get-inventory-by-product-no.query');
const saveInventoryDetailsQuery = require('../../db-queries/inventory/save-inventory-details.query');
const deleteInventorydetailsByIdQuery = require('../../db-queries/inventory/delete-inventory-details-by-id.query');
const updateInventoryDetailsQuery = require('../../db-queries/inventory/update-inventory-details.query');
const getInventoryListNotOnProductQuery = require('../../db-queries/inventory/get-inventory-list-not-on-products.query');
const updateInventoryOnProductStatusQuery = require('../../db-queries/inventory/update-inventory-on-products.query');

// Helpers
/**
 * 
 * @param {Object} payload
 * @param {*} body 
 */
 exports.getInventoryList = async (payload, queryDetails) => {
    try {
        logger.info(`[getInventoryList] services.inventory.service.getInventoryList - START`);
        const { id: userId } = payload;
        const { page, limit, searchKeyword, orderBy } = queryDetails;

        let queryValuesARR = [STATUS.ACTIVE];

        let sortBy = 'p.product_name';
        let sortOrder = ASCENDING.label;

        let limitQuery = '';
        let whereClause = '';

        if (orderBy) {
            const orderParams = orderBy.split('_');
            // ADD CONDITIONS HERE WHEN THERE ARE OTHER FIELDS TO BE SORTED
            if (orderParams[0] === NAME_SORT.label) {
                sortBy = 'p.product_name';
            } else {
                sortOrder = orderParams[1];
            }
        }
        const orderByScript = ` ORDER BY ${sortBy} ${sortOrder}`;

        if (searchKeyword) {
            whereClause += ` AND (p.product_name LIKE ?)`;
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
        const getInventoryListParams = {
            orderByScript,
            queryValues: queryValuesARR,
            whereClause,
            limitQuery
        };

        const { count } = await getInventoryListQuery.getInventoryListCount(getInventoryListParams);

        const inventoryList = await getInventoryListQuery.getInventoryList(getInventoryListParams);

        const pagination = {
            totalCount: count,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || count,
            pageCount: page !== undefined && limit !== undefined && page !== '' && limit !== '' ? Math.ceil(count / parseInt(limit)) : 1
        }

        logger.info(`[getInventoryList] services.inventory.service.getInventoryList - SUCCESS`);

        return { inventoryList, pagination }
        
    } catch (err) {
        logger.error(`[getInventoryList] services.inventory.service.getInventoryList: Error in getting inventory list. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getInventoryList] services.inventory.service.getInventoryList - END`);
    }
}

exports.getInventoryListNotOnProduct = async (payload, queryDetails) => {
    try {
        logger.info(`[getInventoryListNotOnProduct] services.inventory.service.getInventoryListNotOnProduct - START`);
        const { id: userId } = payload;
        const { page, limit, searchKeyword, orderBy } = queryDetails;

        let queryValuesARR = [STATUS.ACTIVE];

        let sortBy = 'p.product_name';
        let sortOrder = ASCENDING.label;

        let limitQuery = '';
        let whereClause = '';

        if (orderBy) {
            const orderParams = orderBy.split('_');
            // ADD CONDITIONS HERE WHEN THERE ARE OTHER FIELDS TO BE SORTED
            if (orderParams[0] === NAME_SORT.label) {
                sortBy = 'p.product_name';
            } else {
                sortOrder = orderParams[1];
            }
        }
        const orderByScript = ` ORDER BY ${sortBy} ${sortOrder}`;

        if (searchKeyword) {
            whereClause += ` AND (p.product_name LIKE ?)`;
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
        const getInventoryListParams = {
            orderByScript,
            queryValues: queryValuesARR,
            whereClause,
            limitQuery
        };

        const inventoryList = await getInventoryListNotOnProductQuery.getInventoryListNotOnProducts(getInventoryListParams);

        logger.info(`[getInventoryListNotOnProduct] services.inventory.service.getInventoryListNotOnProduct - SUCCESS`);

        return { inventoryList }
        
    } catch (err) {
        logger.error(`[getInventoryListNotOnProduct] services.inventory.service.getInventoryListNotOnProduct: Error in getting inventory list. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getInventoryListNotOnProduct] services.inventory.service.getInventoryListNotOnProduct - END`);
    }
}

exports.getInventoryById = async (payload, params) => {
    const inventoryId = parseInt(params.inventoryId);
    const { id: loggedInUserId } = payload;

    try {
        logger.info(`[getInventoryById] services.inventory.service.getInventoryById - START`);
        let inventoryData = await getInventoryByIdQuery.getInventoryById(inventoryId);

        if (!inventoryData.length) {
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001009)
        }

        logger.info(`[getInventoryById] services.inventory.service.getInventoryById - SUCCESS`);

        return { inventoryData: inventoryData[0] }

    } catch (err) {
        logger.error(`[getInventoryById] services.inventory.service.getInventoryById: Error in getting inventory item by id. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[getInventoryById] services.inventory.service.getInventoryById - END`);
    }
}

/**
 * 
 * @param {Object} payload
 * @param {Object} inventoryDetails { productNo, productName, productPrice, categoryId, expiryDate, imageUrl, organizationId }
 */
exports.saveInventory = async (payload, inventoryDetails) => {
    const { id: loggedInUserId } = payload;
    const { productNo, productId } = inventoryDetails
    let result = null;
    try {
        logger.info(`[saveInventory] services.inventory.service.saveInventory - START`);
		console.log(productNo)
        // check if data is existing
        let inventoryData = await getInventoryByIdQuery.getInventoryById(productId);
		console.log(inventoryData)
        if (inventoryData.length === 0) {
            // insert if data is not existing
            result = await saveInventoryDetailsQuery.saveInventoryDetails(inventoryDetails);
        } else {
            // delete existing data to create new one later
            // const deletedInventory = await deleteInventorydetailsByIdQuery.deleteInventorydetailsById(inventoryData[0].product_id);

            // if (!deletedInventory) {
            //     throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001010)
            // }

            result = await updateInventoryDetailsQuery.updateInventoryDetails(inventoryDetails);
        }

        logger.info(`[saveInventory] services.inventory.service.saveInventory - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[saveInventory] services.inventory.service.saveInventory: Error in saving inventory details. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[saveInventory] services.inventory.service.saveInventory - END`);
    }
}

exports.deleteInventoryItem = async (payload, params) => {
    const { id: loggedInUserId } = payload;
    const { inventoryId } = params
    let result = null;
    try {
        logger.info(`[deleteInventoryItem] services.inventory.service.deleteInventoryItem - START`);

        // check if data is existing
        let inventoryData = await getInventoryByIdQuery.getInventoryById(inventoryId);
        if (!inventoryData.length) {
            // error if data is not existing
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001011)
        } else {
            // delete existing data to create new one later
           result = await deleteInventorydetailsByIdQuery.deleteInventorydetailsById(inventoryData[0].product_id);

            if (!result) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001010)
            }
        }

        logger.info(`[deleteInventoryItem] services.inventory.service.deleteInventoryItem - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[deleteInventoryItem] services.inventory.service.deleteInventoryItem: Error in deleting inventory item. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[deleteInventoryItem] services.inventory.service.deleteInventoryItem - END`);
    }
}

exports.updateInventoryOnProductStatus = async (payload, params) => {
    const { id: loggedInUserId, onProduct } = payload;
    const { inventoryId } = params
    let result = null;
    try {
        logger.info(`[updateInventoryOnProductStatus] services.inventory.service.updateInventoryOnProductStatus - START`);

        // check if data is existing
        let inventoryData = await getInventoryByIdQuery.getInventoryById(inventoryId);
        if (!inventoryData.length) {
            // error if data is not existing
            throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001011)
        } else {
            // delete existing data to create new one later
           result = await updateInventoryOnProductStatusQuery.updateInventoryOnProducts(inventoryId, onProduct);

            if (!result) {
                throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001017)
            }
        }

        logger.info(`[updateInventoryOnProductStatus] services.inventory.service.updateInventoryOnProductStatus - SUCCESS`);

        return { result }

    } catch (err) {
        logger.error(`[updateInventoryOnProductStatus] services.inventory.service.updateInventoryOnProductStatus: Error in updating item. \n ${err.stack}`);
		throw err;
    } finally {
        logger.info(`[updateInventoryOnProductStatus] services.inventory.service.updateInventoryOnProductStatus - END`);
    }
}